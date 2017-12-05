<template>
  <transition :name="$router.transfer">
    <keep-alive include="home,search">
      <router-view></router-view>
    </keep-alive>
  </transition>
</template>