<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] transition-colors relative overflow-hidden"
		@dragenter.prevent="onDragEnter"
		@dragover.prevent
		@dragleave="onDragLeave"
		@drop.prevent="onDrop">

		<!-- Drag Overlay -->
		<Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
			<div v-if="isDraggingOver && supportsFileUpload"
				class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[var(--bg-main)]/90 backdrop-blur-sm border-2 border-dashed border-[var(--brand-primary)] rounded-none pointer-events-none">
				<div class="w-16 h-16 rounded-2xl bg-[var(--brand-primary)]/10 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--brand-primary)]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
				</div>
				<p class="text-[15px] font-semibold text-[var(--brand-primary)]">{{ $t('chat.drag_drop_title') }}</p>
				<p class="text-[13px] text-[var(--text-tertiary)]">{{ $t('chat.drag_drop_subtitle') }}</p>
			</div>
		</Transition>
		<!-- <header
			class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-light)] transition-all">
			<div class="flex items-center gap-3">
				<div v-if="currentCharacter" class="flex items-center gap-2 pr-2 border-r border-[var(--border-light)]">
					<img :src="currentCharacter.icon || currentCharacter.avatar"
						class="w-6 h-6 rounded-full object-cover" />
					<span class="text-[14px] font-bold text-[var(--text-primary)]">{{ currentCharacter.name }}</span>
				</div>
				<Tooltip text="Switch Model">
					<ModelSelector position="top" />
				</Tooltip>
			</div>
			<div class="flex items-center gap-2">
				
			</div>
		</header> -->

		<!-- Main Chat Area -->
		<div class="flex-1 overflow-y-auto px-4 pb-48 pt-20 custom-scrollbar relative z-10" ref="messagesContainer" @scroll="onMessagesScroll">
			<div class="max-w-[840px] mx-auto py-6">
				<!-- Initial Loading State -->
				<div v-if="conversationStore.isLoading && (!currentConversation?.messages || currentConversation.messages.length === 0)"
					class="flex flex-col items-center justify-center py-20 space-y-4">
					<div
						class="w-10 h-10 border-4 border-[var(--border-light)] border-t-[var(--text-primary)] rounded-full animate-spin">
					</div>
					<p class="text-[var(--text-tertiary)] text-sm font-medium animate-pulse">Loading messages...</p>
				</div>

				<!-- Conditional TransitionGroup or Div to prevent initial load jitter -->
				<component :is="isMountedInitial ? 'TransitionGroup' : 'div'" name="message-list" class="space-y-10">
					<div v-for="message in currentConversation?.messages" :key="message.id" class="flex gap-4 group"
						:class="message.role === 'user' ? 'flex-row-reverse' : ''" @click="handleMessageClick">
						<!-- Avatar -->
						<div class="flex-shrink-0 mt-1">
							<div
								class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-[var(--bg-main)] border border-[var(--border-light)] shadow-sm">
								<img :src="message.role === 'user' ? userStore.userInfo?.avatar || '/logo.png' : currentCharacter?.icon || currentCharacter?.avatar || getModelIcon(currentConversation?.model)"
									class="w-full h-full object-cover"
									:class="{ 'p-1': message.role !== 'user' && !currentCharacter }"
									:alt="message.role" />
							</div>
						</div>

						<!-- Message Content -->
						<div class="flex flex-col relative"
							:class="message.role === 'user' ? 'items-end max-w-[85%] sm:max-w-[80%]' : 'items-start w-full min-w-0'">
							<!-- User Message -->
							<div v-if="message.role === 'user'" class="w-full flex justify-end">
								<!-- Edit Mode -->
								<div v-if="editingMessageId === message.id"
									class="w-[500px] max-w-full bg-[var(--bg-chat-bubble-user)] rounded-[24px] border border-[var(--border-light)] p-2 shadow-sm animate-in fade-in duration-200">
									<div
										ref="editContentRef"
										contenteditable="true"
										@input="editingContent = ($event.target as HTMLElement).textContent || ''"
										@keydown.enter.exact.prevent="submitEdit"
										@keydown.escape="cancelEditing"
										class="w-full bg-transparent outline-none text-[15px] font-medium leading-relaxed px-3 py-1 min-h-[32px] max-h-48 overflow-y-auto custom-scrollbar whitespace-pre-wrap break-words"></div>
									<div class="flex justify-end gap-2 mt-1">
										<button @click="cancelEditing"
											class="px-3 py-1 text-xs font-semibold rounded-full hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-secondary)]">Cancel</button>
										<button @click="submitEdit"
											class="px-4 py-1.5 text-xs font-semibold bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full hover:opacity-90 transition-opacity">Send</button>
									</div>
								</div>
								<!-- View Mode -->
								<div v-else class="relative group/bubble">
									<div
										class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-5 py-3 rounded-[24px] text-[15px] font-medium leading-relaxed tracking-tight shadow-sm border border-[var(--border-light)]">
										<div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
									</div>

									<!-- Action bar (Hover only) -->
									<div
										class="absolute -top-10 right-0 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity bg-[var(--bg-main)]/80 backdrop-blur-sm border border-[var(--border-light)] rounded-lg p-1 shadow-sm">
										<button @click="copyMessage(message.content)"
											class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
											:title="$t('chat.copy')">
											<Copy :size="14" />
										</button>
										<button @click="startEditing(message)"
											class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
											:title="$t('common.edit')">
											<Pencil :size="14" />
										</button>
									</div>
								</div>
							</div>

							<!-- Bot Message -->
							<div v-else
								class="text-[var(--text-primary)] px-1 py-1 text-[15px] leading-relaxed tracking-tight break-words font-normal">
								<div v-if="!message.content && chatStore.isLoading && chatStore.loadingConversationId === currentConversationId && currentConversation?.messages[currentConversation.messages.length - 1]?.id === message.id"
									class="py-2">
									<div class="flex space-x-1.5">
										<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"
											style="animation-delay: 0s"></div>
										<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"
											style="animation-delay: 0.15s"></div>
										<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"
											style="animation-delay: 0.3s"></div>
									</div>
								</div>
								<div v-else class="relative inline-block w-full">
									<MarkdownContent :content="message.content" />
									<span
										v-if="chatStore.isLoading && chatStore.loadingConversationId === currentConversationId && currentConversation?.messages[currentConversation.messages.length - 1]?.id === message.id"
										class="inline-block w-1.5 h-4 bg-[var(--text-primary)] dark:bg-white ml-1 animate-pulse align-middle"></span>
								</div>

								<!-- Assistant Action Bar -->
								<div
									class="mt-3 flex items-center gap-0.5">
									<!-- Copy -->
									<button @click.stop="copyMessage(message.content)"
										class="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
										:title="$t('chat.copy')">
										<Copy :size="15" />
									</button>
									<!-- Share -->
									<button @click.stop="shareMessage(message.content)"
										class="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
										:title="$t('chat.share')">
										<Share2 :size="15" />
									</button>
									<!-- Regenerate (only show on last assistant message) -->
									<button
										v-if="currentConversation?.messages[currentConversation.messages.length - 1]?.id === message.id"
										@click.stop="regenerateMessage()"
										:disabled="chatStore.isLoading"
										class="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors disabled:opacity-40"
										:title="$t('chat.regenerate')">
										<RefreshCw :size="15" :class="chatStore.isLoading ? 'animate-spin' : ''" />
									</button>
								</div>
							</div>

							<!-- Time/Meta (Hidden by default, shown on hover) -->
							<div
								class="mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[11px] text-[var(--text-tertiary)] font-medium">
								<span>{{ message.role === 'user' ? 'You' : currentConversation?.model || 'AI' }}</span>
								<ClientOnly>
									<span>· {{ formatMessageTime(message.timestamp) }}</span>
								</ClientOnly>
							</div>
						</div>
					</div>
				</component>

				<!-- Send Failed Retry Banner -->
				<div v-if="failedMessageContent" class="flex items-center gap-3 mt-4 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-[13px]">
					<span class="text-red-500 flex-1">{{ $t('chat.send_failed') }}</span>
					<button @click="retryMessage" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-colors">
						<RefreshCw :size="13" />
						{{ $t('chat.retry') }}
					</button>
					<button @click="failedMessageContent = null" class="p-1 text-red-400 hover:text-red-500 transition-colors">
						<X :size="13" />
					</button>
				</div>
			</div>
		</div>

		<!-- Scroll to Bottom Button -->
	<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
		<button v-if="isUserScrolledUp" @click="scrollToBottom(false, true)"
			class="absolute bottom-36 right-8 z-40 size-9 flex items-center justify-center rounded-full bg-[var(--bg-main)] border border-[var(--border-light)] shadow-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:shadow-xl transition-all">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
		</button>
	</Transition>

	<!-- Floating Input Pill -->
		<div class="absolute bottom-8 left-0 right-0 z-50 px-4 pointer-events-none">
			<div class="max-w-[840px] mx-auto relative pointer-events-auto">
				<!-- Input Container -->
				<div
					class="bg-[var(--bg-main)] rounded-[26px] shadow-[var(--shadow-pill)] border border-[var(--border-light)] transition-all duration-300 focus-within:shadow-lg focus-within:border-[var(--text-disable)] relative p-2">
					<div class="flex flex-col">
						<!-- Uploaded Files Preview — above editor -->
						<div v-if="uploadedFiles.length > 0" class="flex flex-wrap gap-2 px-3 pt-2 pb-1">
							<div v-for="file in uploadedFiles" :key="file.id" class="relative group/file shrink-0">
								<!-- Image file -->
								<div v-if="file.type.startsWith('image/')"
									class="relative w-16 h-16 rounded-xl overflow-hidden border border-[var(--border-light)] shadow-sm bg-[var(--bg-hover)]">
									<img :src="file.localUrl || file.url" class="w-full h-full object-cover" />
									<div v-if="file.uploading" class="absolute inset-0 bg-black/40 flex items-center justify-center">
										<Loader2 :size="18" class="animate-spin text-white" />
									</div>
								</div>
								<!-- Non-image file -->
								<div v-else
									class="relative flex items-center gap-2 h-12 px-3 rounded-xl border border-[var(--border-light)] shadow-sm bg-[var(--bg-hover)] max-w-[180px]">
									<div class="shrink-0 w-7 h-7 rounded-lg bg-[var(--fill-tsp-gray-main)] flex items-center justify-center text-[var(--text-secondary)]">
										<Loader2 v-if="file.uploading" :size="14" class="animate-spin" />
										<FileText v-else :size="14" />
									</div>
									<span class="text-[12px] font-medium text-[var(--text-primary)] truncate">{{ file.name }}</span>
								</div>
								<!-- Delete button (only when upload is done) -->
								<button v-if="!file.uploading" @click="removeFile(file.id)"
									class="absolute -top-1.5 -right-1.5 size-5 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/file:opacity-100 transition-opacity z-10">
									<X :size="10" stroke-width="3" />
								</button>
							</div>
						</div>

						<editor-content :editor="editor" class="w-full max-h-48 overflow-y-auto custom-scrollbar" />

						<input type="file" ref="fileInputRef" class="hidden" multiple @change="handleFileUpload" />

						<div class="flex items-center justify-between px-2 pb-1 bg-[var(--bg-main)]">
							<div class="flex items-center gap-1">
								<!-- Attach Button -->
								<Tooltip v-if="supportsFileUpload" text="Add Attachment">
									<button @click="triggerFileUpload" :disabled="isUploading"
										class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors">
										<Plus :size="20" />
									</button>
								</Tooltip>

								<!-- Web Search Popover -->
								<Popover v-if="supportsWebSearch" class="relative" v-slot="{ open }">
									<Tooltip text="Web Search">
										<PopoverButton
											class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors relative"
											:class="{ 'text-[var(--text-primary)] bg-[var(--bg-hover)]': open || isWebSearchEnabled }">
											<Globe :size="18" />
											<div v-if="isWebSearchEnabled"
												class="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--text-primary)] rounded-full border border-[var(--bg-main)]">
											</div>
										</PopoverButton>
									</Tooltip>
									<Transition enter-active-class="transition duration-150 ease-out"
										enter-from-class="translate-y-1.5 opacity-0 scale-[0.98]"
										enter-to-class="translate-y-0 opacity-100 scale-100"
										leave-active-class="transition duration-100 ease-in"
										leave-from-class="translate-y-0 opacity-100"
										leave-to-class="translate-y-1.5 opacity-0">
										<PopoverPanel
											class="absolute bottom-full left-0 mb-3 z-50 w-[300px] max-w-[calc(100vw-2rem)] bg-[var(--bg-main)] rounded-2xl shadow-lg border border-[var(--border-light)] p-4 cursor-default">
											<div class="text-[14px] font-semibold text-[var(--text-primary)] mb-3">Web
												Search</div>
											<div class="h-[1px] bg-[var(--border-light)] -mx-4 mb-3"></div>
											<div class="flex items-start justify-between">
												<div class="pr-4">
													<div class="text-[13px] font-medium text-[var(--text-primary)]">
														Enable Web Search</div>
													<div
														class="text-[12px] text-[var(--text-tertiary)] leading-relaxed mt-0.5">
														Enable web search and real-time information access.</div>
												</div>
												<Switch v-model="isWebSearchEnabled"
													:class="isWebSearchEnabled ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'"
													class="relative inline-flex h-5 w-[36px] shrink-0 items-center rounded-full transition-colors focus:outline-none mt-1">
													<span
														:class="isWebSearchEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'"
														class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm" />
												</Switch>
											</div>
										</PopoverPanel>
									</Transition>
								</Popover>

								<!-- Parameters Popover -->
								<Popover class="relative" v-slot="{ open }">
									<Tooltip text="Model Parameters">
										<PopoverButton
											class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
											:class="{ 'text-[var(--text-primary)] bg-[var(--bg-hover)]': open }">
											<Settings :size="18" />
										</PopoverButton>
									</Tooltip>
									<Transition enter-active-class="transition duration-150 ease-out"
										enter-from-class="translate-y-1.5 opacity-0 scale-[0.98]"
										enter-to-class="translate-y-0 opacity-100 scale-100"
										leave-active-class="transition duration-100 ease-in"
										leave-from-class="translate-y-0 opacity-100"
										leave-to-class="translate-y-1.5 opacity-0">
										<PopoverPanel
											class="absolute bottom-full left-0 mb-3 z-50 w-[300px] max-w-[calc(100vw-2rem)] bg-[var(--bg-main)] rounded-2xl shadow-lg border border-[var(--border-light)]">
											<!-- Header -->
											<div
												class="px-4 pt-3.5 pb-3 border-b border-[var(--border-light)] flex items-center justify-between">
												<div class="flex items-center gap-2">
													<SlidersHorizontal :size="14" class="text-[var(--text-tertiary)]" />
													<span
														class="text-[13px] font-semibold text-[var(--text-primary)]">Parameters</span>
												</div>
												<button @click="resetParams"
													class="text-[12px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Reset</button>
											</div>
											<ModelParameters :model-input="modelStore.selectedModel?.model_input"
												:values="currentConversation?.params || {}"
												@update:values="updateParams" />
										</PopoverPanel>
									</Transition>
								</Popover>
							</div>

							<!-- Stop / Send Button -->
							<Tooltip
								:text="chatStore.isLoading ? 'Stop generating' : hasContent ? 'Send Message' : 'Type something...'">
								<button v-if="chatStore.isLoading" @click="stopGeneration"
									class="flex items-center justify-center w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full transition-transform active:scale-90 dark:bg-[var(--text-white)] dark:text-[var(--bg-main)]">
									<Square :size="12" fill="currentColor" />
								</button>
								<button v-else @click="() => sendMessage()"
									:disabled="(!hasContent && uploadedFiles.length === 0) || isUploading"
									class="flex items-center justify-center w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full transition-transform active:scale-90 disabled:opacity-20 disabled:scale-100 dark:bg-[var(--text-white)] dark:text-[var(--bg-main)]">
									<ArrowUp :size="16" :stroke-width="2.5" />
								</button>
							</Tooltip>
						</div>
					</div>
				</div>

				<!-- Suggestions -->
				<div v-if="currentConversation?.messages.length === 0" class="mt-6 flex flex-wrap justify-center gap-2">
					<button v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 3)" :key="suggestion.id"
						@click="handleApplyPrompt(suggestion)"
						class="flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded-full border border-[var(--border-light)] transition-all text-sm font-medium shadow-sm active:scale-95">
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
import { useRoute, useRouter } from 'vue-router'
import { fetchChatStream } from '../../utils/api'
import MarkdownContent from '../../components/MarkdownContent.vue'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '../../utils/prompts'
import { Popover, PopoverButton, PopoverPanel, Switch } from '@headlessui/vue'
import { useConversationStore } from '../../stores/conversation'
import { useChatStore } from '../../stores/chat'
import { useModelStore } from '../../stores/models'
import { useUserStore } from '../../stores/user'
import { useDiscoveryStore } from '../../stores/discovery'
import { useUIStore } from '../../stores/ui'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Tooltip from '../../components/Tooltip.vue'
import { Copy, Pencil, Plus, Globe, Settings, ArrowUp, Square, SlidersHorizontal, Loader2, X, FileText, Share2, RefreshCw } from 'lucide-vue-next'
import { uploadFile } from '../../utils/api'
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const modelStore = useModelStore()
const userStore = useUserStore()
const discoveryStore = useDiscoveryStore()
const uiStore = useUIStore()

const supportsFileUpload = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields
	return !!(fields?.file_ids || fields?.image_urls)
})

const supportsWebSearch = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields
	return !!fields?.enable_web_search
})
const messagesContainer = ref<HTMLElement | null>(null)
const inputMessage = ref('')
const activeSubPrompts = ref<string[]>([])
const isMountedInitial = ref(false)

// Editing state
const editingMessageId = ref<string | null>(null)
const editingContent = ref('')
const editContentRef = ref<HTMLElement | null>(null)

// Failed message retry state
const failedMessageContent = ref<string | null>(null)

// Scroll lock: don't auto-scroll when user has scrolled up
const isUserScrolledUp = ref(false)
const hasScrolledToBottom = ref(false)
const onMessagesScroll = () => {
	if (!messagesContainer.value || !hasScrolledToBottom.value) return
	const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
	isUserScrolledUp.value = scrollHeight - scrollTop - clientHeight > 80
}

// Drag & drop upload
const isDraggingOver = ref(false)
let dragCounter = 0
const onDragEnter = () => {
	dragCounter++
	isDraggingOver.value = true
}
const onDragLeave = () => {
	dragCounter--
	if (dragCounter <= 0) {
		dragCounter = 0
		isDraggingOver.value = false
	}
}
const onDrop = (e: DragEvent) => {
	dragCounter = 0
	isDraggingOver.value = false
	if (!supportsFileUpload.value) return
	const files = Array.from(e.dataTransfer?.files || [])
	if (files.length > 0) handleFilesUpload(files)
}

// Abort controller for stream cancellation
const abortController = ref<AbortController | null>(null)

// File Upload State
const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedFiles = ref<{ id: string; name: string; key: string; url: string; type: string; uploading: boolean; localUrl?: string }[]>([])
const isWebSearchEnabled = ref(true)

const triggerFileUpload = () => {
	fileInputRef.value?.click()
}

const handleFilesUpload = async (files: File[]) => {
	const placeholders = files.map(file => ({
		id: Math.random().toString(36).slice(2),
		name: file.name,
		key: '',
		url: '',
		type: file.type,
		uploading: true,
		localUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
	}))
	uploadedFiles.value.push(...placeholders)
	isUploading.value = true

	await Promise.allSettled(files.map(async (file, i) => {
		const placeholder = placeholders[i]
		if (!placeholder) return
		try {
			const { key, url } = await uploadFile(file)
			const item = uploadedFiles.value.find(f => f.id === placeholder.id)
			if (item) {
				item.key = key
				item.url = url
				item.uploading = false
			}
		} catch {
			uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== placeholder.id)
			uiStore.showToast(t('chat.upload_failed', { name: file.name }), 'error')
		}
	}))

	isUploading.value = uploadedFiles.value.some(f => f.uploading)
}

const handleFileUpload = async (event: Event) => {
	const target = event.target as HTMLInputElement
	if (!target.files?.length) return
	const files = Array.from(target.files)
	if (fileInputRef.value) fileInputRef.value.value = ''
	await handleFilesUpload(files)
}

const removeFile = (id: string) => {
	const item = uploadedFiles.value.find(f => f.id === id)
	if (item?.localUrl) URL.revokeObjectURL(item.localUrl)
	uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== id)
}

const stopGeneration = () => {
	abortController.value?.abort()
	abortController.value = null
}

const currentConversationId = computed(() => route.params.id as string)
const currentConversation = computed(() => conversationStore.currentConversation)

const currentCharacter = computed(() => {
	if (!currentConversation.value?.characterId || currentConversation.value.characterId <= 1) return null
	const bot = discoveryStore.allItems.find((b) => Number(b.related_id || b.id) === Number(currentConversation.value?.characterId))
	return bot
		? {
			name: bot.title,
			icon: bot.cover,
			avatar: bot.cover,
		}
		: null
})

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
					handlePaste: (view, event) => {
						if (!supportsFileUpload.value) return false
						const items = Array.from(event.clipboardData?.items || [])
						const imageItems = items.filter(item => item.type.startsWith('image/'))
						if (imageItems.length === 0) return false
						event.preventDefault()
						const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[]
						if (files.length > 0) {
							handleFilesUpload(files)
						}
						return true
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

// Draft persistence per conversation
const DRAFT_PREFIX = 'chat_draft_'
const saveDraft = (text: string) => {
	const id = currentConversationId.value
	if (!id) return
	if (text.trim()) {
		localStorage.setItem(DRAFT_PREFIX + id, text)
	} else {
		localStorage.removeItem(DRAFT_PREFIX + id)
	}
}
const loadDraft = () => {
	const id = currentConversationId.value
	if (!id) return
	const draft = localStorage.getItem(DRAFT_PREFIX + id)
	if (draft && editor.value) {
		editor.value.commands.setContent(draft)
		inputMessage.value = draft
	}
}
watch(inputMessage, (val) => saveDraft(val))

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
	return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
	// 1. 初始化本地存储
	await conversationStore.initFromLocalStorage()

	const conversationId = currentConversationId.value
	if (conversationId) {
		// 2. 切换会话
		const conversation = await conversationStore.switchConversation(conversationId)

		if (conversation) {
			if (conversation.model) modelStore.selectModel(conversation.model)
			nextTick(() => {
				scrollToBottom(true, true)
				setTimeout(() => {
					isMountedInitial.value = true
					// If there's a pending message from WelcomeScreen, send it
					if (chatStore.pendingMessage) {
						sendMessage(true)
					} else {
						loadDraft()
					}
				}, 50)
			})
		}
	} else {
		isMountedInitial.value = true
	}
})

onBeforeUnmount(() => {
	editor.value?.destroy()
})

watch(
	() => currentConversationId.value,
	async (newId) => {
		if (newId) {
			hasScrolledToBottom.value = false
			isUserScrolledUp.value = false
			await conversationStore.switchConversation(newId)
			if (currentConversation.value) {
				if (currentConversation.value.model) modelStore.selectModel(currentConversation.value.model)
				// 只同步 selectedGroupId，不重新加载会话列表（避免清空消息）
				if (currentConversation.value.groupId !== conversationStore.selectedGroupId) {
					conversationStore.selectedGroupId = currentConversation.value.groupId
				}
			}
			nextTick(() => {
				scrollToBottom(true, true)
				loadDraft()
			})
		}
	},
)

watch(
	() => currentConversation.value?.messages.length,
	() => {
		nextTick(() => scrollToBottom())
	},
)

const scrollToBottom = (instant = false, force = false) => {
	if (!messagesContainer.value) return
	if (!force && isUserScrolledUp.value) return
	messagesContainer.value.scrollTo({
		top: messagesContainer.value.scrollHeight,
		behavior: instant ? 'auto' : 'smooth',
	})
	hasScrolledToBottom.value = true
}

const sendMessage = async (isInitial = false) => {
	// For initial messages, the message is already in the store,
	// but we need to derive userMessage for the stream.
	let userMessage = inputMessage.value.trim()

	if (isInitial && chatStore.pendingMessage) {
		userMessage = chatStore.pendingMessage
		chatStore.setPendingMessage(null) // Consume it
	}

	// Allow sending just files without text
	if (!userMessage && uploadedFiles.value.length === 0 && !isInitial) {
		return
	}

	if ((chatStore.isLoading && !isInitial) || !currentConversation.value) {
		return
	}

	const conversationId = currentConversation.value.id
	// 确保 model 格式是 provider:model
	let model = currentConversation.value.model || modelStore.selectedModelId || 'openai:gpt-4o-mini'

	if (!model.includes(':')) {
		const modelObj = modelStore.models.find((m) => m.model === model)
		if (modelObj) {
			model = `${modelObj.provider}:${modelObj.model}`
		}
	}

	const image_urls: string[] = []
	const file_ids: string[] = []

	uploadedFiles.value.filter(f => !f.uploading).forEach(f => {
		if (f.type.startsWith('image/')) {
			image_urls.push(f.key)
		} else {
			file_ids.push(f.key)
		}
	})

	const payloadOptions: any = { file_ids, image_urls }
	if (supportsWebSearch.value) {
		payloadOptions.enable_web_search = isWebSearchEnabled.value
	}

	// Reset scroll lock when user sends a new message
	isUserScrolledUp.value = false
	failedMessageContent.value = null

	// 1. Clear input if not initial
	if (!isInitial) {
		inputMessage.value = ''
		editor.value?.commands.clearContent()
		uploadedFiles.value = []
		localStorage.removeItem(DRAFT_PREFIX + currentConversationId.value)
	}

	// 2. Add user message ONLY IF not already there (initial messages are added by the caller)
	if (!isInitial) {
		conversationStore.addMessage(conversationId, {
			role: 'user',
			content: userMessage,
		})

		// Auto-update title if needed
		const currentTitle = currentConversation.value?.title
		if (!currentTitle || currentTitle === 'New conversation') {
			const newTitle = userMessage.length > 40 ? userMessage.substring(0, 40) + '...' : userMessage
			conversationStore.updateTitle(conversationId, newTitle)
		}
	}

	// 3. Set loading and add assistant placeholder
	chatStore.setLoading(true, conversationId)
	abortController.value = new AbortController()

	try {
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
		const mergedParams = { ...modelDefaults, ...userParams, ...payloadOptions }
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

		let tokenBuffer = ''
		let lastFlushTime = Date.now()
		const FLUSH_INTERVAL = 60 // 60ms throttle for UI updates

		await fetchChatStream({
			message: userMessage,
			model,
			options: {
				...options,
				context,
			},
			signal: abortController.value.signal,
			onMessage: (content) => {
				tokenBuffer += content
				const now = Date.now()
				if (now - lastFlushTime > FLUSH_INTERVAL) {
					// Use the lightweight update method
					conversationStore.updateLastMessageContent(conversationId, tokenBuffer)
					tokenBuffer = ''
					lastFlushTime = now
				}
			},
			onError: (error) => {
				const lastMsg = currentConversation.value?.messages[currentConversation.value.messages.length - 1]
				if (lastMsg?.role === 'assistant' && !lastMsg.content) {
					conversationStore.removeLastAssistantMessage(conversationId)
				}
				failedMessageContent.value = userMessage
				uiStore.showToast(error?.message || t('chat.connection_failed'), 'error')
			},
			onFinish: () => {
				abortController.value = null
				// Final flush of any remaining tokens
				if (tokenBuffer) {
					conversationStore.updateLastMessageContent(conversationId, tokenBuffer)
				}
				// Call the full update method once at the end to sync updatedAt and trigger storage save
				const finalContent = currentConversation.value?.messages[currentConversation.value.messages.length - 1]?.content || ''
				conversationStore.updateLastMessage(conversationId, finalContent, false)

				chatStore.setLoading(false)
			},
		})
	} catch (error: any) {
		abortController.value = null
		conversationStore.removeLastAssistantMessage(conversationId)
		if (error?.name !== 'AbortError') {
			failedMessageContent.value = userMessage
			uiStore.showToast(t('chat.send_failed'), 'error')
		}
		chatStore.setLoading(false)
	}
}

const copyMessage = (content: string) => {
	navigator.clipboard.writeText(content).then(() => {
		uiStore.showToast(t('chat.copied'))
	}).catch(() => {
		uiStore.showToast(t('chat.copy_failed'), 'error')
	})
}


const shareMessage = (content: string) => {
	navigator.clipboard.writeText(content).then(() => {
		uiStore.showToast(t('chat.copied'))
	}).catch(() => {
		uiStore.showToast(t('chat.copy_failed'), 'error')
	})
}

const regenerateMessage = () => {
	if (!currentConversation.value || chatStore.isLoading) return
	const messages = currentConversation.value.messages
	// Remove the last assistant message and resend
	const lastUserMsgIndex = [...messages].reverse().findIndex(m => m.role === 'user')
	if (lastUserMsgIndex === -1) return
	const lastUserMsg = messages[messages.length - 1 - lastUserMsgIndex]
	if (!lastUserMsg) return
	conversationStore.truncateFromMessage(currentConversationId.value, lastUserMsg.id)
	if (editor.value) {
		editor.value.commands.setContent(lastUserMsg.content)
		inputMessage.value = lastUserMsg.content
		sendMessage()
	}
}

const startEditing = (message: any) => {
	editingMessageId.value = message.id
	editingContent.value = message.content
	nextTick(() => {
		if (editContentRef.value) {
			editContentRef.value.textContent = message.content
			// Place cursor at end
			const range = document.createRange()
			const sel = window.getSelection()
			range.selectNodeContents(editContentRef.value)
			range.collapse(false)
			sel?.removeAllRanges()
			sel?.addRange(range)
			editContentRef.value.focus()
		}
	})
}

const cancelEditing = () => {
	editingMessageId.value = null
	editingContent.value = ''
}

const submitEdit = () => {
	const content = (editContentRef.value?.textContent || editingContent.value).trim()
	if (!content) return

	const messageId = editingMessageId.value!
	cancelEditing()

	// Truncate conversation from the edited message onwards, then regenerate
	conversationStore.truncateFromMessage(currentConversationId.value, messageId)

	if (editor.value) {
		editor.value.commands.setContent(content)
		inputMessage.value = content
		sendMessage()
	}
}

const retryMessage = () => {
	if (!failedMessageContent.value || chatStore.isLoading) return
	const content = failedMessageContent.value
	failedMessageContent.value = null
	if (editor.value) {
		editor.value.commands.setContent(content)
		inputMessage.value = content
		sendMessage()
	}
}

// Global click handler for dynamic content (like code block copy buttons)
const handleMessageClick = (e: MouseEvent) => {
	const target = e.target as HTMLElement
	// Check if clicked element or parent is .copy-code-btn
	const btn = target.closest('.copy-code-btn') as HTMLElement

	if (btn) {
		const code = btn.getAttribute('data-code')
		if (code) {
			copyMessage(code)
		}
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

/* Code Block Styles */
:deep(.code-block-wrapper) {
	margin: 0.5rem 0 1rem 0;
	/* Reduced top margin further */
	border-radius: 0.75rem;
	overflow: hidden;
	background-color: #1a1a1b;
	/* Sleeker dark background */
	border: 1px solid var(--border-light);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.code-block-wrapper pre) {
	margin: 0 !important;
	/* Reset default prose margins */
	padding: 1.25rem;
}

:deep(.code-block-header) {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.625rem 1rem;
	background-color: rgba(255, 255, 255, 0.03);
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	font-size: 0.7rem;
	color: var(--text-tertiary);
	font-weight: 500;
	letter-spacing: 0.025em;
}

:deep(.code-lang) {
	font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
	text-transform: uppercase;
	opacity: 0.8;
}

:deep(.copy-code-btn) {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	cursor: pointer;
	padding: 0.25rem 0.625rem;
	border-radius: 0.375rem;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	color: var(--text-tertiary);
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid transparent;
}

:deep(.copy-code-btn:hover) {
	background-color: rgba(255, 255, 255, 0.1);
	color: var(--text-primary);
	border-color: rgba(255, 255, 255, 0.1);
}

:deep(.copy-code-btn:active) {
	transform: scale(0.96);
}

:deep(.hljs) {
	padding: 1.25rem;
	margin: 0 !important;
	background: transparent !important;
	font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
	font-size: 0.825rem;
	line-height: 1.6;
	overflow-x: auto;
}
</style>
