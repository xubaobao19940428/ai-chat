<template>
  <div class="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#050505] relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Fixed Top Area: Greeting & Input -->
    <div class="flex-shrink-0 w-full z-10 pt-12 sm:pt-20 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Greeting -->
        <div class="text-center mb-10 sm:mb-14">
          <div class="flex justify-center mb-6">
             <div class="w-16 h-16 text-indigo-500 dark:text-indigo-400">
                <svg viewBox="0 0 24 24" fill="none" class="w-16 h-16 animate-pulse" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 8L21 9L16.5 13.5L18 19.5L12 16.5L6 19.5L7.5 13.5L3 9L9 8L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
             </div>
          </div>
          <h2 class="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{{ title }}</h2>
          <p class="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium pb-2 transition-all duration-700">{{ subtitle }}</p>
        </div>
    
        <!-- Floating Input Area -->
        <div class="max-w-3xl mx-auto mb-12 shadow-2xl rounded-[1.5rem]">
          <div class="glass-effect dark:bg-gray-900/60 p-1 rounded-[1.5rem]">
            <div class="relative bg-white/60 dark:bg-black/40 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all duration-300 border border-transparent dark:border-white/5 shadow-inner">
              <textarea
                v-model="inputMessage"
                :placeholder="placeholder"
                rows="1"
                class="w-full px-5 pt-4 pb-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none resize-none max-h-48 overflow-y-auto text-base font-medium leading-relaxed"
                :disabled="isLoading"
                @keydown.enter.exact.prevent="handleSubmit"
                @keydown.enter.shift.exact="inputMessage += '\n'"
                @input="autoResize"
                ref="textareaRef"
              ></textarea>
              
              <!-- Bottom Row -->
              <div class="flex items-center justify-between px-4 pb-3 pt-1">
                <div class="flex items-center gap-1.5">
                  <button class="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all" title="Create Image">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button class="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all" title="Search World">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </button>
                  <div class="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1"></div>
                  <ModelSelector />
                </div>
                
                <div class="flex items-center gap-2">
                  <button
                    @click="handleSubmit"
                    :disabled="!inputMessage.trim() || isLoading"
                    class="flex items-center justify-center p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-90 disabled:opacity-40"
                  >
                    <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Bottom Area: Suggestions & Bots -->
    <div class="flex-1 overflow-y-auto px-4 pb-20 custom-scrollbar z-10">
      <div class="max-w-4xl mx-auto pt-4">
        <!-- Suggestions -->
        <div class="mb-12 px-4">
          <div class="flex flex-wrap justify-center gap-2.5">
            <button
              v-for="suggestion in visibleSuggestions"
              :key="suggestion.id"
              @click="handleApplyPrompt(suggestion)"
              class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#111111] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 rounded-full border border-gray-100 dark:border-gray-800 transition-all text-sm font-semibold shadow-sm hover:translate-y-[-1px] active:scale-95 premium-shadow"
            >
              <span class="text-base">{{ suggestion.icon }}</span>
              <span>{{ suggestion.label }}</span>
            </button>
            <button
              v-if="!showAllSuggestions && PROMPT_SUGGESTIONS.length > 5"
              @click="showAllSuggestions = true"
              class="flex items-center gap-2 px-4 py-2.5 bg-white/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-full border border-gray-100/50 dark:border-gray-800 transition-all text-sm font-semibold shadow-sm"
            >
              <span>See More</span>
            </button>
          </div>
    
          <!-- Sub-prompts Selection -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform -translate-y-4 opacity-0 scale-95"
            enter-to-class="transform translate-y-0 opacity-100 scale-100"
          >
            <div v-if="activeSubPrompts.length > 0" class="mt-8 flex flex-wrap justify-center gap-2.5 p-5 glass-effect dark:bg-gray-900/30 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-500/20">
              <button
                v-for="sub in activeSubPrompts"
                :key="sub"
                @click="handleApplySubPrompt(sub)"
                class="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all active:scale-95"
              >
                {{ sub }}
              </button>
              <button @click="activeSubPrompts = []" class="px-3 py-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold uppercase tracking-wider">
                ✕
              </button>
            </div>
          </Transition>
        </div>
    
        <!-- Bot Categories -->
        <div class="space-y-12 px-2 pb-10">
          <template v-if="discoveryStore.isLoading">
             <div class="flex justify-center py-20">
                <div class="w-10 h-10 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          </template>
          <template v-else>
            <BotCategory 
              v-for="group in discoveryStore.groups" 
              :key="group.id" 
              :title="group.title" 
              :bots="mapGroupToBots(group)" 
              class="animate-in fade-in slide-in-from-bottom-4 duration-700"
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
