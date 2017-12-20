import { API_ALBUM, API_ALBUM_COMMENT } from '../../api'
import { zFill, replaceEmoji, translateComment } from '../../assets/js/util'
import Cache from '../../cache'

let cache = new Cache()

const state = {
  _album: null,
  _songs: null,
  _comments: null,
  _hotComments: null
}

const getters = {
  album(s) {
    if (!s._album) {
      return false
    }
    let pt = new Date(s._album.publishTime)
    return Object.assign({}, s._album, {
      publishTime: pt.getFullYear() + '-' + zFill(pt.getMonth() + 1) + '-' + zFill(pt.getDate())
    })
  },
  songs(s) {
    return !s._songs ? false : s._songs.map(({ id, name, al, ar, alia }) => ({
      id,
      name,
      album: al.name,
      alias: alia[0],
      artist: ar[0].name
    }))
  },
  comments: s => s._comments,
  hotComments: s => s._hotComments
}

const mutations = {
  setAlbum(s, { album, songs, comments, hotComments, done }) {
    s._album = album
    s._songs = songs
    s._comments = translateComment(comments)
    s._hotComments = translateComment(hotComments)

    done()
  }
}

const actions = {
  async fetch({ commit, getters }, { id, done }) {
    if (cache.has(id) && !cache.isExpire()) {
      if (getters.album.id != id) {
        commit('setAlbum', Object.assign({}, cache.get(id), done))
      } else {
        done()
      }
    } else {
      let p1 = Vue.http.get(`${API_ALBUM}?id=${id}`),
        p2 = Vue.http.get(`${API_ALBUM_COMMENT}?id=${id}`),
        fetched = await Promise.all([p1, p2]),
        opts = {
          album: fetched[0].body.album,
          songs: fetched[0].body.songs,
          comments: fetched[1].body.comments,
          hotComments: fetched[1].body.hotComments
        }

      cache.set(id, opts)
      commit('setAlbum', Object.assign({ done }, opts))
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}