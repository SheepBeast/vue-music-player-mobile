<template>
  <page id="home" class="home">
    <toolbar fixed class="navbar shadow-3d">
      <router-link :to="{name: 'search'}" class="toolbar-icon">
        <icon ligature="search" style="vertical-align: middle;"></icon>
      </router-link>
      <toolbar-inner>
        <tabs-navigation @tabs:beforechange="viewChange">
          <tab-label v-for="(t,i) in tabs" :key="i" :index="i">
            {{t.zh}}
          </tab-label>
        </tabs-navigation>
      </toolbar-inner>
      <router-link v-if="currentPlays" :to="{name: 'musicPlayer'}" class="toolbar-icon">
        <spectrum :class="{playing}"></spectrum>
      </router-link>
      <div v-else class="toolbar-icon" style="width: 40px; height: 20px;"></div>
    </toolbar>

    <transition :name="tabTransition">
      <keep-alive>
        <component :is="currentView"></component>
      </keep-alive>
    </transition>

  </page>
</template>

<script>
  import find from "./find";

  const recommend = resolve => require(["./recommend"], resolve),
    event = resolve => require(["./event"], resolve);

  export default {
    name: "home",
    data() {
      return {
        currentView: "find",
        tabs: [
          { en: "find", zh: "发现", initialized: true },
          {
            en: "recommend",
            zh: "推荐",
            initialized: false,
            preload({ dispatch }, payload) {
              dispatch('recommend/getRecommend', payload)
            }
          },
          {
            en: "event",
            zh: "动态",
            initialized: false,
            preload({ dispatch }, payload) {
              dispatch("event/getEvent", payload);
            }
          }
        ],
        tabTransition: null
      };
    },
    components: {
      find,
      recommend,
      event
    },
    computed: Vuex.mapGetters("musicPlayer", ["playing", "currentPlays"]),
    methods: {
      /**
       * 切换至recommend，event页面时需要预加载数据
       * next 即将切换后的tab索引
       * prev 切换前的tab索引
       * fire tab组件内部的promise实例的resolve回调，不传值时或传值结果的布尔值为true时切换tab，传值结果的布尔值为false时中止切换
      */
      viewChange({ next, prev, fire }) {
        let comp = this.tabs[next], self = this,
          done = function () {
            Vue.$loadingTip.hide()
            fire()
            self.currentView = self.tabs[next].en;
          }
        this.tabTransition = `tab-slide-${next > prev ? "left" : "right"}`;

        if (!comp.initialized) {
          Vue.$loadingTip.show()
          comp.preload(this.$store, { done })
          comp.initialized = true
        } else {
          done()
        }
      }
    }
  };
</script>