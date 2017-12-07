<template>
  <div class="music-player-playlist-container" :style="{'display': showContainer ? 'flex' : 'none'}">
    <div class="backdrop" @click="close"></div>
    <div class="music-player-playlist" :class="{active}">
      <div class="playlist-history-header text-center">历史记录</div>
      <list class="history-list">
        <list-item @click.native="cut(i)" v-for="(p, i) in playlist" :key="p.id" :style="{color: playIndex == i ? 'rgba(255, 69, 0, 0.8)' : '#000'}">
          <list-item-holder class="dense">
            <list-item-inner>
              <div class="primary-title f-elpsl-1">
                {{p.name}} -
                <small>{{p.ar[0].name}}</small>
                <icon ligature="close" class="close" @click.native="remove(i)"></icon>
              </div>
            </list-item-inner>
          </list-item-holder>
        </list-item>
      </list>
      <div class="playlist-close-button text-center" @click="close">关闭</div>
    </div>
  </div>
</template>

<script>
import pipe from "./pipe";

export default {
  data() {
    return {
      active: false,
      showContainer: false
    };
  },
  computed: Vuex.mapGetters("musicPlayer", ["playlist", "playIndex"]),
  methods: {
    cut(index) {
      this.$store.commit("musicPlayer/cut", { index });
    },
    close() {
      pipe.$emit("togglePlaylist");
    },
    remove(index) {
      this.$store.commit("musicPlayer/remove", { index, vm: this });
    }
  },
  created() {
    pipe.$on("togglePlaylist", () => {
      if (this.active) {
        this.active = false;
        setTimeout(() => {
          this.showContainer = false;
        }, 300);
      } else {
        this.showContainer = true;
        setTimeout(() => {
          this.active = true;
        }, 100);
      }
    });
  }
};
</script>