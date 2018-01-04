<template>
  <page class="music-player-interface" v-if="currentPlays">
    <div id="blur" class="blur-bg" :style="{'background-image': `url(${currentPlays.al.picUrl})`}"></div>
    <back></back>
    <div class="cover">
      <img :src="currentPlays.al.picUrl" style="width: 100%">
    </div>

    <timeline :min-value="0" :max-value="duration"></timeline>

    <div class="controls">
      <div class="info text-center">
        <router-link tag="h3" class="name" :to="{name: 'album', query: {id: currentPlays.al.id}}">
          {{currentPlays.name}}
        </router-link>
        <router-link tag="h4" class="artist" :to="{name: 'artist', query: {id: currentPlays.ar[0].id}}">
          {{currentPlays.ar[0].name}}
        </router-link>
      </div>
      
      <div class="operation-buttons" style="width: 70%; margin: auto; margin-bottom: 10px; color: rgba(0, 0, 0, 0.7);">
        <icon ligature="favorite_border" @click.native="undeveloped"></icon>
        <icon ligature="file_download" @click.native="undeveloped"></icon>
        <span style="width: 24px; height: 24px; display: inline-block; position: relative">
          <router-link class="material-icons" tag="i" :to="{name:'musicPlayerComment', query: {id: $route.query.id}}">
            chat
          </router-link>
          <sup style="width: 8px;height: 8px;display: inline-block;background-color: red;border-radius: 50%;position: absolute;right: -4px;top: -2px;"></sup>
        </span>
       
        <icon ligature="more_horiz" @click.native="undeveloped"></icon>
      </div>

      <div class="operation-buttons">
        <icon :ligature="mode" @click.native="setMode" style="font-size: 20px; color: rgba(0,0,0,0.7)"></icon>
        <icon ligature="skip_previous" @click.native="skipPrevious" style="font-size: 36px"></icon>
        <icon :ligature="switch_button" @click.native="toggle" style="font-size: 54px"></icon>
        <icon ligature="skip_next" @click.native="skipNext" style="font-size: 36px"></icon>
        <icon ligature="playlist_play" @click.native="togglePlaylist" style="font-size: 20px; color: rgba(0,0,0,0.7)"></icon>
      </div>
    </div>

    <!-- playlist -->
    <component :is="'playlist'"></component>
  </page>
  <loading-page v-else></loading-page>
</template>

<script>
import timeline from "./timeline";
import comment from "./comment";
import pipe from "./pipe";
import playlist from "./playlist";
import { deviceInfo } from "../../assets/js/util";
import mixins from "../../mixins";

export default {
  mixins: [mixins],
  computed: {
    ...Vuex.mapGetters("musicPlayer", [
      "mode",
      "switch_button",
      "currentPlays",
      "duration",
      "currentTimeString",
      "durationString"
      // "currentLyricLine"
    ])
  },
  methods: {
    toggle() {
      pipe.$emit("toggle");
    },
    setMode() {
      this.$store.commit("musicPlayer/setMode");
    },
    skipPrevious() {
      this.$store.commit("musicPlayer/skipPrevious");
    },
    skipNext() {
      this.$store.commit("musicPlayer/skipNext");
    },
    togglePlaylist() {
      pipe.$emit("togglePlaylist");
    },
    undeveloped() {
      this.$tip.show("该功能暂未开发");
    }
  },
  components: {
    timeline,
    playlist
  }
};
</script>