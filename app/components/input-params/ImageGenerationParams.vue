<template>
	<!-- Image Prompt Upload -->
	<div v-if="fields.supportsMediaPrompt.value" class="relative group/chip" @mouseleave="fields.scheduleCloseDropdown()">
		<button @mouseenter="fields.openDropdown('media_prompt')" :disabled="isUploading" class="unified-pill"
			:class="fields.activeDropdown.value === 'media_prompt' ? 'unified-pill-active' : mediaFiles.length > 0 ? 'border-[var(--border-main)]' : ''">
			<Loader2 v-if="isUploading" :size="14" class="animate-spin text-[var(--text-secondary)]" />
			<template v-else-if="mediaFiles.length > 0">
				<div class="relative shrink-0">
					<img :src="mediaFiles[0]?.url" class="w-4 h-4 rounded-sm object-cover" />
					<div v-if="mediaFiles.length > 1"
						class="absolute -top-1.5 -right-1.5 min-w-[12px] h-[12px] bg-[var(--text-primary)] rounded-full text-[7px] text-[var(--bg-main)] flex items-center justify-center font-bold px-0.5 leading-none">
						{{ mediaFiles.length }}
					</div>
				</div>
			</template>
			<ImagePlus v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">
				{{ mediaFiles.length > 0 ? `${mediaFiles.length} prompt image${mediaFiles.length > 1 ? 's' : ''}` :
					'Image prompt'
				}}
			</span>
		</button>

		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === 'media_prompt'"
				@mouseenter="fields.cancelCloseDropdown()" @mouseleave="fields.scheduleCloseDropdown()"
				class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[280px]">
				<div class="unified-popover flex flex-col gap-4">
					<p class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
						Image prompts apply style and content to your generation.
						Upload or select from assets.
					</p>
					<div class="flex flex-col gap-2">
						<button @click="$emit('trigger-upload')" class="unified-upload-btn-primary">
							<Plus :size="14" stroke-width="3" />
							Upload
						</button>
						<button @click="$emit('select-asset')" class="unified-upload-btn-secondary">
							<ImagePlus :size="14" />
							Select asset
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- Dynamic Select Fields (aspect_ratio, style, resolution, etc.) -->
	<div v-for="field in fields.dynamicSelectFields.value" :key="field.key" class="relative group/chip" @mouseleave="fields.scheduleCloseDropdown()">
		<!-- Aspect Ratio -->
		<template v-if="field.key === 'aspect_ratio'">
			<button ref="ratioPillRef" @mouseenter="fields.openDropdown(field.key)" class="unified-pill"
				:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
				<Square :size="14" class="text-[var(--text-secondary)]" />
				<span class="unified-pill-text">{{ getParamValue(field.key, field.default) }}</span>
			</button>
			<Teleport to="body">
				<Transition enter-active-class="transition duration-150 ease-out"
					enter-from-class="translate-y-1 opacity-0 scale-95"
					enter-to-class="translate-y-0 opacity-100 scale-100"
					leave-active-class="transition duration-100 ease-in"
					leave-from-class="translate-y-0 opacity-100"
					leave-to-class="translate-y-1 opacity-0">
					<div v-if="fields.activeDropdown.value === field.key" ref="ratioPopoverRef"
						@mouseenter="fields.cancelCloseDropdown()" @mouseleave="fields.scheduleCloseDropdown()"
						data-ratio-popover class="fixed z-[9999]" :style="ratioPopoverStyle">
						<div class="p-6 flex gap-8 items-center min-w-max rounded-2xl border border-[var(--border-light)] bg-[var(--bg-main)] shadow-[0_20px_25px_-5px_rgb(0_0_0/0.1),0_8px_10px_-6px_rgb(0_0_0/0.1)]">
							<!-- Left: Ratio Buttons Grid -->
							<div class="flex flex-wrap gap-2 w-[280px]">
								<button v-for="opt in field.options" :key="opt"
									@click="fields.setParamAndClose(field.key, opt)"
									class="px-3 py-2 rounded-xl text-[13px] font-bold border transition-all min-w-[64px] flex-1 text-center"
									:class="getParamValue(field.key, field.default) === opt ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--bg-main)] shadow-sm scale-[1.02]' : 'bg-transparent text-[var(--text-primary)] border-[var(--border-main)] hover:border-[var(--text-primary)]/20 hover:bg-[var(--bg-hover)]'">
									{{ opt }}
								</button>
							</div>
							<!-- Right: Visual Preview -->
							<div
								class="relative flex items-center justify-center w-[160px] h-[160px] bg-transparent shrink-0">
								<div class="relative bg-[var(--fill-tsp-gray-main)] rounded-xl border border-[var(--border-main)] transition-all duration-300 flex items-center justify-center overflow-hidden shadow-inner"
									:style="fields.getPreviewStyle(getParamValue(field.key, field.default))">
									<div class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
										<div v-for="i in 9" :key="i"
											class="border-[0.5px] border-[var(--border-main)] opacity-50"></div>
									</div>
								</div>
								<div
									class="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-[var(--text-tertiary)] rounded-full">
								</div>
								<div
									class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-[var(--text-tertiary)] rounded-full">
								</div>
								<div
									class="absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-3 bg-[var(--text-tertiary)] rounded-full">
								</div>
								<div
									class="absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-3 bg-[var(--text-tertiary)] rounded-full">
								</div>
							</div>
						</div>
					</div>
				</Transition>
			</Teleport>
		</template>

		<!-- Style Transfer -->
		<template v-else-if="field.key === 'style'">
			<button @mouseenter="fields.openDropdown(field.key)" class="unified-pill"
				:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
				<Palette :size="14" class="text-[var(--text-secondary)]" />
				<span class="unified-pill-text">
					{{ getParamValue(field.key, field.default) === 'No Style' || !getParamValue(field.key,
						field.default) ? 'Style' : getParamValue(field.key, field.default) }}
				</span>
			</button>
			<Transition enter-active-class="transition duration-150 ease-out" enter-from-class="translate-y-1 opacity-0"
				enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-100 ease-in"
				leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
				<div v-if="fields.activeDropdown.value === field.key"
					@mouseenter="fields.cancelCloseDropdown()" @mouseleave="fields.scheduleCloseDropdown()"
					class="absolute bottom-full left-0 mb-2 w-44 z-[60] max-h-56 overflow-y-auto custom-scrollbar">
					<div class="unified-popover p-1.5">
						<button v-for="s in field.options" :key="s" @click="fields.setParamAndClose(field.key, s)"
							class="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left">
							<span class="text-[12px] font-medium"
								:class="getParamValue(field.key, field.default) === s ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{
								s }}</span>
						</button>
					</div>
				</div>
			</Transition>
		</template>

		<!-- Generic Select (resolution, etc.) -->
		<template v-else>
			<button @mouseenter="fields.openDropdown(field.key)" class="unified-pill"
				:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
				<Gem v-if="field.key === 'resolution'" :size="14" class="text-[var(--text-secondary)]" />
				<LayoutGrid v-else :size="14" class="text-[var(--text-secondary)]" />
				<span class="unified-pill-text">
					<span v-if="field.key !== 'resolution'"
						class="uppercase font-bold text-[9px] tracking-wider opacity-60 mr-1">{{ field.key.substring(0,
							3) }}:</span>
					{{ getParamValue(field.key, field.default) }}
				</span>
			</button>
			<Transition enter-active-class="transition duration-150 ease-out"
				enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
				leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
				leave-to-class="translate-y-1 opacity-0">
				<div v-if="fields.activeDropdown.value === field.key"
					@mouseenter="fields.cancelCloseDropdown()" @mouseleave="fields.scheduleCloseDropdown()"
					class="absolute bottom-full left-0 mb-2 z-[60] min-w-[170px]">
					<div class="unified-popover p-3.5">
						<p
							class="text-[10px] font-bold text-[var(--text-tertiary)] mb-2.5 px-1 uppercase tracking-widest text-center">
							{{ field.label || field.key.replace(/_/g, ' ') }}</p>
						<div class="flex flex-col gap-1 max-h-[220px] overflow-y-auto custom-scrollbar">
							<button v-for="opt in field.options" :key="opt"
								@click="fields.setParamAndClose(field.key, opt)"
								class="w-full flex items-center justify-between gap-4 py-2.5 px-3 rounded-xl group transition-all"
								:class="getParamValue(field.key, field.default) === opt ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-sm' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'">
								<span class="text-[13px] font-bold">{{ opt }}</span>
								<div class="flex items-center justify-center">
									<div v-if="getParamValue(field.key, field.default) === opt"
										class="w-4 h-4 rounded-full flex items-center justify-center"
										style="background-color: var(--bg-main)">
										<Check :size="10" style="color: var(--text-primary)" stroke-width="4" />
									</div>
									<div v-else
										class="w-4 h-4 rounded-full border-[2px] border-black/20 dark:border-white/20">
									</div>
								</div>
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</template>
	</div>

	<!-- Dynamic Number Fields (num_outputs) -->
	<div v-for="field in fields.dynamicNumberFields.value" :key="field.key" class="relative group/chip" @mouseleave="fields.scheduleCloseDropdown()">
		<button @mouseenter="fields.openDropdown(field.key)" class="unified-pill"
			:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
			<Monitor :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">{{ getParamValue(field.key, field.default) }} Outputs</span>
		</button>
		<Transition enter-active-class="transition duration-150 ease-out" enter-from-class="translate-y-1 opacity-0"
			enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-100 ease-in"
			leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === field.key"
				@mouseenter="fields.cancelCloseDropdown()" @mouseleave="fields.scheduleCloseDropdown()"
				class="absolute bottom-full left-0 mb-2 z-[60] min-w-[180px]">
				<div class="unified-popover p-3">
					<p
						class="text-[11px] font-bold text-[var(--text-tertiary)] mb-2 px-1 uppercase tracking-widest text-center">
						{{ field.label || 'Outputs' }}</p>
					<div class="flex flex-wrap gap-1.5 justify-center">
						<button v-for="n in field.max - field.min + 1" :key="n"
							@click="fields.setParamAndClose(field.key, n + field.min - 1)"
							class="size-9 rounded-xl font-bold flex items-center justify-center transition-all border text-[13px]"
							:class="getParamValue(field.key, field.default) === n + field.min - 1 ? 'bg-[var(--text-primary)] text-[var(--bg-main)] border-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-primary)]'">
							{{ n + field.min - 1 }}
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- Dynamic Boolean Fields (audio_enabled, etc.) -->
	<div v-for="field in fields.dynamicBooleanFields.value" :key="field.key" class="relative" @mouseleave="fields.scheduleCloseDropdown()">
		<Tooltip :text="field.description || field.key">
			<button @mouseenter="fields.openDropdown(field.key)"
				class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors relative"
				:class="{ 'text-[var(--text-primary)]': getParamValue(field.key, field.default), 'bg-[var(--bg-hover)]': true }">
				<Volume2 v-if="field.key === 'audio_enabled'" :size="18" />
				<ToggleRight v-else-if="getParamValue(field.key, field.default)" :size="18" />
				<ToggleLeft v-else :size="18" />

			</button>
		</Tooltip>
		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1.5 opacity-0 scale-[0.98]"
			enter-to-class="translate-y-0 opacity-100 scale-100" leave-active-class="transition duration-100 ease-in"
			leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1.5 opacity-0">
			<div v-if="fields.activeDropdown.value === field.key"
				@mouseenter="fields.cancelCloseDropdown()" @mouseleave="fields.scheduleCloseDropdown()"
				class="absolute bottom-full left-0 mb-3 z-50 w-[280px] max-w-[calc(100vw-2rem)] bg-[var(--bg-main)] rounded-2xl shadow-lg border border-[var(--border-light)] p-4 cursor-default">
				<div class="text-[14px] font-semibold text-[var(--text-primary)] mb-3">{{ field.description || field.key }}</div>
				<div class="h-[1px] bg-[var(--border-light)] -mx-4 mb-3"></div>
				<div class="flex items-start justify-between">
					<div class="pr-4">
						<div class="text-[13px] font-medium text-[var(--text-primary)]">{{ field.description || field.key }}</div>
					</div>
					<Switch :model-value="!!getParamValue(field.key, field.default)"
						@update:model-value="fields.setParam(field.key, $event)"
						:class="getParamValue(field.key, field.default) ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'"
						class="relative inline-flex h-5 w-[36px] shrink-0 items-center rounded-full transition-colors focus:outline-none mt-0.5">
						<span :class="getParamValue(field.key, field.default) ? 'translate-x-[18px]' : 'translate-x-0.5'"
							class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm" />
					</Switch>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { ImagePlus, Loader2, Plus, Palette, Gem, Square, LayoutGrid, Monitor, Check, Volume2, ToggleLeft, ToggleRight } from 'lucide-vue-next'
import { Switch } from '@headlessui/vue'
import type { useInputFields } from '~/composables/useInputFields'

const props = defineProps<{
	fields: ReturnType<typeof useInputFields>
	mediaFiles: Array<{ url: string; id: string }>
	isUploading: boolean
	externalParams?: Record<string, any>
}>()

defineEmits<{
	'trigger-upload': []
	'select-asset': []
}>()

function getParamValue(key: string, defaultVal: any) {
	if (props.externalParams) return props.externalParams[key] ?? defaultVal
	return props.fields.dynamicParams.value[key] ?? defaultVal
}

const ratioPillRef = ref<HTMLElement | null>(null)
const ratioPopoverRef = ref<HTMLElement | null>(null)
const ratioPopoverStyle = ref<Record<string, string>>({ visibility: 'hidden' })

watch(() => props.fields.activeDropdown.value, async (val) => {
	if (val === 'aspect_ratio') {
		// First render offscreen to measure
		ratioPopoverStyle.value = { visibility: 'hidden' }
		await nextTick()
		positionRatioPopover()
	}
})

function positionRatioPopover() {
	const pill = Array.isArray(ratioPillRef.value) ? ratioPillRef.value[0] : ratioPillRef.value
	const popover = Array.isArray(ratioPopoverRef.value) ? ratioPopoverRef.value[0] : ratioPopoverRef.value
	if (!pill || !popover) return

	const pillRect = pill.getBoundingClientRect()
	const popoverRect = popover.getBoundingClientRect()
	const vw = window.innerWidth
	const MARGIN = 16
	const GAP = 21

	// Vertical: above the pill, matching `bottom-full mb-2` behavior
	const top = pillRect.top - popoverRect.height - GAP

	// Horizontal: center on the pill, then clamp within viewport
	let left = pillRect.left + pillRect.width / 2 - popoverRect.width / 2
	left = Math.max(MARGIN, Math.min(left, vw - popoverRect.width - MARGIN))

	ratioPopoverStyle.value = {
		top: `${Math.max(MARGIN, top)}px`,
		left: `${left}px`,
	}
}
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
