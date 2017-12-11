import { API_RECOMMEND_SONGS } from '../../api'

const state = {
  _recommend: null
}

const getters = {
  recommend(s) {
    return !s._recommend ?
      false :
      {
        list: s._recommend.map(({ id, name, artists, album }) => ({
          id,
          name,
          album: album.name,
          artists: artists.map(({ name }) => name).join('/')
        })),
        banner: (() => {
          let { id, album: { picUrl } } = s._recommend[0]
          return { id, picUrl }
        })()
      }
  }
}

const mutations = {
  setRecommend(s, { recommend, done }) {
    s._recommend = recommend
    done && done()
  }
}

const actions = {
  async fetch({ commit, getters }, { done }) {
    if (!getters.recommend) {
      let { body: { recommend } } = await Vue.http.get(API_RECOMMEND_SONGS)
      commit('setRecommend', { recommend, done })
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