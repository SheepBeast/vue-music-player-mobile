import { replaceEmoji, zFill, replaceTopic } from '../../assets/js/util'
import { API_EVENT } from '../../api'

const state = {
  _event: null
}

const getters = {
  event(s) {
    if (!s._event) {
      return false
    }
    let evts = [],
      sevt = s._event,

      picsIdReg = /==\/\d*\.jpg$/g,
      picsIdTrimReg = /(==\/)|(\.jpg)/g,

      now = Date.now(),
      today = new Date(now).getDate()

    sevt.forEach(({
      id,
      info: { commentCount, liked, likedCount, shareCount },
      json,
      pics,
      rcmdInfo,
      showTime,
      user: { userId, avatarUrl, nickname }
    }) => {
      let jsonObj = JSON.parse(json),
        diff = now - showTime,
        picsUrl = [],
        date,
        song,
        message = jsonObj.msg

      pics.forEach(({ originUrl, squareUrl, width, height }) => {
        picsUrl.push({
          id: originUrl.match(picsIdReg)[0].replace(picsIdTrimReg, ''),
          originUrl,
          squareUrl,
          width,
          height
        })
      })

      let s = jsonObj.song,
        arts = []
      s.artists.forEach(({ name }) => {
        arts.push(name)
      })
      song = {
        id: s.id,
        cover: s.album.img80x80,
        name: s.name,
        arts: arts.join('/')
      }
      if(diff <= 1800000) {
        date = '最近'
      }else if(diff <= 3600000) {
        date = parseInt(diff / 60000) + '分钟前'
      }else{
        let st = new Date(showTime), d = st.getDate()
        if(d != today) {
          date = zFill(st.getMonth() + 1) + '月' + zFill(st.getDate()) + '日'
        }else{
          date = zFill(st.getHours()) + ':' + zFill(st.getMinutes())
        }
      }

      message = replaceTopic(message)
      message = replaceEmoji(message)
      
      evts.push({
        id,
        user: {
          userId,
          avatarUrl,
          nickname
        },
        action: '分享单曲',
        date,
        message,
        picsUrl,
        song,
        reason: rcmdInfo && rcmdInfo.reason || null,
        liked,
        commentCount,
        likedCount,
        shareCount
      })
    })
    return evts
  }
}

const mutations = {
  setEvent(s, { event }) {
    s._event = event
  }
}

const actions = {
  getEvent({ commit, getters }) {
    if (getters.event) {
      return false
    }
    Vue.http.get(API_EVENT).then(({ body: { event } }) => {
      commit('setEvent', { event })
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