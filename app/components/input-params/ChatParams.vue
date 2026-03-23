<template>
	<template v-if="fields.supportsFileUpload.value || fields.supportsWebSearch.value">
		<div class="h-4 w-px bg-[var(--border-light)]/50 mx-1 self-center"></div>
	</template>

	<!-- Attach Button (Image-Generation Style) -->
	<div v-if="fields.supportsFileUpload.value" class="relative group/chip">
		<button @click="fields.toggleDropdown('chat_upload')" :disabled="isUploading" class="unified-pill"
			:class="fields.activeDropdown.value === 'chat_upload' ? 'unified-pill-active' : mediaFiles.length > 0 ? 'border-[var(--border-main)]' : ''">
			<Loader2 v-if="isUploading" :size="14" class="animate-spin text-[var(--text-secondary)]" />
			<template v-else-if="mediaFiles.length > 0">
				<div class="relative shrink-0">
					<img :src="mediaFiles[0]?.url || mediaFiles[0]?.localUrl" class="w-4 h-4 rounded-sm object-cover" />
					<div v-if="mediaFiles.length > 1"
						class="absolute -top-1.5 -right-1.5 min-w-[12px] h-[12px] bg-[var(--text-primary)] rounded-full text-[7px] text-[var(--bg-main)] flex items-center justify-center font-bold px-0.5 leading-none">
						{{ mediaFiles.length }}
					</div>
				</div>
			</template>
			<Paperclip v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">
				{{ mediaFiles.length > 0 ? `${mediaFiles.length} file${mediaFiles.length > 1 ? 's' : ''}` : 'Add file' }}
			</span>
		</button>

		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === 'chat_upload'"
				class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[280px]">
				<div class="unified-popover flex flex-col gap-4">
					<p class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
						Attach files to enhance your conversation.
						Upload or select from assets.
					</p>
					<div class="flex flex-col gap-2">
						<button @click="$emit('trigger-upload')" class="unified-upload-btn-primary">
							<FileUp :size="14" stroke-width="2.5" />
							Upload file
						</button>
						<button @click="$emit('select-asset')" class="unified-upload-btn-secondary">
							<FolderOpen :size="14" />
							Select from assets
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

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
import { Paperclip, FileUp, FolderOpen, Globe, Settings, SlidersHorizontal, Loader2 } from 'lucide-vue-next'
import { useModelStore } from '~/stores/models'
import type { useInputFields } from '~/composables/useInputFields'
import Tooltip from '~/components/Tooltip.vue'
import ModelParameters from '~/components/ModelParameters.vue'

defineProps<{
	fields: ReturnType<typeof useInputFields>
	isWebSearchEnabled: boolean
	isUploading: boolean
	externalParams?: Record<string, any>
	mediaFiles: Array<{ url: string; id: string; localUrl?: string }>
}>()

defineEmits<{
	'trigger-upload': []
	'select-asset': []
	'reset-params': []
	'update:params': [params: any]
	'update:webSearch': [val: boolean]
}>()

const modelStore = useModelStore()
</script>

<style scoped>
.unified-pill {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	height: 34px;
	padding: 0 0.75rem;
	border-radius: 9999px;
	background: var(--fill-tsp-gray-main);
	border: 1px solid transparent;
	transition: all 0.15s;
	cursor: pointer;
}

.unified-pill:hover {
	background: var(--bg-hover);
	border-color: var(--border-main);
}

.unified-pill-active {
	border-color: var(--border-main);
	background: var(--bg-hover);
}

.unified-pill-text {
	font-size: 12px;
	font-weight: 500;
	color: var(--text-primary);
}

.unified-popover {
	border-radius: 1rem;
	background-color: var(--bg-main);
	border: 1px solid var(--border-light);
	padding: 1rem;
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.unified-upload-btn-primary {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	background: black;
	color: white;
	border-radius: 9999px;
	padding: 0.625rem 0;
	font-size: 13px;
	font-weight: 700;
	transition: colors 0.15s;
}

:root.dark .unified-upload-btn-primary {
	background: white;
	color: black;
}

.unified-upload-btn-secondary {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	background-color: var(--bg-main);
	color: var(--text-primary);
	border-radius: 9999px;
	padding: 0.625rem 0;
	font-size: 13px;
	font-weight: 700;
	transition: colors 0.15s;
	border: 1px solid var(--border-main);
	box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>
