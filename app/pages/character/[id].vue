<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-hidden relative transition-colors">
		<!-- Top Header Bar -->
		<header class="flex-shrink-0 flex items-center justify-between px-4 h-[52px] border-b border-[var(--border-light)] bg-[var(--bg-main)]/80 backdrop-blur-md z-20">
			<ModelSelector variant="ghost" capability="chat" position="top" />
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
			<button @click="handleGoBack" class="px-5 py-2 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-lg text-sm font-semibold">Go back</button>
		</div>

		<!-- Content -->
		<div v-else class="flex-1 overflow-hidden flex flex-col">
			<!-- Main: Chat -->
			<main class="flex-1 flex flex-col h-full bg-[var(--bg-main)] relative overflow-hidden">
				<!-- Messages -->
				<div class="flex-1 overflow-y-auto custom-scrollbar px-4 pb-36 pt-6" ref="scrollContainer">
					<div class="max-w-full md:max-w-[900px] mx-auto w-full">
							<div v-if="!conversationId" class="flex flex-col items-center pt-12 pb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
							<!-- Character Profile Section (Centered) -->
							<div class="flex flex-col items-center mb-12">
								<!-- Avatar -->
								<div class="w-[88px] h-[88px] rounded-2xl overflow-hidden border-2 border-[var(--border-light)] bg-[var(--bg-main)] flex-shrink-0 mb-6 shadow-sm">
									<img v-if="character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
									<div v-else class="w-full h-full flex items-center justify-center text-4xl">🤖</div>
								</div>

								<!-- Name -->
								<h1 class="text-[28px] font-black text-[var(--text-primary)] leading-tight tracking-tight mb-4 text-center">{{ character.name }}</h1>

								<!-- Description -->
								<p class="text-[15px] text-[var(--text-secondary)] leading-relaxed font-normal max-w-[480px] text-center">
									{{ character.description }}
								</p>
							</div>

							<!-- Character Welcome Block (Visible) -->
							<div v-if="welcomeMessage" class="w-full max-w-[700px] mb-12 px-4 sm:px-0">
								<div class="flex gap-3">
									<div class="flex-shrink-0 mt-0.5">
										<div class="size-6 rounded-md overflow-hidden border border-[var(--border-light)] bg-[var(--bg-main)] flex items-center justify-center shadow-sm">
											<img v-if="character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
											<Bot v-else :size="12" class="text-[var(--text-secondary)]" />
										</div>
									</div>
									<div class="flex flex-col">
										<span class="text-[14px] font-bold text-[var(--text-primary)] mb-1">{{ character.name }}</span>
										<div class="text-[15px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap opacity-90">{{ welcomeMessage }}</div>
									</div>
								</div>
							</div>

						</div>

						<!-- First Welcome Bubble (Logic Preservation) -->
						<div v-if="welcomeMessage && !conversationId" class="hidden">
							<!-- Kept hidden to preserve logic while allowing splash screen to take center stage -->
						</div>

						<!-- Store messages -->
						<div class="space-y-6">
							<div v-for="message in storeMessages" :key="message.id" class="flex group" :class="message.role === 'user' ? 'justify-end' : ''">
								<!-- Bubble -->
								<div class="flex flex-col max-w-[85%] sm:max-w-[80%]" :class="message.role === 'user' ? 'items-end' : 'items-start'">
									<div v-if="message.role === 'user'" class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-5 py-2.5 rounded-[24px] text-[15px] font-medium leading-relaxed border border-[var(--border-light)] shadow-sm">
										<div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
									</div>
									<div v-else class="text-[var(--text-primary)] text-[15px] leading-relaxed break-words">
										<div v-if="!message.content && isStreaming" class="flex items-center gap-2.5 py-2">
											<div class="flex space-x-1">
												<div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style="animation-delay: 0s"></div>
												<div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
												<div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
											</div>
											<span class="text-[13px] text-[var(--text-tertiary)] font-medium" style="animation: thinking-pulse 1.5s ease-in-out infinite">{{ $t('chat.thinking') }}</span>
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

				<!-- Floating Input Area -->
				<div class="flex-shrink-0 px-4 pb-8 pt-2 absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
					<div class="max-w-[840px] mx-auto relative pointer-events-auto">
						<!-- Suggested Questions (2x2 grid) -->
						<div v-if="!conversationId && suggestedQuestions.length" class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full px-1 mb-4">
							<button v-for="(q, idx) in suggestedQuestions" :key="idx" @click="handleSuggestedQuestionClick(q)" class="flex items-center justify-between gap-3 h-[38px] px-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-main)]/50 backdrop-blur-sm hover:border-[var(--border-main)] hover:bg-[var(--bg-main)] text-[13px] text-[var(--text-primary)] text-left transition-all group/fq shadow-sm">
								<span class="truncate">{{ q }}</span>
								<span class="text-[var(--text-tertiary)] group-hover/fq:text-[var(--text-secondary)] shrink-0 transition-colors">→</span>
							</button>
						</div>

						<UnifiedInput
							ref="unifiedInputRef"
							capability="chat"
							:is-loading="isStreaming"
							:character-name="character?.name"
							:show-model-selector="true"
							@send="handleUnifiedSend"
							@stop="stopStreaming"
						/>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, markRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Share2, User as UserIcon, Info, Code, ThumbsUp, Bot } from 'lucide-vue-next'
import UnifiedInput from '~/components/UnifiedInput.vue'
import ModelSelector from '~/components/ModelSelector.vue'
import { getCharacterDetail, type Character } from '~/api/character'
import { fetchChatStream } from '~/utils/api'
import { renderMarkdown } from '~/utils/markdown'
import { useConversationStore } from '~/stores/conversation'
import { useModelStore } from '~/stores/models'
import { useUIStore } from '~/stores/ui'
import { useUserStore } from '~/stores/user'

definePageMeta({ hideTopBar: true })

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const modelStore = useModelStore()
const uiStore = useUIStore()
const userStore = useUserStore()

// State
const character = ref<Character | null>(null)
const isLoadingCharacter = ref(true)
const isStreaming = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const unifiedInputRef = ref<InstanceType<typeof UnifiedInput> | null>(null)
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

// Suggested questions: prefer character's related_data, fallback to defaults
const suggestedQuestions = computed(() => {
	const custom = character.value?.related_data?.suggested_questions
	if (Array.isArray(custom) && custom.length > 0) return custom
	return ['你能帮我分析一下最近的数据吗？', '多种条件怎么求和？', '写一个关于职场成长的建议列表', '帮我写一个工作总结模板']
})

// Derive messages from the store for the current conversation
const storeMessages = computed(() => {
	if (!conversationId.value) return []
	const conv = conversationStore.conversations.find((c) => String(c.id) === String(conversationId.value))
	return conv?.messages || []
})


const formatTime = (timestamp?: number) => {
	if (!timestamp) return ''
	return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleGoBack = () => {
	router.back()
}

const handleSuggestedQuestionClick = (q: string) => {
	handleUnifiedSend({ content: q, params: {}, files: [], mediaFiles: [] })
}

const handleUnifiedSend = async (payload: { content: string; params: Record<string, any>; files: any[]; mediaFiles: any[] }) => {
	await sendMessage(payload.content)
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

watch(
	() => route.query.conv,
	(newConvId) => {
		if (newConvId) {
			loadExistingConversation(String(newConvId))
		} else {
			conversationId.value = null
			welcomeMessage.value = character.value?.welcome || ''
		}
	},
)

onMounted(async () => {
	modelStore.setActiveCapability('chat')
	const id = Number(route.params.id)
	if (!id) {
		isLoadingCharacter.value = false
		return
	}
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
	const id = await conversationStore.createConversation({ character_id: character.value.id, capability: 'chat' })
	conversationId.value = id
	conversationStore.currentConversationId = id
	router.replace({ query: { ...route.query, conv: id } })
	return id
}

const stopStreaming = () => {
	abortController?.abort()
	abortController = null
}

const sendMessage = async (content?: string) => {
	const userMsg = content?.trim() || ''
	if (!userMsg || isStreaming.value || !character.value) return

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
			model: modelStore.selectedModelId || undefined,
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
@keyframes thinking-pulse {
	0%, 100% { opacity: 0.4; }
	50% { opacity: 1; }
}

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
	font-size: 15px;
}
:deep(.prose) {
	@apply leading-relaxed;
}
</style>
