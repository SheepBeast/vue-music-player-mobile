function photoBrowser(el, binding) {
  if(!binding.value || !binding.value.group || !binding.value.url){
    return false
  }
  let { group, url, index, width, height } = binding.value

  el.dataset.photoBrowserGroup = group
  el.dataset.photoBrowserUrl = url
  el.classList.add('photo-browser-origin-image')
  el.addEventListener('click', function () {
    let els = Object.values(document.querySelectorAll(`[data-photo-browser-group="${group}"]`));
    Vue.$photoBrowser.open(els, index || 0, {width, height});
  })
}

export default {
  inserted: photoBrowser
}