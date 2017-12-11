import { API_USER_DETAIL, API_USER_PLAYLIST } from '../../api'
import Cache from '../../cache'

let cache = new Cache()

const state = {
  _user: null,
  _playlist: null,
  _listenSongs: null
}

const getters = {
  user: s => s._user || null,
  playlist: s => s._playlist || null,
  listenSongs: s => s._listenSongs || null
}

const mutations = {
  setUser(s, { profile, playlist, listenSongs, done }) {
    s._user = profile
    s._playlist = playlist
    s._listenSongs = listenSongs
    done()
  }
}

const actions = {
  async fetch({ commit, getters }, { id, done }) {
    if (cache.has(id) && !cache.isExpire()) {
      if (getters.user.id != id) {
        commit('setUser', Object.assign({ done }, cache.get(id)))
      } else {
        done()
      }
    } else {
      let p1 = Vue.http.get(`${API_USER_DETAIL}?uid=${id}`),
        p2 = Vue.http.get(`${API_USER_PLAYLIST}?uid=${id}`),

        res = await Promise.all([p1, p2]),
        opts = {
          profile: res[0].body.profile,
          listenSongs: res[0].body.listenSongs,
          playlist: res[1].body.playlist
        }

      commit('setUser', Object.assign({ done }, opts))
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