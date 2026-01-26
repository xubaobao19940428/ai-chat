<template>
    <div class="flex-1 flex flex-col overflow-hidden bg-[#f8f9fa] dark:bg-[#050505] transition-colors relative">
        <!-- Background Decoration -->
        <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <!-- 聊天内容区域 -->
        <div class="flex-1 overflow-y-auto px-4 pb-60 pt-4 custom-scrollbar relative z-10" ref="messagesContainer">
            <div class="max-w-3xl mx-auto py-6">
                <TransitionGroup 
                    tag="div" 
                    name="message-list" 
                    class="space-y-8"
                >
                    <div v-for="message in currentConversation?.messages" :key="message.id" class="flex gap-4"
                        :class="message.role === 'user' ? 'flex-row-reverse' : ''">
                        <!-- Avatar -->
                        <div :class="[
                            'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-transform duration-300 hover:scale-110 premium-shadow',
                            message.role === 'user'
                                ? 'bg-indigo-600 shadow-indigo-200 dark:shadow-none bg-gradient-to-br from-indigo-500 to-indigo-700 text-white'
                                : 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-100 dark:border-[#2a2a2a]'
                        ]">
                            <span v-if="message.role === 'user'">U</span>
                            <span v-else class="text-base">{{ getModelIcon(currentConversation?.model) }}</span>
                        </div>

                        <!-- Message Content -->
                        <div class="flex flex-col max-w-[85%] sm:max-w-[75%]" :class="message.role === 'user' ? 'items-end' : 'items-start'">
                            <div :class="[
                                'rounded-2xl px-5 py-3.5 transition-all duration-300 premium-shadow',
                                message.role === 'user'
                                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-[#111111] text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-[#222222] rounded-tl-none'
                            ]">
                                <div v-if="message.role === 'user'"
                                    class="whitespace-pre-wrap text-sm leading-relaxed break-words font-medium">{{ message.content
                                    }}</div>
                                <div v-else class="prose dark:prose-invert prose-sm max-w-none break-words leading-relaxed"
                                    v-html="renderMarkdown(message.content)"></div>
                            </div>
                            
                            <!-- Message Info/Actions (Optional: add time or copy button) -->
                            <div class="mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 text-[10px] text-gray-400 font-medium">
                                <ClientOnly>
                                    <span>{{ formatMessageTime(message.timestamp) }}</span>
                                </ClientOnly>
                            </div>
                        </div>
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="chatStore.isLoading && chatStore.loadingConversationId === currentConversationId"
                        class="flex gap-4">
                        <div
                            class="flex-shrink-0 w-9 h-9 rounded-xl bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-100 dark:border-[#222222] flex items-center justify-center text-base premium-shadow">
                            {{ getModelIcon(currentConversation?.model) }}
                        </div>
                        <div class="bg-white dark:bg-[#111111] border border-gray-100 dark:border-[#222222] rounded-2xl px-5 py-4 premium-shadow">
                            <div class="flex space-x-1.5">
                                <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
                                    style="animation-delay: 0s"></div>
                                <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
                                    style="animation-delay: 0.15s"></div>
                                <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
                                    style="animation-delay: 0.3s"></div>
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
                <div class="h-6"></div>
            </div>
        </div>

        <!-- 底部输入框 (Premium Floating Design) -->
        <div class="absolute bottom-6 left-0 right-0 z-30 pointer-events-none">
            <div class="max-w-3xl mx-auto px-4 sm:px-6">
                <div class="pointer-events-auto transform transition-all duration-500 ease-out hover:translate-y-[-2px]">
                    <div class="relative group">
                         <!-- Glowing Backdrop -->
                        <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-1000 group-hover:duration-200"></div>
                        
                        <!-- Main Container -->
                        <div class="relative glass-effect dark:bg-[#0a0a0a]/80 backdrop-blur-2xl p-2 rounded-[1.8rem] shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] border border-white/60 dark:border-white/10 ring-1 ring-white/50 dark:ring-white/5">
                            <div class="relative bg-white/50 dark:bg-black/40 rounded-[1.4rem] transition-all duration-300 border border-white/40 dark:border-white/5">
                                <!-- Input Area -->
                                <div class="flex flex-col">
                                    <textarea v-model="inputMessage" placeholder="Ask anything..." rows="1"
                                        class="w-full px-6 pt-5 pb-3 bg-transparent text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none resize-none max-h-48 overflow-y-auto text-[15px] font-medium leading-relaxed tracking-wide"
                                        :disabled="chatStore.isLoading" @keydown.enter.exact.prevent="sendMessage"
                                        @keydown.enter.shift.exact="inputMessage += '\n'" @input="autoResize"
                                        ref="textareaRef"></textarea>

                                    <!-- Bottom Toolbar Row -->
                                    <div class="flex items-center justify-between px-5 pb-4 pt-2">
                                        <div class="flex items-center gap-2">
                                            <!-- Actions Group -->
                                            <div class="flex items-center p-1 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                                                <button class="p-2 text-gray-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all" title="Upload Media">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                                <button class="p-2 text-gray-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all" title="Intelligent Search">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div class="w-px h-5 bg-gray-200 dark:bg-zinc-800 mx-1"></div>
                                            <ModelSelector />
                                        </div>

                                        <div class="flex items-center">
                                            <button @click="sendMessage" :disabled="!inputMessage.trim() || chatStore.isLoading"
                                                class="group relative flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none overflow-hidden">
                                                <div class="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <svg v-if="!chatStore.isLoading" class="w-5 h-5 relative z-10 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                                <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Suggestions Pill Bar -->
                <div class="mt-4 overflow-x-auto no-scrollbar pointer-events-auto">
                    <div class="flex items-center gap-2 justify-center pb-2">
                        <button
                            v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 4)"
                            :key="suggestion.id"
                            @click="handleApplyPrompt(suggestion)"
                            class="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-700 backdrop-blur-md text-gray-600 dark:text-zinc-300 rounded-full border border-white/50 dark:border-white/5 transition-all text-[11px] font-semibold hover:-translate-y-0.5 active:scale-95"
                        >
                            <span class="text-xs opacity-70">{{ suggestion.icon }}</span>
                            <span>{{ suggestion.label }}</span>
                        </button>
                    </div>
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
    const provider = (model.provider || '').toLowerCase()
    if (provider.includes('openai')) return '🤖'
    if (provider.includes('google')) return '💎'
    if (provider.includes('anthropic')) return '🧠'
    if (provider.includes('deepseek')) return '🐋'
    return '🌟'
}

const formatMessageTime = (timestamp?: number) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

onMounted(async () => {
    if (currentConversationId.value) {
        await conversationStore.switchConversation(currentConversationId.value)
        if (currentConversation.value) {
            modelStore.selectModel(currentConversation.value.model || '')
            nextTick(() => scrollToBottom())
        }
    }
})

watch(() => currentConversationId.value, async (newId) => {
    if (newId) {
        await conversationStore.switchConversation(newId)
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
            message: userMessage,
            messages,
            model,
            options: {
                context: {
                    conversation_id: conversationId,
                    character_id: currentConversation.value.characterId,
                    max_history: 20
                }
            },
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
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.2);
    border-radius: 10px;
}

/* Message List Animations */
.message-list-enter-active,
.message-list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-list-enter-from,
.message-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.message-list-move {
  transition: transform 0.4s ease;
}
</style>
