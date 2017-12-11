<template>
  <page-content style="padding-top: 0" v-if="recommend">
    <div class="recommend">
      <section class="banner">
        <router-link :to="{name: 'musicPlayer', query: {id: recommend.banner.id}}" tag="img" :src="recommend.banner.picUrl"></router-link>
      </section>
      <list>
        <list-item v-for="(tl, idx) in recommend.list" :key="tl.id">
          <span class="index">{{idx + 1}}</span>
          <router-link :to="{name: 'musicPlayer', query: {id: tl.id}}" tag="div" class="list-item-holder dense">
            <list-item-inner>
              <div class="primary-title f-elpsl-1">{{tl.name}}</div>
              <div class="third-title f-elpsl-1">{{tl.artists}} - {{tl.album}}</div>
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
    computed: Vuex.mapGetters("recommend", ["recommend", "banner"])
  };
</script>