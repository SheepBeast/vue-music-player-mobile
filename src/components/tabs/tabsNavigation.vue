<template>
  <div class="tabs-navigation" ref="navigation">
    <slot></slot>
    <div class="tab-indicator" ref="indicator" @transitionend="afterchange"></div>
  </div>
</template>

<script>
  import pipe from "./pipe";
  export default {
    data() {
      return {
        activeIndex: -1,
        prevIndex: -1,
        indicator: null,
        indicatorStyles: null,
        initailized: false
      };
    },
    methods: {
      change(index, emit) {
        if (index == this.activeIndex) {
          return false;
        }

        let self = this,
          fire,
          p = new Promise((resolve, reject) => {
            fire = resolve
          }).then((sign) => {
            if (sign == undefined || !!sign) {
              let label = self.$children[index].$el.children[0],
                left = label.offsetLeft,
                width = label.offsetWidth,
                indicatorStyles = this.indicatorStyles;

              indicatorStyles.left = left + "px";
              indicatorStyles.width = width + "px";

              self.prevIndex = self.activeIndex;
              self.activeIndex = index;
            }
          })

        if (this.initailized) {
          this.$emit("tabs:beforechange", {
            next: index,
            prev: this.activeIndex,
            fire
          });
        } else {
          this.initailized = true;
          fire()
        }
      },
      afterchange() {
        if (this.initailized) {
          this.$emit("tabs:afterchange", {
            next: this.activeIndex,
            prev: this.prevIndex
          });
        }
      },
      init() {
        this.indicator = this.$refs.indicator;
        this.indicatorStyles = this.indicator.style;
        pipe.$on("tabs:change", index => this.change(index));
        this.change(0);
        this.$emit("tabs:init", this);
      }
    },
    mounted() {
      this.init();
    }
  };
</script>