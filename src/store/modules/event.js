import { replaceEmoji, timeDiff, replaceTopic } from '../../assets/js/util'
import { API_EVENT } from '../../api'

const picsIdReg = /==\/\d*\.jpg$/g,
  picsIdTrimReg = /(==\/)|(\.jpg)/g

const state = {
  _event: null
}

const getters = {
  event(s) {
    return !s._event ? false : (now =>
      s._event.map(({
        id,
        info: { commentCount, liked, likedCount, shareCount },
        json,
        pics,
        rcmdInfo,
        showTime,
        user: { userId, avatarUrl, nickname }
      }) => {
        let jsonObj = JSON.parse(json),
          song = jsonObj.song,
          picsUrl = pics.map(({ originUrl, squareUrl, width, height }) => ({
            id: originUrl.match(picsIdReg)[0].replace(picsIdTrimReg, ''),
            originUrl,
            squareUrl,
            width,
            height
          }))

        return {
          id,
          user: {
            userId,
            avatarUrl,
            nickname
          },
          action: '分享单曲',
          date: timeDiff(showTime, now),
          message: replaceEmoji(replaceTopic(jsonObj.msg)),
          picsUrl,
          song: {
            id: song.id,
            cover: song.album.img80x80,
            name: song.name,
            arts: song.artists.map(({ name }) => name).join('/')
          },
          reason: rcmdInfo && rcmdInfo.reason || null,
          liked,
          commentCount,
          likedCount,
          shareCount
        }
      })
    )(Date.now())
  }
}

const mutations = {
  setEvent(s, { event, done }) {
    s._event = event
    done && done()
  }
}

const actions = {
  async fetch({ commit, getters }, { done }) {
    if (!getters.event) {
      let { body: { event } } = await Vue.http.get(API_EVENT)
      commit('setEvent', { event, done })
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