<template>
	<div>
		<div class="flex items-center justify-between mb-4 px-1">
			<h3 class="font-bold text-[var(--text-primary)] tracking-tight">{{ title }}</h3>
			<NuxtLink to="/explore" class="text-sm text-[var(--text-blue)] font-bold hover:underline underline-offset-4 decoration-2">查看全部</NuxtLink>
		</div>
		<div class="relative group/list">
			<div ref="scrollContainer" class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1" @scroll="checkScroll">
				<div v-for="bot in bots" :key="bot.id" class="flex flex-col items-center gap-2 cursor-pointer min-w-[80px] group transition-transform hover:-translate-y-1" @click="handleBotClick(bot)">
					<div class="w-16 h-16 rounded-2xl bg-[var(--background-white-main)] shadow-[var(--shadow-XS)] border border-[var(--border-main)] flex items-center justify-center text-3xl transition-transform overflow-hidden relative" :class="bot.type === 'search' ? 'rounded-full' : ''">
						<img v-if="bot.icon.startsWith('http')" :src="bot.icon" class="w-full h-full object-cover" />
						<span v-else class="grayscale opacity-50">{{ bot.icon }}</span>
					</div>

					<div class="flex flex-col items-center">
						<span class="text-[11px] text-center text-[var(--text-primary)] font-bold max-w-[90px] truncate leading-tight tracking-tight">{{ bot.name }}</span>
						<span v-if="bot.description" class="text-[10px] text-[var(--text-tertiary)] font-bold flex items-center gap-0.5 mt-0.5 uppercase tracking-tighter">
							<svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
							{{ bot.description }}
						</span>
					</div>
				</div>

				<!-- Spacer for the end -->
				<div class="min-w-[5px]"></div>
			</div>

			<!-- Right Scroll Button (Only show if overflow) -->
			<div v-if="canScrollRight" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-full items-center bg-gradient-to-l from-[var(--background-gray-main)] via-[var(--background-gray-main)] to-transparent pl-4 pr-1">
				<button @click="scrollRight" class="w-8 h-8 rounded-full bg-[var(--background-white-main)] shadow-[var(--shadow-S)] border border-[var(--border-main)] flex items-center justify-center text-[var(--icon-secondary)] hover:bg-[var(--fill-tsp-white-main)] transition-colors">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Nuxt auto-imports ref, onMounted, onUnmounted, useRouter from vue/vue-router (actually via #imports)
// But explicit imports are fine
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversation'
import type { Bot } from '../utils/bots'
// import { useConversationStore } from '@/store/conversation' -> auto imported

const router = useRouter()
const conversationStore = useConversationStore()

interface Props {
	title: string
	bots: Bot[]
}

const props = defineProps<Props>()
const scrollContainer = ref<HTMLElement | null>(null)
const canScrollRight = ref(false)

const handleBotClick = (bot: Bot) => {
	if (bot.mode === 'image') {
		router.push('/image-generation')
	} else if (bot.type === 'search') {
		router.push('/ai-search')
	} else {
		// Chat
		conversationStore.createConversation({ character_id: Number(bot.id) }).then((id) => {
			router.push(`/chat/${id}`)
		})
	}
}

const checkOverflow = () => {
	if (scrollContainer.value) {
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
		// Use a small tolerance (1px)
		canScrollRight.value = scrollWidth > clientWidth && Math.ceil(scrollLeft + clientWidth) < scrollWidth
	}
}

const checkScroll = () => {
	checkOverflow()
}

const scrollRight = () => {
	if (scrollContainer.value) {
		scrollContainer.value.scrollBy({
			left: 200,
			behavior: 'smooth',
		})
	}
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
	checkOverflow()

	if (scrollContainer.value) {
		resizeObserver = new ResizeObserver(() => checkOverflow())
		resizeObserver.observe(scrollContainer.value)
	}
})

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect()
	}
})
</script>

<style scoped>
.scrollbar-hide {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
</style>
