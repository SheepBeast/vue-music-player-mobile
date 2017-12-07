<template>
  <div id="music-player-comment"
    class="comment shadow-3d-reverse"
    :class="{active}"
    :style="{height: contentHeight, top: computedTop}"
    @click="toggle($event)"
    ref="comment">
    <h4 class="comment-label">评论
      <span class="count">{{currentPlays.total}}</span>
    </h4>
    <div class="comment-content">
      <list>
        <list-item v-for="c in currentPlays.comments" :key="c.commentId">
          <router-link class="avatar" tag="div" :to="{name: 'user', query: {id: c.user.userId}}">
            <img :src="c.user.avatarUrl" data-toggle="router-link">
          </router-link>
          <list-item-holder>
            <list-item-inner>
              <div class="primary-title">
                <router-link tag="span"  :to="{name: 'user', query: {id: c.user.userId}}" data-toggle="router-link">
                   {{c.user.nickname}}
                </router-link>
              </div>
              <div class="third-title">{{c.timeString}}</div>
              <div v-if="!c.translatedBeReplied" class="message" v-html="c.translatedMessage"></div>
              <div class="message" v-else>
                回复
                <router-link class="reply-user-nickname" data-toggle="router-link" :to="{name: 'user', query: {id: c.translatedBeReplied.user.id}}">
                  @{{c.translatedBeReplied.user.nickname}}
                </router-link>：
                <span v-html="c.translatedMessage"></span>
                <div class="message reply" v-html="c.translatedBeReplied && c.translatedBeReplied.content"></div>
              </div>
            </list-item-inner>
          </list-item-holder>
        </list-item>
      </list>
    </div>
  </div>
</template>

<script>
import { deviceInfo } from "../../assets/js/util.js";
import pipe from "./pipe";

export default {
  data() {
    return {
      active: false,
      fixedLayerTop: null
    };
  },
  computed: {
    ...Vuex.mapGetters("musicPlayer", ["currentPlays"]),
    contentHeight() {
      return deviceInfo.height - 54 + "px";
    },
    computedTop() {
      if (!this.fixedLayerTop) {
        return "";
      }
      return (this.active ? 54 : this.fixedLayerTop) + "px";
    }
  },
  methods: {
    toggle(e) {
      e.preventDefault();
      if (e.target.dataset.toggle) {
        return false;
      }
      this.active = !this.active;
      pipe.$emit("toggleMiniUI", { active: this.active });
    }
  },
  mounted() {
    this.fixedLayerTop = this.$refs.comment.getBoundingClientRect().top;
  }
};
</script>