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
        prev: -1,
        indicator: null,
        isFirst: true
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
            if (typeof sign == 'undefined' || !!sign) {
              let label = self.$children[index].$el.children[0],
                left = label.offsetLeft,
                width = label.offsetWidth,
                indicatorStyles = self.indicator.style;

              indicatorStyles.left = left + "px";
              indicatorStyles.width = width + "px";

              self.prev = self.activeIndex;
              self.activeIndex = index;
            }
          })

        if (!this.isFirst) {
          this.$emit("tabs:beforechange", {
            next: index,
            prev: this.activeIndex,
            fire
          });
        } else {
          this.isFirst = false;
          fire()
        }
      },
      afterchange() {
        if (!this.isFirst) {
          this.$emit("tabs:afterchange", {
            next: this.activeIndex,
            prev: this.prev
          });
        }
      },
      init() {
        this.indicator = this.$refs.indicator;
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