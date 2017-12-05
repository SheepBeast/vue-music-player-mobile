<template>
  <page class="home">
    <toolbar fixed class="shadow-3d">
      <router-link :to="{name: 'search'}" class="btn-icon">
        <icon ligature="search" style="vertical-align: middle;"></icon>
      </router-link>
      <toolbar-inner>
        <tabs-navigation @tabs:afterChange="viewChange">
          <tab-label v-for="(t,i) in tabs" :key="i" :index="i">
            {{t.zh}}
          </tab-label>
        </tabs-navigation>
      </toolbar-inner>
      <router-link v-if="currentPlays" :to="{name: 'musicPlayer'}" class="btn-icon">
        <spectrum :class="{playing}"></spectrum>
      </router-link>
      <div v-else class="btn-icon" style="width: 40px; height: 20px;"></div>
    </toolbar>
 
    <keep-alive>
      <component :is="currentView" v-cloak></component>
    </keep-alive>
  </page>
</template>

<script>
import find from "./find";
// import recommend from './recommend'

const recommend = resolve => require(["./recommend"], resolve);

export default {
  name: "home",
  data() {
    return {
      currentView: "find",
      tabs: [{ en: "find", zh: "发现" }, { en: "recommend", zh: "推荐" }]
    };
  },
  components: {
    find,
    recommend
  },
  computed: Vuex.mapGetters("musicPlayer", ["playing", "currentPlays"]),
  methods: {
    viewChange(index) {
      console.log("tabs", index);
      this.currentView = this.tabs[index].en;
    }
  }
};
</script>