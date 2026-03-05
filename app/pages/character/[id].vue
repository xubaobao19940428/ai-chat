<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-hidden relative transition-colors">
		<!-- Top Header Bar -->
		<header class="flex-shrink-0 flex items-center justify-between px-4 h-[52px] border-b border-[var(--border-light)] bg-[var(--bg-main)]/80 backdrop-blur-md z-20">
			<button @click="router.back()" class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
				<ArrowLeft :size="18" />
			</button>
			<button @click="handleShare" class="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
				<Share2 :size="16" />
			</button>
		</header>

		<!-- Loading -->
		<div v-if="isLoadingCharacter" class="flex-1 flex items-center justify-center">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-primary)]"></div>
		</div>

		<!-- Error -->
		<div v-else-if="!character" class="flex-1 flex flex-col items-center justify-center gap-4">
			<p class="text-[var(--text-tertiary)] text-sm">Character not found.</p>
			<button @click="router.back()" class="px-5 py-2 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-lg text-sm font-semibold">
				Go back
			</button>
		</div>

		<!-- Content -->
		<div v-else class="flex-1 overflow-hidden flex flex-col md:flex-row">
			<!-- Sidebar: Character Info -->
			<aside class="w-full md:w-[300px] lg:w-[336px] md:h-full border-r border-[var(--border-light)] bg-[var(--bg-main)] flex-shrink-0 flex flex-col">
				<!-- Profile Header (non-scrolling) -->
				<div class="px-5 pt-5 pb-4 flex-shrink-0">
					<div class="flex items-center gap-3.5 mb-4">
						<!-- Avatar -->
						<div class="w-[52px] h-[52px] rounded-xl overflow-hidden bg-[var(--fill-tsp-white-main)] flex-shrink-0 border border-[var(--border-light)]">
							<img v-if="character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
							<div v-else class="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
								<Bot :size="22" />
							</div>
						</div>
						<!-- Name & Meta -->
						<div class="min-w-0 flex-1">
							<h1 class="text-[15px] font-bold text-[var(--text-primary)] leading-tight truncate">{{ character.name }}</h1>
							<div class="flex items-center gap-1.5 mt-1">
								<span class="text-[11px] text-[var(--text-tertiary)] truncate">{{ character.related_data?.provider || 'AI' }}</span>
								<span class="w-[3px] h-[3px] rounded-full bg-[var(--text-disable)] flex-shrink-0"></span>
								<Cpu :size="10" class="text-[var(--text-disable)] flex-shrink-0" />
								<span class="text-[11px] text-[var(--text-tertiary)] truncate">{{ character.model_id || 'GPT-4o mini' }}</span>
							</div>
						</div>
					</div>

					<!-- Start Chat Button -->
					<button @click="handleStartChat" class="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-[var(--text-primary)] text-[var(--bg-main)] text-[13px] font-semibold hover:opacity-90 transition-opacity">
						<MessagesSquare :size="14" />
						Start Chat
					</button>
				</div>

				<!-- Tabs (sticky, outside scroll) -->
				<div class="flex-shrink-0 flex items-center gap-1 border-b border-[var(--border-light)] px-3">
					<button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
						class="relative flex items-center gap-1.5 px-2.5 py-2.5 text-[12px] font-medium transition-colors"
						:class="activeTab === tab.key ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'">
						<component :is="tab.icon" :size="13" />
						{{ tab.label }}
						<div v-if="activeTab === tab.key" class="absolute bottom-0 left-1 right-1 h-[2px] bg-[var(--text-primary)] rounded-full"></div>
					</button>
				</div>

				<!-- Tab Content (scrollable) -->
				<div class="flex-1 overflow-y-auto custom-scrollbar px-5 py-4">
					<!-- Info Tab -->
					<div v-if="activeTab === 'info'" class="animate-in fade-in duration-200">
						<p class="text-[var(--text-secondary)] text-[13px] leading-relaxed" :class="{ 'line-clamp-6': !descExpanded }">
							{{ character.description || 'No description available.' }}
						</p>
						<button v-if="character.description && character.description.length > 200"
							@click="descExpanded = !descExpanded"
							class="text-[var(--text-blue)] text-xs mt-2 font-medium hover:underline">
							{{ descExpanded ? 'Show less' : 'Show more' }}
						</button>
					</div>

					<!-- Welcome Tab -->
					<div v-if="activeTab === 'welcome'" class="animate-in fade-in duration-200">
						<div v-if="character.welcome" class="p-4 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] text-[13px] leading-relaxed italic border border-[var(--border-light)]">
							"{{ character.welcome }}"
						</div>
						<div v-else class="text-[var(--text-disable)] text-xs py-10 text-center">No welcome message set.</div>
					</div>

					<!-- API Tab -->
					<div v-if="activeTab === 'api'" class="animate-in fade-in duration-200">
						<div class="p-3.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] font-mono text-[11px] text-[var(--text-secondary)] space-y-3">
							<div>
								<div class="text-[var(--text-tertiary)] font-semibold mb-1">ID</div>
								<div class="break-all">{{ character.id }}</div>
							</div>
							<div>
								<div class="text-[var(--text-tertiary)] font-semibold mb-1">Endpoint</div>
								<div class="text-[var(--text-blue)]">POST /v1/chat</div>
							</div>
						</div>
					</div>
				</div>
			</aside>

			<!-- Main: Chat -->
			<main class="flex-1 flex flex-col h-full bg-[var(--bg-main)] relative overflow-hidden">
				<!-- Messages -->
				<div class="flex-1 overflow-y-auto custom-scrollbar px-5 pb-36 pt-6" ref="scrollContainer">
					<div class="max-w-[720px] mx-auto w-full">
						<!-- Date Separator -->
						<div class="flex items-center gap-3 mb-8">
							<div class="flex-1 h-px bg-[var(--border-light)] opacity-40"></div>
							<span class="text-[10px] text-[var(--text-disable)] font-medium tracking-widest uppercase flex-shrink-0">{{ todayStr }}</span>
							<div class="flex-1 h-px bg-[var(--border-light)] opacity-40"></div>
						</div>

						<!-- Welcome message (pre-conversation) -->
						<div v-if="welcomeMessage && !conversationId" class="flex gap-3 mb-6">
							<div class="flex-shrink-0 mt-0.5">
								<div class="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden bg-[var(--fill-tsp-white-main)] border border-[var(--border-light)]">
									<img v-if="character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
									<Bot v-else :size="14" class="text-[var(--text-secondary)]" />
								</div>
							</div>
							<div class="text-[var(--text-primary)] text-[14px] leading-relaxed">
								<div class="prose dark:prose-invert prose-neutral max-w-none break-words" v-html="renderMarkdown(welcomeMessage)"></div>
							</div>
						</div>

						<!-- Store messages -->
						<div class="space-y-6">
							<div v-for="message in storeMessages" :key="message.id" class="flex gap-3 group"
								:class="message.role === 'user' ? 'flex-row-reverse' : ''">
								<!-- Avatar -->
								<div class="flex-shrink-0 mt-0.5">
									<div class="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden"
										:class="message.role === 'user' ? 'bg-[var(--text-primary)]' : 'bg-[var(--fill-tsp-white-main)] border border-[var(--border-light)]'">
										<img v-if="message.role === 'assistant' && character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
										<Bot v-else-if="message.role === 'assistant'" :size="14" class="text-[var(--text-secondary)]" />
										<UserIcon v-else :size="13" class="text-[var(--bg-main)]" />
									</div>
								</div>
								<!-- Bubble -->
								<div class="flex flex-col max-w-[85%] sm:max-w-[78%]" :class="message.role === 'user' ? 'items-end' : 'items-start'">
									<div v-if="message.role === 'user'"
										class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-4 py-2.5 rounded-[18px] text-[14px] leading-relaxed border border-[var(--border-light)]">
										<div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
									</div>
									<div v-else class="text-[var(--text-primary)] text-[14px] leading-relaxed break-words">
										<div v-if="!message.content && isStreaming" class="flex space-x-1 py-2">
											<div class="w-1.5 h-1.5 bg-[var(--text-disable)] rounded-full animate-bounce" style="animation-delay: 0s"></div>
											<div class="w-1.5 h-1.5 bg-[var(--text-disable)] rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
											<div class="w-1.5 h-1.5 bg-[var(--text-disable)] rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
										</div>
										<div v-else class="prose dark:prose-invert prose-neutral max-w-none break-words" v-html="renderMarkdown(message.content)"></div>
									</div>
									<!-- Timestamp -->
									<div class="mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[var(--text-disable)]">
										{{ formatTime(message.timestamp) }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Floating Input -->
				<div class="absolute bottom-5 left-0 right-0 z-50 px-4 pointer-events-none">
					<div class="max-w-[720px] mx-auto pointer-events-auto">
						<div class="bg-[var(--bg-main)]/95 backdrop-blur-md rounded-[20px] shadow-xl border border-[var(--border-light)] focus-within:border-[var(--border-main)] transition-colors p-1.5">
							<div class="flex items-end gap-2">
								<textarea v-model="inputMessage" placeholder="Message the character..."
									class="flex-1 bg-transparent border-none outline-none text-[14px] leading-relaxed px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none max-h-[120px] min-h-[36px]"
									rows="1" @keydown="handleKeydown" @input="autoResize" ref="inputArea"></textarea>
								<button v-if="isStreaming" @click="stopStreaming"
									class="flex-shrink-0 mb-1.5 flex items-center justify-center w-7 h-7 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full transition-transform active:scale-90">
									<Square :size="10" fill="currentColor" />
								</button>
								<button v-else @click="sendMessage" :disabled="!inputMessage.trim()"
									class="flex-shrink-0 mb-1.5 flex items-center justify-center w-7 h-7 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full transition-transform active:scale-90 disabled:opacity-25">
									<ArrowUp :size="14" :stroke-width="2.5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, markRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
	ArrowLeft, ArrowUp, MessagesSquare, Share2, Square,
	User as UserIcon, Info, Code, ThumbsUp, Cpu, Bot,
} from 'lucide-vue-next'
import { getCharacterDetail, type Character } from '~/api/character'
import { fetchChatStream } from '~/utils/api'
import { renderMarkdown } from '~/utils/markdown'
import { useConversationStore } from '~/stores/conversation'
import { useUIStore } from '~/stores/ui'

definePageMeta({ hideTopBar: true })

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()

// State
const character = ref<Character | null>(null)
const isLoadingCharacter = ref(true)
const inputMessage = ref('')
const isStreaming = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const inputArea = ref<HTMLTextAreaElement | null>(null)
const conversationId = ref<number | string | null>(null)
const welcomeMessage = ref<string>('')
const activeTab = ref('info')
const descExpanded = ref(false)
let abortController: AbortController | null = null

const tabs = [
	{ key: 'info', label: 'Info', icon: markRaw(Info) },
	{ key: 'welcome', label: 'Welcome', icon: markRaw(ThumbsUp) },
	{ key: 'api', label: 'API', icon: markRaw(Code) },
]

// Derive messages from the store for the current conversation
const storeMessages = computed(() => {
	if (!conversationId.value) return []
	const conv = conversationStore.conversations.find(c => String(c.id) === String(conversationId.value))
	return conv?.messages || []
})

const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const formatTime = (timestamp?: number) => {
	if (!timestamp) return ''
	return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const autoResize = () => {
	if (inputArea.value) {
		inputArea.value.style.height = 'auto'
		inputArea.value.style.height = inputArea.value.scrollHeight + 'px'
	}
}

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault()
		sendMessage()
	}
}

const scrollToBottom = () => {
	nextTick(() => {
		if (scrollContainer.value) scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
	})
}

const loadExistingConversation = async (convId: string) => {
	isLoadingCharacter.value = true
	try {
		await conversationStore.switchConversation(convId)
		conversationId.value = convId
		nextTick(() => scrollToBottom())
	} catch (e) {
		console.error('Failed to load conversation:', e)
	} finally {
		isLoadingCharacter.value = false
	}
}

watch(() => route.query.conv, (newConvId) => {
	if (newConvId) {
		loadExistingConversation(String(newConvId))
	} else {
		conversationId.value = null
		welcomeMessage.value = character.value?.welcome || ''
	}
})

onMounted(async () => {
	const id = Number(route.params.id)
	if (!id) { isLoadingCharacter.value = false; return }
	try {
		const res: any = await getCharacterDetail(id)
		character.value = res.data

		if (route.query.conv) {
			await loadExistingConversation(String(route.query.conv))
		} else if (character.value?.welcome) {
			welcomeMessage.value = character.value.welcome
		}
	} catch (error) {
		console.error('Failed to load character:', error)
	} finally {
		isLoadingCharacter.value = false
	}
})

const ensureConversation = async () => {
	if (conversationId.value) return conversationId.value
	if (!character.value) return null
	const id = await conversationStore.createConversation({ character_id: character.value.id })
	conversationId.value = id
	conversationStore.currentConversationId = id
	router.replace({ query: { ...route.query, conv: id } })
	return id
}

const stopStreaming = () => {
	abortController?.abort()
	abortController = null
}

const sendMessage = async () => {
	if (!inputMessage.value.trim() || isStreaming.value || !character.value) return
	const userMsg = inputMessage.value.trim()
	inputMessage.value = ''
	if (inputArea.value) inputArea.value.style.height = 'auto'

	const convId = await ensureConversation()
	if (!convId) return

	// Clear welcome message once conversation starts
	welcomeMessage.value = ''

	conversationStore.addMessage(convId, { role: 'user', content: userMsg })
	conversationStore.addMessage(convId, { role: 'assistant', content: '' })
	scrollToBottom()
	isStreaming.value = true

	abortController = new AbortController()
	let tokenBuffer = ''
	let lastFlushTime = Date.now()
	const FLUSH_INTERVAL = 60

	try {
		await fetchChatStream({
			message: userMsg,
			model: undefined,
			signal: abortController.signal,
			options: { context: { conversation_id: convId, character_id: character.value.id, max_history: 20 } },
			onMessage: (content) => {
				tokenBuffer += content
				const now = Date.now()
				if (now - lastFlushTime > FLUSH_INTERVAL) {
					conversationStore.updateLastMessageContent(convId, tokenBuffer)
					tokenBuffer = ''
					lastFlushTime = now
				}
				scrollToBottom()
			},
			onError: (error) => {
				const lastMsg = storeMessages.value.at(-1)
				if (lastMsg?.role === 'assistant' && !lastMsg.content) {
					conversationStore.removeLastAssistantMessage(convId)
				}
				uiStore.showToast(error?.message || 'Something went wrong.', 'error')
			},
			onFinish: () => {
				// Final flush
				if (tokenBuffer) {
					conversationStore.updateLastMessageContent(convId, tokenBuffer)
					tokenBuffer = ''
				}
				// Sync updatedAt + trigger debounced IndexedDB save
				const finalContent = storeMessages.value.at(-1)?.content || ''
				conversationStore.updateLastMessage(convId, finalContent, false)
				isStreaming.value = false
				abortController = null
			},
		})
	} catch (error: any) {
		abortController = null
		conversationStore.removeLastAssistantMessage(convId)
		if (error?.name !== 'AbortError') {
			uiStore.showToast('Failed to send message. Please try again.', 'error')
		}
		isStreaming.value = false
	}
}

const handleStartChat = async () => {
	if (!character.value) return
	const id = await conversationStore.createConversation({ character_id: character.value.id })
	router.push(`/character/${character.value.id}?conv=${id}`)
}

const handleShare = () => {
	if (navigator.share) {
		navigator.share({ title: character.value?.name, url: window.location.href })
	} else {
		navigator.clipboard.writeText(window.location.href)
		uiStore.showToast('Link copied to clipboard')
	}
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: var(--text-disable);
	border-radius: 10px;
}

.prose {
	color: var(--text-primary);
	line-height: 1.65;
	font-size: 14px;
}
:deep(.prose) {
	@apply leading-relaxed;
}
</style>
