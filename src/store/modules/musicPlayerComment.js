import { translateComment } from '../../assets/js/util'
import { API_MUSIC_COMMENT } from '../../api'

const state = {
  _comments: null,
  _total: null
}

const getters = {
  comments(s) {
    return s._comments || false
  },
  total(s) {
    return s._total || 0
  }
}
const mutations = {
  addComments(s, { comments, total, done }) {
    s._comments = translateComment(comments).sort(() => 0.5 - Math.random())
    s._total = total
    done()
  }
}
const actions = {
  async fetch({ commit }, { id, done }) {
    let res = await Vue.http.get(`${API_MUSIC_COMMENT}?limit=20&id=${id}`)
    commit('addComments', {
      comments: res.body.comments,
      total: res.body.total,
      done
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