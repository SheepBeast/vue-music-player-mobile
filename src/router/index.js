import navigation from './navigation.vue'
import children from './routes'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [{
    path: '/',
    component: navigation,
    children
  }],
})
