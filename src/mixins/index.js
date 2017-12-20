export const beforeRouteEnter = {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$router.pass) {
        next()
      } else {
        vm.$router.replace({ name: 'home' })
      }
    })
  }
}

export const updated = {
  updated() {
    Vue.$lazyload()
  }
}

export default Object.assign({}, beforeRouteEnter, updated)