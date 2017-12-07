<template>
  <page-content class="events">
    <template v-show="event">
      <section class="event shadow-3d" v-for="e in event" :key="e.id">
        <div class="side-left">
          <router-link class="avatar" tag="div" :to="{name: 'user', query: {id: e.user.userId}}">
            <img class="lazyload" v-lazyload="{src: e.user.avatarUrl, wrapper: '#home'}">
          </router-link>
        </div>
        <div class="main">
          <card>
            <card-content class="header">
              <router-link tag="span" :to="{name: 'user', query: {id: e.user.userId}}">{{e.user.nickname}}</router-link>
              <small class="action-time">{{e.date}}</small>
            </card-content>
            <card-media>
              <p class="message" v-html="e.message"></p>
              <grid class="gutter">
                <cell :span="33" v-for="(p, i) in e.picsUrl" :key="p.id">
                  <img class="lazyload" v-photo-browser="{group: e.id, index: i, url: p.originUrl, width: p.width, height: p.height}" v-lazyload="{src: p.squareUrl, wrapper: '#home'}">
                </cell>
              </grid>

              <router-link :to="{name: 'musicPlayer', query: {id: e.song.id}}" tag="div" class="toolbar music">
                <avatar class="rect">
                  <img class="lazyload" v-lazyload="{src: e.song.cover, wrapper: '#home'}">
                </avatar>
                <toolbar-inner>
                  <div class="primary-title f-elpsl-1">{{e.song.name}}</div>
                  <div class="third-title f-elpsl-1">{{e.song.arts}}</div>
                </toolbar-inner>
                <icon ligature="play_circle_outline" class="toolbar-icon icon-play"></icon>
              </router-link>

              <small class="recommend-reason" v-if="e.reason">—— {{e.reason}}</small>
            </card-media>
            <card-actions>
              <grid class="text-center">
                <cell :span="33">
                  <span @click="undeveloped">
                    <icon ligature="thumb_up"></icon>
                    <span class="count">{{e.likedCount}}</span>
                  </span>
                </cell>
                <cell :span="33">
                  <span @click="undeveloped">
                    <icon ligature="chat"></icon>
                    <span class="count">{{e.commentCount}}</span>
                  </span>
                </cell>
                <cell :span="33">
                  <span @click="undeveloped">
                    <icon ligature="reply" class="reverse"></icon>
                    <span class="count">{{e.shareCount}}</span>
                  </span>
                </cell>
              </grid>
            </card-actions>
          </card>
        </div>
      </section>
    </template>
    <loading-page v-show="!event"></loading-page>
  </page-content>
</template>
<script>
import { createService } from "../../assets/js/util.js";

/**
 * 由于图片浏览器只在当前页面使用，所以该页面才注册photoBrowser服务，并注册局部指令
 * 该页面为异步加载的页面，所以也减少首页加载时间
 */
import photoBrowser from "../../plugins/photoBrowser.vue";
import vProtoBrowser from "../../directives/photoBrowser.js";

export default {
  name: "event",
  beforeCreate() {
    if (!Vue.$photoBrowser) {
      createService("$photoBrowser", photoBrowser);
    }
    this.$store.dispatch("event/getEvent");
  },
  methods: {
    undeveloped() {
      this.$tip.show("该功能暂未开发");
    }
  },
  directives: {
    photoBrowser: vProtoBrowser
  },
  computed: Vuex.mapGetters("event", ["event"]),
  mounted() {
    this.$lazyload();
  }
};
</script>