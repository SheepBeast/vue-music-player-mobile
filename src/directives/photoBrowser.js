function photoBrowser(el, binding) {
  let group = binding.value && binding.value.group, els
  if (group) {
    el.dataset.group = group
    el.addEventListener('click', function () {
      els = Object.values(document.querySelectorAll(`[data-group="${group}"]`));
      Vue.$photoBrowser.show(els, binding.value && binding.value.index || 0);
    })
  }
}

export default {
  inserted: photoBrowser
}