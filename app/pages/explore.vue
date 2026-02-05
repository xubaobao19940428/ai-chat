<template>
	<div class="flex-1 flex flex-col h-full bg-[#fcfbfb] dark:bg-[#000000] overflow-hidden">
		<!-- Header Area -->
		<div class="flex-shrink-0 px-2 pt-2 md:pt-5 pb-2">
			<div class="max-w-6xl mx-auto w-full flex items-center justify-between gap-6">
				<!-- Left: Tabs -->
				<!-- <div class="flex items-center gap-1 bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-full">
					<button class="px-5 py-1.5 rounded-full font-bold text-sm transition-all" :class="activeTab === 'explore' ? 'bg-white dark:bg-[#2a2a2a] text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'" @click="activeTab = 'explore'">Explore</button>
					<button class="px-5 py-1.5 rounded-full font-bold text-sm transition-colors" :class="activeTab === 'my-creation' ? 'bg-white  dark:bg-[#2a2a2a] text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'" @click="activeTab = 'my-creation'">My Creation</button>
				</div> -->

				<!-- Middle: Header Tags (API Categorization) -->
				<div class="flex-1 hidden md:flex justify-center overflow-hidden px-4">
					<div class="flex items-center gap-2 overflow-x-auto scrollbar-hide mask-fade-x bg-[#0000000a] dark:bg-[#1a1a1a] px-2 py-1 rounded-full">
						<button v-for="group in discoveryGroups" :key="group.id" class="text-sm font-medium whitespace-nowrap transition-colors px-6 py-2 rounded-full" :class="selectedGroupId === group.id ? 'text-black bg-white dark:bg-[#2a2a2a] dark:text-white font-bold shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'" @click="selectedGroupId = group.id">
							{{ group.title }}
						</button>
					</div>
				</div>

				<!-- Right Area (Empty as placeholder) -->
				<div class="flex items-center gap-4"></div>
			</div>
		</div>

		<!-- Original Page Modules (Search & Lower Filters) -->
		<div class="flex-shrink-0 px-4 md:px-6 pt-2 pb-2">
			<div class="max-w-5xl mx-auto w-full">
				<!-- Search Bar -->
				<div class="relative group mb-8 mt-4">
					<div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
						<Search :size="20" class="text-gray-400" />
					</div>
					<input v-model="searchQuery" type="text" placeholder="搜索机器人、应用或用户" class="block w-full pl-14 pr-4 py-3.5 bg-white dark:bg-[#1a1a1a] border border-transparent dark:border-[#2a2a2a] rounded-2xl text-base shadow-sm hover:shadow-md focus:shadow-md focus:ring-0 transition-all placeholder-gray-400 dark:text-white" />
				</div>

				<!-- Filter Tags -->
				<div class="relative group/tags mb-6" v-if="activeTab === 'explore'">
					<div class="flex flex-wrap gap-2.5 px-1 scrollbar-hide overflow-x-auto">
						<button class="flex-shrink-0 px-4 py-2 rounded-[14px] text-sm font-bold transition-all border border-transparent" :class="selectedTag === '全部' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'bg-[#eeeff1] dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-[#e5e7eb] dark:hover:bg-[#333333] hover:shadow-sm'" @click="selectedTag = '全部'">全部</button>
						<button v-for="tag in filterTags" :key="tag" class="flex-shrink-0 px-4 py-2 rounded-[14px] text-sm font-bold transition-all border border-transparent" :class="selectedTag === tag ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'bg-[#eeeff1] dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-[#e5e7eb] dark:hover:bg-[#333333] hover:shadow-sm'" @click="selectedTag = tag">
							{{ tag }}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Scrollable Content -->
		<div class="flex-1 overflow-y-auto px-4 md:px-6 pb-12 custom-scrollbar">
			<div class="max-w-5xl mx-auto w-full">
				<!-- Explore Tab -->
				<div v-if="activeTab === 'explore'">
					<!-- Loading State -->
					<div v-if="discoveryStore.isLoading && botsList.length === 0" class="flex justify-center py-20">
						<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
					</div>

					<div v-else class="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
						<div v-for="bot in botsList" :key="bot.id" class="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 p-4 md:p-5 rounded-[20px] bg-white dark:bg-[#1a1a1a] border border-transparent hover:border-gray-200 dark:hover:border-[#333333] shadow-sm hover:shadow-lg transition-all cursor-pointer group text-center md:text-left" @click="handleBotClick(bot)">
							<!-- Icon -->
							<div class="flex-shrink-0 w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-[16px] overflow-hidden bg-[#f8f9fa] dark:bg-[#2a2a2a] flex items-center justify-center text-2xl md:text-3xl shadow-inner">
								<img v-if="bot.icon && bot.icon.startsWith('http')" :src="bot.icon" class="w-full h-full object-cover" />
								<span v-else>{{ bot.icon || '🤖' }}</span>
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0 pt-0.5 w-full">
								<div class="flex flex-col md:flex-row items-center md:items-center md:justify-between mb-1 gap-1">
									<h3 class="text-[14px] md:text-[16px] font-bold text-gray-900 dark:text-white truncate w-full md:w-auto">{{ bot.name }}</h3>
									<span v-if="bot.type === 'character'" class="px-1.5 py-0.5 rounded-md bg-[#f3f4f6] dark:bg-[#2a2a2a] text-[#4b5563] dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider flex-shrink-0"> Official </span>
								</div>
								<p class="text-[12px] md:text-[14px] text-gray-500 dark:text-gray-400 line-clamp-1 md:line-clamp-2 leading-relaxed mb-2 md:mb-3">
									{{ bot.description || 'No description available.' }}
								</p>

								<div class="hidden md:flex items-center gap-2" v-if="bot.provider">
									<span class="text-xs text-gray-400">By {{ bot.provider }}</span>
								</div>
							</div>
						</div>
					</div>

					<div v-if="!discoveryStore.isLoading && botsList.length === 0" class="text-center py-20 text-gray-500">未找到相关的机器人</div>
				</div>

				<!-- My Creation Tab (Placeholder as requested) -->
				<div v-else class="flex flex-col items-center justify-center py-20">
					<div class="text-gray-400 mb-4">暂无创建的机器人</div>
					<button class="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold shadow-md hover:scale-105 transition-transform">立即创建</button>
				</div>
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
const activeTab = ref('explore')
const searchQuery = ref('')
const selectedGroupId = ref<number | null>(null)
const selectedTag = ref('官方')

// Load API Data
onMounted(() => {
	discoveryStore.fetchDiscovery('provider')
})

// API Data Groups
const discoveryGroups = computed(() => discoveryStore.groups)

// Restore full original filterTags
const filterTags = ['官方', '搜索', '视频生成', '应用', '简体中文', '精选', '创意写作', '游戏机器人', '专业', '脚本', '图像生成', '音频生成', '繁体中文', '热门', '上新', 'AI', '翻译']

// Mapping API items to local Bot structure for consistency
const botsList = computed(() => {
	let items: any[] = []

	if (selectedGroupId.value !== null) {
		const group = discoveryGroups.value.find((g) => g.id === selectedGroupId.value)
		if (group) items = group.items
	} else {
		// Default: merge all groups
		items = discoveryGroups.value.flatMap((g) => g.items)
	}

	let mapped = items.map((item) => ({
		id: String(item.related_id || item.id),
		name: item.title,
		description: item.subtitle,
		icon: item.cover,
		type: item.type,
		provider: item.related_data?.provider || 'AI',
		action_url: item.action_url,
	}))

	// Tag filtering logic
	if (selectedTag.value && selectedTag.value !== '全部' && selectedTag.value !== '官方') {
		const tag = selectedTag.value.toLowerCase()
		mapped = mapped.filter((b) => (b.name && b.name.toLowerCase().includes(tag)) || (b.description && b.description.toLowerCase().includes(tag)) || (b.type && b.type.toLowerCase() === tag))
	} else if (selectedTag.value === '官方') {
		mapped = mapped.filter((b) => b.type === 'character' || b.type === 'official')
	}

	// Search filtering
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		return mapped.filter((b) => (b.name && b.name.toLowerCase().includes(query)) || (b.description && b.description.toLowerCase().includes(query)))
	}

	return mapped
})

const handleBotClick = (bot: any) => {
	// API items handling
	if (bot.type === 'character') {
		conversationStore.createConversation({ character_id: Number(bot.id) }).then((id) => {
			router.push(`/chat/${id}`)
		})
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
	background: #e5e7eb;
	border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
	background: #333;
}
</style>
