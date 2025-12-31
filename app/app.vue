<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const uiStore = useUIStore()

onMounted(() => {
  uiStore.initTheme()
})
</script>
