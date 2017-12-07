<template>
  <div class="songs">
    <h4 class="trk-title">最佳匹配</h4>
    
    <list>
      <list-item v-if="multi.album">
        <avatar class="rect">
          <img :src="multi.album.picUrl">
        </avatar>
        <router-link tag="div" class="list-item-holder middle" :to="{name: 'album', query: {id: multi
        .album.id}}">
          <list-item-inner>
            <div class="primary-title f-elpsl-1">专辑：{{multi.album.name}}</div>
            <div class="third-title f-elpsl-1">{{multi.album.artist}}</div>
          </list-item-inner>
        <icon ligature="navigate_next"></icon>
        
        </router-link>
      </list-item>

      <list-item v-if="multi.artist">
        <avatar class="rect">
          <img :src="multi.artist.picUrl">
        </avatar>
        <router-link tag="div" class="list-item-holder middle" :to="{name: 'artist', query: {id: multi
        .artist.id}}">
          <list-item-inner>
            <div class="primary-title f-elpsl-1">
              歌手：{{multi.artist.name}}
              <span class="alias" v-if="multi.artist.alias">（{{multi.artist.alias}}）</span>
            </div>
          </list-item-inner>
          <icon ligature="navigate_next"></icon>
        </router-link>
      </list-item>

      <list-item v-for="s in songs" :key="s.id">
        <router-link v-if="s.album.status >= 0" tag="div" class="list-item-holder dense no-avatar" :to="{name: 'musicPlayer', query: {id: s.id}}">
          <list-item-inner>
            <div class="primary-title f-elpsl-1">{{s.name}}</div>
            <div class="third-title f-elpsl-1">{{s.artist.name}} - {{s.album.name}}</div>
          </list-item-inner>
          <icon ligature="play_circle_outline" class="icon-play"></icon>
        </router-link>
        <list-item-holder class="dense no-avatar" @click.native="unsupported" v-else>
          <list-item-inner>
            <div class="primary-title f-elpsl-1">{{s.name}}</div>
            <div class="third-title f-elpsl-1">{{s.artist.name}} - {{s.album.name}}</div>
          </list-item-inner>
          <icon ligature="play_circle_outline" class="icon-play"></icon>
        </list-item-holder>
      </list-item>
    </list>
  </div>
</template>

<script>
export default {
  computed: Vuex.mapGetters("search", ["songs", "multi"]),
  methods: {
    unsupported() {
      this.$tip.show("当前专辑需单独付费");
    }
  }
};
</script>