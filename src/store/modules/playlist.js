import { replaceEmoji, timeDiff, translateComment } from '../../assets/js/util'
import { API_PLAYLIST_DETAIL, API_PLAYLIST_COMMENT } from '../../api'
import Cache from '../../cache'

let cache = new Cache()

const state = {
  _playlist: null,
  _comments: null
}

const getters = {
  playlist: s => s._playlist,
  comments: s => s._comments
}

const mutations = {
  setPlaylist(s, { playlist, comments, done }) {
    s._playlist = playlist
    s._comments = translateComment(comments).sort(() => 0.5 - Math.random())
    done && done()
  }
}

const actions = {
  async fetch({ commit, getters }, { id, done }) {
    if (cache.has(id) && !cache.isExpire()) {
      if (getters.playlist.id != id) {
        commit('setPlaylist', Object.assign({}, cache.get(id), done))
      } else {
        done()
      }
    } else {
      let p1 = Vue.http.get(`${API_PLAYLIST_DETAIL}?id=${id}`),
        p2 = Vue.http.get(`${API_PLAYLIST_COMMENT}?id=${id}`),
        res = await Promise.all([p1, p2]),
        opts = {
          playlist: res[0].body.playlist,
          comments: res[1].body.comments
        }
      cache.set(id, opts)
      commit('setPlaylist', Object.assign({ done }, opts))
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