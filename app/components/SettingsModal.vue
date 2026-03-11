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
							<div class="md:w-[221px] flex-shrink-0 border-r border-[var(--border-main)] relative flex flex-col bg-[var(--background-gray-main)]">
								<!-- Logo -->
								<div class="items-center px-5 pt-5 pb-3 flex">
									<div class="flex gap-0.5 text-black dark:text-white">
										<!-- Manus Logo SVG from HTML -->
										<div class="flex items-center size-8 justify-center shrink-0">
											<img src="/favicon.svg" class="size-6 pointer-events-none" alt="Aura Logo" />
										</div>
										<span class="font-bold text-lg tracking-tight ml-2">aura</span>
									</div>
								</div>

								<!-- Nav Items -->
								<nav class="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
									<button v-for="item in menuItems" :key="item.value" @click="activeItem = item.value" :class="['w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium transition-colors', item.value === activeItem ? 'bg-[var(--fill-tsp-white-main)] font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] hover:text-[var(--text-primary)]']">
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

							<!-- Content Content -->
							<div class="flex-1 flex flex-col bg-[var(--background-gray-main)] relative overflow-hidden">
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
									<div v-if="activeItem === 'Account'" class="w-full space-y-6">
										<!-- User Profile Header -->
										<div class="flex items-center justify-between pb-6">
											<div class="flex items-center gap-4">
												<!-- Avatar Upload -->
												<div @click="triggerUpload" class="group relative h-16 w-16 rounded-full overflow-hidden border border-[var(--border-main)] cursor-pointer">
													<img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" class="w-full h-full object-cover transition-opacity group-hover:opacity-75" />
													<div v-else class="w-full h-full bg-[var(--fill-tsp-white-main)] flex items-center justify-center text-2xl font-bold text-[var(--text-secondary)] transition-opacity group-hover:opacity-75">
														{{ userStore.userInfo?.nickname?.[0]?.toUpperCase() || 'U' }}
													</div>
													<!-- Hover Overlay -->
													<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
														<SquarePen :size="24" class="text-white drop-shadow-md" />
													</div>
													<input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
												</div>
												<div>
													<h3 class="text-xl font-bold text-[var(--text-primary)] leading-tight">{{ userStore.userInfo?.nickname || 'User' }}</h3>
													<p class="text-[13px] text-[var(--text-tertiary)] mt-0.5">{{ userStore.userInfo?.email || 'user@example.com' }}</p>
												</div>
											</div>
											<div class="flex items-center gap-3">
												<button class="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] hover:text-[var(--text-primary)] transition-colors">
													<User :size="20" />
												</button>
												<button @click="userStore.logout" class="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border-main)] text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors">
													<LogOut :size="20" />
												</button>
											</div>
										</div>

										<!-- Plan Card -->
										<div class="rounded-[16px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] p-5">
											<div class="flex items-center justify-between mb-4">
												<span class="font-serif text-xl font-bold text-[var(--text-primary)]">{{ $t('settings.free_plan') }}</span>
												<button @click="showVipModal = true" class="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-80 transition-opacity">{{ $t('settings.upgrade') }}</button>
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
									</div>

									<div v-else-if="activeItem === 'Usage'" class="w-full space-y-6">
										<!-- Plan Card (Reused) -->
										<div class="rounded-[16px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] p-5">
											<div class="flex items-center justify-between mb-4">
												<span class="font-serif text-xl font-bold text-[var(--text-primary)]">{{ $t('settings.free_plan') }}</span>
												<button @click="showVipModal = true" class="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-80 transition-opacity">{{ $t('settings.upgrade') }}</button>
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
												<div v-if="isLoadingRecords" class="p-4 flex justify-center">
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

									<div v-else-if="activeItem === 'Settings'" class="w-full space-y-8">
										<!-- General -->
										<div class="pb-8 border-b border-[var(--border-light)]">
											<div class="text-[13px] font-medium text-[var(--text-tertiary)] mb-1">{{ $t('common.general') }}</div>
											<div class="mb-6">
												<div class="text-sm font-medium text-[var(--text-primary)] mb-3">{{ $t('common.language') }}</div>
												<div class="relative w-[208px]">
													<select :value="locale" @change="(e) => setLocale((e.target as any).value)" class="w-full appearance-none bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-white)] text-[var(--text-primary)] text-sm rounded-lg py-2 pl-3 pr-8 outline-none cursor-pointer">
														<option value="en">English</option>
														<option value="zh">简体中文</option>
													</select>
													<ChevronDown :size="16" class="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-primary)] pointer-events-none" />
												</div>
											</div>

											<div>
												<div class="text-sm font-medium text-[var(--text-primary)] mb-3">{{ $t('common.appearance') }}</div>
												<div class="flex gap-6">
													<!-- Light -->
													<button @click="uiStore.setThemeMode('light')" class="group flex flex-col gap-2.5 items-center">
														<div :class="['w-[90px] h-[60px] rounded-[10px] border box-border overflow-hidden transition-all', uiStore.themeMode === 'light' ? 'border-[var(--icon-blue)] ring-1 ring-[var(--icon-blue)]' : 'border-[var(--border-main)] group-hover:border-[var(--icon-blue)]']">
															<div class="w-full h-full bg-[#fcfcfc] relative">
																<div class="absolute top-2 left-2 right-2 h-1.5 bg-[#e5e5e5] rounded-full"></div>
																<div class="absolute top-5 left-2 w-8 h-1.5 bg-[#e5e5e5] rounded-full"></div>
															</div>
														</div>
														<div class="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">{{ $t('common.light') }}</div>
													</button>
													<!-- Dark -->
													<button @click="uiStore.setThemeMode('dark')" class="group flex flex-col gap-2.5 items-center">
														<div :class="['w-[90px] h-[60px] rounded-[10px] border box-border overflow-hidden transition-all', uiStore.themeMode === 'dark' ? 'border-[var(--icon-blue)] ring-1 ring-[var(--icon-blue)]' : 'border-[var(--border-main)] group-hover:border-[var(--icon-blue)]']">
															<div class="w-full h-full bg-[#1a1a1a] relative">
																<div class="absolute top-2 left-2 right-2 h-1.5 bg-[#333] rounded-full"></div>
																<div class="absolute top-5 left-2 w-8 h-1.5 bg-[#333] rounded-full"></div>
															</div>
														</div>
														<div class="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">{{ $t('common.dark') }}</div>
													</button>
													<!-- System -->
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

									<!-- Other Tabs Placeholder -->
									<div v-else class="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)]">
										<p>Content for {{ activeItem }}</p>
									</div>
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
import { ref, reactive, watch } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild, Switch } from '@headlessui/vue'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'
import BuyVipDialog from './BuyVipDialog.vue'
import { User, SlidersHorizontal, BarChart3, Calendar, Mail, Database, Globe, LayoutGrid, Puzzle, Link, Rocket, CircleHelp, ArrowUpRight, X, ChevronDown, Sparkles, LogOut, SquarePen, CreditCard, ChevronRight } from 'lucide-vue-next'

const uiStore = useUIStore()
const userStore = useUserStore()
const { locale, setLocale, t } = useI18n()
const activeItem = ref('Account')
const showVipModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const records = ref<any[]>([])
const isLoadingRecords = ref(false)

const menuItems = computed(() => [
	{ name: t('common.account'), icon: User, value: 'Account' },
	{ name: t('common.settings'), icon: SlidersHorizontal, value: 'Settings' },
	{ name: t('settings.usage'), icon: BarChart3, value: 'Usage' },
	{ name: t('settings.scheduled_tasks'), icon: Calendar, value: 'Scheduled tasks' },
	{ name: t('settings.mail_aura'), icon: Mail, value: 'Mail Aura' },
	{ name: t('settings.data_controls'), icon: Database, value: 'Data controls' },
	{ name: t('settings.cloud_browser'), icon: Globe, value: 'Cloud browser' },
	{ name: t('settings.personalization'), icon: LayoutGrid, value: 'Personalization' },
	{ name: t('settings.skills'), icon: Puzzle, value: 'Skills' },
	{ name: t('settings.connectors'), icon: Link, value: 'Connectors' },
	{ name: t('settings.integrations'), icon: Rocket, value: 'Integrations' },
])

const notifications = reactive({
	exclusive: true,
	queue: true,
})

const triggerUpload = () => {
	fileInput.value?.click()
}

const handleFileChange = async (e: Event) => {
	const input = e.target as HTMLInputElement
	if (input.files && input.files[0]) {
		try {
			await userStore.uploadAvatar(input.files[0])
			// Do not alert, just update UI which is handled by store
		} catch (error) {
			uiStore.showToast('Avatar upload failed', 'error')
		}
	}
}

watch(activeItem, async (val) => {
	if (val === 'Usage') {
		isLoadingRecords.value = true
		records.value = await userStore.fetchAccountRecords()
		isLoadingRecords.value = false
	}
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 0px;
}
</style>
