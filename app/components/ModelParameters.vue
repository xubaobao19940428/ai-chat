<template>
	<div class="py-1.5 max-h-[380px] overflow-y-auto no-scrollbar">
		<div v-for="field in numericFields" :key="field.key" class="px-4 py-3 group/param hover:bg-[var(--bg-hover)] transition-colors">
			<!-- Label row -->
			<div class="flex items-center justify-between mb-2.5">
				<div>
					<span class="text-[13px] font-medium text-[var(--text-primary)] leading-none">{{ field.label || field.key }}</span>
					<span v-if="isAtDefault(field.key, field.default)" class="ml-2 text-[10px] text-[var(--text-tertiary)] font-medium">default</span>
				</div>
				<input
					type="number"
					:value="getValue(field.key, field.default)"
					@input="onInput(field.key, $event)"
					:min="field.min"
					:max="field.max"
					:step="field.step || 0.1"
					class="w-[52px] px-1.5 py-0.5 bg-[var(--bg-hover)] border border-[var(--border-light)] rounded-lg text-[12px] font-mono text-center text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-main)] transition-all"
				/>
			</div>
			<!-- Slider -->
			<input
				type="range"
				:value="getValue(field.key, field.default)"
				@input="onInput(field.key, $event)"
				:min="field.min"
				:max="field.max"
				:step="field.step || 0.1"
				class="slider w-full cursor-pointer"
				:style="sliderStyle(field)"
			/>
			<!-- Min / Max labels -->
			<div class="flex justify-between mt-1.5">
				<span class="text-[10px] font-mono text-[var(--text-tertiary)]">{{ field.min }}</span>
				<span class="text-[10px] font-mono text-[var(--text-tertiary)]">{{ field.max }}</span>
			</div>
		</div>

		<!-- Empty State -->
		<div v-if="numericFields.length === 0" class="py-10 flex flex-col items-center gap-2.5">
			<SlidersHorizontal :size="24" class="text-[var(--text-tertiary)] opacity-30" />
			<p class="text-[12px] text-[var(--text-tertiary)] font-medium">No adjustable parameters for this model</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SlidersHorizontal } from 'lucide-vue-next'
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
		.map(([key, field]) => ({ ...field, key }))
})

const getValue = (key: string, defaultValue: any) => {
	const val = props.values[key]
	return val !== undefined && val !== null ? val : defaultValue
}

const isAtDefault = (key: string, defaultValue: any) => {
	const val = props.values[key]
	return val === undefined || val === null || val === defaultValue
}

// Compute fill percentage for the slider track
const sliderStyle = (field: any) => {
	const val = Number(getValue(field.key, field.default))
	const pct = ((val - field.min) / (field.max - field.min)) * 100
	return { '--fill': `${pct}%` }
}

const updateValue = (key: string, value: string | number) => {
	const numValue = typeof value === 'string' ? parseFloat(value) : value
	if (isNaN(numValue)) return
	emit('update:values', { ...props.values, [key]: numValue })
}

const onInput = (key: string, event: Event) => {
	updateValue(key, (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.no-scrollbar {
	scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
	display: none;
}

/* Slider base */
.slider {
	-webkit-appearance: none;
	appearance: none;
	height: 4px;
	border-radius: 9999px;
	outline: none;
	background: linear-gradient(
		to right,
		var(--text-primary) 0%,
		var(--text-primary) var(--fill, 50%),
		var(--border-light) var(--fill, 50%),
		var(--border-light) 100%
	);
}

/* Thumb — webkit */
.slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: var(--bg-main);
	border: 2px solid var(--text-primary);
	cursor: pointer;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}
.slider::-webkit-slider-thumb:hover {
	transform: scale(1.15);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.slider:active::-webkit-slider-thumb {
	transform: scale(1.05);
}

/* Thumb — firefox */
.slider::-moz-range-thumb {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: var(--bg-main);
	border: 2px solid var(--text-primary);
	cursor: pointer;
	transition: transform 0.15s ease;
}
.slider::-moz-range-thumb:hover {
	transform: scale(1.15);
}

/* Number input — hide spin buttons */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
input[type='number'] {
	-moz-appearance: textfield;
}
</style>
