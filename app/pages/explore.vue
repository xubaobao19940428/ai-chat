<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] overflow-hidden transition-colors">
		<!-- Header: Desktop -->
		<header
			class="hidden lg:flex bg-[var(--bg-main)] border-b border-[var(--border-main)] px-6 py-3 items-center justify-between gap-6 shrink-0 z-10">
			<h1 class="text-xl font-bold text-[var(--text-primary)] tracking-tight">{{ $t('explore.title') }}</h1>
			<div class="flex items-center gap-3">
				<button @click="toggleMyCreated"
					:class="['flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all shadow-sm', showMyCreated ? 'bg-[var(--text-primary)] text-[var(--bg-main)]' : 'border border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--fill-tsp-white-dark)]']">
					{{ $t('explore.my_created') }}
				</button>
				<button @click="router.push('/character/create')"
					class="flex items-center gap-2 px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-xl font-bold text-[13px] hover:opacity-90 transition-all shadow-sm">
					<Plus :size="16" />
					<span>{{ $t('explore.create_bot') }}</span>
				</button>
			</div>
		</header>

		<!-- Header: Mobile -->
		<header class="lg:hidden bg-[var(--bg-main)] border-b border-[var(--border-main)] px-4 shrink-0 z-10">
			<div class="flex items-center justify-between gap-2 py-2">
				<div class="flex items-center gap-3 min-w-0">
					<button @click="uiStore.openMobileMenu()" :aria-label="$t('common.menu')"
						class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0">
						<Menu :size="20" />
					</button>
					<h1 class="text-lg font-bold text-[var(--text-primary)] tracking-tight truncate">{{
						$t('explore.title') }}</h1>
				</div>
				<div class="flex items-center gap-1.5 shrink-0">
					<button @click="toggleMyCreated"
						:class="['flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[12px] transition-all whitespace-nowrap', showMyCreated ? 'bg-[var(--text-primary)] text-[var(--bg-main)]' : 'border border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--fill-tsp-white-dark)]']">
						{{ $t('explore.my_created') }}
					</button>
					<button @click="router.push('/character/create')" :aria-label="$t('explore.create_bot')"
						class="flex items-center justify-center size-8 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-lg hover:opacity-90 transition-all shrink-0">
						<Plus :size="16" />
					</button>
				</div>
			</div>
			<div class="pb-2.5">
				<div class="relative">
					<Search :size="14"
						class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
					<input v-model="searchQuery" type="text" :placeholder="$t('explore.search_placeholder')"
						class="w-full h-9 pl-9 pr-3 bg-[var(--fill-tsp-gray-main)] border border-transparent focus:border-[var(--text-tertiary)] focus:bg-[var(--bg-main)] rounded-xl text-[14px] transition-all placeholder-[var(--text-disable)] text-[var(--text-primary)] outline-none" />
				</div>
			</div>
		</header>

		<!-- Filter Bar -->
		<div v-if="!showMyCreated"
			class="flex-shrink-0 flex items-center gap-3 px-4 lg:px-6 py-2.5 overflow-x-auto no-scrollbar">
			<div class="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar">
				<button v-for="tag in filterTags" :key="tag.id" @click="handleTagChange(tag.id)"
					:class="['flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-full border transition-all whitespace-nowrap', selectedTag === tag.id ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]']">
					<Heart v-if="tag.id === 'favorites'" :size="13" class="!stroke-transparent"
						:class="selectedTag === 'favorites' ? 'fill-white' : 'fill-black'" />
					{{ $t('explore.tags.' + tag.name) }}
				</button>
			</div>
			<div class="relative hidden lg:flex items-center w-[280px] shrink-0">
				<Search :size="14"
					class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
				<input v-model="searchQuery" type="text" :placeholder="$t('explore.search_placeholder')"
					class="w-full h-8 pl-9 pr-3 bg-[var(--fill-tsp-gray-main)] border border-transparent focus:border-[var(--text-tertiary)] focus:bg-[var(--bg-main)] rounded-xl text-[13px] transition-all placeholder-[var(--text-disable)] text-[var(--text-primary)] outline-none" />
			</div>
		</div>

		<!-- Scrollable Content -->
		<div :class="['flex-1 overflow-y-auto px-4 lg:px-5 pb-12 custom-scrollbar', showMyCreated ? 'pt-4' : '']"
			ref="scrollContainer" @scroll="handleScroll">
			<div class="w-full min-h-full">
				<!-- Skeleton Loading State (initial) -->
				<div v-if="isListLoading && displayList.length === 0"
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
					<div v-for="i in 12" :key="i"
						class="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--background-white-main)] border border-[var(--border-light)] animate-pulse">
						<div class="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--background-gray-main)]"></div>
						<div class="flex-1 min-w-0">
							<div class="h-3.5 bg-[var(--background-gray-main)] rounded w-2/3 mb-1.5"></div>
							<div class="h-3 bg-[var(--background-gray-main)] rounded w-full"></div>
						</div>
					</div>
				</div>

				<!-- Bot Cards Grid -->
				<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
					<div v-for="bot in displayList" :key="bot.id" :data-key="bot.id"
						class="relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--background-white-main)] border border-[var(--border-light)] hover:border-[var(--border-main)] hover:shadow-md transition-all cursor-pointer group"
						@click="handleBotClick(bot)">
						<!-- Hover Tooltip: full description -->
						<div v-if="bot.description"
							class="absolute bottom-full left-0 right-0 mb-1.5 px-3 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-main)] text-[12px] leading-relaxed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-lg max-w-full">
							{{ bot.description }}
							<div
								class="absolute top-full left-6 w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-[var(--text-primary)]">
							</div>
						</div>

						<!-- Icon -->
						<div
							class="flex-shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-[var(--background-gray-main)] flex items-center justify-center text-xl border border-[var(--border-light)]">
							<img v-if="bot.icon && bot.icon.startsWith('http')" :src="bot.icon"
								class="w-full h-full object-cover" />
							<span v-else>{{ bot.icon || '🤖' }}</span>
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<h3 class="text-[14px] font-bold text-[var(--text-primary)] truncate leading-tight">
									{{ bot.name }}
								</h3>
								<span v-if="bot.type === 'character' && !showMyCreated"
									class="px-1 py-px rounded bg-[var(--fill-tsp-white-main)] text-[var(--text-tertiary)] text-[9px] font-bold uppercase tracking-wider flex-shrink-0">{{
										$t('explore.official_badge') }}</span>
								<span v-if="showMyCreated && bot.access_type === 1"
									class="px-1.5 py-px rounded bg-[var(--fill-tsp-white-main)] text-[var(--text-tertiary)] text-[9px] font-bold flex-shrink-0">{{
										$t('character_create.private_label') }}</span>
							</div>
							<p class="text-[12px] text-[var(--text-tertiary)] truncate mt-0.5">
								{{ bot.description || $t('explore.no_description') }}
							</p>
						</div>

						<!-- Favorite -->
						<button v-if="!showMyCreated" @click.stop="toggleFavorite(Number(bot.id))"
							class="flex-shrink-0 size-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all outline-none border-none"
							:class="isFavorited(Number(bot.id)) ? '!opacity-100' : ''">
							<Heart :size="16"
								:class="isFavorited(Number(bot.id)) ? 'fill-red-500 !stroke-transparent' : 'fill-white/80 !stroke-transparent'" />
						</button>
					</div>
				</div>

				<div v-if="hasFetched && !isListLoading && displayList.length === 0"
					class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-1">
					<SearchX :size="48" class="text-[var(--text-disable)] mb-2" />
					<h3 class="text-lg font-semibold text-[var(--text-primary)]">{{ showMyCreated ?
						$t('explore.my_created_empty') : $t('explore.empty_state') }}</h3>
					<p class="text-sm text-[var(--text-tertiary)]">{{ showMyCreated ?
						$t('explore.my_created_empty_subtitle') : $t('explore.empty_state_subtitle') }}</p>
					<button v-if="showMyCreated" @click="router.push('/character/create')"
						class="mt-4 px-5 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] text-[13px] font-semibold hover:opacity-90 transition-opacity">
						{{ $t('explore.create_bot') }}
					</button>
					<button v-else @click="discoveryStore.hasMore = true; discoveryStore.fetchDiscovery(selectedTag, true)"
						class="mt-4 px-5 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
						<RefreshCw :size="14" />
						{{ $t('chat.retry') }}
					</button>
				</div>

				<!-- Loading More Indicator -->
				<div v-if="discoveryStore.isLoadingMore && !showMyCreated" class="flex justify-center py-8">
					<div class="flex items-center gap-3 text-[var(--text-tertiary)]">
						<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
						<span class="text-sm font-medium">{{ $t('explore.loading_more') }}</span>
					</div>
				</div>

				<!-- No More Data -->
				<div v-if="!showMyCreated && !discoveryStore.hasMore && botsList.length > 0 && !discoveryStore.isLoading"
					class="text-center py-6 text-[var(--text-disable)] text-sm">{{ $t('explore.no_more') }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ hideTopBar: true })
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, SearchX, Flame, Plus, Menu, Heart, RefreshCw } from 'lucide-vue-next'
import { useFavorite } from '~/composables/useFavorite'
import { useUIStore } from '~/stores/ui'
import { useExploreDiscoveryStore } from '~/stores/discovery'
import { useConversationStore } from '~/stores/conversation'
import { getMyCharacters } from '~/api/character'
import { encodeId } from '~/utils/sqids'

const router = useRouter()
const uiStore = useUIStore()
const discoveryStore = useExploreDiscoveryStore()
const conversationStore = useConversationStore()

// Favorites
const { isFavorited, toggleFavorite } = useFavorite('character')

// State
const searchQuery = ref('')
const debouncedSearch = ref('')
const selectedTag = ref<number | string>(10)
const hasFetched = ref(false)
const showMyCreated = ref(false)
const myCharacters = ref<any[]>([])
const isLoadingMyCharacters = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

// Debounce search query
const SEARCH_DEBOUNCE_MS = 300
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(searchQuery, (val) => {
	clearTimeout(searchTimer)
	searchTimer = setTimeout(() => {
		debouncedSearch.value = val
	}, SEARCH_DEBOUNCE_MS)
})

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
	// {
	// 	id: 9,
	// 	name: 'uncategorized',
	// },
	{
		id: 'favorites',
		name: 'favorites',
	},
]

onUnmounted(() => {
	clearTimeout(searchTimer)
})

// Load initial data
onMounted(async () => {
	if (discoveryStore.allItems.length === 0) {
		await discoveryStore.fetchDiscovery(selectedTag.value)
	}
	hasFetched.value = true
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
	// Reset scroll position to top
	if (scrollContainer.value) scrollContainer.value.scrollTop = 0
	if (tag !== 'favorites') {
		discoveryStore.fetchDiscovery(tag)
	}
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

	// Favorites filtering
	if (selectedTag.value === 'favorites') {
		return mapped.filter((b: any) => isFavorited(Number(b.id)))
	}

	// Search filtering
	if (debouncedSearch.value) {
		const query = debouncedSearch.value.toLowerCase()
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
		router.push(`/character/${encodeId(bot.id)}`)
	}
}

// My Created Characters
const toggleMyCreated = async () => {
	showMyCreated.value = !showMyCreated.value
	if (showMyCreated.value) {
		await fetchMyCharacters()
	}
}

const fetchMyCharacters = async () => {
	isLoadingMyCharacters.value = true
	try {
		const res: any = await getMyCharacters({ page: 1, page_size: 100 })
		myCharacters.value = (res?.data?.list || []).map((c: any) => ({
			id: String(c.id),
			name: c.name,
			description: c.description || '',
			icon: c.avatar || '',
			type: 'my_character',
			access_type: c.access_type,
		}))
	} catch (err: any) {
		console.error('Failed to fetch my characters:', err)
		myCharacters.value = []
	} finally {
		isLoadingMyCharacters.value = false
	}
}

// Computed display list & loading state
const displayList = computed(() => showMyCreated.value ? myCharacters.value : botsList.value)
const isListLoading = computed(() => showMyCreated.value ? isLoadingMyCharacters.value : discoveryStore.isLoading)
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
