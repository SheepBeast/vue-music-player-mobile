<template>
  <page-content>
    <template v-show="playlist && newSong">
      <div class="find">
        <section class="recommend-playlist">
          <h4 class="section-header">推荐歌单</h4>
          <grid gutter class="section-content">
            <cell :span="33" v-for="p in playlist" :key="p.id">
              <router-link :to="{name: 'playlist', query: {id: p.id}}" tag="div">
                <card>
                  <card-media>
                    <img class="lazyload" v-lazyload="{src: p.picUrl, wrapper: '#home'}">
                  </card-media>
                  <card-content class="intro">
                    <div class="title f-elpsl-2">{{p.name}}</div>
                  </card-content>
                </card>
              </router-link>
            </cell>
          </grid>
        </section>

        <section class="new-song">
          <h4 class="section-header">最新音乐</h4>
          <list>
            <list-item v-for="ns in newSong" :key="ns.id">
              <router-link :to="{name: 'musicPlayer', query: {id: ns.id}}" tag="div" class="list-item-holder dense">
                <list-item-inner>
                  <div class="primary-title f-elpsl-1">{{ns.name}}</div>
                  <div class="third-title f-elpsl-1">{{ns.artists}} - {{ns.album}}</div>
                </list-item-inner>
                <icon ligature="play_circle_outline" class="icon-play"></icon>
              </router-link>
            </list-item>
          </list>
        </section>
      </div>
    </template>
    <loading-page v-show="!(playlist && newSong)"></loading-page>
  </page-content>
</template>

<script>
  export default {
    name: "find",
    beforeCreate() {
      this.$store.dispatch("find/getNewSong");
      this.$store.dispatch("find/getPlaylist");
    },
    computed: Vuex.mapGetters("find", ["playlist", "newSong"])
  };
</script>