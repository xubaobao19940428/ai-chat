<template>
	<div class="w-full flex flex-col gap-6 min-h-0">
		<!-- Plan Card -->
		<div class="flex-shrink-0">
			<PlanCard @upgrade="$emit('upgrade')" />
		</div>

		<!-- Billing Link -->
		<button class="flex-shrink-0 w-full flex items-center justify-between p-4 rounded-[12px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors">
			<div class="flex items-center gap-3">
				<CreditCard :size="20" class="text-[var(--text-secondary)]" />
				<span class="text-sm font-bold text-[var(--text-primary)]">{{ $t('settings.website_billing') }}</span>
			</div>
			<ChevronRight :size="16" class="text-[var(--text-tertiary)]" />
		</button>

		<!-- Usage History Table -->
		<div class="flex-1 min-h-0 rounded-[16px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] flex flex-col overflow-hidden">
			<!-- Table Header (fixed) -->
			<div class="flex-shrink-0 bg-[var(--fill-tsp-gray-main)] px-4 py-2 flex items-center text-xs font-medium text-[var(--text-tertiary)] border-b border-[var(--border-main)]">
				<div class="flex-1">{{ $t('settings.details') }}</div>
				<div class="w-40 text-left">{{ $t('settings.date') }}</div>
				<div class="w-24 text-right">{{ $t('settings.credits_change') }}</div>
			</div>
			<!-- Table Body (scrollable) -->
			<div class="flex-1 overflow-y-auto divide-y divide-[var(--border-light)] custom-scrollbar">
				<div v-if="isLoading" class="p-4 flex justify-center">
					<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
				</div>
				<div v-else-if="records.length === 0" class="p-4 text-center text-[var(--text-tertiary)] text-sm">{{ $t('settings.no_records') }}</div>
				<div v-else v-for="record in records" :key="record.id" class="px-4 py-3 flex items-center text-sm group hover:bg-[var(--fill-tsp-white-light)] transition-colors">
					<div class="flex-1 text-[var(--text-primary)] truncate pr-4">{{ formatMessage(record.message) }}</div>
					<div class="w-40 text-[var(--text-tertiary)] whitespace-nowrap">{{ new Date(record.created_at * 1000).toLocaleString() }}</div>
					<div :class="['w-24 text-right font-medium', isDeduction(record.record_type) ? 'text-[var(--text-primary)]' : 'text-green-600']">{{ isDeduction(record.record_type) ? '-' : '+' }}{{ record.coins }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CreditCard, ChevronRight } from 'lucide-vue-next'
import { useUserStore } from '../../stores/user'
import PlanCard from './PlanCard.vue'

defineEmits<{
	upgrade: []
}>()

const { t } = useI18n()
const userStore = useUserStore()
const records = ref<any[]>([])
const isLoading = ref(false)

const MESSAGE_MAP: Record<string, string> = {
	AI_USAGE: 'settings.usage_ai',
	IMAGE_GENERATION: 'settings.usage_image',
	VIDEO_GENERATION: 'settings.usage_video',
	RECHARGE: 'settings.usage_recharge',
	DAILY_BONUS: 'settings.usage_daily_bonus',
}

// 扣减类: 2消费 3任务 4过期
function isDeduction(recordType: number): boolean {
	return [2, 3, 4].includes(recordType)
}

function formatMessage(message: string): string {
	const key = MESSAGE_MAP[message]
	return key ? t(key) : message.replace(/_/g, ' ')
}

onMounted(async () => {
	isLoading.value = true
	records.value = await userStore.fetchAccountRecords()
	isLoading.value = false
})
</script>

<style scoped>
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
