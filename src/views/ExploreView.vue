<template>
    <div class="flex-1 flex flex-col h-full bg-[#fcfbfb] dark:bg-[#000000] overflow-hidden">
        <!-- Header Area -->
        <div class="flex-shrink-0 px-2 pt-2 md:pt-5 pb-2">
            <div class="max-w-6xl mx-auto w-full flex items-center justify-between gap-6">
                <!-- Left: Tabs -->
                <div class="flex items-center gap-1 bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-full">
                    <button class="px-5 py-1.5 rounded-full font-bold text-sm transition-all"
                        :class="activeTab === 'explore' ? 'bg-white dark:bg-[#2a2a2a] text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
                        @click="activeTab = 'explore'">
                        Explore
                    </button>
                    <button class="px-5 py-1.5 rounded-full font-bold text-sm transition-colors"
                        :class="activeTab === 'my-creation' ? 'bg-white  dark:bg-[#2a2a2a] text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
                        @click="activeTab = 'my-creation'">
                        My Creation
                    </button>
                </div>

                <!-- Middle: Header Tags -->
                <div class="flex-1 hidden md:flex justify-center overflow-hidden px-4">
                    <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide mask-fade-x bg-[#0000000a] dark:bg-[#1a1a1a] px-2 py-1 rounded-full">
                        <button v-for="tag in headerSearchTags" :key="tag"
                            class="text-sm font-medium whitespace-nowrap transition-colors px-6 py-2 rounded-full"
                            :class="headerSelectTag === tag ? 'text-black bg-white dark:bg-[#2a2a2a] dark:text-white font-bold shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
                            @click="headerSelectTag = tag">
                            {{ tag }}
                        </button>
                    </div>
                </div>

                <!-- Right: Search & Create -->
                <div class="flex items-center gap-4">
                    <div class="w-64 relative group hidden md:block">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input v-model="searchQuery" type="text" placeholder="搜索机器人"
                            class="block w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-full text-sm shadow-sm focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder-gray-400" />
                    </div>
                    <!-- <button
                        class="px-4 py-2 font-bold text-sm bg-black text-white dark:bg-white dark:text-black rounded-full shadow-sm hover:opacity-90 transition-opacity">
                        Create
                    </button> -->
                </div>
            </div>
        </div>

        <!-- Original Page Modules (Search & Tags) -->
        <div class="flex-shrink-0 px-4 md:px-6 pt-2 pb-2">
            <div class="max-w-5xl mx-auto w-full">
                <!-- Search Bar -->
                <div class="relative group mb-8">
                    <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text" placeholder="搜索机器人、应用或用户"
                        class="block w-full pl-14 pr-4 py-3.5 bg-white dark:bg-[#1a1a1a] border border-transparent dark:border-[#2a2a2a] rounded-2xl text-base shadow-sm hover:shadow-md focus:shadow-md focus:ring-0 transition-all placeholder-gray-400" />
                </div>

                <!-- Filter Tags -->
                <div class="relative group/tags mb-6">
                    <div class="flex flex-wrap gap-2.5 px-1">
                        <button v-for="tag in filterTags" :key="tag"
                            class="flex-shrink-0 px-4 py-2 rounded-[14px] text-sm font-bold transition-all border border-transparent"
                            :class="selectedTag === tag
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                                : 'bg-[#eeeff1] dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-[#e5e7eb] dark:hover:bg-[#333333] hover:shadow-sm'"
                            @click="selectedTag = tag">
                            {{ tag }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-4 md:px-6 pb-12">
            <div class="max-w-5xl mx-auto w-full">
                <div class="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                    <div v-for="bot in filteredBots" :key="bot.id"
                        class="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 p-4 md:p-5 rounded-[20px] bg-white dark:bg-[#1a1a1a] border border-transparent hover:border-gray-200 dark:hover:border-[#333333] shadow-sm hover:shadow-lg transition-all cursor-pointer group text-center md:text-left"
                        @click="handleBotClick(bot)">
                        <!-- Icon -->
                        <div
                            class="flex-shrink-0 w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-[16px] overflow-hidden bg-[#f8f9fa] dark:bg-[#2a2a2a] flex items-center justify-center text-2xl md:text-3xl shadow-inner">
                            <img v-if="bot.icon.startsWith('http')" :src="bot.icon"
                                class="w-full h-full object-cover" />
                            <span v-else>{{ bot.icon }}</span>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0 pt-0.5 w-full">
                            <div class="flex flex-col md:flex-row items-center md:items-center md:justify-between mb-1 gap-1">
                                <h3 class="text-[14px] md:text-[16px] font-bold text-gray-900 dark:text-white truncate w-full md:w-auto">{{ bot.name }}
                                </h3>
                                <span v-if="bot.type === 'official'"
                                    class="px-1.5 py-0.5 rounded-md bg-[#f3f4f6] dark:bg-[#2a2a2a] text-[#4b5563] dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                                    Official
                                </span>
                            </div>
                            <p class="text-[12px] md:text-[14px] text-gray-500 dark:text-gray-400 line-clamp-1 md:line-clamp-2 leading-relaxed mb-2 md:mb-3">
                                {{ bot.detailedDescription || bot.description || 'No description available.' }}
                            </p>

                            <div class="hidden md:flex items-center gap-2" v-if="bot.provider">
                                <span class="text-xs text-gray-400">By {{ bot.provider }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { OFFICIAL_BOTS, SCRIPT_BOTS, SEARCH_BOTS, type Bot } from '@/data/bots'
import { useConversationStore } from '@/store/conversation'

const router = useRouter()
const conversationStore = useConversationStore()

const activeTab = ref('explore')
const searchQuery = ref('')
const headerSelectTag = ref('热门')
const selectedTag = ref('官方')

const headerSearchTags = ref([
    '热门', 'AI模型', '写作', '教育', '生活返回式', '编程',

])
const filterTags = [
    '官方', '搜索', '视频生成', '应用', '简体中文', '精选',
    '创意写作', '游戏机器人', '专业', '脚本', '图像生成',
    '音频生成', '繁体中文', '热门', '上新', 'AI', '翻译'
]

const allBots = computed(() => {
    return [...OFFICIAL_BOTS, ...SCRIPT_BOTS, ...SEARCH_BOTS]
})

const filteredBots = computed(() => {
    let bots = allBots.value

    // Basic filtering by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        bots = bots.filter(b =>
            b.name.toLowerCase().includes(query) ||
            (b.description && b.description.toLowerCase().includes(query)) ||
            (b.detailedDescription && b.detailedDescription.toLowerCase().includes(query))
        )
    }

    // Tag filtering
    // For now, if the tag is 'AI模型', we show official bots as a demo
    if (selectedTag.value === 'AI模型' || selectedTag.value === '官方') {
        return bots.filter(b => b.type === 'official')
    }

    return bots
})

const handleBotClick = (bot: Bot) => {
    if (bot.mode === 'image') {
        router.push({ name: 'ImageGeneration' })
    } else if (bot.type === 'search') { 
        // Optional: Route search bots to search view if exists, assuming 'AISearchEngine'
        router.push({ name: 'AISearchEngine' }) 
    } else {
        // Default to Chat
        const conversation = conversationStore.createConversation(bot.id)
        router.push({ name: 'ChatView', params: { id: conversation.id } })
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
</style>
