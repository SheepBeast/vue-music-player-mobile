function photoBrowser(el, binding) {
  if (!binding.value || !binding.value.url) {
    return false
  }
  let { url } = binding.value

  el.addEventListener('click', function () {
    Vue.$photoBrowser.open(url);
  })
}

export default {
  inserted: photoBrowser
}