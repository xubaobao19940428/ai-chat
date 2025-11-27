<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-white">
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
      <!-- 如果无消息，显示欢迎界面 -->
      <div v-if="!conversationStore.currentConversation || conversationStore.currentConversation.messages.length === 0" class="max-w-4xl mx-auto">
        <!-- 问候语 -->
        <div class="text-center mb-6 sm:mb-8">
          <div class="text-4xl sm:text-5xl mb-3 sm:mb-4">🌅</div>
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Good night, 钱诚</h2>
          <p class="text-sm sm:text-base text-gray-600">How can I help you today?</p>
        </div>

        <!-- 输入框区域 -->
        <div class="max-w-3xl mx-auto mb-6">
          <div class="relative">
            <textarea
              v-model="inputMessage"
              placeholder="Type a message..."
              rows="1"
              class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 resize-none max-h-32 overflow-y-auto text-sm bg-white"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="inputMessage += '\n'"
              @input="autoResize"
              ref="textareaRef"
            ></textarea>
            <button
              @click="sendMessage"
              :disabled="!inputMessage.trim() || chatStore.isLoading"
              class="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <!-- 功能按钮行（移动端隐藏部分，桌面端显示） -->
          <div class="hidden sm:flex items-center gap-2 mt-3 flex-wrap">
            <button class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Create an image</span>
            </button>
            <button class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>Search the web</span>
            </button>
            <select
              v-model="selectedModel"
              @change="handleModelChange"
              class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:border-indigo-500 text-sm cursor-pointer"
            >
              <option v-for="model in AI_MODELS" :key="model.id" :value="model.id">
                {{ model.provider }} {{ model.name }}
              </option>
            </select>
            <button class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <!-- 快捷操作按钮 -->
          <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2 mt-4 sm:flex-wrap">
            <button class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span class="truncate">Help me write</span>
            </button>
            <button class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="truncate">Learn about</span>
            </button>
            <button class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="truncate">Analyze Image</span>
            </button>
            <button class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span class="truncate">Summarize</span>
            </button>
          </div>
        </div>

        <!-- Available Models 部分 -->
        <div class="max-w-6xl mx-auto mt-8 sm:mt-12">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-xs sm:text-sm font-medium text-gray-900">Available Models</span>
            </div>
            <a href="#" class="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700">See All</a>
          </div>

          <!-- 模型卡片滚动区域 -->
          <div class="relative">
            <div class="flex gap-2 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide px-1" ref="modelsContainer">
              <div
                v-for="model in AI_MODELS"
                :key="model.id"
                :class="[
                  'flex-shrink-0 w-64 sm:w-72 lg:w-80 p-3 sm:p-4 bg-white border-2 rounded-xl cursor-pointer transition-all',
                  selectedModel === model.id
                    ? 'border-indigo-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
                @click="selectModel(model.id)"
              >
                <div class="flex items-start justify-between mb-2 sm:mb-3">
                  <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div class="text-xl sm:text-2xl flex-shrink-0">{{ model.icon }}</div>
                    <div class="min-w-0 flex-1">
                      <div class="font-semibold text-gray-900 text-sm sm:text-base truncate">{{ model.provider }} {{ model.name }}</div>
                    </div>
                  </div>
                  <span v-if="selectedModel === model.id" class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded flex-shrink-0 ml-1">Selected</span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">{{ model.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 如果有消息，显示聊天界面 -->
      <div v-else class="max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div class="space-y-3 sm:space-y-6">
          <div
            v-for="message in conversationStore.currentConversation.messages"
            :key="message.id"
            class="group flex gap-2 sm:gap-4"
            :class="message.role === 'user' ? 'flex-row-reverse' : ''"
          >
            <div
              :class="[
                'flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium',
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-purple-600 text-white'
              ]"
            >
              <span v-if="message.role === 'user'">U</span>
              <span v-else class="text-xs sm:text-sm">{{ getModelById(conversationStore.currentConversation.model)?.icon || '🤖' }}</span>
            </div>
            
            <div class="flex-1 min-w-0 pt-0.5 sm:pt-1">
              <div
                :class="[
                  'rounded-lg px-3 py-2 sm:px-4 sm:py-3',
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white ml-auto'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                ]"
                :style="message.role === 'user' ? 'max-width: 85%; margin-left: auto;' : 'max-width: 85%;'"
              >
                <p class="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">{{ message.content }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="chatStore.isLoading && chatStore.loadingConversationId === conversationStore.currentConversationId" class="flex gap-2 sm:gap-4">
            <div class="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs sm:text-sm">
              {{ getModelById(conversationStore.currentConversation.model)?.icon || '🤖' }}
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
              <div class="flex space-x-1.5">
                <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="h-6"></div>
      </div>
    </div>

    <!-- 底部输入框（当有消息时显示） -->
    <div v-if="conversationStore.currentConversation && conversationStore.currentConversation.messages.length > 0" class="border-t border-gray-200 bg-white">
      <div class="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div class="relative">
          <textarea
            v-model="inputMessage"
            placeholder="Type a message..."
            rows="1"
            class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32 overflow-y-auto text-sm bg-white"
            :disabled="chatStore.isLoading"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="inputMessage += '\n'"
            @input="autoResize"
            ref="textareaRef"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!inputMessage.trim() || chatStore.isLoading"
            class="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
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

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()

const inputMessage = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const modelsContainer = ref<HTMLElement | null>(null)
const selectedModel = ref('gpt-4o-mini')

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
