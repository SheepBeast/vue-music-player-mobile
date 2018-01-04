Vue.use(Vuex)
Vue.use(VueResource)

Vue.http.options.xhr = { withCredentials: true }

import find from './modules/find'
import playlist from './modules/playlist'
import search from './modules/search'
import musicPlayer from './modules/musicPlayer'
import musicPlayerComment from './modules/musicPlayerComment'
import recommend from './modules/recommend'
import album from './modules/album'
import artist from './modules/artist'
import user from './modules/user'
import event from './modules/event'

export default new Vuex.Store({
  modules: {
    find,
    playlist,
    search,
    musicPlayer,
    musicPlayerComment,
    recommend,
    album,
    artist,
    user,
    event
  }
}) 