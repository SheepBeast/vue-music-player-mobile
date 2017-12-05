<template>
  <div class="photo-browser" ref="photoBrowser" @animationend="animationend" @click="hide" >
    <div class="fixed" ref="fixer">
      <swiper @swiper:init="swiperInit" :autoplay="false">
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

      groups: [],
      fixer: null,
      photoBrowser: null,

      swiper: null,

      index: null
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
    show(groups = [], index = 0) {
      console.time("show");
      if (!Array.isArray(groups) || groups.length === 0) {
        return false;
      }

      this.float = true;
      this.groups = groups;
      this.index = index;
      this.pics = groups.map(el => el.src);

      this.$nextTick(() => {
        this.swiper.go(index);
      });

      setTimeout(
        self => {
          let fixerStyles = self.fixer.style,
            photoBrowserStyles = self.photoBrowser.style,
            relatedTarget = self.groups[self.index],
            rect = relatedTarget.getBoundingClientRect();

          fixerStyles.top = rect.top + "px";
          fixerStyles.left = rect.left + "px";
          fixerStyles.width = rect.width + "px";
          fixerStyles.visibility = "visible";

          photoBrowserStyles.display = "block";

          setTimeout(() => {
            let radio = rect.width / rect.height,
              top = (deviceInfo.height - deviceInfo.width / radio) / 2;

            relatedTarget.style.visibility = "hidden";

            fixerStyles.top = `${top}px`;
            fixerStyles.left = "0";
            fixerStyles.width = "100%";

            photoBrowserStyles.zIndex = "";

            self.photoBrowser.classList.add("zoom-in");
            console.timeEnd("show");
          }, 200);
        },
        0,
        this
      );
    },
    hide() {
      console.time("hide");
      this.float = false;
      setTimeout(
        self => {
          let fixerStyles = self.fixer.style,
            activeIndex = self.swiper.activeIndex,
            currentTarget = self.groups[activeIndex],
            rect = currentTarget.getBoundingClientRect();

          if (self.index !== activeIndex) {
            currentTarget.style.visibility = "hidden";
            self.groups[self.index].style.visibility = "visible";
          }
          fixerStyles.top = rect.top + "px";
          fixerStyles.left = rect.left + "px";
          fixerStyles.width = rect.width + "px";

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
        this.groups[this.swiper.activeIndex].style.visibility = "visible";

        setTimeout(
          self => {
            let fixerStyles = self.fixer.style,
              photoBrowserStyles = self.photoBrowser.style;

            self.pics = [];
            fixerStyles.top = "";
            fixerStyles.left = "";
            fixerStyles.width = "";

            photoBrowserStyles.display = "";
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
      this.groups = [];
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
