<template>
  <div class="cell" :class="computedSpan">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    span: {
      type: Number,
      required: true,
      validator(val) {
        return (
          [10, 20, 25, 33, 40, 50, 60, 66, 75, 80, 90, 100].indexOf(val) > -1
        );
      }
    }
  },
  computed: {
    computedSpan() {
      return {
        ["cell-" + this.span]: true
      };
    }
  }
};
</script>
