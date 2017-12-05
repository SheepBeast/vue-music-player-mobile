<template>
  <page class="playlist artist" v-if="artist">
    <div class="ar-header">
      <img class="ar-bg" :src="artist.picUrl">

      <toolbar fixed class="navigate" style="position: absolute;">
        <toolbar-inner>
          <grid>
            <cell :span="33"></cell>
            <cell :span="33" class="text-center" style="align-self: center;">
              <span class="title">歌手</span>
            </cell>
            <cell :span="33"></cell>
          </grid>
        </toolbar-inner>
      </toolbar>

      <toolbar fixed class="navigate">
        <toolbar-inner>
          <grid>
            <cell :span="33">
              <back></back>
            </cell>
            <cell :span="33"></cell>
            <cell :span="33"></cell>
          </grid>
        </toolbar-inner>
      </toolbar>

      <h4 class="f-elpsl-1 ar-name">{{artist.name}}<span v-if="artist.alias">（{{artist.alias}}）</span></h4>
    </div>

    <section class="intro">
      <div class="description" :class="{'f-elpsl-2': !showDesc}" @click="toggle">
        简介：{{artist.briefDesc}}
      </div>
      <icon :ligature="!showDesc ? 'expand_more' : 'expand_less'" class="icon-expand" @click.native="expand"></icon>
    </section>

    <section v-if="hotSongs">
      <h4 class="trk-title">热门{{hotSongs.length}}单曲</h4>
      <list>
        <list-item v-for="(hs, idx) in hotSongs" :key="hs.id">
          <span class="index">{{idx + 1}}</span>
          <router-link class="list-item-holder dense" :to="{name: 'musicPlayer', query: {id: hs.id}}" tag="div">
            <list-item-inner>
              <div class="prinary-title f-elpsl-1">
                {{hs.name}}
                <span v-if="hs.alias">{{hs.alias}}</span>
              </div>
              <div class="third-title f-elpsl-1">{{hs.artist}} - {{hs.album}}</div>
            </list-item-inner>
            <icon ligature="play_circle_outline" class="icon-play"></icon>
          </router-link>
        </list-item>
      </list>
    </section>
  </page>
  <loading-page v-else></loading-page>
</template>

<script>
export default {
  data() {
    return {
      showDesc: false
    };
  },
  methods: {
    toggle() {
      this.showDesc = !this.showDesc;
    }
  },
  computed: Vuex.mapGetters("artist", ["artist", "hotSongs"])
};
</script>