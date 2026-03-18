<template>
	<div class="flex items-center justify-between group relative" :style="{ zIndex }">
		<div class="text-[15px] text-[var(--text-primary)]">{{ label }}</div>
		<div class="relative shrink-0">
			<Listbox :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
				<div class="relative z-10">
					<ListboxButton class="flex items-center gap-2 bg-[var(--background-white-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] transition-colors rounded-lg px-3 py-1.5 text-[14px] text-[var(--text-primary)] outline-none cursor-pointer">
						<span>{{ options.find((o) => o.value === modelValue)?.title }}</span>
						<ChevronDown :size="16" class="text-[var(--text-secondary)]" />
					</ListboxButton>
					<transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
						<ListboxOptions class="absolute right-0 mt-2 z-50 w-[220px] bg-[var(--background-white-main)] backdrop-blur-3xl border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-L)] overflow-hidden outline-none py-2">
							<ListboxOption v-for="option in options" :key="option.value" :value="option.value" v-slot="{ active, selected }">
								<li :class="['relative cursor-pointer select-none py-2.5 px-4 transition-colors', active ? 'bg-[var(--fill-tsp-gray-main)]' : '']">
									<div class="flex items-center justify-between">
										<div>
											<div :class="['text-[14px]', selected ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-primary)]']">{{ option.title }}</div>
											<div v-if="option.desc" class="text-[12px] text-[var(--text-tertiary)] mt-0.5 leading-snug">{{ option.desc }}</div>
										</div>
										<Check v-if="selected" class="w-4 h-4 text-[var(--text-primary)] shrink-0 ml-2" />
									</div>
								</li>
							</ListboxOption>
						</ListboxOptions>
					</transition>
				</div>
			</Listbox>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, Check } from 'lucide-vue-next'

defineProps<{
	label: string
	options: Array<{ value: string; title: string; desc: string }>
	modelValue: string
	zIndex: number
}>()

defineEmits<{
	'update:modelValue': [value: string]
}>()
</script>
