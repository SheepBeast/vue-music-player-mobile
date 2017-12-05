<template>
  <div class="tip text-center" :class="{active}" v-html="str" :style="{opacity}"></div>
</template>

<script>
export default {
  data() {
    return {
      str: "",
      timer: null,
      active: false
    };
  },
  methods: {
    show(str /* string or html */) {
      if (str) {
        this.str = str;
        this.active = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(
          self => {
            self.hide();
          },
          2000,
          this
        );
      }
    },
    hide() {
      this.active = false;
    }
  }
};
</script>