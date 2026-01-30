<template>
	<header class="w-full pt-3 pb-4 px-5 bg-transparent sticky top-0 z-10 flex justify-between items-center h-[56px]">
		<!-- Left: Model Selection -->
		<div class="relative z-20 flex items-center flex-shrink-0">
			<ModelSelector variant="ghost" :show-icon="false" position="top" />
		</div>

		<!-- Right: Actions -->
		<div class="flex items-center gap-4">
			<!-- Notifications -->
			<button class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <span class="absolute top-[2px] right-[2px] w-1.5 h-1.5 bg-red-500 rounded-full border border-[var(--background-gray-main)]"></span>
			</button>

			<!-- Credits -->
			<div class="relative hidden sm:block">
				<div class="rounded-full h-8 px-3 py-1 flex items-center gap-1.5 bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" width="14" height="14" class="text-[var(--text-primary)]">
                        <path d="M9 1L11.5 6.5L17 7L13 11L14 17L9 14L4 17L5 11L1 7L6.5 6.5L9 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<span class="text-[13px] font-bold text-[var(--text-primary)]">1,300</span>
				</div>
			</div>

			<!-- User Avatar -->
			<div @click="handleProfileClick" class="flex items-center cursor-pointer transition-transform active:scale-95">
				<div v-if="userStore.userInfo?.avatar" class="w-8 h-8 rounded-full overflow-hidden border border-[var(--border-main)]">
						<img :src="userStore.userInfo.avatar" class="w-full h-full object-cover" />
				</div>
                <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-blue-600 border border-[var(--border-main)]">
                    {{ userStore.userInfo?.nickname?.[0]?.toUpperCase() || 'U' }}
                </div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useUIStore } from '../stores/ui'
import ModelSelector from './ModelSelector.vue'

const userStore = useUserStore()
const uiStore = useUIStore()

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
