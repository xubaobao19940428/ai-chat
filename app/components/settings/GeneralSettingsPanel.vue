<template>
	<div class="w-full space-y-8">
		<!-- General -->
		<div class="pb-8 border-b border-[var(--border-light)]">
			<div class="text-[13px] font-medium text-[var(--text-tertiary)] mb-1">{{ $t('common.general') }}</div>
			<div class="mb-6">
				<div class="text-sm font-medium text-[var(--text-primary)] mb-3">{{ $t('common.language') }}</div>
				<Listbox :model-value="locale" @update:model-value="setLocale">
					<div class="relative w-[208px]">
						<ListboxButton class="w-full flex items-center justify-between gap-2 bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] hover:border-[var(--border-blue)] text-[var(--text-primary)] text-sm rounded-lg py-2 pl-3 pr-3 outline-none cursor-pointer transition-colors">
							<span>{{ currentLanguageLabel }}</span>
							<ChevronDown :size="15" class="text-[var(--text-tertiary)] shrink-0" />
						</ListboxButton>
						<transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
							<ListboxOptions class="absolute z-50 mt-1 w-full bg-[var(--background-white-main)] border border-[var(--border-main)] rounded-lg shadow-[var(--shadow-L)] overflow-hidden outline-none p-1">
								<ListboxOption v-for="lang in languages" :key="lang.value" :value="lang.value" v-slot="{ active, selected }">
									<li :class="['flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm cursor-pointer select-none transition-colors', active ? 'bg-[var(--fill-tsp-gray-main)]' : '']">
										<span :class="selected ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{ lang.label }}</span>
										<div v-if="selected" class="size-4 rounded-full bg-[var(--text-primary)] flex items-center justify-center shrink-0">
											<svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
										</div>
									</li>
								</ListboxOption>
							</ListboxOptions>
						</transition>
					</div>
				</Listbox>
			</div>

			<div>
				<div class="text-sm font-medium text-[var(--text-primary)] mb-3">{{ $t('common.appearance') }}</div>
				<div class="flex gap-6">
					<button @click="uiStore.setThemeMode('light')" class="group flex flex-col gap-2.5 items-center">
						<div :class="['w-[90px] h-[60px] rounded-[10px] border box-border overflow-hidden transition-all', uiStore.themeMode === 'light' ? 'border-[var(--icon-blue)] ring-1 ring-[var(--icon-blue)]' : 'border-[var(--border-main)] group-hover:border-[var(--icon-blue)]']">
							<div class="w-full h-full bg-[#fcfcfc] relative">
								<div class="absolute top-2 left-2 right-2 h-1.5 bg-[#e5e5e5] rounded-full"></div>
								<div class="absolute top-5 left-2 w-8 h-1.5 bg-[#e5e5e5] rounded-full"></div>
							</div>
						</div>
						<div class="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">{{ $t('common.light') }}</div>
					</button>
					<button @click="uiStore.setThemeMode('dark')" class="group flex flex-col gap-2.5 items-center">
						<div :class="['w-[90px] h-[60px] rounded-[10px] border box-border overflow-hidden transition-all', uiStore.themeMode === 'dark' ? 'border-[var(--icon-blue)] ring-1 ring-[var(--icon-blue)]' : 'border-[var(--border-main)] group-hover:border-[var(--icon-blue)]']">
							<div class="w-full h-full bg-[#1a1a1a] relative">
								<div class="absolute top-2 left-2 right-2 h-1.5 bg-[#333] rounded-full"></div>
								<div class="absolute top-5 left-2 w-8 h-1.5 bg-[#333] rounded-full"></div>
							</div>
						</div>
						<div class="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">{{ $t('common.dark') }}</div>
					</button>
					<button @click="uiStore.setThemeMode('system')" class="group flex flex-col gap-2.5 items-center">
						<div :class="['w-[90px] h-[60px] rounded-[10px] border box-border overflow-hidden transition-all', uiStore.themeMode === 'system' ? 'border-[var(--icon-blue)] ring-1 ring-[var(--icon-blue)]' : 'border-[var(--border-main)] group-hover:border-[var(--icon-blue)]']">
							<div class="w-full h-full flex">
								<div class="w-1/2 bg-[#fcfcfc]"></div>
								<div class="w-1/2 bg-[#1a1a1a]"></div>
							</div>
						</div>
						<div class="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">{{ $t('common.system') }}</div>
					</button>
				</div>
			</div>
		</div>

		<!-- Communication -->
		<div class="pb-8 border-b border-[var(--border-light)]">
			<div class="text-[13px] font-medium text-[var(--text-tertiary)] mb-1">{{ $t('settings.communication_pref') }}</div>

			<div class="flex items-start justify-between py-3">
				<div class="pr-4">
					<div class="text-sm font-medium text-[var(--text-primary)]">{{ $t('settings.receive_exclusive') }}</div>
					<div class="text-[13px] text-[var(--text-tertiary)] leading-relaxed mt-0.5">{{ $t('settings.receive_exclusive_desc') }}</div>
				</div>
				<Switch v-model="notifications.exclusive" :class="notifications.exclusive ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none">
					<span :class="notifications.exclusive ? 'translate-x-3.5' : 'translate-x-0.5'" class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform" />
				</Switch>
			</div>

			<div class="flex items-start justify-between py-3">
				<div class="pr-4">
					<div class="text-sm font-medium text-[var(--text-primary)]">{{ $t('settings.email_queue') }}</div>
					<div class="text-[13px] text-[var(--text-tertiary)] leading-relaxed mt-0.5">{{ $t('settings.email_queue_desc') }}</div>
				</div>
				<Switch v-model="notifications.queue" :class="notifications.queue ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none">
					<span :class="notifications.queue ? 'translate-x-3.5' : 'translate-x-0.5'" class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform" />
				</Switch>
			</div>
		</div>

		<!-- Cookies -->
		<div class="flex items-center justify-between">
			<span class="text-sm text-[var(--text-primary)]">{{ $t('settings.manage_cookies') }}</span>
			<button class="px-3 py-1.5 rounded-[10px] border border-[var(--border-btn-main)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--fill-tsp-white-light)] transition-colors">{{ $t('settings.manage') }}</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Switch, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown } from 'lucide-vue-next'
import { useUIStore } from '../../stores/ui'

const uiStore = useUIStore()
const { locale, setLocale } = useI18n()

const languages = [
	{ value: 'en', label: 'English' },
	{ value: 'zh', label: '简体中文' },
	{ value: 'ja', label: '日本語' },
	{ value: 'ko', label: '한국어' },
	{ value: 'es', label: 'Español' },
	{ value: 'fr', label: 'Français' },
	{ value: 'de', label: 'Deutsch' },
	{ value: 'pt', label: 'Português' },
]

const currentLanguageLabel = computed(() => languages.find(l => l.value === locale.value)?.label ?? 'English')

const notifications = reactive({
	exclusive: true,
	queue: true,
})
</script>
