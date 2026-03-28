<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-hidden relative transition-colors">
		<!-- Top Header Bar -->
		<header class="flex-shrink-0 flex items-center justify-between px-4 h-[52px] bg-[var(--bg-main)]/80 backdrop-blur-md z-20">
			<button @click="handleGoBack" class="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
				<ArrowLeft :size="16" />
			</button>
			<span v-if="character?.name" class="absolute left-1/2 -translate-x-1/2 text-[14px] font-semibold text-[var(--text-primary)] truncate max-w-[40%] text-center pointer-events-none">{{ character.name }}</span>
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

		<!-- Character Detail -->
		<div v-else class="flex-1 overflow-y-auto custom-scrollbar px-4 pb-48 pt-6">
			<div class="max-w-full md:max-w-[840px] mx-auto w-full">
				<!-- Character Profile Section -->
				<div class="flex flex-col items-center pt-12 pb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
					<!-- Avatar -->
					<div class="w-[88px] h-[88px] rounded-2xl overflow-hidden border-2 border-[var(--border-light)] bg-[var(--bg-main)] flex-shrink-0 mb-6 shadow-sm">
						<img v-if="character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
						<div v-else class="w-full h-full flex items-center justify-center text-4xl">🤖</div>
					</div>

					<!-- Name -->
					<h1 class="text-[28px] font-black text-[var(--text-primary)] leading-tight tracking-tight mb-4 text-center">
						{{ character.name }}
					</h1>

					<!-- Description -->
					<p class="text-[15px] text-[var(--text-secondary)] leading-relaxed font-normal max-w-[480px] text-center">
						{{ character.description }}
					</p>
				</div>

				<!-- Welcome Message -->
				<div v-if="character.welcome" class="w-full max-w-[700px] mx-auto mb-8 px-0 sm:px-0">
					<div class="flex gap-3">
						<div class="flex-shrink-0 mt-0.5">
							<div class="size-6 rounded-md overflow-hidden border border-[var(--border-light)] bg-[var(--bg-main)] flex items-center justify-center shadow-sm">
								<img v-if="character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
								<Bot v-else :size="12" class="text-[var(--text-secondary)]" />
							</div>
						</div>
						<div class="flex flex-col">
							<span class="text-[14px] font-bold text-[var(--text-primary)] mb-1">{{ character.name }}</span>
							<div class="text-[15px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap opacity-90">
								{{ character.welcome }}
							</div>
						</div>
					</div>
				</div>

				</div>
		</div>

		<!-- Floating Input -->
		<div v-if="character" class="absolute left-0 right-0 z-50 px-4 pointer-events-none"
			:style="{ bottom: keyboardHeight > 0 ? `${keyboardHeight + 8}px` : '12px' }">
			<div class="max-w-[840px] mx-auto relative pointer-events-auto">
				<!-- Suggested Questions above input -->
				<div v-if="displayedQuestions.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full px-1 mb-4">
					<button v-for="(q, idx) in displayedQuestions" :key="idx" @click="handleSendMessage(q)"
						class="flex items-center justify-between gap-3 h-[38px] px-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-main)]/50 backdrop-blur-sm hover:border-[var(--border-main)] hover:bg-[var(--bg-main)] text-[13px] text-[var(--text-primary)] text-left transition-all group/fq shadow-sm">
						<span class="truncate">{{ q }}</span>
						<span class="text-[var(--text-tertiary)] group-hover/fq:text-[var(--text-secondary)] shrink-0 transition-colors">→</span>
					</button>
				</div>

				<UnifiedInput ref="unifiedInputRef" capability="chat" :is-loading="false"
					:character-name="character?.name" :show-model-selector="true" @send="handleUnifiedSend" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Share2, ArrowLeft, Bot } from 'lucide-vue-next'
import UnifiedInput from '~/components/UnifiedInput.vue'
import { getCharacterDetail, type Character } from '~/api/character'
import { useConversationStore } from '~/stores/conversation'
import { useChatStore } from '~/stores/chat'
import { useModelStore } from '~/stores/models'
import { useUIStore } from '~/stores/ui'
import { useKeyboardOffset } from '~/composables/useKeyboardOffset'
import { encodeId, decodeId } from '~/utils/sqids'

definePageMeta({ hideTopBar: true })
const { keyboardHeight } = useKeyboardOffset()

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const modelStore = useModelStore()
const uiStore = useUIStore()

const character = ref<Character | null>(null)
const isLoadingCharacter = ref(true)
const unifiedInputRef = ref<InstanceType<typeof UnifiedInput> | null>(null)

const suggestedQuestions = computed(() => {
	const questions = character.value?.common_questions
	if (Array.isArray(questions) && questions.length > 0) return questions as string[]
	return [] as string[]
})

const displayedQuestions = computed(() => suggestedQuestions.value.slice(0, 4))

const handleGoBack = () => {
	router.back()
}

const handleShare = () => {
	if (navigator.share) {
		navigator.share({ title: character.value?.name, url: window.location.href })
	} else {
		navigator.clipboard.writeText(window.location.href)
		uiStore.showToast('Link copied to clipboard')
	}
}

const handleSendMessage = async (content: string) => {
	if (!content.trim() || !character.value) return
	try {
		const model = modelStore.selectedModelId || 'openai:gpt-4o-mini'
		const conversationId = await conversationStore.createConversation({
			character_id: character.value.id,
			model,
			model_id: modelStore.selectedModel?.id,
			group_id: conversationStore.selectedGroupId || 0,
			capability: 'chat',
		})

		conversationStore.addMessage(conversationId, {
			role: 'user',
			content,
		})

		chatStore.setPendingMessage(content)
		router.push(`/chat/${encodeId(conversationId)}`)
	} catch (e) {
		console.error('Failed to start chat:', e)
		uiStore.showToast('Failed to start chat', 'error')
	}
}

const handleUnifiedSend = async (payload: { content: string; params: Record<string, any>; files: any[]; mediaFiles: any[] }) => {
	await handleSendMessage(payload.content)
}

onMounted(async () => {
	modelStore.setActiveCapability('chat')
	const id = decodeId(route.params.id as string)
	if (!id) {
		isLoadingCharacter.value = false
		return
	}
	try {
		const res: any = await getCharacterDetail(id)
		character.value = res.data
	} catch (error: any) {
		console.error('Failed to load character:', error)
		const msg = error?.response?.data?.message || error?.message || 'Failed to load character'
		uiStore.showToast(msg, 'error')
	} finally {
		isLoadingCharacter.value = false
	}
})
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
</style>
