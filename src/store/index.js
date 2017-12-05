Vue.use(Vuex)
Vue.use(VueResource)

Vue.http.options.xhr = { withCredentials: true }

import find from './modules/find'
import playlist from './modules/playlist'
import search from './modules/search'
import musicPlayer from './modules/musicPlayer'
import recommend from './modules/recommend'
import album from './modules/album'
import artist from './modules/artist'
import user from './modules/user'

export default new Vuex.Store({
  modules: {
    find,
    playlist,
    search,
    musicPlayer,
    recommend,
    album,
    artist,
    user
  }
}) 