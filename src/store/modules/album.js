import { API_ALBUM, API_ALBUM_COMMENT } from '../../api'
import { zFill, replaceEmoji } from '../../assets/js/util'
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
    let { id, picUrl, artist, description, name, status, publishTime } = s._album, d
    let pt = new Date(publishTime)
    d = {
      id,
      picUrl,
      artist: {
        id: artist.id,
        name: artist.name
      },
      description,
      name,
      status,
      publishTime: pt.getFullYear() + '-' + zFill(pt.getMonth() + 1) + '-' + zFill(pt.getDate())
    }
    return d
  },
  songs(s) {
    if (!s._songs) {
      return false
    }
    let _s = s._songs, ss = []
    _s.forEach(({ id, name, al, ar, alia }) => {
      ss.push({
        id,
        name,
        album: al.name,
        alias: alia[0],
        artist: ar[0].name
      })
    })
    return ss
  },
  comments(s) {
    return s._comments
  },
  hotComments(s) {
    return s._hotComments
  }
}

const mutations = {
  setAlbum(s, { album, songs, comments, hotComments, done }) {
    comments.forEach(c => {
      let d = new Date(c.time)
      c.timeString = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
      c.translatedMessage = replaceEmoji(c.content)

      if (c.beReplied.length > 0) {
        let rep = c.beReplied[0]
        c.translatedBeReplied = {
          user: {
            id: rep.user.userId,
            nickname: rep.user.nickname
          },
          content: '@' + rep.user.nickname + '：' + replaceEmoji(rep.content)
        }
      }
    })

    hotComments.forEach(c => {
      let d = new Date(c.time)
      c.timeString = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
      c.translatedMessage = replaceEmoji(c.content)

      if (c.beReplied.length > 0) {
        let rep = c.beReplied[0]
        c.translatedBeReplied = {
          user: {
            id: rep.user.userId,
            nickname: rep.user.nickname
          },
          content: '@' + rep.user.nickname + '：' + replaceEmoji(rep.content)
        }
      }
    })

    s._album = album
    s._songs = songs
    s._comments = comments
    s._hotComments = hotComments

    done()
  }
}

const actions = {
  getAlbum({ commit, getters }, { id, done }) {
    if (cache.has(id) && !cache.isExpire()) {
      if (getters.album.id != id) {
        commit('setAlbum', Object.assign({}, cache.get(id), done))
      } else {
        done()
      }
      return false
    }
    let p1 = Vue.http.get(`${API_ALBUM}?id=${id}`),
      p2 = Vue.http.get(`${API_ALBUM_COMMENT}?id=${id}`)
    Promise.all([p1, p2]).then(res => {
      let opts = {
        album: res[0].body.album,
        songs: res[0].body.songs,
        comments: res[1].body.comments,
        hotComments: res[1].body.hotComments
      }

      cache.set(id, opts)
      commit('setAlbum', Object.assign({}, opts, { done }))
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}