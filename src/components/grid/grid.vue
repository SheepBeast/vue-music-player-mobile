<template>
  <div class="grid" :class="{gutter, nowrap}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    gutter: Boolean,
    nowrap: Boolean
  }
};
</script>
