<script>
import {deviceInfo} from '../../assets/js/util'
export default {
  render(h) {
    let swiperContainerEl,
      swiperWrapperEl,
      swiperPaginationEl,
      swiperPaginationBulletEls;

    if (this.pagination) {
      let self = this;
      swiperPaginationBulletEls = Array.apply(null, {
        length: self.slides
      }).map(function(val, idx) {
        return h("span", {
          staticClass: "swiper-pagination-bullet",
          class: {
            "swiper-pagination-bullet-active": self.activeIndex === idx
          }
        });
      });
      swiperPaginationEl = h(
        "div",
        { staticClass: "swiper-pagination" },
        swiperPaginationBulletEls
      );
    }

    swiperWrapperEl = h(
      "div",
      {
        staticClass: "swiper-wrapper",
        on: {
          mousedown: this.mousedown,
          mouseup: this.mouseup,
          transitionend: this.transitionend
        },
        style: {
          transform: `translateX(${-this.activeIndex * 100 + "%"})`
        },
        ref: 'wrapper'
      },
      [this.$slots.default]
    );

    swiperContainerEl = h(
      "div",
      {
        staticClass: "swiper",
        class: {
          gutter: this.gutter
        }
      },
      [swiperWrapperEl, swiperPaginationEl]
    );

    return swiperContainerEl;
  },
  props: {
    timeout: {
      type: Number,
      default: 5000,
      validator(val) {
        return val >= 0;
      }
    },
    pagination: Boolean,
    autoplay: {
      type: Boolean,
      default: true
    },
    gutter: Boolean
  },
  data() {
    return {
      activeIndex: 0,
      slides: null,
      isSliding: false,
      tmp: {
        pageX: null,
          startTime: null
      },
      timer: null
    };
  },

  methods: {
    mousedown(e) {
      if (this.isSliding) {
        return false;
      }
      clearTimeout(this.timer);
      this.tmp.pageX = e.pageX;
      this.tmp.startTime = Date.now();
    },
    mouseup(e) {
      e.stopPropagation()
      let offset = e.pageX - this.tmp.pageX;

      // 若在第一张幻灯片时向左滑动或在最后一张幻灯片向右滑动都无效
      if (
        (offset < 0 && this.activeIndex === this.slides - 1) ||
        (offset > 0 && this.activeIndex === 0)
      ) {
        return false;
      }

      let abs_threshold = Math.abs(offset),
        abs_timediff = Math.abs(Date.now() - this.tmp.startTime),
        nextIndex;

      // 滑动触发条件, (滑屏时间小于300毫秒 && 非点击事件) || 滑屏距离大于100px
      if ((abs_timediff <= 300 && abs_threshold > 10) || abs_threshold >= 100) {
        nextIndex = offset > 0 ? this.activeIndex - 1 : this.activeIndex + 1;
        this.slide(nextIndex, "touch");
      } else {
        this.$emit('swiper:noop')
        this.autoPlay();
      }
    },
    transitionend(e) {
      this.autoPlay();
    },
    // slideType 触发方式， 允许值为 touch 滑屏触发、auto 内部自动触发
    slide(nextIndex, slideType) {
      this.isSliding = true;

      if (nextIndex > this.slides - 1 || nextIndex < 0) {
        // 根据触发方式执行不同的逻辑
        // 若是手势触发则停止此次轮播
        if (slideType && slideType === "touch") {
          return false;
        } else {
          // 若是内部自动触发则修正索引
          nextIndex = nextIndex < 0 ? this.slides - 1 : 0;
        }
      }
      this.activeIndex = nextIndex;
      this.tmp.offset = nextIndex * deviceInfo.width
      this.isSliding = false;
    },
    autoPlay() {
      if (this.autoplay) {
        clearTimeout(this.timer);
        this.timer = setTimeout(
          self => {
            let nextIndex = self.activeIndex + 1;
            if (nextIndex > self.slides - 1) {
              nextIndex = 0;
            }
            self.slide(nextIndex);
          },
          this.timeout,
          this
        );
      }
    },
    next() {
      this.slide(this.activeIndex + 1);
    },
    prev() {
      this.slide(this.activeIndex - 1);
    },
    go(idx) {
      this.slide(idx);
    },
    init() {
      this.$emit("swiper:init", this);
    },
    updateSlides() {
      this.slides = this.$children.length;
      if (this.activeIndex >= this.slides) {
        this.activeIndex = 0;
      }
    }
  },
  mounted() {
    this.updateSlides();
    this.autoPlay();
    this.init();
  },
  updated() {
    this.updateSlides();
  }
};
</script>