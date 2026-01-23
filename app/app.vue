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
const userStore = useUserStore()
const projectStore = useProjectStore()
const conversationStore = useConversationStore()
const modelStore = useModelStore()
const discoveryStore = useDiscoveryStore()

onMounted(() => {
  uiStore.initTheme()
  userStore.initialize()
  if (userStore.token) {
    userStore.fetchUserInfo()
    projectStore.fetchProjects()
    modelStore.fetchModels()
    discoveryStore.fetchDiscovery()
    conversationStore.fetchConversations()
  }
})
</script>
