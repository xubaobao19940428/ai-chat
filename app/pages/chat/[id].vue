<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] transition-colors relative overflow-hidden">
		<!-- Header (Fixed) -->
		<header class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-light)] transition-all">
			<div class="flex items-center gap-3">
				<ModelSelector position="top" />
			</div>
			<div class="flex items-center gap-2">
				<!-- Utility buttons can go here -->
			</div>
		</header>

		<!-- Main Chat Area -->
		<div class="flex-1 overflow-y-auto px-4 pb-48 pt-20 custom-scrollbar relative z-10" ref="messagesContainer">
			<div class="max-w-[840px] mx-auto py-6">
				<!-- Initial Loading State -->
				<div v-if="conversationStore.isLoading && (!currentConversation?.messages || currentConversation.messages.length === 0)" class="flex flex-col items-center justify-center py-20 space-y-4">
					<div class="w-10 h-10 border-4 border-[var(--border-light)] border-t-[var(--text-primary)] rounded-full animate-spin"></div>
					<p class="text-[var(--text-tertiary)] text-sm font-medium animate-pulse">Loading messages...</p>
				</div>

				<TransitionGroup v-else tag="div" name="message-list" class="space-y-10">
					<div v-for="message in currentConversation?.messages" :key="message.id" class="flex gap-4 group" :class="message.role === 'user' ? 'flex-row-reverse' : ''">
						<!-- Avatar -->
						<div class="flex-shrink-0 mt-1">
							<div class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-[var(--bg-main)] border border-[var(--border-light)] shadow-sm">
								<img :src="message.role === 'user' ? userStore.userInfo?.avatar || '/logo.png' : getModelIcon(currentConversation?.model)" class="w-5 h-5 object-contain" :alt="message.role" />
							</div>
						</div>

						<!-- Message Content -->
						<div class="flex flex-col max-w-[85%] sm:max-w-[80%] relative" :class="message.role === 'user' ? 'items-end' : 'items-start'">
							<!-- User Message -->
							<div v-if="message.role === 'user'" class="w-full flex justify-end">
								<!-- Edit Mode -->
								<div v-if="editingMessageId === message.id" class="w-[500px] max-w-full bg-[var(--bg-chat-bubble-user)] rounded-[24px] border border-[var(--border-light)] p-2 shadow-sm animate-in fade-in duration-200">
									<textarea v-model="editingContent" class="w-full bg-transparent border-none focus:ring-0 text-[15px] font-medium leading-relaxed px-3 py-1 resize-none custom-scrollbar min-h-[32px] max-h-48" rows="1"></textarea>
									<div class="flex justify-end gap-2 mt-1">
										<button @click="cancelEditing" class="px-3 py-1 text-xs font-semibold rounded-full hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-secondary)]">Cancel</button>
										<button @click="submitEdit" :disabled="!editingContent.trim()" class="px-4 py-1.5 text-xs font-semibold bg-[var(--text-primary)] text-[var(--bg-main)] dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity disabled:opacity-50">Send</button>
									</div>
								</div>
								<!-- View Mode -->
								<div v-else class="relative group/bubble">
									<div class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-5 py-3 rounded-[24px] text-[15px] font-medium leading-relaxed tracking-tight shadow-sm border border-[var(--border-light)]">
										<div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
									</div>

									<!-- Action bar (Hover only) -->
									<div class="absolute -top-10 right-0 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity bg-[var(--bg-main)]/80 backdrop-blur-sm border border-[var(--border-light)] rounded-lg p-1 shadow-sm">
										<button @click="copyMessage(message.content)" class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors" title="Copy">
											<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
												<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
											</svg>
										</button>
										<button @click="startEditing(message)" class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors" title="Edit">
											<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
												<path d="m15 5 4 4" />
											</svg>
										</button>
									</div>
								</div>
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
			<div class="max-w-[840px] mx-auto relative pointer-events-auto">
				<!-- Input Container -->
				<div class="bg-[var(--bg-main)] rounded-[26px] shadow-[var(--shadow-pill)] border border-[var(--border-light)] transition-all duration-300 focus-within:shadow-lg focus-within:border-[var(--text-disable)] relative p-2">
					<div class="flex flex-col">
						<editor-content :editor="editor" class="w-full max-h-48 overflow-y-auto custom-scrollbar" />

						<div class="flex items-center justify-between px-2 pb-1 bg-[var(--bg-main)]">
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
											<path
												d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
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
							<button @click="sendMessage" :disabled="!hasContent || chatStore.isLoading" class="flex items-center justify-center w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full transition-transform active:scale-90 disabled:opacity-20 disabled:scale-100 dark:bg-[var(--text-white)] dark:text-[var(--bg-main)]">
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
import { ref, computed, onMounted, watch, nextTick, h, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { fetchChatStream } from '../../utils/api'
import { renderMarkdown } from '../../utils/markdown'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '../../utils/prompts'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { useConversationStore } from '../../stores/conversation'
import { useChatStore } from '../../stores/chat'
import { useModelStore } from '../../stores/models'
import { useUserStore } from '../../stores/user'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const route = useRoute()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const modelStore = useModelStore()
const userStore = useUserStore()
const messagesContainer = ref<HTMLElement | null>(null)
const inputMessage = ref('')
const activeSubPrompts = ref<string[]>([])

// Editing state
const editingMessageId = ref<string | null>(null)
const editingContent = ref('')

const currentConversationId = computed(() => route.params.id as string)
const currentConversation = computed(() => conversationStore.currentConversation)

const editor = useEditor({
	content: '',
	extensions: [
		StarterKit.configure({
			heading: false,
			bulletList: false,
			orderedList: false,
			blockquote: false,
			codeBlock: false,
			horizontalRule: false,
		}),
		Placeholder.configure({
			placeholder: 'Ask anything...',
		}),
	],
	editorProps: {
		attributes: {
			class: 'prose dark:prose-invert focus:outline-none min-h-[44px] px-4 py-3 text-[15px] font-medium leading-relaxed text-[var(--text-primary)]',
		},
	},
	onUpdate: ({ editor }) => {
		inputMessage.value = editor.getText()
	},
})

// Custom key handler for Enter
const handleEnter = (e: KeyboardEvent) => {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault()
		sendMessage()
	}
}

// Add event listener to editor DOM element when mounted
watch(
	() => editor.value,
	(newEditor) => {
		if (newEditor) {
			// Tiptap doesn't expose raw keydown easily without extension, but we can bind to the view's dom
			// Or better yet, we can use the extension, but for simplicity here since we are inside a component, we can try to bind to the wrapper event if possible,
			// but editor-content doesn't forward events directly.
			// Actually, Tiptap suggests using Extension.create for keymaps.
			// Let's stick to a simpler approach: add a listener to the window/document focused element or modify the extension config if needed.
			// Wait, 'keydown' is simpler if we just intercept it on the wrapper or rely on custom extension.
			// However, standard contenteditable behavior is fine, we just need to intercept Enter.
			// Let's add a custom extension for keymap or just use a directive if available.
			// Simplest: use EditorProps.handleKeyDown
			newEditor.setOptions({
				editorProps: {
					handleKeyDown: (view, event) => {
						if (event.key === 'Enter' && !event.shiftKey) {
							event.preventDefault()
							sendMessage()
							return true
						}
						return false
					},
					attributes: {
						class: 'prose dark:prose-invert focus:outline-none min-h-[44px] px-4 py-3 text-[15px] font-medium leading-relaxed text-[var(--text-primary)]',
					},
				},
			})
		}
	},
	{ immediate: true },
)

const hasContent = computed(() => {
	return inputMessage.value.trim().length > 0
})

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
	if (editor.value) {
		editor.value.commands.setContent(suggestion.prompt)
		inputMessage.value = suggestion.prompt
		editor.value.commands.focus()
	}
}

onMounted(async () => {
	console.log('=== Chat page mounted ===')
	console.log('Current conversation ID:', currentConversationId.value)

	if (currentConversationId.value) {
		await conversationStore.switchConversation(currentConversationId.value)

		console.log('After switchConversation, currentConversation:', currentConversation.value)

		if (currentConversation.value) {
			console.log('Conversation groupId:', currentConversation.value.groupId)
			console.log('Current selectedGroupId:', conversationStore.selectedGroupId)

			modelStore.selectModel(currentConversation.value.model || '')

			// 同步 selectedGroupId 并刷新列表（现在 Store 已经处理了保留当前会话逻辑）
			if (currentConversation.value.groupId !== conversationStore.selectedGroupId) {
				console.log('Syncing selectedGroupId to:', currentConversation.value.groupId)
				await conversationStore.setSelectedGroupId(currentConversation.value.groupId)
			}
			nextTick(() => scrollToBottom())
		} else {
			console.warn('Current conversation not found after switchConversation!')
		}
	}
})

onBeforeUnmount(() => {
	editor.value?.destroy()
})

watch(
	() => currentConversationId.value,
	async (newId) => {
		if (newId) {
			await conversationStore.switchConversation(newId)
			if (currentConversation.value) {
				modelStore.selectModel(currentConversation.value.model || '')
				// 只同步 selectedGroupId，不重新加载会话列表（避免清空消息）
				if (currentConversation.value.groupId !== conversationStore.selectedGroupId) {
					console.log('Watch: Syncing selectedGroupId to:', currentConversation.value.groupId)
					conversationStore.selectedGroupId = currentConversation.value.groupId
				}
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

const sendMessage = async () => {
	if (!inputMessage.value.trim() || chatStore.isLoading || !currentConversation.value) return

	const conversationId = currentConversation.value.id
	// 确保 model 格式是 provider:model
	let model = currentConversation.value.model || modelStore.selectedModelId || 'openai:gpt-4o-mini'
	// 如果 model 没有包含 provider，尝试从 modelStore 获取完整格式
	if (!model.includes(':')) {
		const modelObj = modelStore.models.find((m) => m.model === model)
		if (modelObj) {
			model = `${modelObj.provider}:${modelObj.model}`
		}
	}
	const userMessage = inputMessage.value.trim()

	// Clear editor EARLY but use the captured userMessage
	inputMessage.value = ''
	editor.value?.commands.clearContent()

	// Set loading state
	chatStore.setLoading(true, conversationId)

	try {
		console.log('=== Sending message ===')
		console.log('Conversation ID:', conversationId)
		console.log('Model (with provider):', model)
		console.log('User message length:', userMessage.length)

		// Capture history BEFORE adding the new message
		const history = currentConversation.value.messages.map((msg) => ({
			role: msg.role as any,
			content: msg.content,
		}))
		console.log('History count (before new message):', history.length)

		// Add messages to UI/Store
		conversationStore.addMessage(conversationId, {
			role: 'user',
			content: userMessage,
		})

		// Auto-update title if it's the first message or matches default
		const currentTitle = currentConversation.value?.title
		if (currentTitle === '(A.I. Bestie) 的对话' || currentTitle === 'New conversation' || !currentTitle) {
			const newTitle = userMessage.length > 40 ? userMessage.substring(0, 40) + '...' : userMessage
			conversationStore.updateTitle(conversationId, newTitle)
		}

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

		const context: Record<string, any> = {
			conversation_id: conversationId,
			max_history: 20,
		}

		if (currentConversation.value.characterId && currentConversation.value.characterId !== 0) {
			context.character_id = currentConversation.value.characterId
		}

		console.log('Sending message with context:', context)
		let messageCount = 0

		await fetchChatStream({
			message: userMessage,
			messages: history,
			model,
			options: {
				...options,
				context,
			},
			onMessage: (content) => {
				messageCount++
				conversationStore.updateLastMessage(conversationId, content)
			},
			onError: (error) => {
				console.error('Stream error:', error)
				const errorMessage = error?.message || 'Connection failed'
				conversationStore.updateLastMessage(conversationId, `\n[Error: ${errorMessage}]`, true)
			},
			onFinish: () => {
				console.log('Stream finished. Total chunks received:', messageCount)
				chatStore.setLoading(false)
			},
		})
	} catch (error) {
		console.error('Send message error:', error)
		conversationStore.updateLastMessage(conversationId, '\n[Error: Failed to start stream]', true)
		chatStore.setLoading(false)
	}
}

const copyMessage = (content: string) => {
	navigator.clipboard.writeText(content).then(() => {
		// Optional: Add a toast notification here
		console.log('Message copied to clipboard')
	})
}

const startEditing = (message: any) => {
	editingMessageId.value = message.id
	editingContent.value = message.content
}

const cancelEditing = () => {
	editingMessageId.value = null
	editingContent.value = ''
}

const submitEdit = () => {
	if (!editingContent.value.trim()) return

	const content = editingContent.value.trim()
	cancelEditing()

	// We use the same sendMessage logic but with the new content
	// To strictly follow the requirement "send 新发送出去一条消息"
	// We effectively populate the editor and call sendMessage
	if (editor.value) {
		editor.value.commands.setContent(content)
		inputMessage.value = content
		sendMessage()
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

/* Tiptap Styles */
:deep(.tiptap) {
	outline: none !important;

	p.is-editor-empty:first-child::before {
		color: var(--text-tertiary);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
}
</style>
