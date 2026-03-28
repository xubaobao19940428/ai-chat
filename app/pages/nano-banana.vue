<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">
		<!-- Header: Mobile only -->
		<header class="lg:hidden bg-[var(--bg-main)] px-4 shrink-0 z-10">
			<div class="flex items-center justify-between gap-3 py-2">
				<div class="flex items-center gap-3">
					<button @click="uiStore.openMobileMenu()" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
						<Menu :size="20" />
					</button>
				</div>
			</div>
		</header>

		<!-- Scrollable Main Content -->
		<div class="flex-1 overflow-y-auto custom-scrollbar">
			<div class="flex flex-col items-center px-4 pt-[18vh]">
				<div class="w-full max-w-full sm:max-w-[768px] sm:min-w-[390px] mx-auto">
					<!-- Title -->
					<div class="flex flex-col items-center gap-4 mb-8 animate-fade-in-up" style="animation-delay: 0.1s; animation-fill-mode: forwards">
						<div class="size-14 rounded-2xl flex items-center justify-center">
							<img src="/nanobanana-color.png" alt="Nano Banana" class="w-16 h-16 object-contain" />
						</div>
						<h1 class="text-[var(--text-primary)] text-center font-serif text-[32px] tracking-tight">Nano Banana</h1>
					</div>

					<!-- Input Area -->
					<div class="flex flex-col gap-1 w-full animate-fade-in-up" style="animation-delay: 0.2s; animation-fill-mode: forwards">
						<UnifiedInput ref="unifiedInputRef" capability="image_generation" :is-loading="isLoading" :show-model-selector="true" :allow-model-switch="false" provider="google" placeholder-text="Describe an image to generate with Nano Banana..." @send="handleSend" />
					</div>

					<!-- TODO: Prompt Gallery Section - hidden until API is ready -->
					<!-- <div class="mt-10 animate-fade-in-up" style="animation-delay: 0.3s; animation-fill-mode: forwards">
						... prompt gallery will be enabled when API is available ...
					</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ hideTopBar: true })

import { ref, computed, onMounted } from 'vue'
import { Menu } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import { useModelStore } from '@/stores/models'
import { useConversationStore } from '@/stores/conversation'
import { useChatStore } from '@/stores/chat'
import { getModels } from '@/api/models'
import UnifiedInput from '@/components/UnifiedInput.vue'
import { encodeId } from '@/utils/sqids'

const router = useRouter()
const uiStore = useUIStore()
const modelStore = useModelStore()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const { t } = useI18n()

const unifiedInputRef = ref<InstanceType<typeof UnifiedInput> | null>(null)
const isLoading = ref(false)

// Fetch Google image models and auto-select on mount
onMounted(async () => {
	try {
		modelStore.setActiveCapability('image_generation')
		const res: any = await getModels({ provider: 'google', capability: 'image' })
		const googleModels = res.data || []
		if (googleModels.length > 0) {
			// Prefer "nano-banana" model if available
			const nanoBanana = googleModels.find((m: any) => m.model?.toLowerCase().includes('nano') || m.display_name?.toLowerCase().includes('nano')) || googleModels[0]
			modelStore.selectModel(`${nanoBanana.provider}:${nanoBanana.model}`, 'image_generation')
		}
	} catch (e) {
		console.error('Failed to fetch Google image models:', e)
	}
})

// Handle sending a prompt
const handleSend = async (payload: { content: string; params: Record<string, any>; files: any[]; mediaFiles: any[] }) => {
	const content = payload.content
	if (!content.trim() && payload.files.length === 0) return

	isLoading.value = true

	try {
		const modelId = modelStore.selectedModelId || 'google:gemini-2.0-flash-exp'

		const image_urls: string[] = []
		const file_ids: string[] = []
		payload.files.forEach((f: any) => {
			if (f.type?.startsWith('image/')) {
				image_urls.push(f.key)
			} else {
				file_ids.push(f.key)
			}
		})

		const payloadOptions: any = { ...payload.params, file_ids, image_urls, files: payload.files }

		// Map media files based on model fields
		const model = modelStore.selectedModel
		const fields = model?.model_input?.fields || {}
		if (payload.mediaFiles.length > 0) {
			if ('input_images' in fields) {
				payloadOptions.input_images = payload.mediaFiles.map((f) => f.url)
			} else if ('image' in fields) {
				payloadOptions.image = payload.mediaFiles[0]?.url
			} else if ('images' in fields) {
				payloadOptions.images = payload.mediaFiles.map((f) => f.url)
			} else if ('ref_image' in fields) {
				payloadOptions.ref_image = payload.mediaFiles[0]?.url
			}
		}

		// Create conversation
		const conversationId = await conversationStore.createConversation({
			model: modelId,
			model_id: model?.id,
			group_id: conversationStore.selectedGroupId || 0,
			params: payloadOptions,
			capability: 'image',
		})

		// Add user message
		conversationStore.addMessage(conversationId, {
			role: 'user',
			content: content,
		})

		// Set pending message so chat page triggers generation
		chatStore.setPendingMessage(content)

		// Navigate to chat
		router.push(`/chat/${encodeId(conversationId)}`)
	} catch (e) {
		console.error('Failed to create Nano Banana conversation:', e)
	} finally {
		isLoading.value = false
	}
}

// TODO: Re-enable when API is ready
// const handlePromptClick = (prompt: { prompt: string }) => {
// 	unifiedInputRef.value?.setContent(prompt.prompt)
// 	unifiedInputRef.value?.focus()
// }

// --- Categories (hidden until API is ready) ---
// const activeCategory = ref('all')
// const categories = computed(() => [ ... ])
// const allPrompts = [ ... ]
// const filteredPrompts = computed(() => { ... })
</script>

<style scoped lang="scss">
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in-up {
	opacity: 0;
	animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: var(--border-light) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: var(--border-light);
		border-radius: 10px;

		&:hover {
			background: var(--text-tertiary);
		}
	}
}

.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
