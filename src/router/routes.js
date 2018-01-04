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
        dispatch('musicPlayer/fetch', payload)
      }
    }
  },
  {
    path: '/musicPlayerComment',
    name: 'musicPlayerComment',
    component: resolve => require(['../views/musicPlayer/comment.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        console.log('comm', payload)
        dispatch('musicPlayerComment/fetch', payload)
      }
    }
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: resolve => require(['../views/playlist.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('playlist/fetch', payload)
      }
    }
  },
  {
    path: '/album',
    name: 'album',
    component: resolve => require(['../views/album.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('album/fetch', payload)
      }
    }
  },
  {
    path: '/artist',
    name: 'artist',
    component: resolve => require(['../views/artist.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('artist/fetch', payload)
      }
    }
  },
  {
    path: '/user',
    name: 'user',
    component: resolve => require(['../views/user.vue'], resolve),
    meta: {
      preload({ dispatch }, payload) {
        dispatch('user/fetch', payload)
      }
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]