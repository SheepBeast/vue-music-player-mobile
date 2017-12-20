<template>
  <page id="album" class="playlist" v-if="album">
    <section class="pl-header">
      <div class="blur-bg" :style="{'background-image': `url(${album.picUrl})`}"></div>

      <toolbar class="navigate">
        <toolbar-inner>
          <grid>
            <cell :span="33"></cell>
            <cell :span="33" class="text-center" style="align-self: center;">
              <span class="title">专辑</span>
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

      <div class="pl-header-wrapper">
        <img :src="album.picUrl" class="pl-header-cover">
        <div class="pl-header-info">
          <h4 class="title f-elpsl-2">{{album.name}}</h4>
          <small class="subhead f-elpsl-1">
            歌手：
            <router-link tag="span" :to="{name: 'artist', query: {id: album.artist.id}}">{{album.artist.name}}</router-link>
          </small>
          <br>
          <small class="subhead f-elpsl-1">
            发行时间：{{album.publishTime}}
          </small>
        </div>
      </div>
    </section>

    <section class="intro" v-if="album.description">
      <div class="description" :class="{'f-elpsl-2': !showDesc}" @click="toggle">
        简介：{{album.description}}
      </div>
      <icon :ligature="!showDesc ? 'expand_more' : 'expand_less'" class="icon-expand" @click.native="toggle"></icon>
    </section>

    <template v-if="songs">
      <h4 class="trk-title">歌曲列表</h4>
      <list>
        <router-link v-for="(s, idx) in songs" :key="s.id" tag="div" class="list-item" :to="{name: 'musicPlayer', query: {id: s.id}}">
          <span class="index">{{idx + 1}}</span>
          <list-item-holder class="dense">
            <list-item-inner>
              <div class="primary-title f-elpsl-1">
                {{s.name}}
                <span v-if="s.alias">{{s.alias}}</span>
              </div>
              <div class="third-title f-elpsl-1">{{s.artist}} - {{s.album}}</div>
            </list-item-inner>
            <icon ligature="play_circle_outline" class="icon-play"></icon>
          </list-item-holder>
        </router-link>
      </list>
    </template>

    <section class="comment" v-if="hotComments.length > 0">
      <h4 class="cmt-title">热门评论</h4>
      <list>
        <list-item v-for="c in hotComments" :key="c.commentId">
          <router-link :to="{name: 'user', query: {id: c.user.userId}}" class="avatar" tag="div">
            <img class="lazyload" v-lazyload="{src: c.user.avatarUrl, wrapper: '#album'}">
          </router-link>
          <list-item-holder>
            <list-item-inner>
              <div class="primary-title">
                <router-link :to="{name: 'user', query: {id: c.user.userId}}" tag="span">
                  {{c.user.nickname}}
                </router-link>
                <small class="liked">
                  {{c.likedCount}}&nbsp;&nbsp;
                  <icon ligature="thumb_up"></icon>
                </small>
              </div>
              <div class="third-title">{{c.timeString}}</div>
              <div v-if="!c.translatedBeReplied" class="message" v-html="c.translatedMessage"></div>
              <div class="message" v-else>
                回复
                <router-link class="reply-user-nickname" :to="{name: 'user', query: {id: c.translatedBeReplied.user.id}}">
                  @{{c.translatedBeReplied.user.nickname}}
                </router-link>：
                <span>{{c.translatedMessage}}</span>
                <div class="message reply" v-html="c.translatedBeReplied && c.translatedBeReplied.content"></div>
              </div>
            </list-item-inner>
          </list-item-holder>
        </list-item>
      </list>
    </section>

    <section class="comment" v-if="comments.length > 0">
      <h4 class="cmt-title">精彩评论</h4>
      <list>
        <list-item v-for="c in comments" :key="c.commentId">
          <router-link :to="{name: 'user', query: {id: c.user.userId}}" class="avatar" tag="div">
            <img class="lazyload" v-lazyload="{src: c.user.avatarUrl, wrapper: '#album'}">
          </router-link>
          <list-item-holder>
            <list-item-inner>
              <div class="primary-title">
                <router-link :to="{name: 'user', query: {id: c.user.userId}}" tag="span">
                  {{c.user.nickname}}
                </router-link>
                <small class="liked">
                  {{c.likedCount}}&nbsp;&nbsp;
                  <icon ligature="thumb_up"></icon>
                </small>
              </div>
              <div class="third-title">{{c.timeString}}</div>
              <div v-if="!c.translatedBeReplied" class="message" v-html="c.translatedMessage"></div>
              <div class="message" v-else>
                回复
                <router-link class="reply-user-nickname" :to="{name: 'user', query: {id: c.translatedBeReplied.user.id}}">
                  @{{c.translatedBeReplied.user.nickname}}
                </router-link>：
                <span v-html="c.translatedMessage"></span>
                <div class="message reply" v-html="c.translatedBeReplied && c.translatedBeReplied.content"></div>
              </div>
            </list-item-inner>
          </list-item-holder>
        </list-item>
      </list>
    </section>
  </page>
  <loading-page v-else></loading-page>
</template>

<script>
import mixins from "../mixins";
export default {
  data() {
    return {
      showDesc: false
    };
  },
  mixins: [mixins],
  methods: {
    toggle() {
      this.showDesc = !this.showDesc;
    }
  },
  computed: Vuex.mapGetters("album", [
    "album",
    "songs",
    "comments",
    "hotComments"
  ])
};
</script>