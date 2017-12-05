import { replaceEmoji } from '../../assets/js/util'
import { API_PLAYLIST_DETAIL, API_PLAYLIST_COMMENT } from '../../api'
import Cache from '../../cache'

let cache = new Cache()

const state = {
  _playlist: null
}

const getters = {
  playlist(s) {
    return s._playlist
  }
}

const mutations = {
  setPlaylist(s, { playlist, comments, done }) {
    comments.forEach(c => {
      let d = new Date(c.time)
      c.timeString = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
      c.translatedMessage = replaceEmoji(c.content)

      if (c.beReplied.length > 0) {
        let rep = c.beReplied[0]
        c.translatedBeReplied = {
          user: {
            id: rep.user.userId,
            nickname: rep.user.nickname
          },
          content: '@' + rep.user.nickname + '：' + replaceEmoji(rep.content)
        }
      }
    })
    playlist.comments = comments
    s._playlist = playlist
    done()
  }
}

const actions = {
  getPlaylist({ commit, getters }, { id, done }) {
    if (cache.has(id) && !cache.isExpire()) {
      if (getters.playlist.id != id) {
        commit('setPlaylist', Object.assign({}, cache.get(id), done))
      } else {
        done()
      }
      return false
    }

    let p1 = Vue.http.get(`${API_PLAYLIST_DETAIL}?id=${id}`),
      p2 = Vue.http.get(`${API_PLAYLIST_COMMENT}?id=${id}`)
    Promise.all([p1, p2]).then(res => {
      let opts = {
        playlist: res[0].body.playlist, comments: res[1].body.comments
      }
      cache.set(id, opts)
      commit('setPlaylist', Object.assign({}, opts, { done }))
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