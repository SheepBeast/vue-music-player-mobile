<template>
  <div class="tip loading-tip text-center" :class="{active}" style="background-color: rgba(10,9,9,0.8)">
    <spectrum class="playing" color="#F57614"></spectrum>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false
    };
  },
  methods: {
    show() {
      this.active = true;
    },
    hide() {
      this.active = false;
    }
  }
};
</script>