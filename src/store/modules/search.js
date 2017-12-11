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
  suggest(s) {
    let _suggest = s._suggest,
      o = _suggest.order,
      suggest = []

    if (o) {
      let mvidx = o.indexOf('mvs')
      if (mvidx > -1) {
        o.splice(mvidx, 1)
      }

      for (let i = 0, l = o.length; i < l; i++) {
        let type = o[i]
        if (_suggest.hasOwnProperty(type)) {
          _suggest[type].forEach(s => {
            let artist
            if(type == 'albums'){
              artist = s.artist.name
            }else if(type == 'songs'){
              artist = s.artists[0].name
            }else{
              artist = ""
            }
            suggest.push({
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
    return suggest
  },
  history: s => s._history,
  songs(s) {
    return s._songs.map(({ id, album, artists, name, mvid }) => ({
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
    }))
  },
  multi(s) {
    let _m = s._multi,
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
  albums(s) {
    return s._albums.map(({ id, alias, artist, picUrl, name, publishTime }) => ({
      id,
      name,
      artist: artist.name,
      picUrl,
      alias: alias[0],
      publishTime: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    }))
  },
  artists(s) {
    return s._artists.map(({ id, img1v1Url, name, alias }) => ({
      id,
      avatar: img1v1Url,
      name,
      alias: alias[0]
    }))
  },
  playlists(s) {
    return s._playlists.map(({ id, name, trackCount, creator: { nickname }, playCount, coverImgUrl }) => ({
      id,
      name,
      trackCount,
      by: nickname,
      playCount,
      coverImgUrl
    }))
  }
}

const mutations = {
  setSuggest(s, { suggest }) {
    s._suggest = suggest
  },
  clearSuggest(s) {
    s._suggest = {}
  },
  setHistory(s, { keywords, remove }) {
    if (keywords) {
      let _h = s._history,
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
    }

  },
  setResult(s, { result, type }) {
    s['_' + type] = s['_' + type].concat(result)
  },
  setMultiResult(s, { result }) {
    s._multi = result
  },
  resetResult(s) {
    s['_multi'] = {}
    s['_songs'] = []
    s['_albums'] = []
    s['_artists'] = []
    s['_playlists'] = []
  }
}

const actions = {
  async getSuggest({ commit }, { keywords }) {
    if (suggestCache.has(keywords) && !suggestCache.isExpire()) {
      commit('setSuggest', suggestCache.get(keywords))
    } else {
      let { body: { result } } = await Vue.http.get(`${API_SEARCH_SUGGEST}?keywords=${encodeURIComponent(keywords)}`),
        opts = { suggest: result }

      suggestCache.set(keywords, opts)
      commit('setSuggest', opts)
    }
  },
  async getResult({ commit }, { keywords, limit, type }) {
    if (resultCache.has(keywords) && !resultCache.isExpire()) {
      commit('setResult', resultCache.get(keywords))
    } else {
      let { body: { result } } = await Vue.http.get(`${API_SEARCH}?keywords=${encodeURIComponent(keywords)}&limit=${limit}`),
        opts = { result: result[typeRef[type]], type: typeRef[type] }

      resultCache.set(keywords, opts)
      commit('setResult', opts)
    }
  },
  async getMultiResult({ commit }, { keywords }) {
    if (multiCache.has(keywords) && !multiCache.isExpire()) {
      commit('setMultiResult', multiCache.get(keywords))
    } else {
      let { body: { result } } = await Vue.http.get(`${API_SEARCH_MULTIMATCH}?keywords=${encodeURIComponent(keywords)}`),
        opts = { result }

      multiCache.set(keywords, opts)
      commit('setMultiResult', opts)
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