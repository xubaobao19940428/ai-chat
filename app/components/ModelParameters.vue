<template>
	<div class="px-5 py-6 space-y-5 max-h-[500px] overflow-y-auto no-scrollbar">
		<div v-for="field in numericFields" :key="field.key" class="flex items-center gap-4 group/row">
			<!-- Left side: Checkbox + Label -->
			<div class="flex items-center gap-3 w-44 flex-shrink-0">
				<!-- Lobe Styling Checkbox -->
				<label class="relative flex-shrink-0 flex items-center cursor-pointer">
					<input type="checkbox" :checked="isOverridden(field.key)" @change="toggleOverride(field.key, field.default)" class="peer sr-only" />
					<div class="w-5 h-5 bg-gray-100 dark:bg-zinc-800 border border-transparent rounded peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100 peer-checked:text-white dark:peer-checked:text-black transition-all flex items-center justify-center shadow-sm">
						<svg class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
						</svg>
					</div>
				</label>

				<!-- Label Section -->
				<div class="flex flex-col min-w-0">
					<div class="flex items-center gap-1.5 group relative">
						<span class="text-[14px] font-bold text-gray-800 dark:text-zinc-200 truncate cursor-help leading-tight italic decoration-dotted underline-offset-4 group-hover:underline">{{ field.label || field.key }}</span>
						<div class="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal w-56 z-50 pointer-events-none shadow-2xl border border-white/10" v-if="field.description">
							{{ field.description }}
						</div>
					</div>
					<span class="text-[10px] font-mono text-gray-400 dark:text-zinc-500 truncate mt-0.5">
						{{ field.key }}
					</span>
				</div>
			</div>

			<!-- Middle side: Slider with Icons -->
			<div class="flex-1 flex items-center gap-3 min-w-0">
				<span class="w-5 h-5 flex items-center justify-center text-[12px] opacity-40 flex-shrink-0">
					<component :is="getParamIcon(field.key, 'min')" />
				</span>
				<div class="flex-1 relative h-6 flex items-center">
					<input type="range" :value="getValue(field.key, field.default)" @input="onInput(field.key, $event)" :min="field.min" :max="field.max" :step="field.step || 0.1" class="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400 slider-thumb-custom" :class="{ 'opacity-10 grayscale pointer-events-none': !isOverridden(field.key) }" />
				</div>
				<span class="w-5 h-5 flex items-center justify-center text-[12px] opacity-40 flex-shrink-0">
					<component :is="getParamIcon(field.key, 'max')" />
				</span>
			</div>

			<!-- Right side: Numeric Input -->
			<div class="w-20 flex-shrink-0 flex justify-end">
				<input type="number" :value="getValue(field.key, field.default)" @input="onInput(field.key, $event)" :min="field.min" :max="field.max" :step="field.step || 0.1" class="w-full px-2 py-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-lg text-[13px] font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all" :class="{ 'opacity-30': !isOverridden(field.key) }" />
			</div>
		</div>

		<!-- Empty State -->
		<div v-if="numericFields.length === 0" class="py-14 text-center space-y-4">
			<div class="text-4xl filter grayscale opacity-30">⚙️</div>
			<p class="text-xs text-gray-400 dark:text-zinc-600 font-medium">当前模型没有可调参数</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { ModelInputField } from '../utils/api'

const props = defineProps<{
	modelInput?: { fields: Record<string, ModelInputField> }
	values: Record<string, any>
}>()

const emit = defineEmits<{
	(e: 'update:values', values: Record<string, any>): void
}>()

const numericFields = computed(() => {
	if (!props.modelInput?.fields) return []
	return Object.entries(props.modelInput.fields)
		.filter(([_, field]) => field.type === 'number')
		.map(([key, field]) => ({
			...field,
			key,
		}))
})

// Helper to get contextual icons based on parameter keys
const getParamIcon = (key: string, type: 'min' | 'max') => {
	const k = key.toLowerCase()

	// Temperature icons (Cold to Spark)
	if (k.includes('temperature') || k.includes('creativity')) {
		return type === 'min' ? () => h('span', '❄️') : () => h('span', '✨')
	}
	// Penalties icons (Short to Long / Sparse to Dense)
	if (k.includes('penalty')) {
		return type === 'min' ? () => h('span', '📄') : () => h('span', '📖')
	}
	// Frequency / Top_P icons (Simple to Diverse)
	if (k.includes('top_p') || k.includes('frequency')) {
		return type === 'min' ? () => h('span', '🎯') : () => h('span', '🌈')
	}

	// Generic
	return type === 'min' ? () => h('span', '○') : () => h('span', '●')
}

const getValue = (key: string, defaultValue: any) => {
	const val = props.values[key]
	// Return user value if it's explicitly set (and not null), otherwise default
	return val !== undefined && val !== null ? val : defaultValue
}

const isOverridden = (key: string) => {
	// If explicitly null, it is UNCHECKED.
	// If undefined (missing) or has a value, it is CHECKED.
	return props.values[key] !== null
}

const toggleOverride = (key: string, defaultValue: any) => {
	const newValues = { ...props.values }
	if (isOverridden(key)) {
		// Current: Checked (either default or custom). Action: Uncheck.
		newValues[key] = null
	} else {
		// Current: Unchecked (null). Action: Check (restore default or keep value if possible).
		// Deleting the key makes it "Checked" but inheriting the default from metadata.
		delete newValues[key]
	}
	emit('update:values', newValues)
}

const updateValue = (key: string, value: string | number) => {
	const numValue = typeof value === 'string' ? parseFloat(value) : value
	if (isNaN(numValue)) return

	const newValues = { ...props.values, [key]: numValue }
	emit('update:values', newValues)
}

const onInput = (key: string, event: Event) => {
	const target = event.target as HTMLInputElement
	updateValue(key, target.value)
}
</script>

<style scoped>
/* Range input styling */
.slider-thumb-custom::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 18px;
	height: 18px;
	background: white;
	border: 3px solid #6366f1; /* Indigo/Blue */
	border-radius: 50%;
	cursor: pointer;
	box-shadow:
		0 0 10px rgba(99, 102, 241, 0.4),
		0 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slider-thumb-custom:hover::-webkit-slider-thumb {
	box-shadow:
		0 0 15px rgba(99, 102, 241, 0.6),
		0 4px 8px rgba(0, 0, 0, 0.15);
	transform: scale(1.1);
}

.slider-thumb-custom:active::-webkit-slider-thumb {
	transform: scale(0.95);
}

.dark .slider-thumb-custom::-webkit-slider-thumb {
	background: #121212;
	border-color: #818cf8;
	box-shadow: 0 0 12px rgba(129, 140, 248, 0.4);
}

/* Hide arrows for number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
input[type='number'] {
	-moz-appearance: textfield;
}
</style>
