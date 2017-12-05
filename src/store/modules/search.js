import { API_SEARCH_SUGGEST, API_SEARCH, API_SEARCH_MULTIMATCH } from '../../api'
import Cache from '../../cache'

let suggestCache = new Cache(),
  resultCache = new Cache(),
  multiCache = new Cache()

const idRef = {
  'songs': 1,
  'albums': 10,
  'artists': 100,
  'playlists': 1000
}

const typeRef = {
  '1': 'songs',
  '10': 'albums',
  '100': 'artists',
  '1000': 'playlists'
}

const alias = {
  songs: '单曲',
  albums: '专辑',
  artists: '艺人',
  playlists: '歌单'
}

const state = {
  _suggest: {},
  _history: [],
  _multi: {},

  _songs: [],
  _albums: [],
  _artists: [],
  _playlists: []
}

const getters = {
  suggest(state) {
    let _sg = state._suggest,
      o = _sg.order,
      sg = []

    if (o) {
      let mvidx = o.indexOf('mvs')
      if (mvidx > -1) {
        o.splice(mvidx, 1)
      }

      for (let i = 0, l = o.length; i < l; i++) {
        let type = o[i]
        if (_sg.hasOwnProperty(type)) {
          let series = _sg[type]
          series.forEach((s) => {
            let artist
            switch (type) {
              case 'albums':
                artist = s.artist.name
                break
              case 'songs':
                artist = s.artists[0].name
                break
              default:
                artist = ""
                break
            }
            sg.push({
              id: s.id,
              name: s.name,
              type: idRef[type],
              alias: alias[type],
              artist
            })
          });

        }
      }
    }
    return sg
  },
  history(state) {
    return state._history
  },
  songs(state) {
    let _s = state._songs,
      s = []

    _s.forEach(({ id, album, artists, name, mvid }) => {
      s.push({
        id,
        name,
        artist: {
          id: artists[0].id,
          name: artists[0].name
        },
        album: {
          id: album.id,
          name: album.name,
          status: album.status
        },
        mvid
      })
    })

    return s
  },
  multi(state) {
    let _m = state._multi,
      al,
      ar,
      m = {}

    if (al = _m.album && _m.album[0]) {
      m.album = {
        id: al.id,
        name: al.name,
        picUrl: al.picUrl,
        artist: al.artist.name
      }
    }
    if (ar = _m.artist && _m.artist[0]) {
      m.artist = {
        id: ar.id,
        name: ar.name,
        picUrl: ar.picUrl,
        alias: ar.alias[0]
      }
    }
    return m
  },


  albums(state) {
    let _a = state._albums,
      a = []

    _a.forEach(({ id, alias, artist, picUrl, name, publishTime }) => {
      let d = new Date(publishTime)

      a.push({
        id,
        name,
        artist: artist.name,
        picUrl,
        alias: alias[0],
        publishTime: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      })
    })
    return a
  },
  artists(state) {
    let _a = state._artists, a = []

    _a.forEach(({ id, img1v1Url, name, alias }) => {
      a.push({
        id,
        avatar: img1v1Url,
        name,
        alias: alias[0]
      })
    })
    return a
  },
  playlists(state) {
    let _p = state._playlists,
      p = []

    _p.forEach(({ id, name, trackCount, creator: { nickname }, playCount, coverImgUrl }) => {
      p.push({
        id,
        name,
        trackCount,
        by: nickname,
        playCount,
        coverImgUrl
      })
    })
    return p
  }
}

const mutations = {
  setSuggest(state, { suggest }) {
    state._suggest = suggest
  },
  clearSuggest(state) {
    state._suggest = {}
  },
  setHistory(state, { keywords, remove }) {
    if (!keywords) {
      return false
    }
    let _h = state._history,
      findIndex = _h.findIndex(h => h.keywords === keywords)
    // 如果有keywords相同的记录则提到最前， 如果没有则增加新记录且记录且最多十条
    if (findIndex > -1) {
      let spliced = _h.splice(findIndex, 1)
      if (!remove) {
        _h.unshift(spliced[0])

      }
    } else {
      _h.unshift({ keywords })
      if (_h.length > 10) {
        _h.pop()
      }
    }
  },
  setResult(state, { result, type }) {
    state['_' + type] = state['_' + type].concat(result)
  },
  setMultiResult(state, { result }) {
    state._multi = result
  },
  resetResult(state) {
    state['_multi'] = {}
    state['_songs'] = []
    state['_albums'] = []
    state['_artists'] = []
    state['_playlists'] = []
  }
}

const actions = {
  getSuggest({ commit }, { keywords }) {
    if (suggestCache.has(keywords) && !suggestCache.isExpire()) {
      commit('setSuggest', suggestCache.get(keywords))
    } else {
      Vue.http.get(`${API_SEARCH_SUGGEST}?keywords=${encodeURIComponent(keywords)}`).then(({ body: { result } }) => {
        let opts = { suggest: result }
        suggestCache.set(keywords, opts)
        commit('setSuggest', opts)
      })
    }
  },
  getResult({ commit }, { keywords, limit, type }) {
    if (resultCache.has(keywords) && !resultCache.isExpire()) {
      commit('setResult', resultCache.get(keywords))
    } else {
      Vue.http.get(`${API_SEARCH}?keywords=${encodeURIComponent(keywords)}&limit=${limit}`).then(({ body: { result } }) => {
        let opts = { result: result[typeRef[type]], type: typeRef[type] }
        resultCache.set(keywords, opts)
        commit('setResult', opts)
      })
    }
  },
  getMultiResult({ commit }, { keywords }) {
    if (multiCache.has(keywords) && !multiCache.isExpire()) {
      commit('setMultiResult', multiCache.get(keywords))
    } else {
      Vue.http.get(`${API_SEARCH_MULTIMATCH}?keywords=${encodeURIComponent(keywords)}`).then(({ body: { result } }) => {
        let opts = { result }
        multiCache.set(keywords, opts)
        commit('setMultiResult', opts)
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