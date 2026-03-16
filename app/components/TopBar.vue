<template>
	<header class="w-full pt-3 pb-4 px-5 bg-transparent sticky top-0 z-10 flex justify-between items-center h-[56px]">
		<!-- Left: Mobile Menu + Model Selection -->
		<div class="relative z-20 flex items-center gap-3 flex-shrink-0">
			<!-- Hamburger (mobile only) -->
			<button @click="uiStore.openMobileMenu()"
				class="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center">
				<Menu :size="20" />
			</button>
			<ModelSelector v-if="showModelSelector" variant="ghost" :show-icon="false" position="top"
				:capability="currentCapability" />
		</div>

		<!-- Right: Actions -->
		<div v-if="isHomePage" class="flex items-center gap-4">
			<!-- Notifications -->
			<button
				class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative flex items-center justify-center">
				<Bell :size="20" />
				<span
					class="absolute top-[2px] right-[2px] w-1.5 h-1.5 bg-red-500 rounded-full border border-[var(--background-gray-main)]"></span>
			</button>
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Menu } from 'lucide-vue-next'
import { useUserStore } from '../stores/user'
import { useUIStore } from '../stores/ui'
import { useConversationStore } from '../stores/conversation'
import ModelSelector from './ModelSelector.vue'

const userStore = useUserStore()
const uiStore = useUIStore()
const route = useRoute()
const conversationStore = useConversationStore()

const showModelSelector = computed(() => {
	const allowedRoutes = ['index', 'chat', 'chat-id', 'image-generation', 'video-generation']
	return allowedRoutes.includes(route.name as string)
})

const currentCapability = computed(() => {
	if (route.name === 'image-generation') return 'image_generation'
	if (route.name === 'video-generation') return 'video_generation'
	if (route.name === 'chat-id') {
		const conv = conversationStore.currentConversation
		// 只有当已加载的会话 id 与当前路由匹配时才限制，否则返回 undefined 避免错误 override
		if (!conv || String(conv.id) !== String(route.params.id)) return undefined
		const cap = conv.capability
		if (cap === 'image') return 'image_generation'
		if (cap === 'video') return 'video_generation'
		return 'chat'
	}
	return undefined
})

const isHomePage = computed(() => ['index', 'chat'].includes(route.name as string))

const handleProfileClick = () => {
	if (!userStore.userInfo) {
		uiStore.openLoginModal()
	}
}
</script>

<style scoped>
.clickable {
	cursor: pointer;
	user-select: none;
}
</style>
