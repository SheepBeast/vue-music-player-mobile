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
      activeIndex: 0,
      indicator: null
    };
  },
  methods: {
    change(index) {
      this.$emit("tabs:beforeChange", this.activeIndex);
      let label = this.$children[index].$el.children[0],
        left = label.offsetLeft,
        width = label.offsetWidth,
        indicatorStyles = this.indicator.style;

      indicatorStyles.left = left + "px";
      indicatorStyles.width = width + "px";

      this.activeIndex = index;
    },
    afterchange() {
      this.$emit("tabs:afterChange", this.activeIndex);
    },
    init() {
      this.indicator = this.$refs.indicator;

      pipe.$on("tabs:change", index => {
        this.change(index);
      });
      setTimeout(
        self => {
          self.change(0);
        },
        1000,
        this
      );
      this.$emit("tabs:init", this);
    }
  },
  mounted() {
    this.init();
  }
};
</script>