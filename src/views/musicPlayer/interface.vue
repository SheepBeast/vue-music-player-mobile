<template>
  <page class="music-player-interface" v-if="currentPlays">
    <div id="blur" class="blur-bg" :class="{mask: hideCover}" :style="{'background-image': `url(${currentPlays.al.picUrl})`}"></div>

    <back></back>
    <div class="cover">
      <img :src="currentPlays.al.picUrl" @click="toggleCover" :class="{hidden: hideCover}" @transitionend="coverTransitionEnd" :style="computedCoverHeight">
      <div class="lyric" ref="lyric" :style="{'display': notDisplayLyric ? 'none' : 'block'}">
        <div class="lyc-wrapper" :style="{top: `-webkit-calc(50% - ${currentLyricLine * 25}px)`}">
          <template v-if="lyric.length > 0">
            <p :class="{lighter: currentLyricLine === idx}" v-for="(pl, idx) in lyric" :key="pl.time">{{pl.clause}}</p>
          </template>
          <template v-else>
            <p>暂无歌词</p>
          </template>
        </div>
      </div>
    </div>

    <timeline :min-value="0" :max-value="duration"></timeline>

    <div class="controls" style="padding-top: 10px; padding-bottom: 20px;">
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
        <icon ligature="reply" @click.native="undeveloped" style="transform: scaleX(-1)"></icon>
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

    <!-- mini -->
    <div class="music-player-mini-interface" :class="{active: showMiniUI}" ref="mini">
      <img :src="currentPlays.al.picUrl" style="height: 100%;">
      <div class="operation-buttons">
        <icon class="text-center" ligature="favorite_border" @click.native="undeveloped"></icon>
        <icon class="text-center larger" ligature="skip_previous" @click.native="skipPrevious"></icon>
        <icon class="text-center larger" :ligature="switch_button" @click.native="toggle"></icon>
        <icon class="text-center larger" ligature="skip_next" @click.native="skipNext"></icon>
        <icon class="text-center larger" ligature="more_horiz" @click.native="undeveloped"></icon>
      </div>

      <div class="blur-bg" style="opacity: 1" :style="{'background-image': `url(${currentPlays.al.picUrl})`}"></div>
    </div>

    <!-- comment -->
    <component :is="'comment'"></component>

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
import mixins from "../mixins";

export default {
  data() {
    return {
      showMiniUI: false,
      computedTop: 0,
      hideCover: false,
      notDisplayLyric: true
    };
  },
  mixins: [mixins],
  computed: {
    ...Vuex.mapGetters("musicPlayer", [
      "mode",
      "switch_button",
      "currentPlays",
      "duration",
      "currentTimeString",
      "durationString",
      "lyric",
      "currentLyricLine"
    ]),
    computedCoverHeight() {
      return {
        height: `${deviceInfo.width}px`
      };
    }
  },
  methods: {
    toggle() {
      pipe.$emit("toggle");
    },
    toggleCover() {
      this.notDisplayLyric = false;
      this.hideCover = !this.hideCover;
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
    coverTransitionEnd() {
      if (!this.hideCover) {
        this.notDisplayLyric = true;
      }
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
    comment,
    playlist
  },
  mounted() {
    pipe.$on("toggleMiniUI", ({ active }) => {
      this.showMiniUI = active;
    });
  }
};
</script>