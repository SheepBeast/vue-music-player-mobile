import emoji from '../json/emoji.json'


// video, audio 使用的简单的时间格式化函数
// 只适用于数字转时分秒格式

export function timeTransform(time) {
  if (!isNaN(time = parseInt(time))) {
    return Math.floor(time / 60) + ':' + zFill(time % 60)
    // return zFill(Math.floor(time / 60)) + ':' + zFill(time % 60)
  }
  return '0:00'
}

export function zFill(time) {
  if (time < 10) {
    return "0" + time
  }
  return "" + time
}

let toString = Object.prototype.toString,
  types = {},
  typesArray = ['Number', 'String', 'Boolean', 'Null', 'Undefined', 'Array', 'Object']

typesArray.forEach(function (val) {
  types['[object ' + val + ']'] = val.toLowerCase()
})

export function type(val) {
  return types[toString.call(val)]
}


export function createService(name, vnode) {
  let wrapper = document.createElement('div'),
    id = 'v-' + Date.now().toString(32)

  wrapper.id = id

  if (document.body.appendChild(wrapper)) {
    if (Vue.prototype[name]) {
      console.error(`${name}属性或函数已存在`)
      return false
    } else {
      Vue[name] = Vue.prototype[name] = new Vue(vnode).$mount('#' + id)
      return true
    }
  } else {
    return false
  }
}

export const deviceInfo = (function () {
  return {
    width: document.documentElement.clientWidth || document.body.clientWidth,
    height: document.documentElement.clientHeight || document.body.clientHeight
  }
})()


const emojiReg = /(\[[a-zA-Z0-9\u4e00-\u9fa5]+\])/g

export function replaceEmoji(str) {
  return str ? str.replace(emojiReg, w => {
    return `<img class="emoji" src="${emoji[w]}"/>`
  }) : ''
}

export function stop() {
  window.stop ? window.stop() : document.execCommand('stop')
}

export default {
  timeTransform,
  zFill,
  type,
  createService,
  deviceInfo,
  replaceEmoji,
  stop
}