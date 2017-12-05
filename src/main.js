import './assets/less/index.less'
import components from './components'
import plugins from './plugins'
import directives from './directives'

Vue.use(components)
Vue.use(plugins)
Vue.use(directives)

import App from './App'

import router from './router'
import store from './store'

import construct from './router/construct';

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>', 
  components: { App }
})

construct(router)