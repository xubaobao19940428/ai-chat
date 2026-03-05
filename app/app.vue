<template>
	<div class="h-screen overflow-hidden">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const uiStore = useUIStore()
const userStore = useUserStore()
const projectStore = useProjectStore()
const conversationStore = useConversationStore()
const modelStore = useModelStore()
const discoveryStore = useDiscoveryStore()

// Named handler so we can remove it on unmount
const handleGlobalKeydown = (e: KeyboardEvent) => {
	if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
		e.preventDefault()
		uiStore.openSearchModal()
	}
}

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

	// Refetch user-specific data on login
	watch(() => userStore.token, (token, prevToken) => {
		if (token && !prevToken) {
			userStore.fetchUserInfo()
			projectStore.fetchProjects()
			conversationStore.fetchConversations()
			modelStore.fetchModels()
		}
	})

	// Global Keyboard Shortcuts
	window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
	window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>
