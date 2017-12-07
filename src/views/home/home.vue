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
        { en: "find", zh: "发现" },
        { en: "recommend", zh: "推荐" },
        { en: "event", zh: "动态" }
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
    viewChange({ next, prev }) {
      this.tabTransition = `tab-slide-${next > prev ? "left" : "right"}`;
      this.currentView = this.tabs[next].en;
    }
  }
};
</script>