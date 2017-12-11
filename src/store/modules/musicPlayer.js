import { timeTransform, replaceEmoji, timeDiff, translateComment } from '../../assets/js/util'
import pipe from '../../views/musicPlayer/pipe'
import { API_MUSIC_DETAIL, API_MUSIC_COMMENT, API_MUSIC_URL, API_MUSIC_LYRIC, API_ALBUM } from '../../api'

const timeReg = /\[\d*:\d*\.\d*\]/g,
  timeReplaceReg = /\[|\]/g

const state = {
  _mode: 'shuffle',
  _currentTime: 0,
  _duration: 0,

  _playing: false,

  _playlist: [],
  _playIndex: 0,
  _musicUrl: "",
  _recentlyPlaying: true,

  // _lyric: null,
  _supported: true,
  _currentLyricLine: -1,
  _nextCursor: 0
}

const getters = {
  currentTime: s => s._currentTime,
  duration: s => s._duration,
  currentTimeString(s, getters) {
    if (getters.lyric[s._nextCursor]) {
      let latestLyric = getters.lyric[s._nextCursor]
      if (latestLyric && s._currentTime >= latestLyric.time) {
        s._currentLyricLine = s._nextCursor
        ++s._nextCursor
      }
    }
    return timeTransform(s._currentTime)
  },
  durationString: s => timeTransform(s._duration),
  playing: s => s._playing,
  currentPlays: s => s._playlist[s._playIndex],
  playlist: s => s._playlist,
  playIndex: s => s._playIndex,
  mode: s => s._mode,
  switch_button: s => !s._playing ? 'play_arrow' : 'pause',
  recentlyPlaying: s => s._recentlyPlaying,
  lyric(s) {
    let _lyric = s._playlist[s._playIndex].lyric
    if (_lyric) {
      let splited = _lyric.split('\n'),
        parsed = []

      splited.pop()
      for (let i = 0, l = splited.length, time, clause, temp, _temp, min, sec; i < l; i++) {
        temp = splited[i]
        time = temp.match(timeReg)
        if (time) {
          time = time[0].replace(timeReplaceReg, '')
        } else {
          time = '00:00'
        }
        clause = temp.replace(timeReg, '').trim()
        if (clause) {
          _temp = time.split(':')
          min = parseInt(_temp[0])
          sec = parseFloat(_temp[1])
          parsed.push({
            time: min * 60 + sec,
            clause
          })
        }
      }
      s._currentLyricLine = -1
      s._nextCursor = 0
      return parsed
    }
    return []
  },
  currentLyricLine: s => s._currentLyricLine,
  nextCursor: s => s._nextCursor,
  musicUrl: s => s._musicUrl,
  supported: s => s._supported
}
const mutations = {
  setMode(s) {
    switch (s._mode) {
      case 'shuffle':
        s._mode = 'repeat';
        break
      case 'repeat':
        s._mode = 'repeat_one'
        break
      case 'repeat_one':
        s._mode = 'shuffle'
        break
    }
  },
  skipPrevious(s) {
    let prev = s._playIndex - 1
    if (prev < 0) {
      prev = s._playlist.length - 1
    }
    s._playIndex = prev
    if (!s._playlist[prev].supported) {
      pipe.$emit('unsupported')
    }
  },
  skipNext(s) {
    let next = s._playIndex + 1
    if (next > s._playlist.length - 1) {
      next = 0
    }
    s._playIndex = next
    if (!s._playlist[next].supported) {
      pipe.$emit('unsupported')
    }
  },
  setRecentlyPlaying(s, { recentlyPlaying }) {
    s._recentlyPlaying = recentlyPlaying
  },

  canplay(s, { recentlyPlaying }) {
    s._recentlyPlaying = recentlyPlaying
  },
  durationchange(s, { duration }) {
    s._duration = duration
  },
  ended(s) {
    s._currentTime = 0
    s._recentlyPlaying = true

    s._currentLyricLine = -1
    s._nextCursor = 0

    // 根据相应的播放模式相应切换歌曲
    // 随机播放
    if (s._playlist.length > 1) {
      switch (s._mode) {
        case 'shuffle':
          let randomIndex = s._playIndex, l = s._playlist.length
          do {
            randomIndex = Math.floor(Math.random() * l)
          } while (randomIndex == s._playIndex)

          s._playIndex = randomIndex
          break
        case 'repeat':
          let nextIndex = s._playIndex + 1
          s._playIndex = nextIndex == s._playlist.length ? 0 : nextIndex
          break
        case 'repeat_one':
          break
      }
    }
  },
  loadedmetadata(s, { duration }) {
    // s._currentTime = 0
    s._duration = duration
  },
  pause(s) {
    s._playing = false
    // s._recentlyPlaying = true
  },
  playing(s) {
    s._supported = true
    s._playing = true
    s._recentlyPlaying = true
  },
  timeupdate(s, { currentTime }) {
    s._currentTime = currentTime
  },

  addSong(s, { song: { id, name, ar, al }, url, comments, total, more, lyric, supported, done }) {
    s._playlist.push({
      id,
      name,
      ar,
      al,
      url,
      comments: translateComment(comments).sort(() => 0.5 - Math.random()),
      total,
      more,
      lyric,
      supported
    })
    // s._lyric = lyric
    s._playIndex = s._playlist.length - 1
    done()
  },
  setNextCursor(s, { cursor }) {
    s._nextCursor = cursor
  },
  setSupported(s, { id, supported }) {
    if (!id) {
      return false
    }
    let idx = s._playlist.findIndex(p => {
      return p.id == id && p.supported
    })
    if (idx > -1) {
      s._playlist[idx].supported = supported
      if (!supported) {
        s._playing = false
      }
    }
  },
  cut(s, { index }) {
    s._playIndex = index
    if (!s._playlist[index].supported) {
      pipe.$emit('unsupported')
    }
  },
  remove(s, { index, vm }) {
    let p = s._playlist
    if (p.length > 1) {
      s._playlist.splice(index, 1)
      s._playIndex = 0
    } else {
      vm.$router.back()
      setTimeout(() => {
        s._playlist = []
      }, 300);
    }
  }
}
const actions = {
  async fetch({ commit, getters }, { id, done }) {
    let hasSong = false
    if (!(!getters.currentPlays || (id && getters.currentPlays.id != id))) {
      hasSong = true
    } else if (id && getters.playlist) {
      let index = getters.playlist.findIndex(val => val.id == id)
      if (index > -1) {
        hasSong = true
        commit('cut', { index })
      }
    }
    if (hasSong) {
      done()
    } else {
      let p1 = Vue.http.get(`${API_MUSIC_DETAIL}?ids=${id}`),
        p2 = Vue.http.get(`${API_MUSIC_URL}?id=${id}`),
        p3 = Vue.http.get(`${API_MUSIC_COMMENT}?limit=20&id=${id}`),
        p4 = Vue.http.get(`${API_MUSIC_LYRIC}?id=${id}`),

       res = await Promise.all([p1, p2, p3, p4]),
       song = res[0].body.songs[0], 
       url = res[1].body.data[0].url, 
       lrc
      
      // 设置歌曲信息
      commit('addSong', {
        song: res[0].body.songs[0],
        url,
        comments: res[2].body.comments,
        total: res[2].body.total,
        more: res[2].body.more,
        lyric: (lrc = res[3].body.lrc) && lrc.lyric || null,
        supported: true,
        done
      })

      // 即使设置歌曲但还是需要判断是否支持播放
      // 如果不支持则页面只显示歌曲信息而提示不能播放
      // 避免直接显示空白页
      if(url) {
        let resp = await Vue.http.get(`${API_ALBUM}?id=${song.al.id}`)
        if (resp.body.album.status == -3) {
          pipe.$emit('unsupported')
        }
      }else{
        pipe.$emit('unsupported')
      }
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