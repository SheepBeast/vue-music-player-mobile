import lazyload from './lazyload'
// import photoBrowser from './photoBrowser'
// import zoom from './zoom'

export default {
  install(Vue, options) {
    Vue.directive('lazyload', lazyload)
    // Vue.directive('photoBrowser', photoBrowser)
    // Vue.directive('zoom', zoom)
  }
}