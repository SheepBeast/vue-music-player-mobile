function photoBrowser(el, binding) {
  if(!binding.value) {
    return false
  }
  let { group, url, index, width, height } = binding.value
  if (!group || !url) {
    return false
  }

  let id = Date.now(),
    els
  if (group) {
    el.dataset.photoBrowserGroup = group
    el.dataset.photoBrowserUrl = url
    el.classList.add('photo-browser-origin-image')
    el.addEventListener('click', function () {
      els = Object.values(document.querySelectorAll(`[data-photo-browser-group="${group}"]`));
      Vue.$photoBrowser.show(els, index || 0, {width, height});
    })
  }
}

export default {
  inserted: photoBrowser
}