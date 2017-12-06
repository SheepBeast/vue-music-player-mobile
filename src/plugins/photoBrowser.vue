<template>
  <div class="photo-browser" ref="photoBrowser" @animationend="animationend">
    <div class="fixer photo-browser-origin-image" ref="fixer">
      <swiper @swiper:init="swiperInit" @swiper:noop="hide" :autoplay="false" :style="{display: overflow ? 'inline' : 'block'}">
        <swiper-slide v-for="p in pics" :key="p">
          <img :src="p" class="item" draggable="false">
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { deviceInfo } from "../assets/js/util";
export default {
  data() {
    return {
      float: false,
      pics: [],

      els: [],
      fixer: null,
      photoBrowser: null,

      swiper: null,

      index: null,

      overflow: false
    };
  },
  methods: {
    /**
     * groups
     * 类型：Array[object NodeList]
     * 取值方式：var groups = Object.values(document.querySelectorAll(selector))，其中selector为自定义选择器
     * 
     * index
     * 类型：Number
     * 作用：photoBrowser显示时默认展示第几张图，从0开始
     */
    show(els = [], index = 0, meta) {
      console.time("show");
      if (!Array.isArray(els) || els.length === 0) {
        return false;
      }

      this.float = true;
      this.els = els;
      this.index = index;
      this.pics = els.map(el => el.dataset.photoBrowserUrl);

      this.$nextTick(() => {
        this.swiper.go(index);
      });

      setTimeout(
        self => {
          let fixerStyles = self.fixer.style,
            photoBrowserStyles = self.photoBrowser.style,
            relatedTarget = self.els[self.index],
            rect = relatedTarget.getBoundingClientRect(),
            metaRatio = meta.height / meta.width,
            overflow = metaRatio > deviceInfo.ratio;
          
          self.overflow = overflow;

          // show
          fixerStyles.top = rect.top + "px";
          fixerStyles.left = rect.left + "px";
          fixerStyles.width = rect.width + "px";
          fixerStyles.height = rect.height + "px";
          
          photoBrowserStyles.display = "block";

          setTimeout(() => {
            relatedTarget.style.opacity = 0;

            // shown
            fixerStyles.top = 0
            fixerStyles.left = 0;
            fixerStyles.width = "100%";
            fixerStyles.height = "100%";
            fixerStyles.opacity = 1;

            photoBrowserStyles.zIndex = "";

            self.photoBrowser.classList.add("zoom-in");
            console.timeEnd("show");
          }, 200);
        },
        0,
        this
      );
    },
    hide(e) {
      console.time("hide");
      this.float = false;
      setTimeout(
        self => {
          let fixerStyles = self.fixer.style,
            activeIndex = self.swiper.activeIndex,
            currentTarget = self.els[activeIndex],
            rect = currentTarget.getBoundingClientRect();

          if (self.index !== activeIndex) {
            currentTarget.style.opacity = 0;
            self.els[self.index].style.opacity = 1;
          }
          
          // hide
          fixerStyles.top = rect.top + "px";
          fixerStyles.left = rect.left + "px";
          fixerStyles.width = rect.width + "px";
          fixerStyles.height = rect.height + "px";
          fixerStyles.opacity = 0.1;

          // self.photoBrowser.style.backgroundColor = "transparent";
          self.photoBrowser.classList.add("zoom-out");
          console.timeEnd("hide");
        },
        0,
        this
      );
    },
    animationend() {
      if (!this.float) {
        console.time("animationend");
        this.els[this.swiper.activeIndex].style.opacity = 1;

        setTimeout(
          self => {
            let fixerStyles = self.fixer.style,
              photoBrowserStyles = self.photoBrowser.style;

            // hidden
            fixerStyles.opacity = 0;
            fixerStyles.top = fixerStyles.left = fixerStyles.width = fixerStyles.height = fixerStyles.overflow = photoBrowserStyles.display =
              "";

            self.overflow = false;

            // photoBrowserStyles.display = "";
            photoBrowserStyles.zIndex = -1000;

            self.photoBrowser.classList.remove("zoom-in", "zoom-out");
            self.reset();
            console.timeEnd("animationend");
          },
          100,
          this
        );
      }
    },
    reset() {
      this.pics = [];
      this.els = [];
      this.index = null;
    },
    init() {
      this.fixer = this.$refs.fixer;
      this.photoBrowser = this.$el;
    },
    swiperInit(vnode) {
      this.swiper = vnode;
    }
  },
  mounted() {
    this.init();
  }
};
</script>
