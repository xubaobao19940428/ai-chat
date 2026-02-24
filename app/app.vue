<template>
  <div class="h-screen overflow-hidden">
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

  // Publicly available data
  modelStore.fetchModels()

  // User-specific data
  if (userStore.token) {
    userStore.fetchUserInfo()
    projectStore.fetchProjects()
    conversationStore.fetchConversations()
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      uiStore.openSearchModal()
    }
  })
})
</script>
