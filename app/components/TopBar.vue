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
				<Bell :size="20" />
				<span class="absolute top-[2px] right-[2px] w-1.5 h-1.5 bg-red-500 rounded-full border border-[var(--background-gray-main)]"></span>
			</button>

			<!-- Credits -->
			<div class="relative hidden sm:block">
				<div class="rounded-full h-8 px-3 py-1 flex items-center gap-1.5 bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] shadow-sm">
					<Star :size="14" class="text-[var(--text-primary)]" />
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
import { Bell, Star } from 'lucide-vue-next'
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
