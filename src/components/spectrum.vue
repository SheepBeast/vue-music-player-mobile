<template>
  <ul class="spectrum">
    <li class="s1" :style="computedColor"></li>
    <li class="s2" :style="computedColor"></li>
    <li class="s3" :style="computedColor"></li>
  </ul>
</template>

<script>
export default {
  props: {
    color: String
  },
  computed: {
    computedColor() {
      if (this.color) {
        return {
          "background-color": this.color
        };
      }
    }
  }
};
</script>
