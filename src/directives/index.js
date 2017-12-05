import lazyload from './lazyload'
// import photoBrowser from './photoBrowser'

export default {
  install(Vue, options) {
    Vue.directive('lazyload', lazyload)
    // Vue.directive('photoBrowser', photoBrowser)
  }
}