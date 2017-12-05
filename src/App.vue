<template>
  <div id="app" class="app">
    <router-view></router-view>
    <component :is="'musicPlayer'"></component>
  </div>
</template>

<script>
import musicPlayer from './views/musicPlayer/player'
export default {
  components: {
    musicPlayer
  }
};
</script>