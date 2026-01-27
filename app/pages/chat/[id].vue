<template>
	<div class="flex-1 flex flex-col h-full bg-[#f8f9fa] dark:bg-[#050505] transition-colors relative overflow-hidden">
		<!-- Background Decoration -->
		<div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
		<div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

		<!-- 聊天内容区域 -->
		<div class="flex-1 overflow-y-auto px-4 pb-60 pt-4 custom-scrollbar relative z-10" ref="messagesContainer">
			<div class="max-w-3xl mx-auto py-6">
				<TransitionGroup tag="div" name="message-list" class="space-y-8">
					<div v-for="message in currentConversation?.messages" :key="message.id" class="flex gap-4" :class="message.role === 'user' ? 'flex-row-reverse' : ''">
						<!-- Avatar -->
						<div :class="['flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-transform duration-300 hover:scale-110 premium-shadow overflow-hidden', message.role === 'user' ? 'bg-indigo-600 shadow-indigo-200 dark:shadow-none bg-gradient-to-br from-indigo-500 to-indigo-700 text-white' : 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-100 dark:border-[#2a2a2a]']">
							<span v-if="message.role === 'user'">U</span>
							<img v-else :src="getModelIcon(currentConversation?.model)" class="w-5 h-5 object-contain dark:invert" :alt="currentConversation?.model" />
						</div>

						<!-- Message Content -->
						<div class="flex flex-col max-w-[85%] sm:max-w-[75%]" :class="message.role === 'user' ? 'items-end' : 'items-start'">
							<div :class="['rounded-2xl px-5 py-3.5 transition-all duration-300 premium-shadow', message.role === 'user' ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none' : 'bg-white dark:bg-[#111111] text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-[#222222] rounded-tl-none']">
								<div v-if="message.role === 'user'" class="whitespace-pre-wrap text-sm leading-relaxed break-words font-medium">{{ message.content }}</div>
								<div v-else class="prose dark:prose-invert prose-sm max-w-none break-words leading-relaxed" v-html="renderMarkdown(message.content)"></div>
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
					<div v-if="chatStore.isLoading && chatStore.loadingConversationId === currentConversationId" class="flex gap-4">
						<div class="flex-shrink-0 w-9 h-9 rounded-xl bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-100 dark:border-[#222222] flex items-center justify-center text-base premium-shadow overflow-hidden">
							<img :src="getModelIcon(currentConversation?.model)" class="w-5 h-5 object-contain dark:invert" :alt="currentConversation?.model" />
						</div>
						<div class="bg-white dark:bg-[#111111] border border-gray-100 dark:border-[#222222] rounded-2xl px-5 py-4 premium-shadow">
							<div class="flex space-x-1.5">
								<div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
								<div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
								<div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
							</div>
						</div>
					</div>
				</TransitionGroup>
				<div class="h-6"></div>
			</div>
		</div>

		<!-- 底部输入框 (LobeChat Inspired) -->
		<div class="absolute bottom-6 left-0 right-0 z-50 pointer-events-none">
			<div class="max-w-3xl mx-auto px-4 sm:px-6">
				<div class="pointer-events-auto relative">
					<!-- Integrated Card -->
					<div class="glass-effect dark:bg-[#0f0f0f]/90 backdrop-blur-3xl rounded-[1.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-white/60 dark:border-white/10 overflow-visible transition-all duration-300 ring-1 ring-black/5 dark:ring-white/5">
						<!-- Input Section -->
						<div class="flex flex-col">
							<!-- Textarea -->
							<textarea v-model="inputMessage" placeholder="Ask anything..." rows="1" class="w-full px-5 pt-4 pb-1 bg-transparent text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none resize-none max-h-48 overflow-y-auto text-[15px] font-medium leading-relaxed" :disabled="chatStore.isLoading" @keydown.enter.exact.prevent="sendMessage" @keydown.enter.shift.exact="inputMessage += '\n'" @input="autoResize" ref="textareaRef"></textarea>

							<!-- Integrated Toolbar Row -->
							<div class="flex items-center justify-between px-4 pb-3 pt-1">
								<div class="flex items-center gap-1.5">
									<ModelSelector />

									<div class="w-px h-4 bg-gray-200 dark:bg-zinc-800 mx-1"></div>

									<!-- Tool Buttons -->
									<div class="flex items-center gap-0.5">
										<!-- Model Params (Equalizer) -->
										<Popover class="relative" v-slot="{ open }">
											<PopoverButton class="p-2 text-gray-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all focus:outline-none" :class="{ 'text-indigo-600 bg-gray-100 dark:bg-white/5': open }" title="Model Settings">
												<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders-horizontal" aria-hidden="true">
													<path d="M10 5H3"></path>
													<path d="M12 19H3"></path>
													<path d="M14 3v4"></path>
													<path d="M16 17v4"></path>
													<path d="M21 12h-9"></path>
													<path d="M21 19h-5"></path>
													<path d="M21 5h-7"></path>
													<path d="M8 10v4"></path>
													<path d="M8 12H3"></path>
												</svg>
											</PopoverButton>

											<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
												<PopoverPanel class="absolute bottom-full left-0 mb-3 z-50 w-96 sm:w-[500px] bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 border border-gray-100 dark:border-white/5 backdrop-blur-xl">
													<div class="p-1 px-3 py-2 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
														<span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Model Settings</span>
														<button @click="resetParams" class="text-[10px] text-indigo-500 hover:underline font-bold">Reset</button>
													</div>
													<ModelParameters :model-input="modelStore.selectedModel?.model_input" :values="currentConversation?.params || {}" @update:values="updateParams" />
												</PopoverPanel>
											</Transition>
										</Popover>

										<div class="w-px h-4 bg-gray-200 dark:bg-zinc-800 mx-1"></div>

										<button class="p-2 text-gray-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all" title="Upload Media">
											<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</button>
										<button class="p-2 text-gray-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all" title="Intelligent Search">
											<svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
											</svg>
										</button>
									</div>
								</div>

								<!-- Send Button -->
								<button @click="sendMessage" :disabled="!inputMessage.trim() || chatStore.isLoading" class="group flex items-center justify-center w-9 h-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none">
									<svg v-if="!chatStore.isLoading" class="w-4.5 h-4.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7" />
									</svg>
									<div v-else class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Suggestions Pill Bar -->
				<div class="mt-4 overflow-x-auto no-scrollbar pointer-events-auto">
					<div class="flex items-center gap-2 justify-center pb-2">
						<button v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 4)" :key="suggestion.id" @click="handleApplyPrompt(suggestion)" class="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-700 backdrop-blur-md text-gray-600 dark:text-zinc-300 rounded-full border border-white/50 dark:border-white/5 transition-all text-[11px] font-semibold hover:-translate-y-0.5 active:scale-95">
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
import { ref, computed, onMounted, watch, nextTick, h } from 'vue'
import { useRoute } from 'vue-router'
import { fetchChatStream } from '~/utils/api'
import { renderMarkdown } from '~/utils/markdown'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '~/utils/prompts'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

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

// Helper to get contextual icons based on parameter keys
const getParamIcon = (key: string, type: 'min' | 'max') => {
	const k = key.toLowerCase()

	// frequency_penalty (Vocabulary Richness)
	if (k.includes('frequency_penalty')) {
		return type === 'min' ? () => h('span', '📄') : () => h('span', '📖')
	}
	// presence_penalty (Expression Divergence)
	if (k.includes('presence_penalty')) {
		return type === 'min' ? () => h('span', '🔄') : () => h('span', '⚛️')
	}
	// temperature (Creativity Level)
	if (k.includes('temperature')) {
		return type === 'min' ? () => h('span', '❄️') : () => h('span', '✨')
	}
	// top_p (Openness to Ideas)
	if (k.includes('top_p')) {
		return type === 'min' ? () => h('span', '🎯') : () => h('span', '🌈')
	}

	// Generic fallback
	return type === 'min' ? () => h('span', '○') : () => h('span', '●')
}

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

watch(
	() => modelStore.selectedModelId,
	(newId) => {
		if (newId && currentConversationId.value) {
			conversationStore.switchModel(currentConversationId.value, newId)
		}
	},
)

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
		content: userMessage,
	})

	// Add empty assistant message for streaming
	conversationStore.addMessage(conversationId, {
		role: 'assistant',
		content: '',
	})

	chatStore.setLoading(true, conversationId)

	try {
		const messages = currentConversation.value.messages.slice(0, -1).map((msg) => ({
			role: msg.role as any,
			content: msg.content,
		}))

		// Prepare Model Parameters
		const modelInput = modelStore.selectedModel?.model_input
		const modelDefaults: Record<string, any> = {}
		if (modelInput) {
			Object.entries(modelInput.fields).forEach(([k, f]) => {
				modelDefaults[k] = (f as any).default
			})
		}

		const userParams = currentConversation.value.params || {}
		const mergedParams = { ...modelDefaults, ...userParams }

		// Filter out nulls (explicitly unchecked)
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
