<template>
	<div class="w-full">
		<div class="max-w-[600px]">
			<!-- Password -->
			<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)] cursor-pointer hover:opacity-80 transition-opacity">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.security_tab.password') }}</div>
				<div class="flex items-center gap-2 text-[var(--text-tertiary)]">
					<span class="text-[14px] tracking-wider">*******</span>
					<ChevronRight :size="18" />
				</div>
			</div>

			<!-- Passkey -->
			<div class="flex items-start justify-between py-5 border-b border-[var(--border-light)]">
				<div class="pr-6">
					<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.security_tab.passkey') }}</div>
					<div class="text-[14px] text-[var(--text-tertiary)] mt-1 leading-relaxed">{{ $t('settings.security_tab.passkey_desc') }}</div>
				</div>
				<div class="flex items-center gap-1 text-[var(--text-tertiary)] cursor-pointer hover:opacity-80 transition-opacity shrink-0 mt-1">
					<span class="text-[14px]">{{ $t('settings.security_tab.add') }}</span>
					<ChevronRight :size="16" />
				</div>
			</div>

			<!-- MFA Section -->
			<div class="mt-8">
				<div class="text-[18px] font-semibold text-[var(--text-primary)] mb-4">{{ $t('settings.security_tab.mfa_title') }}</div>

				<!-- Authenticator app -->
				<div class="flex items-start justify-between py-5 border-b border-[var(--border-light)]">
					<div class="pr-6">
						<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.security_tab.authenticator_app') }}</div>
						<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.security_tab.authenticator_app_desc') }}</div>
					</div>
					<Switch v-model="security.authenticator" :class="security.authenticator ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
						<span :class="security.authenticator ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
					</Switch>
				</div>

				<!-- Text message -->
				<div class="flex items-start justify-between py-5 border-b border-[var(--border-light)]">
					<div class="pr-6">
						<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.security_tab.text_message') }}</div>
						<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.security_tab.text_message_desc') }}</div>
					</div>
					<Switch v-model="security.textMessage" :class="security.textMessage ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
						<span :class="security.textMessage ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
					</Switch>
				</div>
			</div>

			<!-- Trusted devices -->
			<div class="mt-8">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.security_tab.trusted_devices') }}</div>
				<div class="text-[14px] text-[var(--text-tertiary)] mt-1 leading-relaxed">{{ $t('settings.security_tab.trusted_devices_desc') }}</div>
			</div>

			<!-- Logout this device -->
			<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)] mt-4">
				<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.security_tab.logout_device') }}</div>
				<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
					{{ $t('settings.security_tab.logout_btn') }}
				</button>
			</div>

			<!-- Logout all devices -->
			<div class="flex items-start justify-between py-5 border-b border-[var(--border-light)]">
				<div class="pr-6">
					<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.security_tab.logout_all') }}</div>
					<div class="text-[14px] text-[var(--text-tertiary)] mt-1 leading-relaxed">{{ $t('settings.security_tab.logout_all_desc') }}</div>
				</div>
				<button class="px-4 py-2 text-[13px] font-medium text-red-500 border border-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0 mt-1">
					{{ $t('settings.security_tab.logout_all_btn') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Switch } from '@headlessui/vue'
import { ChevronRight } from 'lucide-vue-next'

const security = reactive({
	authenticator: false,
	textMessage: false,
})
</script>
