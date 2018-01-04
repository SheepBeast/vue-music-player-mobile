<template>
  <page class="playlist comment" v-if="comments">
      <toolbar class="navigate navbar">
        <toolbar-inner>
          <grid>
            <cell :span="33">
              <div class="navigate-before" @click="$router.back()">
                <icon ligature="navigate_before" style="font-size: 30px;"></icon>
                <span>返回</span>
              </div>
            </cell>
            <cell :span="33" class="text-center" style="align-self: center;">
              <span class="title">评论<small>({{total > 999 ? '999+' : total}})</small></span>
            </cell>
            <cell :span="33"></cell>
          </grid>
        </toolbar-inner>
      </toolbar>

    <div class="comment-content">
      <list>
        <list-item v-for="c in comments" :key="c.commentId">
          <router-link class="avatar" tag="div" :to="{name: 'user', query: {id: c.user.userId}}">
            <img :src="c.user.avatarUrl">
          </router-link>
          <list-item-holder>
            <list-item-inner>
              <div class="primary-title">
                <router-link tag="span" :to="{name: 'user', query: {id: c.user.userId}}">
                  {{c.user.nickname}}
                </router-link>
                <div class="third-title time-string">{{c.timeString}}</div>
              </div>
              
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
    </div>
  </page>
  <loading-page v-else></loading-page>
</template>

<script>
  import mixins from "../../mixins";
  export default {
    mixins: [mixins],
    computed: Vuex.mapGetters("musicPlayerComment", ["comments", "total"])
  };
</script>