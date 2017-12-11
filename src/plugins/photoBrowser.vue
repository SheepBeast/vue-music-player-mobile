<template>
  <div class="photo-browser" ref="photoBrowser" @animationend="closed">
    <div class="fixer photo-browser-origin-image" ref="fixer">
      <swiper @swiper:init="swiperInit" @swiper:noop="close" :autoplay="false" :style="{display: overflow ? 'inline' : 'block'}">
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
      fixerStyles: null,
      photoBrowserStyles: null,

      swiper: null,

      index: null,

      overflow: false
    };
  },
  methods: {
    enter(index) {
      let ctx = this;
      return new Promise((resolve, reject) => {
        ctx.float = true;

        ctx.$nextTick(() => {
          ctx.swiper.go(index);
          resolve();
        });
      });
    },
    enterActive(fixerStyles, photoBrowserStyles, relatedTarget, meta) {
      let ctx = this;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let rect = relatedTarget.getBoundingClientRect(),
            metaRatio = meta.height / meta.width,
            overflow = metaRatio > deviceInfo.ratio;

          ctx.overflow = overflow;

          fixerStyles.top = `${rect.top}px`;
          fixerStyles.left = `${rect.left}px`;
          fixerStyles.width = `${rect.width}px`;
          fixerStyles.height = `${rect.height}px`;

          photoBrowserStyles.display = "block";
          resolve();
        }, 0);
      });
    },
    enterTo(fixerStyles, photoBrowserStyles, relatedTarget) {
      setTimeout(
        self => {
          relatedTarget.style.opacity = 0;

          fixerStyles.top = 0;
          fixerStyles.left = 0;
          fixerStyles.width = "100%";
          fixerStyles.height = "100%";
          fixerStyles.opacity = 1;

          photoBrowserStyles.zIndex = "";

          self.photoBrowser.classList.add("zoom-in");
        },
        200,
        this
      );
    },
    hide() {
      this.float = false;
    },
    hideActive(fixerStyles) {
      setTimeout(
        self => {
          let activeIndex = self.swiper.activeIndex,
            currentTarget = self.els[activeIndex],
            rect = currentTarget.getBoundingClientRect();

          if (self.index !== activeIndex) {
            currentTarget.style.opacity = 0;
            self.els[self.index].style.opacity = 1;
          }

          fixerStyles.top = `${rect.top}px`;
          fixerStyles.left = `${rect.left}px`;
          fixerStyles.width = `${rect.width}px`;
          fixerStyles.height = `${rect.height}px`;
          fixerStyles.opacity = 0.1;

          self.photoBrowser.classList.add("zoom-out");
        },
        0,
        this
      );
    },
    hideTo(fixerStyles, photoBrowserStyles) {
      if (!this.float) {
        this.els[this.swiper.activeIndex].style.opacity = 1;

        setTimeout(
          self => {
            fixerStyles.opacity = 0;
            fixerStyles.top = fixerStyles.left = fixerStyles.width = fixerStyles.height = fixerStyles.overflow = photoBrowserStyles.display =
              "";

            self.overflow = false;

            photoBrowserStyles.zIndex = -1000;

            self.photoBrowser.classList.remove("zoom-in", "zoom-out");
            self.reset();
          },
          100,
          this
        );
      }
    },
    /**
     * els
     * 类型：Array[object NodeList]
     * 取值方式：var els = Object.values(document.querySelectorAll(selector))，其中selector为自定义选择器
     * 
     * index
     * 类型：Number
     * 说明：photoBrowser显示时默认展示第几张图，从0开始
     * 
     * meta
     * 类型：Object
     * 说明：用于传递一些元数据怒
     */
    async open(els = [], index = 0, meta) {
      if (!Array.isArray(els) || els.length === 0) {
        return false;
      }

      this.els = els;
      this.index = index;
      this.pics = els.map(el => el.dataset.photoBrowserUrl);

      let fixerStyles = this.fixerStyles,
        photoBrowserStyles = this.photoBrowserStyles,
        relatedTarget = els[index];

      await this.enter(index);
      await this.enterActive(
        fixerStyles,
        photoBrowserStyles,
        relatedTarget,
        meta
      );
      this.enterTo(fixerStyles, photoBrowserStyles, relatedTarget);
    },
    close(e) {
      this.hide();
      this.hideActive(this.fixerStyles);
    },
    closed() {
      this.hideTo(this.fixerStyles, this.photoBrowserStyles);
    },
    reset() {
      this.pics = [];
      this.els = [];
      this.index = null;
    },
    init() {
      this.fixer = this.$refs.fixer;
      this.fixerStyles = this.fixer.style;
      this.photoBrowser = this.$el;
      this.photoBrowserStyles = this.photoBrowser.style;
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
