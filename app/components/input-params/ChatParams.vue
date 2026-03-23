<template>
	<template v-if="fields.supportsFileUpload.value || fields.supportsWebSearch.value">
		<div class="h-4 w-px bg-[var(--border-light)]/50 mx-1 self-center"></div>
	</template>

	<!-- Attach Button -->
	<Tooltip v-if="fields.supportsFileUpload.value" text="Add Attachment">
		<button @click="$emit('trigger-upload')" :disabled="isUploading"
			class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors">
			<Plus :size="20" />
		</button>
	</Tooltip>

	<!-- Web Search -->
	<Popover v-if="fields.supportsWebSearch.value" class="relative" v-slot="{ open }">
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
			enter-to-class="translate-y-0 opacity-100 scale-100" leave-active-class="transition duration-100 ease-in"
			leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1.5 opacity-0">
			<PopoverPanel
				class="absolute bottom-full left-0 mb-3 z-50 w-[300px] max-w-[calc(100vw-2rem)] bg-[var(--bg-main)] rounded-2xl shadow-lg border border-[var(--border-light)] p-4 cursor-default">
				<div class="text-[14px] font-semibold text-[var(--text-primary)] mb-3">Web Search</div>
				<div class="h-[1px] bg-[var(--border-light)] -mx-4 mb-3"></div>
				<div class="flex items-start justify-between">
					<div class="pr-4">
						<div class="text-[13px] font-medium text-[var(--text-primary)]">Enable Web Search</div>
						<div class="text-[12px] text-[var(--text-tertiary)] leading-relaxed mt-0.5">
							Enable web search and real-time information access.</div>
					</div>
					<Switch :model-value="isWebSearchEnabled" @update:model-value="$emit('update:webSearch', $event)"
						:class="isWebSearchEnabled ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'"
						class="relative inline-flex h-5 w-[36px] shrink-0 items-center rounded-full transition-colors focus:outline-none mt-1">
						<span :class="isWebSearchEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'"
							class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm" />
					</Switch>
				</div>
			</PopoverPanel>
		</Transition>
	</Popover>

	<!-- Parameters Settings -->
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
			enter-to-class="translate-y-0 opacity-100 scale-100" leave-active-class="transition duration-100 ease-in"
			leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1.5 opacity-0">
			<PopoverPanel
				class="absolute bottom-full left-0 mb-3 z-50 w-[300px] max-w-[calc(100vw-2rem)] bg-[var(--bg-main)] rounded-2xl shadow-lg border border-[var(--border-light)]">
				<div class="px-4 pt-3.5 pb-3 border-b border-[var(--border-light)] flex items-center justify-between">
					<div class="flex items-center gap-2">
						<SlidersHorizontal :size="14" class="text-[var(--text-tertiary)]" />
						<span class="text-[13px] font-semibold text-[var(--text-primary)]">Parameters</span>
					</div>
					<button @click="$emit('reset-params')"
						class="text-[12px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Reset</button>
				</div>
				<ModelParameters :model-input="modelStore.selectedModel?.model_input" :values="externalParams || {}"
					@update:values="(v: any) => $emit('update:params', v)" />
			</PopoverPanel>
		</Transition>
	</Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel, Switch } from '@headlessui/vue'
import { Plus, Globe, Settings, SlidersHorizontal } from 'lucide-vue-next'
import { useModelStore } from '~/stores/models'
import type { useInputFields } from '~/composables/useInputFields'
import Tooltip from '~/components/Tooltip.vue'
import ModelParameters from '~/components/ModelParameters.vue'

defineProps<{
	fields: ReturnType<typeof useInputFields>
	isWebSearchEnabled: boolean
	isUploading: boolean
	externalParams?: Record<string, any>
}>()

defineEmits<{
	'trigger-upload': []
	'reset-params': []
	'update:params': [params: any]
	'update:webSearch': [val: boolean]
}>()

const modelStore = useModelStore()
</script>
