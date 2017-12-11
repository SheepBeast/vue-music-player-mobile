export default {
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