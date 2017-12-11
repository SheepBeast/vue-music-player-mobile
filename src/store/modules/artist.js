import { API_ARTISTS } from '../../api'
import Cache from '../../cache'

let cache = new Cache()

const state = {
  _artist: null,
  _hotSongs: null
}

const getters = {
  artist: s => !s._artist ? false : s._artist,
  hotSongs(s) {
    return !s._hotSongs ? false : s._hotSongs.map(({ id, name, al, ar, alia }) => ({
      id,
      name,
      album: al.name,
      alias: alia[0],
      artist: ar.map(({ name }) => name)
    }))
  }
}

const mutations = {
  setArtist(s, { artist, hotSongs, done }) {
    s._artist = artist
    s._hotSongs = hotSongs
    done()
  }
}

const actions = {
  async fetch({ commit, getters }, { id, done }) {
    if (cache.has(id) && !cache.isExpire()) {
      if (getters.artist.id != id) {
        commit('setArtist', Object.assign({}, cache.get(id), done))
      } else {
        done()
      }
    } else {
      let { body: { artist, hotSongs } } = await Vue.http.get(`${API_ARTISTS}?id=${id}`),
        opts = { artist, hotSongs }

      cache.set(id, opts)
      commit('setArtist', Object.assign({ done }, opts))
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