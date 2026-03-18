<template>
	<div class="w-full space-y-6">
		<!-- Plan Card -->
		<PlanCard @upgrade="$emit('upgrade')" />

		<!-- Billing Link -->
		<button class="w-full flex items-center justify-between p-4 rounded-[12px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors">
			<div class="flex items-center gap-3">
				<CreditCard :size="20" class="text-[var(--text-secondary)]" />
				<span class="text-sm font-bold text-[var(--text-primary)]">{{ $t('settings.website_billing') }}</span>
			</div>
			<ChevronRight :size="16" class="text-[var(--text-tertiary)]" />
		</button>

		<!-- Usage History Table -->
		<div class="rounded-[16px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] overflow-hidden">
			<div class="bg-[var(--fill-tsp-gray-main)] px-4 py-2 flex items-center text-xs font-medium text-[var(--text-tertiary)] border-b border-[var(--border-main)]">
				<div class="flex-1">{{ $t('settings.details') }}</div>
				<div class="w-40 text-left">{{ $t('settings.date') }}</div>
				<div class="w-24 text-right">{{ $t('settings.credits_change') }}</div>
			</div>
			<div class="divide-y divide-[var(--border-light)] min-h-[100px]">
				<div v-if="isLoading" class="p-4 flex justify-center">
					<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
				</div>
				<div v-else-if="records.length === 0" class="p-4 text-center text-[var(--text-tertiary)] text-sm">{{ $t('settings.no_records') }}</div>
				<div v-else v-for="record in records" :key="record.id" class="px-4 py-3 flex items-center text-sm group hover:bg-[var(--fill-tsp-white-light)] transition-colors">
					<div class="flex-1 text-[var(--text-primary)] truncate pr-4">{{ record.description }}</div>
					<div class="w-40 text-[var(--text-tertiary)] whitespace-nowrap">{{ new Date(record.created_at * 1000).toLocaleString() }}</div>
					<div :class="['w-24 text-right font-medium', record.amount >= 0 ? 'text-green-600' : 'text-[var(--text-primary)]']">{{ record.amount > 0 ? '+' : '' }}{{ record.amount }}</div>
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

const userStore = useUserStore()
const records = ref<any[]>([])
const isLoading = ref(false)

onMounted(async () => {
	isLoading.value = true
	records.value = await userStore.fetchAccountRecords()
	isLoading.value = false
})
</script>
