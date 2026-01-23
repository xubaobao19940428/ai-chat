<template>
  <div class="flex flex-col h-full bg-[#fcfbfb] dark:bg-[#000000]">
    <!-- Fixed Top Area: Greeting & Input -->
    <div class="flex-shrink-0 w-full z-10 bg-[#fcfbfb] dark:bg-[#000000] pt-6 sm:pt-10 px-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-10px_rgba(255,255,255,0.02)]">
      <div class="max-w-4xl mx-auto">
        <!-- Scrollable content usually starts below this -->
        
        <!-- Greeting -->
        <div class="text-center mb-6 sm:mb-8">
          <div class="flex justify-center mb-4">
             <div class="w-12 h-12 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 animate-pulse" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 8L21 9L16.5 13.5L18 19.5L12 16.5L6 19.5L7.5 13.5L3 9L9 8L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
             </div>
          </div>
          <h2 class="text-2xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h2>
          <p class="text-lg text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
        </div>
    
        <!-- Input Area -->
        <div class="max-w-3xl mx-auto mb-6">
          <div class="relative bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] focus-within:border-indigo-500 dark:focus-within:border-[#333333] transition-colors">
            <textarea
              v-model="inputMessage"
              :placeholder="placeholder"
              rows="1"
              class="w-full px-12 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none resize-none max-h-32 overflow-y-auto text-base"
              :disabled="isLoading"
              @keydown.enter.exact.prevent="handleSubmit"
              @keydown.enter.shift.exact="inputMessage += '\n'"
              @input="autoResize"
              ref="textareaRef"
            ></textarea>
            
            <!-- Attachment Icon -->
            <button class="absolute left-3 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
    
            <!-- Bottom Actions -->
            <div class="flex items-center justify-between px-3 pb-3">
              <div class="flex items-center gap-2">
                 <button class="flex items-center gap-2 px-3 py-2 sm:py-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="hidden sm:inline">Create an image</span>
                </button>
                <button class="flex items-center gap-2 px-3 py-2 sm:py-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span class="hidden sm:inline">Search the web</span>
                </button>
              </div>
              
              <div class="flex items-center gap-2">
              <div class="flex items-center gap-2">
                <ModelSelector />
              </div>
    
                <button
                  @click="handleSubmit"
                  :disabled="!inputMessage.trim() || isLoading"
                  class="p-2 bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#222222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Bottom Area: Suggestions & Bots -->
    <div class="flex-1 overflow-y-auto px-4 pb-8 custom-scrollbar">
      <div class="max-w-4xl mx-auto pt-4">
        <!-- Suggestions -->
        <div class="mb-8 px-4">
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="suggestion in visibleSuggestions"
              :key="suggestion.id"
              @click="handleApplyPrompt(suggestion)"
              class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 rounded-full border border-gray-100 dark:border-gray-800 transition-all text-sm font-medium shadow-sm active:scale-95"
            >
              <span>{{ suggestion.icon }}</span>
              <span>{{ suggestion.label }}</span>
            </button>
            <button
              v-if="!showAllSuggestions && PROMPT_SUGGESTIONS.length > 5"
              @click="showAllSuggestions = true"
              class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#222222] text-gray-500 dark:text-gray-400 rounded-full border border-gray-100 dark:border-gray-800 transition-all text-sm font-medium shadow-sm"
            >
              <span>See All</span>
            </button>
          </div>
    
          <!-- Sub-prompts Selection -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
          >
            <div v-if="activeSubPrompts.length > 0" class="mt-4 flex flex-wrap justify-center gap-2 p-3 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <button
                v-for="sub in activeSubPrompts"
                :key="sub"
                @click="handleApplySubPrompt(sub)"
                class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
              >
                {{ sub }}
              </button>
              <button @click="activeSubPrompts = []" class="px-2 py-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs">
                Clear
              </button>
            </div>
          </Transition>
        </div>
    
        <!-- Bot Categories -->
        <div class="space-y-8 px-2">
          <template v-if="discoveryStore.isLoading">
             <div class="flex justify-center py-10">
                <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          </template>
          <template v-else>
            <BotCategory 
              v-for="group in discoveryStore.groups" 
              :key="group.id" 
              :title="group.title" 
              :bots="mapGroupToBots(group)" 
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { type Bot } from '~/utils/bots'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '~/utils/prompts'
import { type DiscoveryGroup } from '~/utils/api'

// Props
interface Props {
  mode?: 'chat' | 'image' | 'search'
  isLoading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  mode: 'chat',
  isLoading: false
})

// Emits
const emit = defineEmits<{
  (e: 'sendMessage', content: string, model: string): void
  (e: 'modelChange', modelId: string): void
}>()

// State
const inputMessage = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const modelStore = useModelStore()
const discoveryStore = useDiscoveryStore()
const showAllSuggestions = ref(false)
const activeSubPrompts = ref<string[]>([])

// Computed
const title = computed(() => {
  if (props.mode === 'image') return 'AI 绘画创作'
  if (props.mode === 'search') return 'AI 全网搜索'
  return '晚上好, Bot'
})

const visibleSuggestions = computed(() => {
  if (showAllSuggestions.value) return PROMPT_SUGGESTIONS
  return PROMPT_SUGGESTIONS.slice(0, 5)
})

const subtitle = computed(() => {
  if (props.mode === 'image') return '描述你想象中的画面'
  if (props.mode === 'search') return '即时获取最新网络资讯'
  return '今天有什么需要帮忙的?'
})

const placeholder = computed(() => {
  if (props.mode === 'image') return '例如：一只在大海冲浪的赛博朋克猫...'
  if (props.mode === 'search') return '搜索网络...'
  return 'Type a message...'
})

// Methods
const mapGroupToBots = (group: DiscoveryGroup): Bot[] => {
  return group.items.map(item => ({
    id: String(item.related_id), // Use related_id as bot ID for chat context
    name: item.title,
    description: item.subtitle,
    icon: item.cover,
    type: item.type === 'character' ? 'standard' : item.type as any,
    mode: item.type === 'character' ? 'chat' : 'chat'
  }))
}

// Methods
const autoResize = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 128)}px`
    }
  })
}

const handleApplyPrompt = (suggestion: PromptSuggestion) => {
  inputMessage.value = suggestion.prompt
  if (suggestion.subPrompts) {
    activeSubPrompts.value = suggestion.subPrompts
  } else {
    activeSubPrompts.value = []
  }
  autoResize()
  if (textareaRef.value) textareaRef.value.focus()
}

const handleApplySubPrompt = (sub: string) => {
  inputMessage.value = sub
  activeSubPrompts.value = []
  autoResize()
  if (textareaRef.value) textareaRef.value.focus()
}

const handleSubmit = () => {
  if (!inputMessage.value.trim() || props.isLoading) return
  
  emit('sendMessage', inputMessage.value.trim(), modelStore.selectedModelId || 'gpt-4o-mini')
  inputMessage.value = ''
  activeSubPrompts.value = []
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }
}
</script>

<style scoped>
/* Copied animations from ChatView */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
