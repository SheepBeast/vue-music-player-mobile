<template>
  <page id="user" class="user" v-if="user">
    <section class="u-header" :style="{'background-image': `url(${user.backgroundUrl})`}">
      <toolbar class="navigate u-header-toolbar">
        <toolbar-inner>
          <grid>
            <cell :span="33"></cell>
            <cell :span="33" class="text-center" style="align-self: center;">
              <span class="title">用户</span>
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
            <cell :span="33">
            </cell>
            <cell :span="33"></cell>
          </grid>
        </toolbar-inner>
      </toolbar>

      <div class="u-wrapper">
        <grid class="text-center" style="align-items: center;">
          <cell :span="33">
            {{user.listenSongs}}
            <div class="u-header-count">听歌数</div>
          </cell>
          <cell :span="33">
            <avatar>
              <img :src="user.avatarUrl">
            </avatar>
          </cell>
          <cell :span="33">
            {{user.followeds}}
            <div class="u-header-count">粉丝数</div>
          </cell>
        </grid>
        <div class="text-center">
          {{user.nickname}}
          <div class="btn-follow" @click="undeveloped">
            <icon ligature="add"></icon>关注
          </div>
        </div>
      </div>
    </section>

    <list class="u-playlist" v-if="playlist">
      <router-link v-for="p in playlist" :key="p.id" class="list-item" :to="{name: 'playlist', query: {id: p.id}}"
        tag="div">
        <avatar>
          <img class="lazyload" v-lazyload="{src: p.coverImgUrl, wrapper: '#user'}">
        </avatar>
        <list-item-holder class="dense u-pl-0">
          <list-item-inner>
            <div class="primary-title f-elpsl-1">{{p.name}}</div>
            <div class="third-title f-elpsl-1">{{p.trackCount}}首，播放{{p.playCount}}次</div>
          </list-item-inner>
        </list-item-holder>
      </router-link>
    </list>
  </page>
  <loading-page v-else></loading-page>
</template>

<script>
export default {
  computed: Vuex.mapGetters("user", ["user", "playlist"]),
  methods: {
    undeveloped() {
      this.$tip.show("该功能暂未开发");
    }
  }
};
</script>