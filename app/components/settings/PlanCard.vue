<template>
	<div class="rounded-[16px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] p-5">
		<div class="flex items-center justify-between mb-4">
			<span class="font-serif text-xl font-bold text-[var(--text-primary)]">{{ $t('settings.free_plan') }}</span>
			<button @click="$emit('upgrade')" class="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-80 transition-opacity">{{ $t('settings.upgrade') }}</button>
		</div>

		<div class="border-t border-dashed border-[var(--border-main)] my-4"></div>

		<div class="space-y-5">
			<!-- Credits -->
			<div class="flex items-center justify-between">
				<div class="flex items-start gap-2.5">
					<Sparkles :size="20" class="text-[var(--text-secondary)] mt-0.5" />
					<div>
						<div class="flex items-center gap-1.5">
							<span class="text-sm font-bold text-[var(--text-primary)]">{{ $t('settings.credits') }}</span>
							<CircleHelp :size="14" class="text-[var(--text-tertiary)]" />
						</div>
						<div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">{{ $t('settings.free_credits') }}</div>
					</div>
				</div>
				<div class="text-right">
					<div class="text-sm font-bold text-[var(--text-primary)]">1,000</div>
					<div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">1,000</div>
				</div>
			</div>

			<!-- Daily Refresh -->
			<div class="flex items-center justify-between">
				<div class="flex items-start gap-2.5">
					<Calendar :size="20" class="text-[var(--text-secondary)] mt-0.5" />
					<div>
						<div class="flex items-center gap-1.5">
							<span class="text-sm font-bold text-[var(--text-primary)]">{{ $t('settings.daily_refresh_credits') }}</span>
							<CircleHelp :size="14" class="text-[var(--text-tertiary)]" />
						</div>
						<div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">{{ $t('settings.refresh_daily') }}</div>
					</div>
				</div>
				<div class="text-right">
					<div class="text-sm font-bold text-[var(--text-primary)]">300</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Sparkles, Calendar, CircleHelp } from 'lucide-vue-next'

defineEmits<{
	upgrade: []
}>()
</script>
