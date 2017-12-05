import { API_ARTISTS } from '../../api'
import Cache from '../../cache'

let cache = new Cache()

const state = {
  _artist: null,
  _hotSongs: null
}

const getters = {
  artist(s) {
    if (!s._artist) {
      return false
    }
    let { alias, briefDesc, id, name, picUrl } = s._artist, ar
    ar = {
      id,
      picUrl,
      name,
      briefDesc,
      alias: alias[0]
    }

    return ar
  },
  hotSongs(s) {
    if (!s._hotSongs) {
      return false
    }
    let _hs = s._hotSongs, hs = []
    _hs.forEach(({ id, name, al, ar, alia }) => {
      let _ar = []
      ar.forEach(({ name }) => {
        _ar.push(name)
      })
      hs.push({
        id,
        name,
        album: al.name,
        alias: alia[0],
        artist: _ar.join('/')
      })
    })
    return hs
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
  getArtist({ commit, getters }, { id, done }) {
    if (cache.has(id) && !cache.isExpire()) {
      if (getters.artist.id != id) {
        commit('setArtist', Object.assign({}, cache.get(id), done))
      } else {
        done()
      }
      return false
    }

    Vue.http.get(`${API_ARTISTS}?id=${id}`).then(({ body: { artist, hotSongs } }) => {
      let opts = { artist, hotSongs }
      cache.set(id, opts)
      commit('setArtist', Object.assign({}, opts, { done }))
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