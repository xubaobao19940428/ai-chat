<template>
	<header class="w-full pt-3 pb-4 px-5 bg-[var(--background-gray-main)] sticky top-0 z-10 flex justify-between items-center h-[56px] border-b border-[var(--border-main)] lg:border-none">
		<!-- Left: Version/Dropdown -->
		<div class="relative z-20 flex items-center flex-shrink-0">
			<div class="flex h-8 px-2 justify-center items-center gap-1 rounded-[8px] clickable hover:bg-[var(--fill-tsp-white-main)] transition-colors transition-all duration-300">
				<span class="text-[var(--text-primary)] md:text-[18px] text-[16px] font-medium leading-tight truncate">Manus 1.6 Lite</span>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" fill="none" width="16" height="16" color="var(--text-tertiary)" class="rotate-[90deg] opacity-60">
					<path d="M10.1992 18.6367L16.1992 12.6367L10.1992 6.63672" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
				</svg>
			</div>
		</div>

		<!-- Right: Actions -->
		<div class="flex items-center gap-2">
			<!-- Notifications -->
			<div class="flex items-center justify-center cursor-pointer outline outline-1 -outline-offset-1 outline-[var(--border-btn-main)] border-none hover:bg-[var(--fill-tsp-white-light)] size-8 relative group rounded-full transition-all">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--icon-primary)] opacity-70">
					<path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
					<path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
				</svg>
			</div>

			<!-- Credits -->
			<div class="relative hidden sm:block">
				<div class="rounded-full h-8 px-3 py-1 flex items-center gap-1.5 cursor-pointer outline outline-1 -outline-offset-1 outline-[var(--border-btn-main)] font-medium text-[var(--text-primary)] text-sm hover:bg-[var(--fill-tsp-white-main)] transition-all">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" width="14" height="14" class="text-amber-500">
						<path d="M9 1L11.5 6.5L17 7L13 11L14 17L9 14L4 17L5 11L1 7L6.5 6.5L9 1Z" fill="currentColor" />
					</svg>
					<span class="text-[13px] font-bold">1,296</span>
				</div>
			</div>

			<!-- User Avatar -->
			<div @click="handleProfileClick" class="flex items-center cursor-pointer transition-transform active:scale-95">
				<div class="relative flex items-center justify-center font-bold flex-shrink-0 rounded-full overflow-hidden border border-[var(--border-main)]" style="width: 32px; height: 32px">
					<div v-if="userStore.userInfo" class="w-full h-full bg-[var(--Button-primary-black)] text-white flex items-center justify-center text-sm">
						{{ userStore.userInfo.nickname?.charAt(0) || 'U' }}
					</div>
					<div v-else class="w-full h-full bg-[var(--fill-tsp-white-main)] flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--icon-primary)] opacity-40">
							<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useUIStore } from '../stores/ui'

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
