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
  // import recommend from './recommend'

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
      viewChange({ next, prev, fire }) {
        this.tabTransition = `tab-slide-${next > prev ? "left" : "right"}`;

        let comp = this.tabs[next], self = this,
          done = function () {
            Vue.$loadingTip.hide()
            fire()
            self.currentView = self.tabs[next].en;
          }
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