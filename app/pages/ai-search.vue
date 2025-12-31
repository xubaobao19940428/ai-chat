<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-[#fcfbfb] dark:bg-[#000000] transition-colors">
    <!-- 右上角 Go Pro 按钮（桌面端） -->
    <div class="hidden lg:flex justify-end p-4">
      <button class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span>Go Pro</span>
      </button>
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 sm:pb-6">
      <div class="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
        <!-- 图标和标题 -->
        <div class="text-center mb-6 sm:mb-8">
          <div class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">AI Search Engine</h1>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">Get instant answers with smart AI search</p>
        </div>

        <!-- 搜索输入框 -->
        <div class="w-full max-w-2xl px-2 sm:px-0">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search the web"
              class="w-full px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-14 pl-20 sm:pl-32 border-2 border-gray-300 dark:border-[#2a2a2a] rounded-xl focus:outline-none focus:border-indigo-500 text-sm bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white transition-colors"
              @keydown.enter="performSearch"
            />
            
            <!-- 左侧 Speed 按钮 -->
            <div class="absolute left-2 sm:left-2 top-1/2 -translate-y-1/2 speed-menu-container z-10">
              <button
                @click="toggleSpeedMenu"
                class="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm border border-gray-200"
              >
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="font-medium text-gray-700 hidden sm:inline">Speed</span>
                <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Speed 下拉菜单 -->
              <div
                v-if="showSpeedMenu"
                class="absolute top-full left-0 mt-1 w-36 sm:w-40 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg shadow-lg z-20 transition-colors"
              >
                <button
                  v-for="speed in speedOptions"
                  :key="speed"
                  @click="selectSpeed(speed)"
                  class="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-50 transition-colors text-xs sm:text-sm first:rounded-t-lg last:rounded-b-lg"
                >
                  {{ speed }}
                </button>
              </div>
            </div>

            <!-- 右侧麦克风按钮 -->
            <button
              @click="toggleVoiceInput"
              class="absolute right-2 sm:right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <!-- 搜索建议或历史记录 -->
          <div v-if="searchHistory.length > 0" class="mt-3 sm:mt-4">
            <div class="text-xs font-medium text-gray-500 mb-2 px-2">Recent Searches</div>
            <div class="flex flex-wrap gap-2 px-2">
              <button
                v-for="(item, index) in searchHistory.slice(0, 5)"
                :key="index"
                @click="searchQuery = item; performSearch()"
                class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs sm:text-sm text-gray-700 transition-colors"
              >
                {{ item.length > 20 ? item.slice(0, 20) + '...' : item }}
              </button>
            </div>
          </div>
        </div>

        <!-- 搜索结果区域 -->
        <div v-if="searchResults.length > 0" class="w-full max-w-2xl mt-4 sm:mt-8 px-2 sm:px-0">
          <div class="space-y-2 sm:space-y-4">
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg hover:shadow-md transition-all cursor-pointer"
              @click="openResult(result.url)"
            >
              <div class="flex items-start gap-2 sm:gap-3">
                <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{{ result.title }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{{ result.description }}</p>
                  <div class="text-xs text-indigo-600 truncate">{{ result.url }}</div>
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
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.3);
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(156, 163, 175, 0.5);
    }
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
