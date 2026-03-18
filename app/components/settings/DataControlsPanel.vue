<template>
	<div class="w-full">
		<div class="max-w-[600px]">
			<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)] cursor-pointer hover:opacity-80 transition-opacity">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.improve_model') }}</div>
				<div class="flex items-center gap-1 text-[var(--text-tertiary)]">
					<span class="text-[14px]">{{ $t('settings.data_controls_tab.on') }}</span>
					<ChevronRight :size="16" />
				</div>
			</div>

			<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.shared_links') }}</div>
				<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
					{{ $t('settings.data_controls_tab.manage') }}
				</button>
			</div>

			<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.archived_chats') }}</div>
				<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
					{{ $t('settings.data_controls_tab.manage') }}
				</button>
			</div>

			<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.archive_all') }}</div>
				<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
					{{ $t('settings.data_controls_tab.archive_all_btn') }}
				</button>
			</div>

			<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.delete_all') }}</div>
				<button class="px-4 py-2 text-[13px] font-medium text-red-500 border border-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
					{{ $t('settings.data_controls_tab.delete_all_btn') }}
				</button>
			</div>

			<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.export_data') }}</div>
				<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
					{{ $t('settings.data_controls_tab.export_btn') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
</script>
