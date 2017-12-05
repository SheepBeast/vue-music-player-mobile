<template>
  <i class="material-icons">{{ligature}}</i>
</template>

<script>
export default {
  props: {
    ligature: {
      type: String,
      required: true
    }
  }
};
</script>
