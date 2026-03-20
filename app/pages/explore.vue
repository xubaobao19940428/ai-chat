<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] overflow-hidden transition-colors">
		<!-- Header & Control Area -->
		<div class="flex-shrink-0 px-5 pb-4">
			<div class="w-full">
				<!-- Header Row -->
				<div class="flex items-center justify-between mb-8">
					<h1 class="text-[32px] font-black text-[var(--text-primary)] tracking-tight">{{ $t('explore.title') }}</h1>
					<div class="flex items-center gap-3">
						<button class="px-5 py-2.5 rounded-xl border border-[var(--border-light)] text-[14px] font-bold text-[var(--text-primary)] hover:bg-[var(--fill-tsp-white-dark)] transition-all shadow-sm">
							{{ $t('explore.my_created') }}
						</button>
						<button class="px-5 py-2.5 rounded-xl bg-[#18181b] text-white text-[14px] font-bold hover:bg-[#27272a] transition-all flex items-center gap-2 shadow-md">
							<Plus :size="18" />
							<span>{{ $t('explore.create_bot') }}</span>
						</button>
					</div>
				</div>

				<!-- Control Bar: Tags + Search -->
				<div class="flex flex-col lg:flex-row lg:items-start gap-6 w-full">
					<!-- Filter Tags -->
					<div class="flex flex-wrap gap-2 flex-1 w-full lg:w-auto scrollbar-hide overflow-x-auto">
						<button v-for="tag in filterTags" :key="tag.id" class="flex-shrink-0 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all border" :class="selectedTag === tag.id ? 'bg-[#18181b] text-white border-transparent shadow-md' : 'bg-white text-[#71717a] border-[#e4e4e7] hover:bg-[#f4f4f5]'" @click="handleTagChange(tag.id)">
							{{ $t('explore.tags.' + tag.name) }}
						</button>
					</div>
					<!-- Search Bar -->
					<div class="relative flex items-center w-full lg:w-[360px] shrink-0">
						<Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
						<input v-model="searchQuery" type="text" :placeholder="$t('explore.search_placeholder')" class="block w-full pl-11 pr-4 py-2.5 bg-[#f4f4f5] border border-transparent focus:border-[var(--border-main)] rounded-2xl text-[15px] transition-all placeholder-[var(--text-disable)] text-[var(--text-primary)] outline-none" />
					</div>
				</div>
			</div>
		</div>

		<!-- Scrollable Content -->
		<div class="flex-1 overflow-y-auto px-5 pb-12 custom-scrollbar" ref="scrollContainer" @scroll="handleScroll">
			<div class="w-full">
				<!-- Skeleton Loading State (initial) -->
				<div v-if="discoveryStore.isLoading && botsList.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px]">
					<div v-for="i in 12" :key="i" class="flex items-start p-3 rounded-2xl bg-[var(--background-white-main)] border border-[var(--border-light)] animate-pulse">
						<!-- Icon Placeholder -->
						<div class="flex-shrink-0 w-[72px] h-[72px] rounded-2xl bg-[var(--background-gray-main)]"></div>

						<!-- Content Placeholder -->
						<div class="flex-1 min-w-0 ml-5 pt-1">
							<div class="h-5 bg-[var(--background-gray-main)] rounded-md w-3/4 mb-3"></div>
							<div class="h-3.5 bg-[var(--background-gray-main)] rounded-md w-full mb-2"></div>
							<div class="h-3.5 bg-[var(--background-gray-main)] rounded-md w-2/3 mb-4"></div>

							<div class="flex items-center gap-4 mt-1">
								<div class="h-3 bg-[var(--background-gray-main)] rounded-md w-12"></div>
								<div class="h-3 bg-[var(--background-gray-main)] rounded-md w-16"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Bot Cards Grid -->
				<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px]">
					<div v-for="bot in botsList" :key="bot.id" class="flex items-start p-3 rounded-2xl bg-[var(--background-white-main)] border border-[var(--border-light)] hover:border-[var(--border-main)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group" @click="handleBotClick(bot)">
						<!-- Icon -->
						<div class="flex-shrink-0 w-[72px] h-[72px] rounded-2xl overflow-hidden bg-[var(--background-gray-main)] flex items-center justify-center text-3xl shadow-sm border border-[var(--border-light)]">
							<img v-if="bot.icon && bot.icon.startsWith('http')" :src="bot.icon" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
							<span v-else>{{ bot.icon || '🤖' }}</span>
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0 ml-5 pt-0.5">
							<div class="flex items-center justify-between mb-1.5">
								<h3 class="text-[17px] font-black text-[var(--text-primary)] truncate leading-tight">
									{{ bot.name }}
								</h3>
								<span v-if="bot.type === 'character'" class="px-1.5 py-0.5 rounded-md bg-[var(--fill-tsp-white-main)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider flex-shrink-0"> {{ $t('explore.official_badge') }} </span>
							</div>
							<p class="text-[13.5px] text-[var(--text-tertiary)] line-clamp-2 leading-relaxed mb-4">
								{{ bot.description || $t('explore.no_description') }}
							</p>

							<!-- Stats Footer -->
							<div class="flex items-center gap-4 text-[11px] font-bold text-[var(--text-tertiary)]/60 uppercase tracking-widest">
								<div class="flex items-center gap-1.5">
									<Flame :size="14" class="text-orange-500" />
									<span>3M</span>
								</div>
								<div class="flex items-center gap-1">
									<span class="opacity-70">{{ $t('explore.by_author') }}</span>
									<span class="hover:text-[var(--text-primary)] transition-colors">@{{ bot.provider || 'Aura' }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty State -->
				<div v-if="!discoveryStore.isLoading && botsList.length === 0" class="text-center py-20 text-[var(--text-tertiary)]">{{ $t('explore.empty_state') }}</div>

				<!-- Loading More Indicator -->
				<div v-if="discoveryStore.isLoadingMore" class="flex justify-center py-8">
					<div class="flex items-center gap-3 text-[var(--text-tertiary)]">
						<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
						<span class="text-sm font-medium">{{ $t('explore.loading_more') }}</span>
					</div>
				</div>

				<!-- No More Data -->
				<div v-if="!discoveryStore.hasMore && botsList.length > 0 && !discoveryStore.isLoading" class="text-center py-6 text-[var(--text-disable)] text-sm">{{ $t('explore.no_more') }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Flame, Plus } from 'lucide-vue-next'
import { useExploreDiscoveryStore } from '~/stores/discovery'
import { useConversationStore } from '~/stores/conversation'

const router = useRouter()
const discoveryStore = useExploreDiscoveryStore()
const conversationStore = useConversationStore()

// State
const searchQuery = ref('')
const selectedTag = ref<number | string>(10)
const scrollContainer = ref<HTMLElement | null>(null)

// Filter Tags
const filterTags = [
	{
		id: 10,
		name: 'all',
	},
	{
		id: 7,
		name: 'work',
	},
	{
		id: 3,
		name: 'study',
	},
	{
		id: 6,
		name: 'creative',
	},
	{
		id: 2,
		name: 'tech',
	},
	{
		id: 5,
		name: 'life',
	},
	{
		id: 1,
		name: 'emotion',
	},
	{
		id: 8,
		name: 'business',
	},
	{
		id: 4,
		name: 'tools',
	},
	{
		id: 9,
		name: 'uncategorized',
	},
]

// Load initial data
onMounted(async () => {
	if (discoveryStore.allItems.length === 0) {
		await discoveryStore.fetchDiscovery(selectedTag.value)
	}
	await nextTick()
	tryAutoFill()
})

// After tag change, also try auto-fill
watch(() => discoveryStore.isLoading, async (loading) => {
	if (!loading) {
		await nextTick()
		tryAutoFill()
	}
})

// Handle tag change
const handleTagChange = (tag: number | string) => {
	if (selectedTag.value === tag) return
	selectedTag.value = tag
	discoveryStore.fetchDiscovery(tag)
}

// Map API items to display format
const botsList = computed(() => {
	const items = discoveryStore.allItems as any[]

	const mapped = items.map((item) => {
		const isCharacter = item.type === 'character' || item.related_data?.type === 'character'
		return {
			id: String(item.related_id || item.id),
			name: item.related_data?.name || item.title || 'Unknown',
			description: item.related_data?.description || item.subtitle || '',
			icon: item.related_data?.avatar || item.cover || '',
			type: isCharacter ? 'character' : item.type,
			provider: item.related_data?.provider || 'AI',
			action_url: item.action_url,
		}
	})

	// Search filtering
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		return mapped.filter((b: any) => (b.name && b.name.toLowerCase().includes(query)) || (b.description && b.description.toLowerCase().includes(query)))
	}

	return mapped
})

// Auto-fill: if content doesn't fill the viewport, keep loading
const tryAutoFill = async () => {
	const el = scrollContainer.value
	if (!el) return
	while (
		discoveryStore.hasMore &&
		!discoveryStore.isLoadingMore &&
		!discoveryStore.isLoading &&
		el.scrollHeight <= el.clientHeight + 200
	) {
		await discoveryStore.fetchMore()
		await nextTick()
	}
}

// Scroll-based pagination
const handleScroll = () => {
	const el = scrollContainer.value
	if (!el) return
	// When user scrolls near the bottom (within 200px), load more
	if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
		discoveryStore.fetchMore()
	}
}

const handleBotClick = (bot: any) => {
	if (bot.action_url) {
		if (bot.action_url.startsWith('app://')) {
			router.push(bot.action_url.replace('app://', '/'))
		} else {
			window.open(bot.action_url, '_blank')
		}
	} else {
		// Default: navigate to character detail page
		router.push(`/character/${bot.id}`)
	}
}
</script>

<style scoped>
.scrollbar-hide {
	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: var(--text-disable);
	border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
	background: var(--text-disable);
}
</style>
