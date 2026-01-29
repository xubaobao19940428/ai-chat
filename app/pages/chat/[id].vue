<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] transition-colors relative overflow-hidden">
		<!-- Header (Fixed) -->
		<header class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-light)] transition-all">
			<div class="flex items-center gap-3">
				<ModelSelector />
			</div>
			<div class="flex items-center gap-2">
				<!-- Utility buttons can go here -->
			</div>
		</header>

		<!-- Main Chat Area -->
		<div class="flex-1 overflow-y-auto px-4 pb-48 pt-20 custom-scrollbar relative z-10" ref="messagesContainer">
			<div class="max-w-[760px] mx-auto py-6">
				<TransitionGroup tag="div" name="message-list" class="space-y-10">
					<div v-for="message in currentConversation?.messages" :key="message.id" class="flex gap-4 group" :class="message.role === 'user' ? 'flex-row-reverse' : ''">
						
						<!-- Avatar -->
						<div class="flex-shrink-0 mt-1" :class="message.role === 'user' ? 'hidden' : 'block'">
							<div class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-[var(--bg-main)] border border-[var(--border-light)] shadow-sm">
								<img :src="getModelIcon(currentConversation?.model)" class="w-5 h-5 object-contain" :alt="currentConversation?.model" />
							</div>
						</div>

						<!-- Message Content -->
						<div class="flex flex-col max-w-[85%] sm:max-w-[80%]" :class="message.role === 'user' ? 'items-end' : 'items-start'">
							<!-- User Message -->
							<div v-if="message.role === 'user'" class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-5 py-3 rounded-[24px] text-[15px] font-medium leading-relaxed tracking-tight shadow-sm border border-[var(--border-light)]">
								<div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
							</div>
							
							<!-- Bot Message -->
							<div v-else class="text-[var(--text-primary)] px-1 py-1 text-[15px] leading-relaxed tracking-tight break-words font-normal">
								<div class="prose dark:prose-invert prose-neutral max-w-none break-words" v-html="renderMarkdown(message.content)"></div>
							</div>

							<!-- Time/Meta (Hidden by default, shown on hover) -->
							<div class="mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[11px] text-[var(--text-tertiary)] font-medium">
								<span>{{ message.role === 'user' ? 'You' : currentConversation?.model || 'AI' }}</span>
								<ClientOnly>
									<span>· {{ formatMessageTime(message.timestamp) }}</span>
								</ClientOnly>
							</div>
						</div>
					</div>

					<!-- Loading Indicator -->
					<div v-if="chatStore.isLoading && chatStore.loadingConversationId === currentConversationId" class="flex gap-4">
						<div class="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--border-light)] flex items-center justify-center shadow-sm overflow-hidden mt-1">
							<img :src="getModelIcon(currentConversation?.model)" class="w-5 h-5 object-contain" :alt="currentConversation?.model" />
						</div>
						<div class="py-2">
							<div class="flex space-x-1.5">
								<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style="animation-delay: 0s"></div>
								<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
								<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
							</div>
						</div>
					</div>
				</TransitionGroup>
			</div>
		</div>

		<!-- Floating Input Pill -->
		<div class="absolute bottom-8 left-0 right-0 z-50 px-4 pointer-events-none">
			<div class="max-w-[760px] mx-auto relative pointer-events-auto">
				<!-- Input Container -->
				<div class="bg-[var(--bg-main)] rounded-[26px] shadow-[var(--shadow-pill)] border border-[var(--border-light)] transition-all duration-300 focus-within:shadow-lg focus-within:border-[var(--text-disable)] relative p-2">
					<div class="flex flex-col">
						<textarea 
                            v-model="inputMessage" 
                            placeholder="Message..." 
                            rows="1" 
                            class="w-full px-4 py-3 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none resize-none max-h-48 overflow-y-auto text-[15px] font-medium leading-relaxed" 
                            :disabled="chatStore.isLoading" 
                            @keydown.enter.exact.prevent="sendMessage" 
                            @keydown.enter.shift.exact="inputMessage += '\n'" 
                            @input="autoResize" 
                            ref="textareaRef"
                        ></textarea>

						<div class="flex items-center justify-between px-2 pb-1">
							<div class="flex items-center gap-1">
                                <!-- Attach Button -->
                                <button class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5v14"></path>
                                    </svg>
                                </button>
                                <!-- Web Search Toggle (Example) -->
								<button class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                                        <path d="M2 12h20"></path>
                                    </svg>
								</button>
                                <!-- Parameters Popover -->
                                <Popover class="relative" v-slot="{ open }">
                                    <PopoverButton class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors" :class="{ 'text-[var(--text-primary)] bg-[var(--bg-hover)]': open }">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </PopoverButton>
                                    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-2 opacity-0">
                                        <PopoverPanel class="absolute bottom-full left-0 mb-3 z-50 w-80 bg-[var(--bg-main)] rounded-2xl shadow-[var(--shadow-card)] border border-[var(--border-light)] overflow-hidden">
                                            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
                                                <span class="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Parameters</span>
                                                <button @click="resetParams" class="text-[11px] text-[var(--text-blue)] hover:underline font-semibold">Reset</button>
                                            </div>
                                            <ModelParameters :model-input="modelStore.selectedModel?.model_input" :values="currentConversation?.params || {}" @update:values="updateParams" />
                                        </PopoverPanel>
                                    </Transition>
                                </Popover>
							</div>
                            
                            <!-- Send Button -->
							<button 
                                @click="sendMessage" 
                                :disabled="!inputMessage.trim() || chatStore.isLoading" 
                                class="flex items-center justify-center w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full transition-transform active:scale-90 disabled:opacity-20 disabled:scale-100 dark:bg-[var(--text-white)] dark:text-[var(--bg-main)]"
                            >
								<svg v-if="!chatStore.isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="m5 12 7-7 7 7"></path>
									<path d="M12 19V5"></path>
								</svg>
								<div v-else class="w-4 h-4 border-2 border-[var(--bg-main)]/30 border-t-[var(--bg-main)] rounded-full animate-spin"></div>
							</button>
						</div>
					</div>
				</div>

				<!-- Suggestions -->
				<div v-if="currentConversation?.messages.length === 0" class="mt-6 flex flex-wrap justify-center gap-2">
					<button v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 3)" :key="suggestion.id" @click="handleApplyPrompt(suggestion)" class="flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded-full border border-[var(--border-light)] transition-all text-sm font-medium shadow-sm active:scale-95">
						<span class="opacity-70 text-xs">{{ suggestion.icon }}</span>
						<span>{{ suggestion.label }}</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, h } from 'vue'
import { useRoute } from 'vue-router'
import { fetchChatStream } from '../../utils/api'
import { renderMarkdown } from '../../utils/markdown'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '../../utils/prompts'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { useConversationStore } from '../../stores/conversation'
import { useChatStore } from '../../stores/chat'
import { useModelStore } from '../../stores/models'

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
	const id = (modelId || '').toLowerCase()
    const model = modelStore.models.find((m) => m.model === modelId)
    const provider = (model?.provider || '').toLowerCase()
    
    if (provider.includes('openai') || id.includes('gpt') || id.includes('o1')) return '/icons/openai.svg'
    if (provider.includes('google') || id.includes('gemini')) return '/icons/gemini.svg'
    if (provider.includes('anthropic') || id.includes('claude')) return '/icons/anthropic.svg'
    if (provider.includes('deepseek')) return '/icons/deepseek.svg'
    if (provider.includes('meta') || id.includes('llama')) return '/icons/meta.svg'
    if (provider.includes('zhipu') || id.includes('glm') || id.includes('chatglm')) return '/icons/zhipu.svg'
    if (provider.includes('bytedance') || id.includes('doubao')) return '/icons/doubao.svg'
    if (provider.includes('xai') || id.includes('grok')) return '/icons/grok.svg'
    if (provider.includes('moonshot') || id.includes('kimi')) return '/icons/kimi.svg'
    if (id.includes('fastgpt')) return '/icons/fastgpt.svg'
    
    return '/icons/openai.svg'
}

const formatMessageTime = (timestamp?: number) => {
	if (!timestamp) return ''
	const date = new Date(timestamp * 1000)
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const updateParams = (params: Record<string, any>) => {
	if (currentConversationId.value) {
		conversationStore.updateModelParams(currentConversationId.value, params)
	}
}

const resetParams = () => {
	if (currentConversationId.value) {
		conversationStore.updateModelParams(currentConversationId.value, {})
	}
}

const handleApplyPrompt = (suggestion: PromptSuggestion) => {
	inputMessage.value = suggestion.prompt
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

watch(
	() => currentConversationId.value,
	async (newId) => {
		if (newId) {
			await conversationStore.switchConversation(newId)
			if (currentConversation.value) {
				modelStore.selectModel(currentConversation.value.model || '')
			}
			nextTick(() => scrollToBottom())
		}
	},
)

watch(
	() => currentConversation.value?.messages.length,
	() => {
		nextTick(() => scrollToBottom())
	},
)

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

const sendMessage = async () => {
	if (!inputMessage.value.trim() || chatStore.isLoading || !currentConversation.value) return

	const conversationId = currentConversation.value.id
	const model = currentConversation.value.model || 'gpt-4o-mini'
	const userMessage = inputMessage.value.trim()
	inputMessage.value = ''
	if (textareaRef.value) textareaRef.value.style.height = 'auto'

	try {
		const messages = currentConversation.value.messages.map((msg) => ({
			role: msg.role as any,
			content: msg.content,
		}))

		conversationStore.addMessage(conversationId, {
			role: 'user',
			content: userMessage,
		})

		conversationStore.addMessage(conversationId, {
			role: 'assistant',
			content: '',
		})

		const modelInput = modelStore.selectedModel?.model_input
		const modelDefaults: Record<string, any> = {}
		if (modelInput) {
			Object.entries(modelInput.fields).forEach(([k, f]) => {
				modelDefaults[k] = (f as any).default
			})
		}

		const userParams = currentConversation.value.params || {}
		const mergedParams = { ...modelDefaults, ...userParams }
		const options: Record<string, any> = {}
		Object.entries(mergedParams).forEach(([k, v]) => {
			if (v !== null) options[k] = v
		})

		await fetchChatStream({
			message: userMessage,
			messages,
			model,
			options: {
				...options,
				context: {
					conversation_id: conversationId,
					character_id: currentConversation.value.characterId,
					max_history: 20,
				},
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
			},
		})
	} catch (error) {
		console.error(error)
		conversationStore.updateLastMessage(conversationId, '\n[Error: Failed to start stream]', true)
		chatStore.setLoading(false)
	}
}
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

.message-list-enter-active,
.message-list-leave-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-list-enter-from,
.message-list-leave-to {
	opacity: 0;
	transform: translateY(10px);
}

.prose {
    /* Improve prose readability */
	@apply dark:text-[var(--text-primary)] leading-relaxed;
}
</style>
