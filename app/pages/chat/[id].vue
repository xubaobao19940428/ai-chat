<template>
    <div class="flex-1 flex flex-col overflow-hidden bg-[#fcfbfb] dark:bg-[#000000] transition-colors">
        <!-- 聊天内容区域 -->
        <div class="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 sm:pb-6" ref="messagesContainer">
            <div class="max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
                <div class="space-y-6">
                    <div v-for="message in currentConversation?.messages" :key="message.id" class="group flex gap-4"
                        :class="message.role === 'user' ? 'flex-row-reverse' : ''">
                        <!-- Avatar -->
                        <div :class="[
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                            message.role === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2a2a2a]'
                        ]">
                            <span v-if="message.role === 'user'">U</span>
                            <span v-else class="text-sm">{{ getModelIcon(currentConversation?.model) }}</span>
                        </div>

                        <!-- Message Bubble -->
                        <div class="flex-1 min-w-0 pt-1">
                            <div :class="[
                                'rounded-2xl px-4 py-3',
                                message.role === 'user'
                                    ? 'bg-indigo-600 dark:bg-[#1a1a1a] text-white ml-auto'
                                    : 'text-gray-900 dark:text-gray-100'
                            ]" :style="message.role === 'user' ? 'max-width: 85%; margin-left: auto;' : 'max-width: 100%;'">
                                <div v-if="message.role === 'user'"
                                    class="whitespace-pre-wrap text-sm leading-relaxed break-words">{{ message.content
                                    }}</div>
                                <div v-else class="prose prose-invert prose-sm max-w-none break-words leading-relaxed"
                                    v-html="renderMarkdown(message.content)"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="chatStore.isLoading && chatStore.loadingConversationId === currentConversationId"
                        class="flex gap-4">
                        <div
                            class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2a2a2a] flex items-center justify-center text-sm">
                            {{ getModelIcon(currentConversation?.model) }}
                        </div>
                        <div class="px-4 py-3">
                            <div class="flex space-x-1.5">
                                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style="animation-delay: 0s"></div>
                                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style="animation-delay: 0.15s"></div>
                                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style="animation-delay: 0.3s"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-6"></div>
            </div>
        </div>

        <!-- 底部输入框 -->
        <div
            class="flex-shrink-0 bg-[#fcfbfb] dark:bg-[#000000] border-t border-gray-200 dark:border-[#1a1a1a] pb-6 pt-2 transition-colors">
            <div class="max-w-3xl mx-auto px-4">
                <div
                    class="relative bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] focus-within:border-indigo-500 dark:focus-within:border-[#333333] transition-colors">
                    <textarea v-model="inputMessage" placeholder="Type a message..." rows="1"
                        class="w-full px-12 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none resize-none max-h-32 overflow-y-auto text-base"
                        :disabled="chatStore.isLoading" @keydown.enter.exact.prevent="sendMessage"
                        @keydown.enter.shift.exact="inputMessage += '\n'" @input="autoResize"
                        ref="textareaRef"></textarea>

                    <!-- Attachment Icon -->
                    <button
                        class="absolute left-3 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>

                    <!-- Bottom Actions -->
                    <div class="flex items-center justify-between px-3 pb-3">
                        <div class="flex items-center gap-2">
                            <!-- Actions Buttons (Image/Search) -->
                            <button
                                class="flex items-center gap-2 px-3 py-2 sm:py-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs font-medium">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="hidden sm:inline">Create an image</span>
                            </button>
                        </div>

                        <div class="flex items-center gap-2">
                            <div class="relative">
                                <select v-model="selectedModel" @change="handleModelChange"
                                    class="appearance-none pl-3 pr-8 py-2 sm:py-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 rounded-lg focus:outline-none text-xs font-medium cursor-pointer max-w-[120px] sm:max-w-none truncate">
                                    <option v-for="model in AI_MODELS" :key="model.id" :value="model.id">
                                        {{ model.name }}
                                    </option>
                                </select>
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <button @click="sendMessage" :disabled="!inputMessage.trim() || chatStore.isLoading"
                                class="p-2 bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#222222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 10l7-7m0 0l7 7m-7-7v18" />
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
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { sendChatMessage } from '~/utils/api'
import { AI_MODELS, getModelById } from '~/utils/models'
import { renderMarkdown } from '~/utils/markdown'

const route = useRoute()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const inputMessage = ref('')
const selectedModel = ref('gpt-4o-mini')

const currentConversationId = computed(() => route.params.id as string)
const currentConversation = computed(() => conversationStore.currentConversation)

const getModelIcon = (modelId?: string) => {
    return getModelById(modelId || '')?.icon || '🤖'
}

onMounted(() => {
    if (currentConversationId.value) {
        conversationStore.switchConversation(currentConversationId.value)
        if (currentConversation.value) {
            selectedModel.value = currentConversation.value.model
            nextTick(() => scrollToBottom())
        }
    }
})

watch(() => currentConversationId.value, (newId) => {
    if (newId) {
        conversationStore.switchConversation(newId)
        if (currentConversation.value) {
            selectedModel.value = currentConversation.value.model
        }
        nextTick(() => scrollToBottom())
    }
})

watch(() => currentConversation.value?.messages.length, () => {
    nextTick(() => scrollToBottom())
})

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const autoResize = () => {
    nextTick(() => {
        if (textareaRef.value) {
            textareaRef.value.style.height = 'auto'
            textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 128)}px`
        }
    })
}

const handleModelChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    selectedModel.value = target.value
    if (currentConversationId.value) {
        conversationStore.switchModel(currentConversationId.value, selectedModel.value)
    }
}

const sendMessage = async () => {
    if (!inputMessage.value.trim() || chatStore.isLoading || !currentConversation.value) return

    const conversationId = currentConversation.value.id
    const userMessage = inputMessage.value.trim()
    inputMessage.value = ''
    if (textareaRef.value) textareaRef.value.style.height = 'auto'

    conversationStore.addMessage(conversationId, {
        role: 'user',
        content: userMessage
    })

    chatStore.setLoading(true, conversationId)

    try {
        const messages = currentConversation.value.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }))

        const response = await sendChatMessage(messages, currentConversation.value.model)

        conversationStore.addMessage(conversationId, {
            role: 'assistant',
            content: response.message || 'Error.'
        })
    } catch (error) {
        console.error(error)
        conversationStore.addMessage(conversationId, {
            role: 'assistant',
            content: 'Error sending message.'
        })
    } finally {
        chatStore.setLoading(false)
    }
}
</script>

<style scoped>
/* Scrollbar styles same as before */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}
</style>
