let eventsHub = {},
  count = 0,
  regScale = /scale.*\(.*\)/ig
  
const zoom = function zoom(el, binding){
  let state = Object.assign({
    isZooming: false,
    scale: 1.5
  }, binding.value),

  fn = eventsHub[count] = function(e) {
    e.stopPropagation()
    el.style.transform = `scale(${state.isZooming ? 1 : state.scale})`
    state.isZooming = !state.isZooming
  }
  el.addEventListener('dblclick', fn)
  el.classList.add('zoom')
  el.dataset.eventId = count++
}

export default {
  inserted: zoom,
  unbind: function(el) {
    let eid = el.dataset.eventId
    el.removeEventListener('dblclick', eventsHub[eid])
    el.classList.remove('zoom')
    delete eventsHub[eid]
  }
}