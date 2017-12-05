<template>
  <div class="tab-label" @click="select">
    <a>
      <slot></slot>
    </a>
  </div>
</template>

<script>
import pipe from "./pipe";
export default {
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    select() {
      pipe.$emit("tabs:change", this.index);
    }
  }
};
</script>
