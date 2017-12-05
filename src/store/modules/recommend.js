import { API_RECOMMEND_SONGS } from '../../api'

const state = {
  _recommend: null,
  _banner: null
}

const getters = {
  recommend(s) {
    if (!s._recommend) {
      return false
    }

    let r = []

    s._recommend.forEach(t => {
      let art = []
      t.artists.forEach(a => {
        art.push(a.name)
      })
      r.push({
        id: t.id,
        name: t.name,
        artists: art.join('/'),
        album: t.album.name
      })
    })
    return r
  },
  banner(s) {
    if (!s._recommend) {
      return false
    }
    // return s._recommend.coverImgUrl
    let t = s._recommend[0]
    return {
      sid: t.id,
      picUrl: t.album.picUrl
    }
    return ''
  }
}

const mutations = {
  setRecommend(s, { recommend }) {
    s._recommend = recommend
  }
}

const actions = {
  getRecommend({ commit, getters }) {
    if (getters.recommend) {
      return false
    }
    Vue.http.get(API_RECOMMEND_SONGS).then(({ body: { recommend } }) => {
      commit('setRecommend', { recommend })
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