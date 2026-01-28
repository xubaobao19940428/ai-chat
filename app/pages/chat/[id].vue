<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">
		<!-- Main Chat Area -->
		<div class="flex-1 overflow-y-auto px-4 pb-60 pt-4 custom-scrollbar relative z-10" ref="messagesContainer">
			<div class="max-w-3xl mx-auto py-6">
				<TransitionGroup tag="div" name="message-list" class="space-y-8">
					<div v-for="message in currentConversation?.messages" :key="message.id" class="flex gap-4" :class="message.role === 'user' ? 'flex-row-reverse' : ''">
						<!-- Avatar -->
						<div :class="['flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-transform duration-300 hover:scale-110 shadow-[var(--shadow-XS)] overflow-hidden', message.role === 'user' ? 'bg-[var(--Button-primary-black)] text-[var(--text-onblack)]' : 'bg-[var(--background-white-main)] text-[var(--text-primary)] border border-[var(--border-main)]']">
							<span v-if="message.role === 'user'" class="font-bold text-[10px]">U</span>
							<img v-else :src="getModelIcon(currentConversation?.model)" class="w-4 h-4 object-contain" :alt="currentConversation?.model" />
						</div>

						<!-- Message Content -->
						<div class="flex flex-col max-w-[85%] sm:max-w-[80%]" :class="message.role === 'user' ? 'items-end' : 'items-start'">
							<div :class="['rounded-2xl px-5 py-3 transition-all duration-300', message.role === 'user' ? 'bg-[var(--background-white-main)] text-[var(--text-primary)] border border-[var(--border-main)] shadow-[var(--shadows-drop-2)]' : 'bg-[var(--background-white-main)] text-[var(--text-primary)] border border-[var(--border-main)] shadow-[var(--shadows-drop-2)]']">
								<div v-if="message.role === 'user'" class="whitespace-pre-wrap text-[14px] font-medium leading-relaxed break-words tracking-tight">{{ message.content }}</div>
								<div v-else class="prose dark:prose-invert prose-sm max-w-none break-words leading-relaxed font-medium tracking-tight" v-html="renderMarkdown(message.content)"></div>
							</div>
							<!-- Time -->
							<div class="mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-tighter">
								<ClientOnly>
									<span>{{ formatMessageTime(message.timestamp) }}</span>
								</ClientOnly>
							</div>
						</div>
					</div>

					<!-- Loading Indicator -->
					<div v-if="chatStore.isLoading && chatStore.loadingConversationId === currentConversationId" class="flex gap-4">
						<div class="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--background-white-main)] text-[var(--text-primary)] border border-[var(--border-main)] flex items-center justify-center text-base shadow-[var(--shadow-XS)] overflow-hidden">
							<img :src="getModelIcon(currentConversation?.model)" class="w-4 h-4 object-contain" :alt="currentConversation?.model" />
						</div>
						<div class="bg-[var(--background-white-main)] border border-[var(--border-main)] rounded-2xl px-5 py-4 shadow-[var(--shadows-drop-2)]">
							<div class="flex space-x-1.5">
								<div class="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full animate-bounce" style="animation-delay: 0s"></div>
								<div class="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
								<div class="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
							</div>
						</div>
					</div>
				</TransitionGroup>
				<div class="h-6"></div>
			</div>
		</div>

		<!-- Input Area -->
		<div class="absolute bottom-6 left-0 right-0 z-50 pointer-events-none">
			<div class="max-w-3xl mx-auto px-4 sm:px-6">
				<div class="pointer-events-auto relative">
					<!-- Integrated Card -->
					<div class="bg-[var(--background-white-main)] rounded-[22px] shadow-[var(--shadows-drop-3)] border border-[var(--border-main)] overflow-visible transition-all duration-300 focus-within:shadow-[var(--shadows-drop-4)] focus-within:border-[var(--border-input-active)]">
						<div class="flex flex-col">
							<textarea v-model="inputMessage" placeholder="Ask anything..." rows="1" class="w-full px-5 pt-4 pb-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-disable)] focus:outline-none resize-none max-h-48 overflow-y-auto text-[15px] font-medium leading-relaxed tracking-tight" :disabled="chatStore.isLoading" @keydown.enter.exact.prevent="sendMessage" @keydown.enter.shift.exact="inputMessage += '\n'" @input="autoResize" ref="textareaRef"></textarea>

							<div class="flex items-center justify-between px-4 pb-3 pt-1">
								<div class="flex items-center gap-1.5">
									<ModelSelector />
									<div class="w-px h-4 bg-[var(--border-main)] mx-1"></div>
									<div class="flex items-center gap-0.5">
										<Popover class="relative" v-slot="{ open }">
											<PopoverButton class="p-2 text-[var(--icon-secondary)] hover:text-[var(--icon-primary)] hover:bg-[var(--fill-tsp-white-main)] rounded-xl transition-all focus:outline-none" :class="{ 'text-[var(--icon-primary)] bg-[var(--fill-tsp-white-main)]': open }">
												<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
													<path
														d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
													<circle cx="12" cy="12" r="3"></circle>
												</svg>
											</PopoverButton>
											<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
												<PopoverPanel class="absolute bottom-full left-0 mb-3 z-50 w-96 sm:w-[500px] bg-[var(--background-white-main)] rounded-2xl shadow-[var(--shadow-L)] border border-[var(--border-main)]">
													<div class="p-1 px-3 py-2 border-b border-[var(--border-main)] flex items-center justify-between">
														<span class="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Model Settings</span>
														<button @click="resetParams" class="text-[10px] text-[var(--text-blue)] hover:underline font-bold">Reset</button>
													</div>
													<ModelParameters :model-input="modelStore.selectedModel?.model_input" :values="currentConversation?.params || {}" @update:values="updateParams" />
												</PopoverPanel>
											</Transition>
										</Popover>
										<div class="w-px h-4 bg-[var(--border-main)] mx-1"></div>
										<button class="p-2 text-[var(--icon-secondary)] hover:text-[var(--icon-primary)] hover:bg-[var(--fill-tsp-white-main)] rounded-xl transition-all">
											<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
											</svg>
										</button>
									</div>
								</div>
								<button @click="sendMessage" :disabled="!inputMessage.trim() || chatStore.isLoading" class="flex items-center justify-center w-8 h-8 bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-full shadow-[var(--shadow-S)] transition-all active:scale-95 disabled:opacity-30 disabled:shadow-none">
									<svg v-if="!chatStore.isLoading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
										<path d="m5 12 7-7 7 7"></path>
										<path d="M12 19V5"></path>
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
						<button v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 4)" :key="suggestion.id" @click="handleApplyPrompt(suggestion)" class="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[var(--fill-tsp-white-main)] hover:bg-[var(--fill-tsp-white-light)] text-[var(--text-primary)] rounded-full border border-[var(--border-main)] transition-all text-xs font-medium shadow-[var(--shadow-XS)]">
							<span class="opacity-70">{{ suggestion.icon }}</span>
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
	if (id.includes('gpt')) return '/icons/openai.svg'
	if (id.includes('gemini')) return '/icons/gemini.svg'
	if (id.includes('claude') || id.includes('anthropic')) return '/icons/anthropic.svg'
	if (id.includes('deepseek')) return '/icons/deepseek.svg'
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

.message-list-move {
	transition: transform 0.4s ease;
}

.prose {
	@apply dark:text-[var(--text-primary)];
}
</style>
