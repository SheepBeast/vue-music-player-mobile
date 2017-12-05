// 头像
import avatar from './avatar.vue'

// 卡片
import card from './card/card.vue'
import cardHeader from './card/cardHeader.vue'
import cardMedia from './card/cardMedia.vue'
import cardContent from './card/cardContent.vue'
import cardActions from './card/cardActions.vue'

// 栅格
import grid from './grid/grid.vue'
import cell from './grid/cell.vue'

// 图标
import icon from './icon.vue'

// 工具栏
import toolbar from './toolbar/toolbar.vue'
import toolbarInner from './toolbar/toolbarInner.vue'

// 列表
import list from './list/list.vue'
import listItem from './list/listItem.vue'
import listItemHolder from './list/listItemHolder.vue'
import listItemInner from './list/listItemInner.vue'

// 轮播图
// import swiper from './swiper/swiper.vue'
// import swiperSlide from './swiper/swiperSlide.vue'

// 标签栏
import tabsNavigation from './tabs/tabsNavigation.vue'
import tabLabel from './tabs/tabLabel.vue'
// import tabsContent from './tabs/tabsContent.vue'
// import tab from './tabs/tab.vue'

// 页面
import page from './page/page.vue'
import pageContent from './page/pageContent.vue'

// 搜索栏
import searchbar from './searchbar.vue'

// 频谱效果ICON
import spectrum from './spectrum.vue'

// 加载页面
import loadingPage from './loadingPage.vue'

// 回退按钮
import back from './back.vue'

export default {
  install(Vue, options) {
    Vue.mixin({
      components: {
        avatar,

        card,
        cardHeader,
        cardMedia,
        cardContent,
        cardActions,

        grid,
        cell,

        icon,

        toolbar,
        toolbarInner,

        list,
        listItem,
        listItemHolder,
        listItemInner,

        // swiper,
        // swiperSlide,

        tabsNavigation,
        tabLabel,
        // tabsContent,
        // tab,

        page,
        pageContent,

        searchbar,

        spectrum,

        loadingPage,

        back
      }
    })
  }
}