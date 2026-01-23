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
                        <div class="flex items-center gap-2">
                            <ModelSelector />
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

                <!-- Prompt Suggestions Pill Bar -->
                <div class="mt-4 overflow-x-auto no-scrollbar">
                    <div class="flex items-center gap-2 pb-1">
                        <button
                            v-for="suggestion in PROMPT_SUGGESTIONS"
                            :key="suggestion.id"
                            @click="handleApplyPrompt(suggestion)"
                            class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#222222] text-gray-600 dark:text-gray-400 rounded-full border border-gray-100 dark:border-gray-800 transition-all text-xs font-medium shadow-sm active:scale-95"
                        >
                            <span class="text-sm">{{ suggestion.icon }}</span>
                            <span>{{ suggestion.label }}</span>
                        </button>
                    </div>
                </div>

                <!-- Sub-prompts Selection -->
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform -translate-y-2 opacity-0"
                    enter-to-class="transform translate-y-0 opacity-100"
                >
                    <div v-if="activeSubPrompts.length > 0" class="mt-2 flex flex-wrap gap-2 p-3 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                        <button
                            v-for="sub in activeSubPrompts"
                            :key="sub"
                            @click="handleApplySubPrompt(sub)"
                            class="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                        >
                            {{ sub }}
                        </button>
                        <button @click="activeSubPrompts = []" class="px-2 py-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs">
                            ✕
                        </button>
                    </div>
                </Transition>

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
import { fetchChatStream } from '~/utils/api'
import { renderMarkdown } from '~/utils/markdown'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '~/utils/prompts'

const route = useRoute()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const modelStore = useModelStore()
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const inputMessage = ref('')
const activeSubPrompts = ref<string[]>([])

const currentConversationId = computed(() => route.params.id as string)
const currentConversation = computed(() => conversationStore.currentConversation)

const getModelIcon = (modelId?: string) => {
    const model = modelStore.models.find(m => m.model === modelId)
    if (!model) return '🤖'
    const provider = model.provider.toLowerCase()
    if (provider.includes('openai')) return '🤖'
    if (provider.includes('google')) return '💎'
    if (provider.includes('anthropic')) return '🧠'
    if (provider.includes('deepseek')) return '🐋'
    return '🌟'
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

onMounted(() => {
    if (currentConversationId.value) {
        conversationStore.switchConversation(currentConversationId.value)
        if (currentConversation.value) {
            modelStore.selectModel(currentConversation.value.model || '')
            nextTick(() => scrollToBottom())
        }
    }
})

watch(() => currentConversationId.value, (newId) => {
    if (newId) {
        conversationStore.switchConversation(newId)
        if (currentConversation.value) {
            modelStore.selectModel(currentConversation.value.model || '')
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

watch(() => modelStore.selectedModelId, (newId) => {
    if (newId && currentConversationId.value) {
        conversationStore.switchModel(currentConversationId.value, newId)
    }
})

const sendMessage = async () => {
    if (!inputMessage.value.trim() || chatStore.isLoading || !currentConversation.value) return

    const conversationId = currentConversation.value.id
    const model = currentConversation.value.model || 'gpt-4o-mini'
    const userMessage = inputMessage.value.trim()
    inputMessage.value = ''
    if (textareaRef.value) textareaRef.value.style.height = 'auto'

    // Add user message
    conversationStore.addMessage(conversationId, {
        role: 'user',
        content: userMessage
    })

    // Add empty assistant message for streaming
    conversationStore.addMessage(conversationId, {
        role: 'assistant',
        content: ''
    })

    chatStore.setLoading(true, conversationId)

    try {
        const messages = currentConversation.value.messages.slice(0, -1).map(msg => ({
            role: msg.role as any,
            content: msg.content
        }))

        await fetchChatStream({
            messages,
            model,
            onMessage: (content) => {
                conversationStore.updateLastMessage(conversationId, content)
            },
            onError: (error) => {
                console.error('Stream error:', error)
                conversationStore.updateLastMessage(conversationId, '\n[Error: Connection failed]', true)
            },
            onFinish: () => {
                chatStore.setLoading(false)
            }
        })
    } catch (error) {
        console.error(error)
        conversationStore.updateLastMessage(conversationId, '\n[Error: Failed to start stream]', true)
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
