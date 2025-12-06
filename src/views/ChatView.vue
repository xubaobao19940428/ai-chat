<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-[#fcfbfb] dark:bg-[#000000] transition-colors">
    <!-- 主内容区域 -->
    <div class="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 sm:pb-6">
      <!-- 如果无消息，显示欢迎界面 -->
      <WelcomeScreen 
        v-if="!conversationStore.currentConversation || conversationStore.currentConversation.messages.length === 0"
        mode="chat"
        :is-loading="chatStore.isLoading"
        @send-message="handleWelcomeSendMessage"
      />

      <!-- 如果有消息，显示聊天界面 -->
      <div v-else class="max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div class="space-y-6">
          <div
            v-for="message in conversationStore.currentConversation.messages"
            :key="message.id"
            class="group flex gap-4"
            :class="message.role === 'user' ? 'flex-row-reverse' : ''"
          >
            <div
              :class="[
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2a2a2a]'
              ]"
            >
              <span v-if="message.role === 'user'">U</span>
              <span v-else class="text-sm">{{ getModelById(conversationStore.currentConversation.model)?.icon || '🤖' }}</span>
            </div>
            
            <div class="flex-1 min-w-0 pt-1">
              <div
                :class="[
                  'rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-indigo-600 dark:bg-[#1a1a1a] text-white ml-auto'
                    : 'text-gray-900 dark:text-gray-100'
                ]"
                :style="message.role === 'user' ? 'max-width: 85%; margin-left: auto;' : 'max-width: 100%;'"
              >
                <div v-if="message.role === 'user'" class="whitespace-pre-wrap text-sm leading-relaxed break-words">{{ message.content }}</div>
                <div 
                  v-else 
                  class="prose prose-invert prose-sm max-w-none break-words leading-relaxed"
                  v-html="renderMarkdown(message.content)"
                ></div>
              </div>
            </div>
          </div>
          
          <div v-if="chatStore.isLoading && chatStore.loadingConversationId === conversationStore.currentConversationId" class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2a2a2a] flex items-center justify-center text-sm">
              {{ getModelById(conversationStore.currentConversation.model)?.icon || '🤖' }}
            </div>
            <div class="px-4 py-3">
              <div class="flex space-x-1.5">
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="h-6"></div>
      </div>
    </div>

    <!-- 底部输入框（仅当有消息时显示） -->
    <div v-if="conversationStore.currentConversation && conversationStore.currentConversation.messages.length > 0" class="flex-shrink-0 bg-[#fcfbfb] dark:bg-[#000000] border-t border-gray-200 dark:border-[#1a1a1a] pb-6 pt-2 transition-colors">
      <div class="max-w-3xl mx-auto px-4">
        <div class="relative bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] focus-within:border-indigo-500 dark:focus-within:border-[#333333] transition-colors">
          <textarea
            v-model="inputMessage"
            placeholder="Type a message..."
            rows="1"
            class="w-full px-12 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none resize-none max-h-32 overflow-y-auto text-base"
            :disabled="chatStore.isLoading"
            @keydown.enter.exact.prevent="sendMessage"
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
               <div class="relative">
                 <select
                  v-model="selectedModel"
                  @change="handleModelChange"
                  class="appearance-none pl-3 pr-8 py-2 sm:py-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 rounded-lg focus:outline-none text-xs font-medium cursor-pointer max-w-[120px] sm:max-w-none truncate"
                >
                  <option v-for="model in AI_MODELS" :key="model.id" :value="model.id">
                    {{ model.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
               </div>

              <button
                @click="sendMessage"
                :disabled="!inputMessage.trim() || chatStore.isLoading"
                class="p-2 bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#222222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="text-center mt-2">
           <p class="text-xs text-gray-500 dark:text-gray-500">AI can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConversationStore } from '@/store/conversation'
import { useChatStore } from '@/store/chat'
import { sendChatMessage } from '@/api/chat'
import { AI_MODELS, getModelById } from '@/config/models'
import { renderMarkdown } from '@/utils/markdown'
import WelcomeScreen from '@/components/WelcomeScreen.vue'

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()

const inputMessage = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const modelsContainer = ref<HTMLElement | null>(null)
const selectedModel = ref('gpt-4o-mini')

const handleWelcomeSendMessage = async (content: string, model: string) => {
  const conversation = conversationStore.createConversation(model)
  conversationStore.addMessage(conversation.id, {
    role: 'user',
    content: content,
  })
  
  router.push(`/chat/${conversation.id}`)
  
  // Reuse API call logic from sendMessage (simplified copy for now to ensure robustness during refactor)
  chatStore.setLoading(true, conversation.id)

  try {
     const messages = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

     const response = await sendChatMessage(messages, conversation.model)
    
    conversationStore.addMessage(conversation.id, {
      role: 'assistant',
      content: response.message || '抱歉，我无法理解您的问题。',
    })
  } catch (error) {
    console.error('发送消息失败:', error)
    conversationStore.addMessage(conversation.id, {
      role: 'assistant',
      content: '抱歉，发生了错误，请稍后再试。',
    })
  } finally {
    chatStore.setLoading(false)
  }
}

onMounted(() => {
  const conversationId = route.params.id as string
  if (conversationId) {
    conversationStore.switchConversation(conversationId)
    if (conversationStore.currentConversation) {
      selectedModel.value = conversationStore.currentConversation.model
    }
  } else if (conversationStore.conversations.length > 0) {
    const firstConversation = conversationStore.conversations[0]
    if (firstConversation) {
      router.push(`/chat/${firstConversation.id}`)
      selectedModel.value = firstConversation.model
    } else {
      const conversation = conversationStore.createConversation(selectedModel.value)
      router.push(`/chat/${conversation.id}`)
    }
  }
})

watch(() => conversationStore.currentConversationId, () => {
  if (conversationStore.currentConversation) {
    selectedModel.value = conversationStore.currentConversation.model
  }
  nextTick(() => {
    scrollToBottom()
  })
})

watch(() => conversationStore.currentConversation?.messages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

const autoResize = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 128)}px`
    }
  })
}

const selectModel = (modelId: string) => {
  selectedModel.value = modelId
  if (conversationStore.currentConversationId) {
    conversationStore.switchModel(conversationStore.currentConversationId, modelId)
  }
}

const handleModelChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  selectModel(target.value)
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || chatStore.isLoading) {
    if (!conversationStore.currentConversationId) {
      const conversation = conversationStore.createConversation(selectedModel.value)
      router.push(`/chat/${conversation.id}`)
    }
    return
  }

  // 确保有会话
  if (!conversationStore.currentConversationId) {
    const conversation = conversationStore.createConversation(selectedModel.value)
    router.push(`/chat/${conversation.id}`)
  }

  const conversation = conversationStore.currentConversation
  if (!conversation) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }

  conversationStore.addMessage(conversation.id, {
    role: 'user',
    content: userMessage,
  })

  chatStore.setLoading(true, conversation.id)

  try {
    const messages = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    const response = await sendChatMessage(messages, conversation.model)
    
    conversationStore.addMessage(conversation.id, {
      role: 'assistant',
      content: response.message || '抱歉，我无法理解您的问题。',
    })

    nextTick(() => {
      scrollToBottom()
    })
  } catch (error) {
    console.error('发送消息失败:', error)
    conversationStore.addMessage(conversation.id, {
      role: 'assistant',
      content: '抱歉，发生了错误，请稍后再试。',
    })
  } finally {
    chatStore.setLoading(false)
  }
}

const scrollToBottom = () => {
  const container = document.querySelector('.overflow-y-auto')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}
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

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
</style>
