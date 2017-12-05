import { API_PERSONALIZED, API_PERSONALIZED_NEWSONG } from '../../api'

const state = {
  _playlist: null,
  _newSong: null
}

const getters = {
  playlist(s) {
    return s._playlist
  },
  newSong(s) {
    if (!s._newSong) {
      return false
    }
    let ns = [], _ns = s._newSong//.slice(0, 6)

    _ns.forEach(({ id, name, song: album }) => {
      let arts = []
      album.artists.forEach(({ name }) => {
        arts.push(name)
      })
      ns.push({ id, name, artists: arts.join('/'), album: album.name })
    })
    return ns
  }
}

const mutations = {
  setPlaylist(s, { playlist }) {
    s._playlist = playlist
  },
  setNewSong(s, { newSong }) {
    s._newSong = newSong
  }
}

const actions = {
  getPlaylist({ commit, getters }) {
    if (getters.playlist) {
      return false
    }
    Vue.http.get(API_PERSONALIZED).then(({ body: { result } }) => {
      commit('setPlaylist', { playlist: result })
    })
  },
  getNewSong({ commit, getters }) {
    if (getters.newSong) {
      return false
    }
    Vue.http.get(API_PERSONALIZED_NEWSONG).then(({ body: { result } }) => {
      commit('setNewSong', { newSong: result })
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