<template>
  <audio :src="currentPlays && currentPlays.url || ''" @canplay="canplay" @durationchange="durationchange" @ended="ended" @loadedmetadata="loadedmetadata"
    @pause="pause" @playing="playing" @timeupdate="timeupdate" @stalled="stalled" @error="error" ref="player" style="display: none">
  </audio>
</template>

<script>
import pipe from "./pipe.js";
export default {
  computed: {
    ...Vuex.mapGetters("musicPlayer", [
      "currentPlays",
      "recentlyPlaying",
      "lyric",
      "musicUrl",
      "supported"
    ]),
    player() {
      return this.$refs.player;
    }
  },
  methods: {
    error() {
      if (this.currentPlays && this.currentPlays.url) {
        pipe.$emit("unsupported");
      }
    },
    stalled() {
      pipe.$emit("unsupported");
    },

    canplay() {
      if (this.recentlyPlaying) {
        this.player.play();
      }
    },
    durationchange() {
      this.$store.commit("musicPlayer/loadedmetadata", {
        duration: this.player.duration
      });
    },
    ended() {
      this.player.currentTime = 0;
      this.$store.commit("musicPlayer/ended");
    },
    loadedmetadata() {
      this.$store.commit("musicPlayer/loadedmetadata", {
        duration: this.player.duration
      });
    },
    pause() {
      this.$store.commit("musicPlayer/pause");
    },
    playing() {
      this.$store.commit("musicPlayer/playing");
    },
    timeupdate() {
      this.$store.commit("musicPlayer/timeupdate", {
        currentTime: this.player.currentTime
      });
    }
  },
  mounted() {
    pipe
      .$on("toggle", () => {
        if (this.player.paused) {
          if (this.currentPlays.supported) {
            this.player.play();
          } else {
            pipe.$emit("unsupported");
          }
        } else {
          this.player.pause();
          this.$store.commit("musicPlayer/setRecentlyPlaying", {
            recentlyPlaying: false
          });
        }
      })
      .$on("seeked", ({ currentTime }) => {
        let idx = this.lyric.findIndex(lrc => lrc.time >= currentTime);
        if (idx > -1) {
          this.$store.commit("musicPlayer/setNextCursor", { cursor: idx });
        }
        this.player.currentTime = currentTime;
      })
      .$on("unsupported", () => {
        this.player.pause();
        this.player.currentTime = 0;
        this.$store.commit("musicPlayer/setSupported", {
          id: (this.currentPlays && this.currentPlays.id) || "",
          supported: false
        });
        this.$tip.show("当前歌曲暂不支持播放");
      });
  }
};
</script>