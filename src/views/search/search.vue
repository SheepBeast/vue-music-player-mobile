<template>
  <page class="search">
    <toolbar>
      <icon ligature="navigate_before" style="font-size: 26px; color: #fff;" @click.native="back"></icon>
      <toolbar-inner>
        <searchbar @searchbar:init="searchbarInit" @searchbar:submit="quicksearch" placeholder="搜索歌曲、歌手、专辑" @searchbar:input="input" @searchbar:cancel="cancel"></searchbar>
      </toolbar-inner>
      <span @click="setStep('history')" class="cancel" :class="{'hidden': step == 'history'}">取消</span>
    </toolbar>

    <div v-show="step === 'history'">
      <section class="hot-search">
        <h3>大家都在搜</h3>
        <div>
          <span v-for="(tag, i) in tags" :key="i" class="search-tag" @click="quicksearch(tag)">
            {{tag}}
          </span>
        </div>
      </section>

      <section class="search-history">
        <list>
          <list-item v-for="(h, i) in history" :key="i">
            <icon class="icon-history" ligature="history"></icon>
            <list-item-holder class="dense">
              <list-item-inner @click.native="quicksearch(h.keywords)">
                <span>{{h.keywords}}</span>
              </list-item-inner>
                <icon ligature="close" @click.native="removeHistory(h.keywords)"></icon>
            </list-item-holder>
          </list-item>
        </list>
      </section>
    </div>

    <section class="search-suggest" v-show="step === 'suggest'">
      <list>
        <list-item>
          <list-item-holder class="dense" @click.native="quicksearch()">
            <list-item-inner>
              <small class="type">搜索</small>{{keywords}}
            </list-item-inner>
          </list-item-holder>
        </list-item>

        <list-item v-for="sg in suggest" :key="sg.id">
          <list-item-holder class="dense" @click.native="search(sg.type, sg.id)">
            <list-item-inner>
              <small class="type">{{sg.alias}}</small>{{sg.name}}{{ sg.artist ? ' - ' + sg.artist : '' }}
            </list-item-inner>
          </list-item-holder>
        </list-item>
      </list>
    </section>

    <section class="search-result" :class="{'hidden': step !== 'result'}">
      <component :is="'songs'"></component>
    </section>
  </page>
</template>

<script>
import songs from './songs'

export default {
  name: "search",
  data() {
    return {
      keywords: "",
      step: "history", // 'history', 'suggest', 'result'
      sidenav: null,
      searchbar: null,
      timer: null,

      tags: [
        "孙燕姿",
        "RADWINPS",
        "理想三巡",
        "金玟岐",
        "Despacito铃声(Marimba Remix)",
        "我们不一样",
        "白夜",
        "追光者",
        "李荣浩",
        "许嵩"
      ]
    };
  },
  methods: {
    searchbarInit(vnode) {
      this.searchbar = vnode;
    },
    input(keywords) {
      this.keywords = keywords;
      this.setStep(keywords ? "suggest" : "history");
      clearTimeout(this.timer);
      this.$store.commit("search/clearSuggest");
      this.timer = setTimeout(
        self => {
          if (keywords) {
            self.$store.dispatch("search/getSuggest", { keywords });
          }
        },
        500,
        this
      );
    },
    clear() {
      this.keywords = "";
      this.$store.commit("search/clearSuggest");
    },
    setStep(step) {
      this.step = step;
    },
    cancel() {
      this.clear();
      this.setStep("history");
    },
    removeHistory(keywords) {
      this.$store.commit("search/setHistory", { keywords, remove: true });
    },
    search(type, id) {
      if (!this.keywords) {
        this.$tip.show("请输入搜索关键词");
        return false;
      }
      this.searchbar.$refs.search.value = "";
      this.$store.commit("search/setHistory", { keywords: this.keywords });

      // 跳转相关页面
      if (type && id) {
        let route;
        switch (type) {
          case 1:
            route = {
              name: "musicPlayer"
            };
            break;
          case 10:
            route = {
              name: "album"
            };
            break;
          case 100:
            route = {
              name: "artist"
            };
            break;
          case 1000:
            route = {
              name: "playlist"
            };
            break;
        }
        route.query = { id };
        this.$router.push(route);
      } else {
        // 搜索结果
        this.$store.commit("search/resetResult");
        this.$store.dispatch("search/getResult", {
          keywords: this.keywords,
          type: 1,
          limit: 20
        });
        this.setStep("result");
        this.$store.dispatch("search/getMultiResult", {
          keywords: this.keywords
        });
        this.clear();
      }
    },
    quicksearch(tag) {
      if (tag) {
        this.keywords = tag;
      }
      this.search();
    },
    viewChange(index) {
      this.currentView = this.tabs[index].en;
    },
    back() {
      this.cancel();
      this.$router.back();
    }
  },
  computed: Vuex.mapGetters("search", ["suggest", "history"]),
  components: {
    songs
  }
};
</script>