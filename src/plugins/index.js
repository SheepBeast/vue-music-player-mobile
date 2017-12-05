import { createService } from '../assets/js/util'

import tip from './tip.vue'
import loadingTip from './loadingTip.vue'
// import photoBrowser from './photoBrowser.vue'

export default {
  install(Vue, options) {
    createService('$tip', tip)
    createService('$loadingTip', loadingTip)
    // createService('$photoBrowser', photoBrowser)
  }
}