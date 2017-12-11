import { API_PERSONALIZED, API_PERSONALIZED_NEWSONG } from '../../api'

const state = {
  _playlist: null,
  _newSongs: null
}

const getters = {
  playlist: s => s._playlist,
  newSong(s) {
    return !s._newSongs ?
      false :
      s._newSongs.map(({ id, name, song: { album } }) => ({
        id,
        name,
        album: album.name,
        artists: album.artists.map(({ name }) => name).join('/')
      }))
  }
}

const mutations = {
  setFind(s, { playlist, newSongs }) {
    s._playlist = playlist
    s._newSongs = newSongs
  }
}

const actions = {
  async fetch({ commit, getters }) {
    if (!getters.playlist) {
      let p1 = Vue.http.get(API_PERSONALIZED),
        p2 = Vue.http.get(API_PERSONALIZED_NEWSONG),
        fetched = await Promise.all([p1, p2])

      commit('setFind', {
        playlist: fetched[0].body.result,
        newSongs: fetched[1].body.result
      })
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