<template>
  <page class="photo-browser" :class="{active}" @click.native="close">
    <img :src="url"  draggable="false">
  </page>
</template>

<script>
export default {
  data() {
    return {
      url: require('../assets/img/default.gif'),
      active: false
    };
  },
  methods: {
    open(url) {
      Vue.$loadingTip.show()

      let self = this,
        image = new Image()

      image.onload = function() {
        self.url = url
        setTimeout(function() {
          Vue.$loadingTip.hide()
          self.active = true
          image.onload = null
        }, 300)
      }
      image.src = url
    },
    close(e) {
      this.active = false
    },
    swiperInit(vnode) {
      this.swiper = vnode;
    }
  }
};
</script>
