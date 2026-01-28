<template>
	<div class="px-3 py-2 space-y-0.5 max-h-[480px] overflow-y-auto no-scrollbar">
		<div v-for="field in numericFields" :key="field.key" class="flex items-center gap-3 px-3 py-1 rounded-xl transition-all hover:bg-[var(--fill-tsp-white-main)] group/row">
			<!-- Left side: Checkbox + Label -->
			<div class="flex items-center gap-3 w-36 flex-shrink-0">
				<!-- Professional Checkbox -->
				<label class="relative flex-shrink-0 flex items-center cursor-pointer">
					<input type="checkbox" :checked="isOverridden(field.key)" @change="toggleOverride(field.key, field.default)" class="peer sr-only" />
					<div class="w-4 h-4 bg-[var(--background-white-main)] border border-[var(--border-main)] rounded transition-all flex items-center justify-center peer-checked:border-[var(--border-blue)] peer-checked:bg-[var(--fill-blue)] shadow-[var(--shadow-XS)]">
						<svg class="w-2.5 h-2.5 text-[var(--text-blue)] opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
						</svg>
					</div>
				</label>

				<!-- Label Section -->
				<div class="flex flex-col min-w-0">
					<div class="flex items-center gap-1 group relative">
						<span class="text-[12px] font-bold text-[var(--text-primary)] truncate cursor-help leading-tight tracking-tight">{{ field.label || field.key }}</span>
						<div class="absolute bottom-full left-0 mb-2 p-2 bg-[var(--background-black-main)] text-[var(--text-onblack)] text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal w-40 z-50 pointer-events-none shadow-[var(--shadow-L)] border border-[var(--border-white-tsp)] font-bold" v-if="field.description">
							{{ field.description }}
						</div>
					</div>
					<span class="text-[8px] font-mono text-[var(--text-disable)] truncate uppercase tracking-tighter">
						{{ field.key }}
					</span>
				</div>
			</div>

			<!-- Middle side: Slider with Small Icons -->
			<div class="flex-1 flex items-center gap-2 min-w-0">
				<span class="text-[9px] text-[var(--icon-disable)] flex-shrink-0">
					<component :is="getParamIcon(field.key, 'min')" />
				</span>
				<div class="flex-1 relative h-6 flex items-center">
					<input type="range" :value="getValue(field.key, field.default)" @input="onInput(field.key, $event)" :min="field.min" :max="field.max" :step="field.step || 0.1" class="w-full h-1 bg-[var(--fill-tsp-white-main)] rounded-lg appearance-none cursor-pointer accent-[var(--text-blue)] slider-thumb-slim" :class="{ 'opacity-10 grayscale pointer-events-none': !isOverridden(field.key) }" />
				</div>
				<span class="text-[9px] text-[var(--icon-disable)] flex-shrink-0">
					<component :is="getParamIcon(field.key, 'max')" />
				</span>
			</div>

			<!-- Right side: Numeric Input -->
			<div class="w-16 flex-shrink-0">
				<input type="number" :value="getValue(field.key, field.default)" @input="onInput(field.key, $event)" :min="field.min" :max="field.max" :step="field.step || 0.1" class="w-full px-1.5 py-0.5 bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] rounded text-[11px] font-mono text-center text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-blue)] transition-all font-bold" :class="{ 'opacity-30': !isOverridden(field.key) }" />
			</div>
		</div>

		<!-- Empty State -->
		<div v-if="numericFields.length === 0" class="py-10 text-center space-y-3">
			<div class="text-3xl grayscale opacity-20 filter">⚙️</div>
			<p class="text-[10px] text-[var(--text-disable)] font-bold tracking-tight">当前模型没有可调参数</p>
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
.slider-thumb-slim::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 14px;
	height: 14px;
	background: white;
	border: 2px solid #6366f1;
	border-radius: 50%;
	cursor: pointer;
	box-shadow: 0 0 4px rgba(99, 102, 241, 0.2);
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slider-thumb-slim:hover::-webkit-slider-thumb {
	box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
	transform: scale(1.1);
}

.dark .slider-thumb-slim::-webkit-slider-thumb {
	background: #1a1a1a;
	border-color: #818cf8;
}

/* Hide arrows for number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
input[type='number'] {
	-webkit-appearance: none;
	-moz-appearance: textfield;
	appearance: none;
}
</style>
