<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] overflow-hidden transition-colors">
		<!-- Search & Filter Area -->
		<div class="flex-shrink-0 px-4 md:px-6 pt-4 md:pt-6 pb-2">
			<div class="max-w-5xl mx-auto w-full">
				<!-- Search Bar -->
				<div class="relative group mb-6 mt-2">
					<div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
						<Search :size="20" class="text-[var(--text-tertiary)]" />
					</div>
					<input v-model="searchQuery" type="text" placeholder="搜索机器人、应用或用户"
						class="block w-full pl-14 pr-4 py-3.5 bg-[var(--background-white-main)] border border-[var(--border-light)] rounded-2xl text-base shadow-sm hover:shadow-md focus:shadow-md focus:ring-0 transition-all placeholder-[var(--text-disable)] text-[var(--text-primary)]" />
				</div>

				<!-- Filter Tags -->
				<div class="relative group/tags mb-4">
					<div class="flex flex-wrap gap-2.5 px-1 scrollbar-hide overflow-x-auto">
						<button
							class="flex-shrink-0 px-4 py-2 rounded-[14px] text-sm font-bold transition-all border border-transparent"
							:class="selectedTag === '全部' ? 'bg-[var(--Button-primary-black)] text-[var(--Button-primary-white)] shadow-md' : 'bg-[var(--fill-tsp-white-main)] text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-dark)] hover:shadow-sm'"
							@click="handleTagChange('全部')">全部</button>
						<button v-for="tag in filterTags" :key="tag"
							class="flex-shrink-0 px-4 py-2 rounded-[14px] text-sm font-bold transition-all border border-transparent"
							:class="selectedTag === tag ? 'bg-[var(--Button-primary-black)] text-[var(--Button-primary-white)] shadow-md' : 'bg-[var(--fill-tsp-white-main)] text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-dark)] hover:shadow-sm'"
							@click="handleTagChange(tag)">
							{{ tag }}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Scrollable Content -->
		<div class="flex-1 overflow-y-auto px-4 md:px-6 pb-12 custom-scrollbar" ref="scrollContainer"
			@scroll="handleScroll">
			<div class="max-w-5xl mx-auto w-full">
				<!-- Loading State (initial) -->
				<div v-if="discoveryStore.isLoading && botsList.length === 0" class="flex justify-center py-20">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-primary)]"></div>
				</div>

				<!-- Bot Cards Grid -->
				<div v-else class="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
					<div v-for="bot in botsList" :key="bot.id"
						class="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 p-4 md:p-5 rounded-[20px] bg-[var(--background-white-main)] border border-[var(--border-light)] hover:border-[var(--border-main)] shadow-sm hover:shadow-lg transition-all cursor-pointer group text-center md:text-left"
						@click="handleBotClick(bot)">
						<!-- Icon -->
						<div
							class="flex-shrink-0 w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-[16px] overflow-hidden bg-[var(--background-gray-main)] flex items-center justify-center text-2xl md:text-3xl shadow-inner">
							<img v-if="bot.icon && bot.icon.startsWith('http')" :src="bot.icon"
								class="w-full h-full object-cover" />
							<span v-else>{{ bot.icon || '🤖' }}</span>
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0 pt-0.5 w-full">
							<div
								class="flex flex-col md:flex-row items-center md:items-center md:justify-between mb-1 gap-1">
								<h3
									class="text-[14px] md:text-[16px] font-bold text-[var(--text-primary)] truncate w-full md:w-auto">
									{{ bot.name }}</h3>
								<span v-if="bot.type === 'character'"
									class="px-1.5 py-0.5 rounded-md bg-[var(--fill-tsp-white-main)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
									Official </span>
							</div>
							<p
								class="text-[12px] md:text-[14px] text-[var(--text-tertiary)] line-clamp-1 md:line-clamp-2 leading-relaxed mb-2 md:mb-3">
								{{ bot.description || 'No description available.' }}
							</p>

							<div class="hidden md:flex items-center gap-2" v-if="bot.provider">
								<span class="text-xs text-[var(--text-disable)]">By {{ bot.provider }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty State -->
				<div v-if="!discoveryStore.isLoading && botsList.length === 0"
					class="text-center py-20 text-[var(--text-tertiary)]">未找到相关的机器人</div>

				<!-- Loading More Indicator -->
				<div v-if="discoveryStore.isLoadingMore" class="flex justify-center py-8">
					<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--text-tertiary)]"></div>
				</div>

				<!-- No More Data -->
				<div v-if="!discoveryStore.hasMore && botsList.length > 0 && !discoveryStore.isLoading"
					class="text-center py-6 text-[var(--text-disable)] text-sm">已经到底了</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { useDiscoveryStore } from '~/stores/discovery'
import { useConversationStore } from '~/stores/conversation'

const router = useRouter()
const conversationStore = useConversationStore()
const discoveryStore = useDiscoveryStore()

// State
const searchQuery = ref('')
const selectedTag = ref('全部')
const scrollContainer = ref<HTMLElement | null>(null)

// Filter Tags
const filterTags = ['官方', '搜索', '视频生成', '应用', '简体中文', '精选', '创意写作', '游戏机器人', '专业', '脚本', '图像生成', '音频生成', '繁体中文', '热门', '上新', 'AI', '翻译']

// Load initial data
onMounted(() => {
	discoveryStore.fetchDiscovery('tag')
})

// Handle tag change
const handleTagChange = (tag: string) => {
	selectedTag.value = tag
}

// Map API items to display format
const botsList = computed(() => {
	let items = discoveryStore.allItems

	let mapped = items.map((item) => ({
		id: String(item.related_id || item.id),
		name: item.title,
		description: item.subtitle,
		icon: item.cover,
		type: item.type,
		provider: item.related_data?.provider || 'AI',
		action_url: item.action_url,
	}))

	// Tag filtering
	if (selectedTag.value && selectedTag.value !== '全部' && selectedTag.value !== '官方') {
		const tag = selectedTag.value.toLowerCase()
		mapped = mapped.filter((b) => (b.name && b.name.toLowerCase().includes(tag)) || (b.description && b.description.toLowerCase().includes(tag)) || (b.type && b.type.toLowerCase() === tag))
	} else if (selectedTag.value === '官方') {
		mapped = mapped.filter((b) => b.type === 'character' || (b.type as string) === 'official')
	}

	// Search filtering
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		return mapped.filter((b) => (b.name && b.name.toLowerCase().includes(query)) || (b.description && b.description.toLowerCase().includes(query)))
	}

	return mapped
})

// Scroll-based pagination
const handleScroll = () => {
	const el = scrollContainer.value
	if (!el) return
	// When user scrolls near the bottom (within 200px), load more
	if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
		discoveryStore.fetchMore('tag')
	}
}

const handleBotClick = (bot: any) => {
	if (bot.type === 'character') {
		router.push(`/character/${bot.id}`)
	} else if (bot.action_url) {
		if (bot.action_url.startsWith('app://')) {
			router.push(bot.action_url.replace('app://', '/'))
		} else {
			window.open(bot.action_url, '_blank')
		}
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
