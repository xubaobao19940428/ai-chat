<template>
  <div id="app">
    <router-view />
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
import AuthModal from '@/components/auth/AuthModal.vue'
</script>

<style lang="scss">
// 全局样式
</style>
