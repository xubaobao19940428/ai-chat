<template>
	<TransitionRoot appear :show="uiStore.showSettingsModal" as="template">
		<Dialog as="div" @close="uiStore.closeSettingsModal" class="relative z-50">
			<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center">
					<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
						<DialogPanel class="w-full max-w-[920px] transform overflow-hidden rounded-[20px] bg-[var(--background-gray-main)] border border-[var(--border-main)] text-left align-middle shadow-[var(--shadow-XL)] transition-all flex flex-col md:flex-row h-[min(672px,calc(100vh-82px))]">
							<!-- Sidebar -->
							<SettingsSidebar :model-value="activeItem" :menu-items="menuItems" @select="activeItem = $event" />

							<!-- Content -->
							<div class="flex-1 flex flex-col bg-[var(--background-white-main)] relative overflow-hidden">
								<!-- Close Button -->
								<div class="absolute top-[20px] right-[12px] z-20">
									<button @click="uiStore.closeSettingsModal" class="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--fill-tsp-gray-main)] text-[var(--icon-tertiary)] hover:text-[var(--text-primary)]">
										<X :size="20" />
									</button>
								</div>

								<!-- Header -->
								<div class="gap-1 items-center px-6 py-5 hidden md:flex self-stretch border-b border-[var(--border-main)]">
									<h3 class="text-[18px] font-semibold leading-7 text-[var(--text-primary)]">{{ menuItems.find((i) => i.value === activeItem)?.name || activeItem }}</h3>
								</div>

								<!-- Scrollable Content -->
								<div class="flex-1 overflow-y-auto px-6 pt-4 pb-4 custom-scrollbar">
									<AccountPanel v-if="activeItem === 'Account'" @upgrade="showVipModal = true" />
									<UsagePanel v-else-if="activeItem === 'Usage'" @upgrade="showVipModal = true" />
									<GeneralSettingsPanel v-else-if="activeItem === 'Settings'" />
									<PersonalizationPanel v-else-if="activeItem === 'Personalization'" />
									<BillingPanel v-else-if="activeItem === 'Billing'" />
									<DataControlsPanel v-else-if="activeItem === 'Data controls'" />
									<SecurityPanel v-else-if="activeItem === 'Security'" />
									<div v-else class="w-full h-full flex items-center justify-center text-[var(--text-secondary)] opacity-50">Content for {{ activeItem }}</div>
								</div>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>

	<BuyVipDialog :is-open="showVipModal" @close="showVipModal = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { User, SlidersHorizontal, BarChart3, CreditCard, Database, LayoutGrid, Shield, X } from 'lucide-vue-next'
import { useUIStore } from '../stores/ui'
import BuyVipDialog from './BuyVipDialog.vue'
import SettingsSidebar from './settings/SettingsSidebar.vue'
import AccountPanel from './settings/AccountPanel.vue'
import UsagePanel from './settings/UsagePanel.vue'
import GeneralSettingsPanel from './settings/GeneralSettingsPanel.vue'
import PersonalizationPanel from './settings/PersonalizationPanel.vue'
import BillingPanel from './settings/BillingPanel.vue'
import DataControlsPanel from './settings/DataControlsPanel.vue'
import SecurityPanel from './settings/SecurityPanel.vue'

const uiStore = useUIStore()
const { t } = useI18n()
const activeItem = ref('Account')
const showVipModal = ref(false)

const menuItems = computed(() => [
	{ name: t('common.account'), icon: User, value: 'Account' },
	{ name: t('common.settings'), icon: SlidersHorizontal, value: 'Settings' },
	{ name: t('settings.usage'), icon: BarChart3, value: 'Usage' },
	{ name: t('settings.billing'), icon: CreditCard, value: 'Billing' },
	{ name: t('settings.data_controls'), icon: Database, value: 'Data controls' },
	{ name: t('settings.personalization'), icon: LayoutGrid, value: 'Personalization' },
	{ name: t('settings.security'), icon: Shield, value: 'Security' },
])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 0px;
}
</style>
