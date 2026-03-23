import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useModelStore } from '~/stores/models'

/**
 * Extracts dynamic parameter fields from the selected model's model_input.fields.
 * Eliminates duplicated logic across chat, image-generation, video-generation, character pages.
 */
export function useInputFields(options?: {
	/** chat/[id] mode: params are stored on the conversation object, not locally */
	externalParams?: Ref<Record<string, any> | undefined>
	/** Callback when local params change (used to sync to conversation) */
	onParamsChange?: (params: Record<string, any>) => void
}) {
	const modelStore = useModelStore()

	// --- Model fields ---

	const modelInputFields = computed(() => {
		return modelStore.selectedModel?.model_input?.fields || {}
	})

	// Fields handled elsewhere (editor, media upload, web search, model params popover) — not shown as pills
	const EXCLUDED_FIELD_KEYS = new Set([
		// Handled by text editor
		'prompt', 'messages',
		// Internal model parameters (shown in ModelParameters popover for chat)
		'temperature', 'top_p', 'top_k', 'max_tokens', 'stream', 'stop',
		'presence_penalty', 'frequency_penalty',
		// Handled by media upload button
		'image_urls', 'file_ids', 'image', 'images', 'input_images', 'input_image',
		'init_image', 'end_image', 'ref_image', 'video', 'input_videos',
		// Handled by web search toggle
		'enable_web_search', 'web_search_query', 'web_search_depth',
	])

	const dynamicSelectFields = computed(() => {
		const fields: any[] = []
		for (const [key, field] of Object.entries(modelInputFields.value)) {
			if ((field as any).type === 'select' && !EXCLUDED_FIELD_KEYS.has(key)) {
				fields.push({ key, ...(field as any) })
			}
		}
		return fields
	})

	const dynamicNumberFields = computed(() => {
		const fields: any[] = []
		for (const [key, field] of Object.entries(modelInputFields.value)) {
			if ((field as any).type === 'number' && !EXCLUDED_FIELD_KEYS.has(key)) {
				fields.push({ key, ...(field as any) })
			}
		}
		return fields
	})

	// --- Params state ---

	const _localParams = ref<Record<string, any>>({})

	const dynamicParams = computed({
		get: () => options?.externalParams?.value ?? _localParams.value,
		set: (val: Record<string, any>) => {
			if (options?.externalParams) {
				options.onParamsChange?.(val)
			} else {
				_localParams.value = val
			}
		},
	})

	// Reset defaults when model changes (only for local params mode)
	watch(
		() => modelStore.selectedModel,
		(model) => {
			if (options?.externalParams) return // external mode: parent controls params
			if (!model?.model_input?.fields) return
			const fields = model.model_input.fields
			const newParams: Record<string, any> = {}
			for (const [key, field] of Object.entries(fields)) {
				if (EXCLUDED_FIELD_KEYS.has(key)) continue
				if (field.default !== undefined) {
					newParams[key] = field.default
				} else if ((field as any).options?.length > 0) {
					newParams[key] = (field as any).options[0]
				} else if (field.type === 'number') {
					newParams[key] = field.min || 1
				}
			}
			_localParams.value = newParams
		},
		{ immediate: true },
	)

	// --- Capability detection ---

	const capability = computed(() => {
		const model = modelStore.selectedModel
		return model?.model_input?.capability || model?.capabilities?.[0] || 'chat'
	})

	const isImageModel = computed(() => {
		const cap = capability.value
		return cap === 'image_generation' || cap === 'image'
	})

	const isVideoModel = computed(() => {
		const cap = capability.value
		return cap === 'video_generation' || cap === 'video'
	})

	const isMediaModel = computed(() => isImageModel.value || isVideoModel.value)

	// --- Feature support detection ---

	const supportsFileUpload = computed(() => {
		const fields = modelInputFields.value
		return !!(fields.file_ids || fields.image_urls)
	})

	const supportsWebSearch = computed(() => {
		return !!modelInputFields.value.enable_web_search
	})

	const supportsMediaPrompt = computed(() => {
		const f = modelInputFields.value
		return !!(f.image_urls || f.file_ids || f.image || f.images || f.input_images || f.input_image || f.init_image || f.end_image || f.ref_image)
	})

	const supportsMultipleImages = computed(() => {
		return 'input_images' in modelInputFields.value || 'images' in modelInputFields.value
	})

	const mediaImageUploadLimit = computed(() => {
		const f = modelInputFields.value
		if (f.input_images || f.images) return Infinity
		if (f.init_image && f.end_image) return 2
		return 1
	})

	// --- Dropdown state ---

	const activeDropdown = ref<string | null>(null)

	const toggleDropdown = (key: string) => {
		activeDropdown.value = activeDropdown.value === key ? null : key
	}

	const closeDropdown = () => {
		activeDropdown.value = null
	}

	const setParamAndClose = (key: string, val: any) => {
		if (options?.externalParams) {
			options.onParamsChange?.({ ...options.externalParams.value, [key]: val })
		} else {
			_localParams.value = { ..._localParams.value, [key]: val }
		}
		activeDropdown.value = null
	}

	const setParam = (key: string, val: any) => {
		if (options?.externalParams) {
			options.onParamsChange?.({ ...options.externalParams.value, [key]: val })
		} else {
			_localParams.value = { ..._localParams.value, [key]: val }
		}
	}

	// --- Aspect ratio preview ---

	const getPreviewStyle = (ratio: string) => {
		const baseSize = 120
		const parts = ratio.split(':').map(Number)
		const w = parts[0]
		const h = parts[1]
		if (w && h && w > 0 && h > 0) {
			if (w >= h) {
				return { width: baseSize + 'px', height: (baseSize * h / w) + 'px' }
			} else {
				return { width: (baseSize * w / h) + 'px', height: baseSize + 'px' }
			}
		}
		return { width: baseSize + 'px', height: baseSize + 'px' }
	}

	return {
		// Fields
		modelInputFields,
		dynamicSelectFields,
		dynamicNumberFields,
		dynamicParams,
		// Capability
		capability,
		isImageModel,
		isVideoModel,
		isMediaModel,
		// Feature support
		supportsFileUpload,
		supportsWebSearch,
		supportsMediaPrompt,
		supportsMultipleImages,
		mediaImageUploadLimit,
		// Dropdown
		activeDropdown,
		toggleDropdown,
		closeDropdown,
		setParamAndClose,
		setParam,
		// Utils
		getPreviewStyle,
	}
}
