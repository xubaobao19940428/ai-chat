<template>
	<div class="w-full">
		<div class="max-w-[600px]">
			<div>
				<div class="border border-[var(--border-light)] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
					<FileText :size="40" class="text-[var(--text-tertiary)] opacity-40 mb-3" />
					<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.billing_tab.no_invoices') }}</div>
					<div class="text-[13px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.billing_tab.no_invoices_desc') }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
</script>
