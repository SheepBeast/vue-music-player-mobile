const zoom = function zoom(el, binding, vnode, oldVnode) {
  let state = Object.assign({
    zoomTouchesDistance: 0,
    isZooming: false,
    scale: 1,
    max: 3,
    min: 1,
    el
  }, binding.value)

  return function (e) {
    if (state.isZooming) {
      return false
    }

    state.isZooming = true

    let touches = e.changedTouches;
    if (touches.length !== 2) {
      state.isZooming = false
      return false
    }

    let dist
      = Math.sqrt(
        Math.pow(touches[0].pageX - touches[1].pageX, 2) +
        Math.pow(touches[0].pageY - touches[1].pageY, 2)
      ),
      scale = state.scale + 0.06 * (dist - state.zoomTouchesDistance > 0 ? 1 : -1)

    if (scale < state.min) {
      scale = state.min
    } else if (scale > state.max) {
      scale = state.max
    }

    state.el.style.transform = `scale(${scale})`
    state.zoomTouchesDistance = dist
    state.scale = scale
    state.isZooming = false
    e.stopProgation()
  }
}

let eventsHub = {}

export default {
  bind: function (el, binding) {
    let evtId = 'evt-' + Date.now().toString(32)
    el.evtId = evtId
    eventsHub[evtId] = zoom(el, binding)
    el.addEventListener('touchmove', eventsHub[evtId])
  },
  unbind: function (el) {
    el.removeEventListener('touchmove', eventsHub[el.evtId])
  }
}