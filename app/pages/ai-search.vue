<template>
  <div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] overflow-hidden transition-colors">

    <!-- 可滚动主内容区 -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div class="min-h-full flex flex-col items-center justify-center px-4 py-12">

        <!-- 图标和标题 -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-5 bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] rounded-2xl flex items-center justify-center">
            <Search class="w-8 h-8 text-[var(--text-primary)]" />
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">AI Search</h1>
          <p class="text-sm sm:text-base text-[var(--text-tertiary)]">Get instant answers with smart AI search</p>
        </div>

        <!-- 搜索输入框 -->
        <div class="w-full max-w-2xl">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search the web..."
              class="w-full py-3.5 pr-12 pl-28 sm:pl-36 bg-[var(--background-white-main)] border border-[var(--border-light)] rounded-2xl focus:outline-none focus:border-[var(--border-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-disable)] shadow-sm hover:shadow-md focus:shadow-md transition-all"
              @keydown.enter="performSearch"
            />

            <!-- 左侧 Speed 按钮 -->
            <div class="absolute left-2 top-1/2 -translate-y-1/2 speed-menu-container z-10">
              <button
                @click="toggleSpeedMenu"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-xl transition-colors text-xs font-medium text-[var(--text-secondary)]"
              >
                <Zap class="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span class="hidden sm:inline">{{ selectedSpeed }}</span>
                <ChevronDown class="w-3 h-3 text-[var(--text-tertiary)] flex-shrink-0" />
              </button>

              <!-- Speed 下拉菜单 -->
              <div
                v-if="showSpeedMenu"
                class="absolute top-full left-0 mt-1.5 w-36 bg-[var(--background-white-main)] border border-[var(--border-light)] rounded-xl shadow-lg z-20 overflow-hidden"
              >
                <button
                  v-for="speed in speedOptions"
                  :key="speed"
                  @click="selectSpeed(speed)"
                  class="w-full px-4 py-2.5 text-left hover:bg-[var(--bg-hover)] transition-colors text-sm text-[var(--text-primary)] first:pt-3 last:pb-3"
                  :class="selectedSpeed === speed ? 'font-semibold' : ''"
                >
                  {{ speed }}
                </button>
              </div>
            </div>

            <!-- 右侧麦克风按钮 -->
            <button
              @click="toggleVoiceInput"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
            >
              <Mic class="w-4 h-4 text-[var(--text-tertiary)]" />
            </button>
          </div>

          <!-- 最近搜索 -->
          <div v-if="searchHistory.length > 0 && searchResults.length === 0" class="mt-4">
            <div class="text-xs font-medium text-[var(--text-tertiary)] mb-2 px-1">Recent</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(item, index) in searchHistory.slice(0, 5)"
                :key="index"
                @click="searchQuery = item; performSearch()"
                class="px-3 py-1.5 bg-[var(--fill-tsp-white-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-light)] rounded-xl text-xs text-[var(--text-secondary)] transition-colors"
              >
                {{ item.length > 24 ? item.slice(0, 24) + '…' : item }}
              </button>
            </div>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div v-if="searchResults.length > 0" class="w-full max-w-2xl mt-6">
          <div class="space-y-3">
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="p-4 bg-[var(--background-white-main)] border border-[var(--border-light)] hover:border-[var(--border-main)] rounded-2xl hover:shadow-md transition-all cursor-pointer"
              @click="openResult(result.url)"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-9 h-9 bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] rounded-xl flex items-center justify-center">
                  <FileText class="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-1 line-clamp-1">{{ result.title }}</h3>
                  <p class="text-xs text-[var(--text-tertiary)] mb-2 line-clamp-2">{{ result.description }}</p>
                  <div class="text-xs text-[var(--text-disable)] truncate">{{ result.url }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Zap, ChevronDown, Mic, FileText } from 'lucide-vue-next'

const searchQuery = ref('')
const showSpeedMenu = ref(false)
const selectedSpeed = ref('Speed')
const isVoiceInput = ref(false)
const searchHistory = ref<string[]>([])
const searchResults = ref<Array<{ title: string; description: string; url: string }>>([])

const speedOptions = ['Speed', 'Balanced', 'Thorough']

const toggleSpeedMenu = () => {
  showSpeedMenu.value = !showSpeedMenu.value
}

const selectSpeed = (speed: string) => {
  selectedSpeed.value = speed
  showSpeedMenu.value = false
}

const toggleVoiceInput = () => {
  isVoiceInput.value = !isVoiceInput.value
  // TODO: 实现语音输入功能
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  // 添加到搜索历史
  if (!searchHistory.value.includes(searchQuery.value)) {
    searchHistory.value.unshift(searchQuery.value)
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }
  }

  // TODO: 调用搜索API
  // const response = await searchAPI(searchQuery.value, selectedSpeed.value)
  
  // 模拟搜索结果
  searchResults.value = [
    {
      title: `${searchQuery.value} - Search Results`,
      description: `Find comprehensive information about ${searchQuery.value}. Explore articles, resources, and more related to your search query.`,
      url: 'https://example.com/search'
    },
    {
      title: `Learn more about ${searchQuery.value}`,
      description: `Discover detailed insights and analysis about ${searchQuery.value} from trusted sources.`,
      url: 'https://example.com/learn'
    },
    {
      title: `${searchQuery.value} - Latest Updates`,
      description: `Stay updated with the latest news and developments related to ${searchQuery.value}.`,
      url: 'https://example.com/news'
    }
  ]
}

const openResult = (url: string) => {
  window.open(url, '_blank')
}

// 点击外部关闭下拉菜单
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.speed-menu-container')) {
    showSpeedMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.1) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.1);
    border-radius: 10px;
  }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
