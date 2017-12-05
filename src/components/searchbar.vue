<template>
  <div class="searchbar-container">
    <div class="searchbar-inner">
      <icon ligature="search"></icon>
      <form class="searchbar-form" @submit="submit">
        <input type="search" autocomplete="off" class="searchbar-input" :placeholder="placeholder" ref="search" @input="input">
      </form>
      <icon ligature="cancel" class="cancel" :class="{visible: !!value}" @click.native="cancel"></icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索..."
    }
  },
  data() {
    return {
      value: ""
    };
  },
  methods: {
    input(e) {
      this.$emit("searchbar:input", (this.value = this.$refs.search.value));
    },
    submit(e) {
      e.preventDefault();
      this.$emit("searchbar:submit", (this.value = this.$refs.search.value));
    },
    cancel() {
      this.value = this.$refs.search.value = "";
      this.$emit("searchbar:cancel");
    },
    init() {
      this.$emit("searchbar:init", this);
    }
  },
  mounted() {
    this.init();
  }
};
</script>