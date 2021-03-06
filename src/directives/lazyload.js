import { deviceInfo, type } from '../assets/js/util'

let imagesHub = [],
  bufferHub = [],
  srcHub = [],
  wrapHub = [],
  loading = false,
  clientHeight = deviceInfo.height,
  def = require('../assets/img/default.gif'),
  timer,
  id = 0

const cache = function (el, binding) {
  if (el.tagName !== 'IMG' || !binding.value) {
    return false
  }
  let val = binding.value, src, wrapper
  if (type(val) == 'string') {
    src = val
  } else if (type(val) == 'object') {
    src = val.src
    wrapper = val.wrapper
  }
  if (srcHub.includes(src)) {
    el.src = src
  } else {
    el.src = def;
    (loading ? bufferHub : imagesHub).push({ id: id++, el, src });
  }
  if (wrapper) {
    let wrap = document.querySelector(wrapper)
    if (wrap && !wrapHub.includes(wrap)) {
      wrap.addEventListener('load', lazyload)
      wrap.addEventListener('scroll', throttle(lazyload, 100))
      wrapHub.push(wrap)
    }
  }
  clearTimeout(timer)
  timer = setTimeout(() => {
    lazyload()
  }, 100);
}

// 加载图片
const lazyload = function lazyload() {
  console.time('lazyload')
  if (loading || imagesHub.length == 0) {
    return false
  }
  loading = true

  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop, rmArray = []

  for (let i = 0, l = imagesHub.length; i < l; i++) {
    let { id, el, src } = imagesHub[i],
      rect = el.getBoundingClientRect(),
      range = [-100, clientHeight + 100]

    if (rect.top > range[0] && rect.top <= range[1] || rect.bottom > range[0] && rect.bottom <= range[1]) {
      el.onload = function () {
        el.style.opacity = 1
        el.onload = null
      }
      el.src = src

      rmArray.push(id)
    }
  }

  // 筛选未加载的图片元素
  if (rmArray.length > 0) {
    srcHub = srcHub.concat(rmArray)
    imagesHub = imagesHub.filter(img => !rmArray.includes(img.id)).concat(bufferHub.slice())
    bufferHub.length = 0
  }

  loading = false
  console.timeEnd('lazyload')
}

/**
 * 节流函数
 * @param {Function} callback 回调函数
 * @param {Number} delay 触发回调后多久可再次触发
 */
const throttle = function (callback, delay) {
  let timeout, throttling = false

  return function () {
    if (!throttling) {
      throttling = true
      callback.apply(this, arguments)
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        throttling = false
      }, delay);
    }
  }
}

// 添加主动懒加载的操作方式
Vue.$lazyload = Vue.prototype.$lazyload = lazyload

export default {
  inserted: cache,
  updated: cache
}