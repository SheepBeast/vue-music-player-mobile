import { API_USER_DETAIL, API_USER_PLAYLIST } from '../../api'
import Cache from '../../cache'

let cache = new Cache()

const state = {
  _user: null,
  _playlist: null
}

const getters = {
  user(s) {
    if (!s._user) {
      return false
    }
    let { listenSongs, avatarUrl, backgroundUrl, followeds, nickname, gender } = s._user, u
    u = {
      listenSongs,
      avatarUrl,
      backgroundUrl,
      followeds,
      nickname,
      gender
    }
    return u
  },
  playlist(s) {
    if (!s._playlist) {
      return false
    }
    let _p = s._playlist, p = []

    _p.forEach(({ id, name, playCount, trackCount, coverImgUrl }) => {
      p.push({
        id, name, playCount, trackCount, coverImgUrl
      })
    })
    return p
  }
}

const mutations = {
  setUser(s, { profile, playlist, done }) {
    s._user = profile
    s._playlist = playlist
    done()
  }
}

const actions = {
  getUser({ commit, getters }, { id, done }) {
    if (cache.has(id) && !cache.isExpire()) {
      if (getters.user.id != id) {
        commit('setUser', Object.assign({}, cache.get(id), done))
      } else {
        done()
      }
      return false
    }

    if (!(!getters.user || (id && getters.user.id != id))) {
      done()
      return false
    }
    let p1 = Vue.http.get(`${API_USER_DETAIL}?uid=${id}`),
      p2 = Vue.http.get(`${API_USER_PLAYLIST}?uid=${id}`)

    Promise.all([p1, p2]).then(res => {
      res[0].body.profile.listenSongs = res[0].body.listenSongs
      let opts = {
        profile: res[0].body.profile, playlist: res[1].body.playlist
      }
      commit('setUser', Object.assign({}, opts, { done }))
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