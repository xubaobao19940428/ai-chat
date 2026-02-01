<template>
	<div class="relative" ref="containerRef">
		<!-- Variant: Ghost (TopBar style) -->
		<button v-if="variant === 'ghost'" @click="isOpen = !isOpen" class="flex h-8 px-2 justify-center items-center gap-1.5 rounded-[8px] clickable hover:bg-[var(--fill-tsp-gray-main)] transition-colors transition-all duration-300 -ml-2 cursor-pointer group">
			<ClientOnly>
				<div class="flex items-center gap-2 max-w-[200px]">
					<img v-if="showIcon" :src="getModelIcon(modelStore.selectedModel)" class="w-4 h-4 object-contain" alt="Model" />
					<span class="text-[var(--text-primary)] md:text-[18px] text-[16px] font-medium md:leading-[22px] leading-[20px] truncate tracking-tight">{{ modelStore.selectedModel?.display_name || 'Select Model' }}</span>
				</div>
			</ClientOnly>
			<svg v-if="showChevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="16" height="16" :class="['text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-all duration-300', isOpen ? 'rotate-180' : '']">
				<path d="M10.1992 18.6367L16.1992 12.6367L10.1992 6.63672" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		</button>

		<!-- Variant: Pill (Chat Input style) -->
		<button v-else-if="variant === 'pill'" @click="isOpen = !isOpen" class="flex items-center gap-1.5 rounded-full px-2.5 h-[32px] text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border-main)] group">
			<ClientOnly>
				<div class="flex items-center gap-1.5">
					<img v-if="showIcon" :src="getModelIcon(modelStore.selectedModel)" class="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity" alt="Model" />
					<component v-if="!showIcon && icon" :is="icon" class="w-4 h-4 opacity-80 group-hover:opacity-100" />
					<span class="text-xs font-medium">{{ modelStore.selectedModel?.display_name || 'Select Model' }}</span>
				</div>
			</ClientOnly>
			<svg v-if="showChevron" class="w-3 h-3 text-[var(--text-tertiary)] transition-transform duration-300" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<!-- Variant: Standard (Original style) -->
		<button v-else @click="isOpen = !isOpen" class="flex items-center gap-2.5 px-3 py-2 bg-[var(--fill-tsp-white-main)] hover:bg-[var(--fill-tsp-white-light)] text-[var(--text-primary)] rounded-xl transition-all text-[11px] font-bold cursor-pointer border border-[var(--border-main)] active:scale-95 shadow-[var(--shadow-XS)] group">
			<ClientOnly>
				<div class="flex items-center gap-2 max-w-[140px] sm:max-w-[170px]">
					<img :src="getModelIcon(modelStore.selectedModel)" class="w-4 h-4 object-contain" alt="Model" />
					<span class="truncate">{{ modelStore.selectedModel?.display_name || 'Select Model' }}</span>
				</div>
			</ClientOnly>
			<svg v-if="showChevron" class="w-3.5 h-3.5 text-[var(--icon-disable)] transition-transform duration-300" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<!-- Dropdown Menu -->
		<Teleport to="body">
			<Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform translate-y-2 scale-95 opacity-0" enter-to-class="transform translate-y-0 scale-100 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform translate-y-2 scale-95 opacity-0">
				<div v-if="isOpen" :style="dropdownStyle" class="fixed w-72 sm:w-80 rounded-2xl bg-[var(--background-white-main)] shadow-[var(--shadow-L)] ring-1 ring-[var(--border-main)] focus:outline-none z-[9999] overflow-hidden p-1.5 backdrop-blur-xl border border-[var(--border-main)]">
					<div v-if="modelStore.isLoading" class="p-6 text-center">
						<div class="w-6 h-6 border-2 border-[var(--text-blue)] border-t-transparent rounded-full animate-spin mx-auto"></div>
					</div>
					<div v-else class="space-y-0.5 max-h-[350px] overflow-y-auto no-scrollbar">
						<div class="px-3 py-2 text-[10px] font-bold text-[var(--text-disable)] uppercase tracking-widest text-start">Available Models</div>
						<button v-for="model in modelStore.models" :key="model.model" @click="selectModel(`${model.provider}:${model.model}`)" class="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left hover:bg-[var(--fill-tsp-white-main)] group relative" :class="{ 'bg-[var(--fill-tsp-white-main)]': modelStore.selectedModelId === `${model.provider}:${model.model}` }">
							<!-- Provider Icon -->
							<div class="flex-shrink-0">
								<div class="w-8 h-8 rounded-lg bg-[var(--background-white-main)] border border-[var(--border-main)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[var(--shadow-XS)] overflow-hidden">
									<img :src="getModelIcon(model)" class="w-5 h-5 object-contain" :alt="model.display_name" />
								</div>
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0 text-start">
								<div class="flex items-center gap-2">
									<span class="text-sm font-bold text-[var(--text-primary)] truncate">{{ model.display_name }}</span>
									<div v-if="modelStore.selectedModelId === `${model.provider}:${model.model}`" class="w-1.5 h-1.5 rounded-full bg-[var(--text-blue)]"></div>
								</div>
								<p class="text-[10px] text-[var(--text-tertiary)] truncate uppercase tracking-tighter font-bold">
									{{ model.provider }}
								</p>
							</div>
						</button>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useModelStore } from '../stores/models'

const props = withDefaults(
	defineProps<{
		variant?: 'standard' | 'ghost' | 'pill'
		position?: 'top' | 'bottom'
		showIcon?: boolean
		showChevron?: boolean
		icon?: any
	}>(),
	{
		variant: 'standard',
		position: 'bottom',
		showIcon: true,
		showChevron: true,
	},
)

const modelStore = useModelStore()
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

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
		window.addEventListener('scroll', updateDropdownPosition, true)
		window.addEventListener('resize', updateDropdownPosition)
	} else {
		window.removeEventListener('scroll', updateDropdownPosition, true)
		window.removeEventListener('resize', updateDropdownPosition)
	}
})

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

const selectModel = (id: string) => {
	modelStore.selectModel(id)
	isOpen.value = false
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
