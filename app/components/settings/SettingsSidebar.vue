<template>
	<div class="w-full md:w-[221px] flex-shrink-0 md:border-r border-[var(--border-main)] relative flex flex-col bg-[var(--background-gray-main)]">
		<!-- Logo (Desktop only) -->
		<div class="items-center px-5 pt-5 pb-3 hidden md:flex">
			<div class="flex gap-0.5 text-black dark:text-white">
				<div class="flex items-center size-8 justify-center shrink-0">
					<img src="/favicon.svg" class="size-6 pointer-events-none" alt="Aura Logo" />
				</div>
				<span class="font-bold text-lg tracking-tight ml-2">aura</span>
			</div>
		</div>

		<!-- Nav Items -->
		<nav class="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
			<button v-for="item in menuItems" :key="item.value" @click="$emit('select', item.value)" :class="['w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium transition-colors', item.value === modelValue ? 'bg-[var(--fill-tsp-white-main)] font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] hover:text-[var(--text-primary)]']">
				<component :is="item.icon" :size="16" />
				{{ item.name }}
			</button>
		</nav>

		<!-- Footer Separator -->
		<div class="px-2.5">
			<div class="h-[1px] bg-[var(--border-primary)]"></div>
		</div>

		<!-- Footer -->
		<div class="p-2">
			<a href="https://help.manus.im" target="_blank" class="w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[14px] font-medium text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] hover:text-[var(--text-primary)] transition-colors">
				<div class="flex items-center gap-3">
					<CircleHelp :size="16" />
					{{ $t('settings.get_help') }}
				</div>
				<ArrowUpRight :size="14" />
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CircleHelp, ArrowUpRight } from 'lucide-vue-next'

defineProps<{
	modelValue: string
	menuItems: Array<{ name: string; icon: any; value: string }>
}>()

defineEmits<{
	select: [value: string]
}>()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 0px;
}
</style>
