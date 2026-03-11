<template>
	<div class="relative" ref="containerRef">
		<!-- Variant: Ghost (TopBar style) -->
		<button v-if="variant === 'ghost'" @click="isOpen = !isOpen"
			class="flex h-8 px-2 justify-center items-center gap-1.5 rounded-[8px] clickable hover:bg-[var(--fill-tsp-gray-main)] transition-colors transition-all duration-300 -ml-2 cursor-pointer group">
			<ClientOnly>
				<div class="flex items-center gap-2 max-w-[200px]">
					<img v-if="showIcon" :src="getModelIcon(modelStore.selectedModel)" class="w-4 h-4 object-contain"
						alt="Model" />
					<span
						class="text-[var(--text-primary)] md:text-[18px] text-[16px] font-medium md:leading-[22px] leading-[20px] truncate tracking-tight">{{
							modelStore.selectedModel?.display_name || $t('common.select_model') }}</span>
				</div>
			</ClientOnly>
			<ChevronRight v-if="showChevron" :size="16"
				:class="['text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-all duration-300', isOpen ? 'rotate-90' : '']" />
		</button>

		<!-- Variant: Pill (Chat Input style) -->
		<button v-else-if="variant === 'pill'" @click="isOpen = !isOpen"
			class="flex items-center gap-1.5 rounded-full px-2.5 h-[32px] text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border-main)] group">
			<ClientOnly>
				<div class="flex items-center gap-1.5">
					<img v-if="showIcon" :src="getModelIcon(modelStore.selectedModel)"
						class="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
						alt="Model" />
					<component v-if="!showIcon && icon" :is="icon" class="w-4 h-4 opacity-80 group-hover:opacity-100" />
					<span class="text-xs font-medium">{{ modelStore.selectedModel?.display_name ||
						$t('common.select_model') }}</span>
				</div>
			</ClientOnly>
			<ChevronDown v-if="showChevron" :size="12"
				:class="['text-[var(--text-tertiary)] transition-transform duration-300', isOpen ? 'rotate-180' : '']" />
		</button>

		<!-- Variant: Standard (Original style) -->
		<button v-else @click="isOpen = !isOpen"
			class="flex items-center gap-2.5 px-3 py-2 bg-[var(--fill-tsp-white-main)] hover:bg-[var(--fill-tsp-white-light)] text-[var(--text-primary)] rounded-xl transition-all text-[11px] font-bold cursor-pointer border border-[var(--border-main)] active:scale-95 shadow-[var(--shadow-XS)] group">
			<ClientOnly>
				<div class="flex items-center gap-2 max-w-[140px] sm:max-w-[170px]">
					<img :src="getModelIcon(modelStore.selectedModel)" class="w-4 h-4 object-contain" alt="Model" />
					<span class="truncate">{{ modelStore.selectedModel?.display_name || $t('common.select_model')
						}}</span>
				</div>
			</ClientOnly>
			<ChevronDown v-if="showChevron" :size="14"
				:class="['text-[var(--icon-disable)] transition-transform duration-300', isOpen ? 'rotate-180' : '']" />
		</button>

		<!-- Dropdown Menu -->
		<Teleport to="body">
			<Transition enter-active-class="transition duration-200 ease-out"
				enter-from-class="transform translate-y-1 opacity-0"
				enter-to-class="transform translate-y-0 opacity-100"
				leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
				leave-to-class="opacity-0">
				<div v-if="isOpen" :style="dropdownStyle"
					class="fixed w-[280px] rounded-[12px] bg-[var(--background-white-main)] shadow-[var(--shadow-L)] z-[9999] overflow-hidden border border-[var(--border-main)]">
					<div v-if="modelStore.isLoading" class="p-6 text-center">
						<div
							class="w-5 h-5 border-2 border-[var(--text-blue)] border-t-transparent rounded-full animate-spin mx-auto">
						</div>
					</div>
					<div v-else>
						<!-- Search -->
						<div class="p-2 border-b border-[var(--border-main)]">
							<div
								class="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] bg-[var(--background-gray-main)]">
								<Search :size="13" class="text-[var(--icon-secondary)] flex-shrink-0" />
								<input ref="searchInputRef" v-model="searchQuery" type="text"
									:placeholder="$t('common.search_models')"
									class="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-disable)] outline-none" />
								<button v-if="searchQuery" @click="searchQuery = ''"
									class="text-[var(--icon-secondary)] hover:text-[var(--text-primary)] transition-colors">
									<X :size="12" />
								</button>
							</div>
						</div>
						<!-- List -->
						<div class="max-h-[320px] overflow-y-auto no-scrollbar p-1.5 space-y-0.5">
							<template v-if="filteredModels.length">
								<button v-for="model in filteredModels" :key="model.model"
									@click="selectModel(`${model.provider}:${model.model}`)"
									class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] transition-colors text-left group"
									:class="isSelected(model) ? 'bg-[var(--fill-blue)]' : 'hover:bg-[var(--fill-tsp-white-main)]'">
									<!-- Icon -->
									<div
										class="w-7 h-7 rounded-[7px] bg-[var(--background-gray-main)] flex items-center justify-center flex-shrink-0 overflow-hidden">
										<img :src="getModelIcon(model)" class="w-4 h-4 object-contain"
											:alt="model.display_name" />
									</div>
									<!-- Name + provider -->
									<div class="flex-1 min-w-0">
										<div class="text-[13px] font-medium leading-tight truncate"
											:class="isSelected(model) ? 'text-[var(--text-blue)]' : 'text-[var(--text-primary)]'">
											{{ model.display_name }}
										</div>
										<div class="text-[11px] leading-tight mt-0.5 truncate"
											:class="isSelected(model) ? 'text-[var(--text-blue)]/70' : 'text-[var(--text-tertiary)]'">
											{{ formatProvider(model.provider) }}
										</div>
									</div>
									<!-- Check -->
									<Check v-if="isSelected(model)" :size="13"
										class="flex-shrink-0 text-[var(--text-blue)]" />
								</button>
							</template>
							<div v-else class="py-6 text-center text-[12px] text-[var(--text-tertiary)]">{{
								$t('common.no_models_found') }}</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useModelStore } from '../stores/models'
import { ChevronRight, ChevronDown, Check, Search, X } from 'lucide-vue-next'

const props = withDefaults(
	defineProps<{
		variant?: 'standard' | 'ghost' | 'pill'
		position?: 'top' | 'bottom'
		showIcon?: boolean
		showChevron?: boolean
		icon?: any
		capability?: string
	}>(),
	{
		variant: 'standard',
		position: 'bottom',
		showIcon: true,
		showChevron: true,
	},
)

const modelStore = useModelStore()
const router = useRouter()
const route = useRoute()
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

const filteredModels = computed(() => {
	let models = modelStore.models

	// Filter by capability if provided
	if (props.capability) {
		models = models.filter((m) => m.model_input?.capability === props.capability || m.capabilities?.includes(props.capability!))
	}

	const q = searchQuery.value.trim().toLowerCase()
	if (!q) return models

	return models.filter((m) => m.display_name?.toLowerCase().includes(q) || m.provider?.toLowerCase().includes(q) || m.model?.toLowerCase().includes(q))
})

const updateDropdownPosition = () => {
	if (!containerRef.value || !isOpen.value) return

	const rect = containerRef.value.getBoundingClientRect()
	const style: Record<string, string> = {
		left: `${rect.left}px`,
	}

	if (props.position === 'top') {
		// Display downwards from the top of the element
		style.top = `${rect.bottom + 8}px`
	} else {
		// Display upwards from the top of the element (default/bottom position)
		style.bottom = `${window.innerHeight - rect.top + 8}px`
	}

	// Ensure the dropdown doesn't go off-screen horizontally
	const dropdownWidth = 320 // max width sm:w-80
	if (rect.left + dropdownWidth > window.innerWidth) {
		delete style.left
		style.right = `${window.innerWidth - rect.right}px`
	}

	dropdownStyle.value = style
}

watch(isOpen, async (val) => {
	if (val) {
		await nextTick()
		updateDropdownPosition()
		searchInputRef.value?.focus()
		window.addEventListener('scroll', updateDropdownPosition, true)
		window.addEventListener('resize', updateDropdownPosition)
	} else {
		searchQuery.value = ''
		window.removeEventListener('scroll', updateDropdownPosition, true)
		window.removeEventListener('resize', updateDropdownPosition)
	}
})

// Auto-select first model when filtering changes (e.g. page navigation)
watch(
	() => filteredModels.value,
	(newModels) => {
		if (props.capability && newModels.length > 0) {
			const currentSelected = modelStore.selectedModelId
			const isStillValid = newModels.some((m) => `${m.provider}:${m.model}` === currentSelected)

			if (!isStillValid) {
				const firstModel = newModels[0]
				if (firstModel) {
					modelStore.selectModel(`${firstModel.provider}:${firstModel.model}`)
				}
			}
		}
	},
	{ immediate: true },
)

const getModelIcon = (model: any) => {
	if (!model) return '/icons/deepseek.svg'
	const id = (model.model || '').toLowerCase()
	const provider = (model.provider || '').toLowerCase()

	if (provider.includes('openai') || id.includes('gpt') || id.includes('o1')) return '/icons/openai.svg'
	if (provider.includes('deepseek')) return '/icons/deepseek.svg'
	if (provider.includes('google') || id.includes('gemini')) return '/icons/gemini.svg'
	if (provider.includes('anthropic') || id.includes('claude')) return '/icons/anthropic.svg'
	if (provider.includes('meta') || id.includes('llama')) return '/icons/meta.svg'
	if (provider.includes('zhipu') || id.includes('glm') || id.includes('chatglm')) return '/icons/zhipu.svg'
	if (provider.includes('bytedance') || id.includes('doubao')) return '/icons/doubao.svg'
	if (provider.includes('xai') || id.includes('grok')) return '/icons/grok.svg'
	if (provider.includes('moonshot') || id.includes('kimi')) return '/icons/kimi.svg'
	if (id.includes('fastgpt')) return '/icons/fastgpt.svg'

	return '/icons/deepseek.svg'
}

const isSelected = (model: any) => {
	return modelStore.selectedModelId === `${model.provider}:${model.model}`
}

const formatProvider = (provider: string) => {
	const map: Record<string, string> = {
		openai: 'OpenAI',
		anthropic: 'Anthropic',
		google: 'Google',
		deepseek: 'DeepSeek',
		meta: 'Meta',
		xai: 'xAI',
		bytedance: 'ByteDance',
		moonshot: 'Moonshot',
		zhipu: 'Zhipu AI',
	}
	const key = (provider || '').toLowerCase()
	return map[key] || provider.charAt(0).toUpperCase() + provider.slice(1)
}

const selectModel = (id: string) => {
	modelStore.selectModel(id)
	isOpen.value = false

	const model = modelStore.models.find((m) => `${m.provider}:${m.model}` === id)
	console.log('model', model)

	// Resolve capability
	const cap = model?.model_input?.capability || model?.capabilities?.[0] || ''

	const isImageCap = cap === 'image_generation' || cap === 'image'
	const isVideoCap = cap === 'video_generation' || cap === 'video'
	const currentRoute = route.name as string
	const onImagePage = currentRoute === 'image-generation'
	const onVideoPage = currentRoute === 'video-generation'
	const onMediaPage = onImagePage || onVideoPage

	if (onMediaPage) {
		// Already in a media page: cross-navigate between image/video, or go home for chat models
		if (isImageCap && !onImagePage) {
			router.push('/image-generation')
		} else if (isVideoCap && !onVideoPage) {
			router.push('/video-generation')
		} else if (!isImageCap && !isVideoCap) {
			router.push('/')
		}
	}
	// On home or other pages: don't navigate — WelcomeScreen toolbar handles media models in place
}

const handleClickOutside = (event: MouseEvent) => {
	if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
		isOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.clickable {
	cursor: pointer;
	user-select: none;
}

.no-scrollbar::-webkit-scrollbar {
	display: none;
}

.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
