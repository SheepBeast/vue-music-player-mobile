import home from '../views/home/home.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/search',
    name: 'search',
    component: resolve => require(['../views/search/search.vue'], resolve)
  },
  {
    path: '/musicPlayer',
    name: 'musicPlayer',
    component: resolve => require(['../views/musicPlayer/interface.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('musicPlayer/getSongDetail', payload)
      }
    }
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: resolve => require(['../views/playlist.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('playlist/getPlaylist', payload)
      }
    }
  },
  {
    path: '/album',
    name: 'album',
    component: resolve => require(['../views/album.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('album/getAlbum', payload)
      }
    }
  },
  {
    path: '/artist',
    name: 'artist',
    component: resolve => require(['../views/artist.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('artist/getArtist', payload)
      }
    }
  },
  {
    path: '/user',
    name: 'user',
    component: resolve => require(['../views/user.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('user/getUser', payload)
      }
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]