<template>
  <page id="playlist" class="playlist" v-if="playlist">
    <section class="pl-header">
      <div class="blur-bg" :style="{'background-image': `url(${playlist.coverImgUrl})`}"></div>

      <toolbar class="navigate">
        <toolbar-inner>
          <grid>
            <cell :span="33"></cell>
            <cell :span="33" class="text-center" style="align-self: center;">
              <span class="title">歌单</span>
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
        <img :src="playlist.coverImgUrl" class="pl-header-cover">
        <div class="pl-header-info">
          <h4 class="title f-elpsl-2">{{playlist.name}}</h4>
          <router-link v-if="playlist.creator" tag="div" :to="{name: 'user', query: {id: playlist.creator.userId}}">
            <avatar>
              <img :src="playlist.creator.avatarUrl">
            </avatar>
            <small class="subhead f-elpsl-1">{{playlist.creator.nickname}}</small>
          </router-link>
        </div>
      </div>
    </section>

    <section class="intro" v-if="playlist.tags.length > 0 && playlist.description">
      <div class="tags" v-if="playlist.tags.length > 0">
        标签：
        <span v-for="t in playlist.tags" :key="t">{{t}}</span>
      </div>
      <template v-if="playlist.description">
        <div class="description" v-if="playlist.description" :class="{'f-elpsl-2': !showDesc}" @click="toggle">
          简介：{{playlist.description}}
        </div>
        <icon v-if="playlist.description" :ligature="!showDesc ? 'expand_more' : 'expand_less'" class="icon-expand" @click.native="toggle"></icon>
      </template>
    </section>

    <section v-if="playlist.tracks.length > 0">
      <h4 class="trk-title">歌曲</h4>
      <list>
        <list-item v-for="(t, idx) in playlist.tracks" :key="t.id">
          <span class="index">{{idx + 1}}</span>
          <router-link :to="{name: 'musicPlayer', query: {id: t.id}}" tag="div" class="list-item-holder dense">
            <list-item-inner>
              <div class="primary-title f-elpsl-1">
                {{t.name}}
                <span v-if="t.alia[0]">{{t.alia[0]}}</span>
              </div>
              <div class="third-title f-elpsl-1">{{t.ar[0].name}} - {{t.al.name}}</div>
            </list-item-inner>
            <icon ligature="play_circle_outline" class="icon-play"></icon>
          </router-link>
        </list-item>
      </list>
    </section>

    <section class="comment" v-if="comments">
      <h4 class="cmt-title">评论</h4>
      <list>
        <list-item v-for="c in comments" :key="c.commentId">
          <router-link :to="{name: 'user', query: {id: c.user.userId}}" class="avatar" tag="div">
            <img class="lazyload" v-lazyload="{src: c.user.avatarUrl, wrapper: '#playlist'}">
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
  computed: Vuex.mapGetters("playlist", ["playlist", "comments"])
};
</script>