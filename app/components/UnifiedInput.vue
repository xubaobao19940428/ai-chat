<template>
	<div :class="['w-full', floating ? 'pointer-events-none' : '']">
		<div :class="['w-full max-w-[860px] mx-auto', floating ? 'pointer-events-auto' : '']">
			<!-- Suggested Questions -->
			<div v-if="suggestedQuestions?.length" class="mb-4 flex flex-wrap justify-center gap-2">
				<button v-for="q in suggestedQuestions" :key="q" @click="$emit('select-question', q)"
					class="flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded-full border border-[var(--border-light)] transition-all text-sm font-medium shadow-sm active:scale-95">
					{{ q }}
				</button>
			</div>

			<!-- Input Container -->
			<div ref="containerRef"
				class="bg-[var(--fill-input-chat)] rounded-[22px] border border-black/5 dark:border-[var(--border-main)] py-3 shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] flex flex-col gap-3 transition-all duration-300 focus-within:border-black/10">

				<!-- Uploaded Files Preview -->
				<div v-if="fileUpload.uploadedFiles.value.length > 0" class="px-3 flex items-center gap-3 flex-wrap">
					<div v-for="(file, index) in fileUpload.uploadedFiles.value" :key="file.id"
						class="relative shrink-0 group/preview">
						<img v-if="file.type?.startsWith('image/')" :src="file.url"
							class="w-14 h-14 object-cover rounded-2xl border border-[var(--border-main)] shadow-sm" />
						<div v-else
							class="w-14 h-14 rounded-2xl border border-[var(--border-main)] shadow-sm bg-[var(--fill-tsp-gray-main)] flex items-center justify-center">
							<FileText :size="20" class="text-[var(--text-tertiary)]" />
						</div>
						<div v-if="file.uploading"
							class="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
							<Loader2 :size="18" class="animate-spin text-white" />
						</div>
						<button v-else @click="fileUpload.removeFileByIndex(index)"
							class="absolute -top-1.5 -right-1.5 size-[18px] bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/preview:opacity-100 transition-all scale-75 group-hover/preview:scale-100">
							<X :size="9" stroke-width="3.5" />
						</button>
					</div>
					<!-- Quick add button for multiple images -->
					<button v-if="fields.supportsMultipleImages.value && capability !== 'chat'"
						@click="triggerMediaUpload"
						class="w-14 h-14 shrink-0 rounded-2xl border-2 border-dashed border-[var(--border-main)] flex items-center justify-center hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] transition-all">
						<Plus :size="16" class="text-[var(--text-tertiary)]" />
					</button>
				</div>

				<!-- Editor -->
				<div
					class="overflow-auto ps-4 pe-2 bg-transparent pt-[1px] border-0 w-full text-[var(--text-primary)] placeholder:text-[var(--text-disable)] text-[15px] leading-[24px] min-h-[44px] max-h-[216px]">
					<EditorContent v-if="editor" :editor="editor" />
				</div>

				<!-- Toolbar -->
				<div class="flex items-center justify-between px-3 gap-2">
					<div class="flex items-center gap-1.5 flex-wrap flex-1">
						<!-- Model Selector -->
						<ModelSelector v-if="showModelSelector" variant="pill" :capability="allowModelSwitch ? undefined : capability" class="mr-0.5 hidden lg:flex" />

						<!-- === Capability-specific Parameters === -->
						<ImageGenerationParams
							v-if="capability === 'image_generation' || (showModelSelector && fields.isImageModel.value)"
							:fields="fields"
							:media-files="mediaFiles"
							:is-uploading="fileUpload.isUploading.value"
							:external-params="externalParams"
							@trigger-upload="triggerMediaUploadAndClose"
							@select-asset="selectAssetAndClose"
						/>

						<VideoGenerationParams
							v-else-if="capability === 'video_generation' || (showModelSelector && fields.isVideoModel.value)"
							:fields="fields"
							:all-files="fileUpload.uploadedFiles.value"
							:is-uploading="fileUpload.isUploading.value"
							:external-params="externalParams"
							:uploading-param="mediaTargetParam"
							@trigger-upload="triggerParamUpload"
							@select-asset="selectAssetForParam"
							@remove-media="removeMediaByParam"
						/>

						<ChatParams
							v-else-if="capability === 'chat' && showModelSelector"
							:fields="fields"
							:is-web-search-enabled="isWebSearchEnabled"
							:is-uploading="fileUpload.isUploading.value"
							:external-params="externalParams"
							:media-files="mediaFiles"
							@trigger-upload="fileUpload.triggerFileUpload('*', true)"
							@select-asset="selectAssetAndClose"
							@reset-params="$emit('update:params', {})"
							@update:params="(v: any) => $emit('update:params', v)"
							@update:web-search="(v: boolean) => isWebSearchEnabled = v"
						/>
					</div>

					<!-- Voice Input -->
					<button disabled :title="$t('chat.voice_input')" class="flex items-center justify-center size-10 flex-shrink-0 rounded-full transition-colors self-end opacity-30 cursor-not-allowed">
						<Mic :size="18" class="text-[var(--text-secondary)]" />
					</button>

					<!-- Send / Stop Button -->
					<button v-if="isLoading" @click="$emit('stop')"
						class="unified-send-btn shrink-0 self-end">
						<Square :size="14" fill="currentColor" />
					</button>
					<button v-else @click="handleSend"
						:disabled="(!hasContent && fileUpload.uploadedFiles.value.length === 0) || fileUpload.isUploading.value"
						class="unified-send-btn disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shrink-0 self-end">
						<Sparkles v-if="capability === 'image_generation' || capability === 'video_generation'"
							:size="20" fill="currentColor" />
						<ArrowUp v-else :size="18" :stroke-width="2.5" />
					</button>
				</div>
			</div>

			<!-- Hidden File Input -->
			<input type="file" ref="fileInputElement" class="hidden" @change="handleFileInputChange" />

			<!-- Asset Picker Modal -->
			<AssetPickerModal :show="isAssetPickerOpen"
				:multiple="fields.supportsMultipleImages.value"
				file-type="image" @close="isAssetPickerOpen = false" @select="onAssetsSelected" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
	ArrowUp, Square, Sparkles, Plus, X, Loader2, FileText, Mic
} from 'lucide-vue-next'
import { useModelStore } from '~/stores/models'
import { useInputFields } from '~/composables/useInputFields'
import { useFileUpload } from '~/composables/useFileUpload'
import { useTypewriter } from '~/composables/useTypewriter'
import ModelSelector from '~/components/ModelSelector.vue'
import AssetPickerModal from '~/components/AssetPickerModal.vue'
import ChatParams from '~/components/input-params/ChatParams.vue'
import ImageGenerationParams from '~/components/input-params/ImageGenerationParams.vue'
import VideoGenerationParams from '~/components/input-params/VideoGenerationParams.vue'

const props = withDefaults(defineProps<{
	capability: 'chat' | 'image_generation' | 'video_generation'
	isLoading?: boolean
	characterName?: string
	suggestedQuestions?: string[]
	floating?: boolean
	showModelSelector?: boolean
	externalParams?: Record<string, any>
	placeholderText?: string
	allowModelSwitch?: boolean
}>(), {
	isLoading: false,
	floating: false,
	showModelSelector: true,
	allowModelSwitch: false,
})

const emit = defineEmits<{
	send: [payload: { content: string; params: Record<string, any>; files: any[]; mediaFiles: any[] }]
	stop: []
	'select-question': [question: string]
	'update:params': [params: Record<string, any>]
}>()

// --- Stores ---
const modelStore = useModelStore()

// --- Composables ---
const externalParamsRef = computed(() => props.externalParams)

const fields = useInputFields({
	externalParams: props.externalParams !== undefined ? externalParamsRef : undefined,
	onParamsChange: (params) => emit('update:params', params),
})

const fileUpload = useFileUpload({ purpose: props.capability === 'chat' ? 'general' : 'generation' })

const placeholderFn = () => {
	if (props.placeholderText) return props.placeholderText
	if (props.characterName) return `Message ${props.characterName}...`
	if (props.capability === 'image_generation') return 'Describe an image and click generate...'
	if (props.capability === 'video_generation') return 'Describe a video and click generate...'
	return 'Message Aura...'
}
const { displayedText: displayedPlaceholder } = useTypewriter(placeholderFn)

// --- State ---
const containerRef = ref<HTMLElement | null>(null)
const fileInputElement = ref<HTMLInputElement | null>(null)
const isAssetPickerOpen = ref(false)
const isWebSearchEnabled = ref(true)
const hasContent = ref(false)

// Sync fileInputRef
watch(fileInputElement, (el) => {
	fileUpload.fileInputRef.value = el
})

// --- Editor ---
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
			placeholder: () => displayedPlaceholder.value,
		}),
	],
	editorProps: {
		attributes: {
			class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[44px] py-3 text-[15px] font-medium leading-relaxed text-[var(--text-primary)]',
		},
		handleKeyDown: (_view, event) => {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault()
				handleSend()
				return true
			}
			return false
		},
		handlePaste: (_view, event) => {
			if (!event.clipboardData) return false
			const items = Array.from(event.clipboardData.items)
			const imageItems = items.filter((item) => item.type?.startsWith('image/'))
			if (imageItems.length === 0) return false
			event.preventDefault()
			const files = imageItems.map((item) => item.getAsFile()).filter(Boolean) as File[]
			if (files.length > 0) {
				fileUpload.uploadFiles(files, fields.mediaImageUploadLimit.value)
			}
			return true
		},
	},
	onUpdate: ({ editor: e }) => {
		hasContent.value = !e.isEmpty
	},
})

// Force Tiptap to re-render placeholder as typewriter updates
watch(displayedPlaceholder, () => {
	if (editor.value && editor.value.isEmpty) {
		editor.value.view.dispatch(editor.value.state.tr)
	}
})

// --- Computed ---
const mediaFiles = computed(() => fileUpload.uploadedFiles.value.filter((f) => f.type?.startsWith('image/')))

// --- Slot-based upload for video start/end frame ---
const mediaTargetSlot = ref<number | null>(null)
/** Which param key is currently being uploaded for (video media) */
const mediaTargetParam = ref<string | null>(null)

// --- Methods ---
function triggerMediaUpload() {
	const accept = fields.isVideoModel.value ? 'image/png,image/jpeg,video/mp4' : 'image/*'
	const multiple = fields.supportsMultipleImages.value
	fileUpload.triggerFileUpload(accept, multiple)
}

function triggerMediaUploadAndClose() {
	fields.closeDropdown()
	triggerMediaUpload()
}

function triggerSlotUpload(slot: number) {
	fields.closeDropdown()
	mediaTargetSlot.value = slot
	fileUpload.triggerFileUpload('image/png,image/jpeg', false)
}

/** Param-keyed upload trigger for video generation */
function triggerParamUpload(paramKey: string) {
	fields.closeDropdown()
	mediaTargetParam.value = paramKey
	const isVideo = paramKey === 'video' || paramKey === 'input_videos'
	const isMulti = paramKey === 'input_images' || paramKey === 'input_videos'
	const accept = isVideo ? 'video/mp4,video/*' : 'image/png,image/jpeg,image/*'
	fileUpload.triggerFileUpload(accept, isMulti)
}

function selectAssetAndClose() {
	fields.closeDropdown()
	mediaTargetSlot.value = null
	mediaTargetParam.value = null
	isAssetPickerOpen.value = true
}

function selectAssetForSlot(slot: number) {
	fields.closeDropdown()
	mediaTargetSlot.value = slot
	isAssetPickerOpen.value = true
}

/** Param-keyed asset picker for video generation */
function selectAssetForParam(paramKey: string) {
	fields.closeDropdown()
	mediaTargetParam.value = paramKey
	isAssetPickerOpen.value = true
}

function removeMediaAtSlot(slot: number) {
	fileUpload.removeFileByIndex(slot)
}

/** Param-keyed remove for video generation */
function removeMediaByParam(paramKey: string) {
	fileUpload.removeFileByParam(paramKey)
}

async function handleFileInputChange(event: Event) {
	const target = event.target as HTMLInputElement
	const files = target.files
	if (!files || files.length === 0) return

	if (mediaTargetParam.value !== null) {
		// Param-keyed upload for video generation
		const paramKey = mediaTargetParam.value
		const isMulti = paramKey === 'input_images' || paramKey === 'input_videos'
		if (isMulti) {
			await fileUpload.uploadFilesForParam(Array.from(files), paramKey)
		} else {
			await fileUpload.uploadFileForParam(files[0]!, paramKey)
		}
		mediaTargetParam.value = null
	} else if (mediaTargetSlot.value !== null) {
		// Slot-based upload for video start/end frame
		await fileUpload.uploadFileToSlot(files[0]!, mediaTargetSlot.value)
		mediaTargetSlot.value = null
	} else {
		// Default: append files
		await fileUpload.handleFileChange(event)
	}
	if (target) target.value = ''
}

function onAssetsSelected(assets: { key: string; url: string }[]) {
	if (mediaTargetParam.value !== null) {
		// Param-keyed asset for video generation
		const paramKey = mediaTargetParam.value
		const isMulti = paramKey === 'input_images' || paramKey === 'input_videos'
		for (const asset of assets) {
			fileUpload.addAssetForParam(asset, paramKey, !isMulti)
		}
		mediaTargetParam.value = null
	} else if (mediaTargetSlot.value !== null) {
		if (assets.length > 0) {
			fileUpload.addAssetAtSlot(assets[0]!, mediaTargetSlot.value)
		}
		mediaTargetSlot.value = null
	} else {
		fileUpload.addFromAssets(assets)
	}
	isAssetPickerOpen.value = false
}

function handleSend() {
	if (!editor.value) return
	const content = editor.value.getText().trim()
	if (!content && fileUpload.uploadedFiles.value.length === 0) return

	const params: Record<string, any> = { ...fields.dynamicParams.value }

	// Web search
	if (isWebSearchEnabled.value && fields.supportsWebSearch.value) {
		params.enable_web_search = true
	}

	// Map media files to appropriate fields
	const readyMediaFiles = fileUpload.getImageFiles().filter((f) => !f.uploading)
	const allReadyFiles = fileUpload.getReadyFiles()

	emit('send', {
		content,
		params,
		files: allReadyFiles,
		mediaFiles: readyMediaFiles,
	})

	// Clear after send
	editor.value.commands.clearContent()
	hasContent.value = false
	fileUpload.clearFiles()
}

// --- Click outside to close dropdowns ---
function handleClickOutside(e: MouseEvent) {
	if (!fields.activeDropdown.value || !containerRef.value) return
	const target = e.target as Node
	// Don't close if clicking inside the container
	if (containerRef.value.contains(target)) return
	// Don't close if clicking inside a teleported popover
	const el = target as HTMLElement
	if (el.closest?.('[data-ratio-popover]')) return
	fields.closeDropdown()
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})

// --- Expose ---
defineExpose({
	setContent: (text: string) => {
		editor.value?.commands.setContent(text)
		hasContent.value = !!text
	},
	clearContent: () => {
		editor.value?.commands.clearContent()
		hasContent.value = false
	},
	focus: () => {
		editor.value?.commands.focus()
	},
	getContent: () => editor.value?.getText() || '',
	addFiles: (files: File[]) => {
		fileUpload.uploadFiles(files)
	},
	setParams: (params: Record<string, any>) => {
		const current = fields.dynamicParams.value
		fields.dynamicParams.value = { ...current, ...params }
	},
})
</script>

<style scoped>
/* === Tiptap Placeholder === */
:deep(.tiptap p.is-editor-empty:first-child::before) {
	content: attr(data-placeholder);
	float: left;
	color: var(--text-tertiary);
	pointer-events: none;
	height: 0;
}

/* === Send Button === */
.unified-send-btn {
	display: flex; align-items: center; justify-content: center;
	width: 2.5rem; height: 2.5rem;
	background: var(--text-primary); color: var(--bg-main);
	border-radius: 9999px; transition: transform 0.15s;
}
.unified-send-btn:active { transform: scale(0.9); }

/* === Scrollbar === */
.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: var(--border-dark);
	border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
</style>
