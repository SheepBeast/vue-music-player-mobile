<template>
  <div class="toolbar" :class="{'toolbar-fixed': fixed}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    fixed: Boolean
  }
};
</script>
