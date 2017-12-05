<template>
  <page-content v-if="recommend" style="padding-top: 0">
    <div class="recommend">
      <section class="banner" v-if="banner">
        <router-link :to="{name: 'musicPlayer', query: {id: banner.sid}}" tag="img" :src="banner.picUrl"></router-link>
      </section>

      <list>
        <list-item v-for="(tl, idx) in recommend" :key="tl.id">
          <span class="index">{{idx + 1}}</span>
          <router-link :to="{name: 'musicPlayer', query: {id: tl.id}}" tag="div" class="list-item-holder dense">
            <list-item-inner>
              <div class="primary-title">{{tl.name}}</div>
              <div class="third-title">{{tl.artists}} - {{tl.album}}</div>
            </list-item-inner>
            <icon ligature="play_circle_outline" class="icon-play"></icon>
          </router-link>
        </list-item>
      </list>
    </div>
  </page-content>
  <loading-page v-else></loading-page>
</template>

<script>
export default {
  name: "recommend",
  computed: Vuex.mapGetters("recommend", ["recommend", "banner"]),
  beforeCreate() {
    this.$store.dispatch("recommend/getRecommend");
  }
};
</script>