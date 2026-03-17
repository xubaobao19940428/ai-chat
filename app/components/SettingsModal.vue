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

									<div v-else-if="activeItem === 'Personalization'" class="w-full space-y-8 pb-8">
										<!-- Basic style and tone -->
										<div class="pb-8 border-b border-[var(--border-light)]">
											<div class="flex items-start justify-between">
												<div class="pr-8">
													<div class="text-[17px] font-semibold text-[var(--text-primary)] mb-1">{{ $t('settings.personalization_tab.basic_style_tone') }}</div>
													<div class="text-[14px] text-[var(--text-tertiary)] leading-relaxed">{{ $t('settings.personalization_tab.basic_style_tone_desc') }}</div>
												</div>
												<div class="relative shrink-0">
													<Listbox v-model="selectedStyleTone">
														<div class="relative z-10">
															<ListboxButton class="flex items-center gap-2 bg-[var(--background-white-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] transition-colors rounded-xl px-4 py-2 text-[15px] font-medium text-[var(--text-primary)] outline-none cursor-pointer">
																<span>{{ styleTones.find((s) => s.value === selectedStyleTone)?.title }}</span>
																<ChevronDown :size="16" class="text-[var(--text-secondary)]" />
															</ListboxButton>
															<transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
																<ListboxOptions class="absolute right-0 mt-2 z-50 w-[240px] bg-[var(--background-white-main)] backdrop-blur-3xl border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-L)] overflow-hidden outline-none py-2">
																	<ListboxOption v-for="tone in styleTones" :key="tone.value" :value="tone.value" v-slot="{ active, selected }">
																		<li :class="['relative cursor-pointer select-none py-2.5 px-4 transition-colors', active ? 'bg-[var(--fill-tsp-gray-main)]' : '']">
																			<div class="flex items-center justify-between">
																				<div>
																					<div :class="['text-[15px]', selected ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-primary)]']">{{ tone.title }}</div>
																					<div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">{{ tone.desc }}</div>
																				</div>
																				<Check v-if="selected" class="w-4 h-4 text-[var(--text-primary)] shrink-0" />
																			</div>
																		</li>
																	</ListboxOption>
																</ListboxOptions>
															</transition>
														</div>
													</Listbox>
												</div>
											</div>

											<div class="mt-8">
												<div class="text-[15px] font-semibold text-[var(--text-primary)] mb-1">{{ $t('settings.personalization_tab.characteristics') }}</div>
												<div class="text-[14px] text-[var(--text-tertiary)] leading-relaxed mb-6">{{ $t('settings.personalization_tab.characteristics_desc') }}</div>

												<div class="space-y-4">
													<div class="flex items-center justify-between group relative z-[4]">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.gentle_considerate') }}</div>
														<div class="relative shrink-0">
															<Listbox v-model="personalization.gentle_considerate">
																<div class="relative z-10">
																	<ListboxButton class="flex items-center gap-2 bg-[var(--background-white-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] transition-colors rounded-lg px-3 py-1.5 text-[14px] text-[var(--text-primary)] outline-none cursor-pointer">
																		<span>{{ gentleOptions.find((o) => o.value === personalization.gentle_considerate)?.title }}</span>
																		<ChevronDown :size="16" class="text-[var(--text-secondary)]" />
																	</ListboxButton>
																	<transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
																		<ListboxOptions class="absolute right-0 mt-2 z-50 w-[220px] bg-[var(--background-white-main)] backdrop-blur-3xl border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-L)] overflow-hidden outline-none py-2">
																			<ListboxOption v-for="option in gentleOptions" :key="option.value" :value="option.value" v-slot="{ active, selected }">
																				<li :class="['relative cursor-pointer select-none py-2.5 px-4 transition-colors', active ? 'bg-[var(--fill-tsp-gray-main)]' : '']">
																					<div class="flex items-center justify-between">
																						<div>
																							<div :class="['text-[14px]', selected ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-primary)]']">{{ option.title }}</div>
																							<div v-if="option.desc" class="text-[12px] text-[var(--text-tertiary)] mt-0.5 leading-snug">{{ option.desc }}</div>
																						</div>
																						<Check v-if="selected" class="w-4 h-4 text-[var(--text-primary)] shrink-0 ml-2" />
																					</div>
																				</li>
																			</ListboxOption>
																		</ListboxOptions>
																	</transition>
																</div>
															</Listbox>
														</div>
													</div>
													<div class="flex items-center justify-between group relative z-[3]">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.passionate') }}</div>
														<div class="relative shrink-0">
															<Listbox v-model="personalization.passionate">
																<div class="relative z-10">
																	<ListboxButton class="flex items-center gap-2 bg-[var(--background-white-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] transition-colors rounded-lg px-3 py-1.5 text-[14px] text-[var(--text-primary)] outline-none cursor-pointer">
																		<span>{{ passionateOptions.find((o) => o.value === personalization.passionate)?.title }}</span>
																		<ChevronDown :size="16" class="text-[var(--text-secondary)]" />
																	</ListboxButton>
																	<transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
																		<ListboxOptions class="absolute right-0 mt-2 z-50 w-[220px] bg-[var(--background-white-main)] backdrop-blur-3xl border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-L)] overflow-hidden outline-none py-2">
																			<ListboxOption v-for="option in passionateOptions" :key="option.value" :value="option.value" v-slot="{ active, selected }">
																				<li :class="['relative cursor-pointer select-none py-2.5 px-4 transition-colors', active ? 'bg-[var(--fill-tsp-gray-main)]' : '']">
																					<div class="flex items-center justify-between">
																						<div>
																							<div :class="['text-[14px]', selected ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-primary)]']">{{ option.title }}</div>
																							<div v-if="option.desc" class="text-[12px] text-[var(--text-tertiary)] mt-0.5 leading-snug">{{ option.desc }}</div>
																						</div>
																						<Check v-if="selected" class="w-4 h-4 text-[var(--text-primary)] shrink-0 ml-2" />
																					</div>
																				</li>
																			</ListboxOption>
																		</ListboxOptions>
																	</transition>
																</div>
															</Listbox>
														</div>
													</div>
													<div class="flex items-center justify-between group relative z-[2]">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.titles_lists') }}</div>
														<div class="relative shrink-0">
															<Listbox v-model="personalization.titles_lists">
																<div class="relative z-10">
																	<ListboxButton class="flex items-center gap-2 bg-[var(--background-white-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] transition-colors rounded-lg px-3 py-1.5 text-[14px] text-[var(--text-primary)] outline-none cursor-pointer">
																		<span>{{ titlesListsOptions.find((o) => o.value === personalization.titles_lists)?.title }}</span>
																		<ChevronDown :size="16" class="text-[var(--text-secondary)]" />
																	</ListboxButton>
																	<transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
																		<ListboxOptions class="absolute right-0 mt-2 z-50 w-[220px] bg-[var(--background-white-main)] backdrop-blur-3xl border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-L)] overflow-hidden outline-none py-2">
																			<ListboxOption v-for="option in titlesListsOptions" :key="option.value" :value="option.value" v-slot="{ active, selected }">
																				<li :class="['relative cursor-pointer select-none py-2.5 px-4 transition-colors', active ? 'bg-[var(--fill-tsp-gray-main)]' : '']">
																					<div class="flex items-center justify-between">
																						<div>
																							<div :class="['text-[14px]', selected ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-primary)]']">{{ option.title }}</div>
																							<div v-if="option.desc" class="text-[12px] text-[var(--text-tertiary)] mt-0.5 leading-snug">{{ option.desc }}</div>
																						</div>
																						<Check v-if="selected" class="w-4 h-4 text-[var(--text-primary)] shrink-0 ml-2" />
																					</div>
																				</li>
																			</ListboxOption>
																		</ListboxOptions>
																	</transition>
																</div>
															</Listbox>
														</div>
													</div>
													<div class="flex items-center justify-between group relative z-[1]">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.emojis') }}</div>
														<div class="relative shrink-0">
															<Listbox v-model="personalization.emojis">
																<div class="relative z-10">
																	<ListboxButton class="flex items-center gap-2 bg-[var(--background-white-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] transition-colors rounded-lg px-3 py-1.5 text-[14px] text-[var(--text-primary)] outline-none cursor-pointer">
																		<span>{{ emojisOptions.find((o) => o.value === personalization.emojis)?.title }}</span>
																		<ChevronDown :size="16" class="text-[var(--text-secondary)]" />
																	</ListboxButton>
																	<transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
																		<ListboxOptions class="absolute right-0 mt-2 z-50 w-[220px] bg-[var(--background-white-main)] backdrop-blur-3xl border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-L)] overflow-hidden outline-none py-2">
																			<ListboxOption v-for="option in emojisOptions" :key="option.value" :value="option.value" v-slot="{ active, selected }">
																				<li :class="['relative cursor-pointer select-none py-2.5 px-4 transition-colors', active ? 'bg-[var(--fill-tsp-gray-main)]' : '']">
																					<div class="flex items-center justify-between">
																						<div>
																							<div :class="['text-[14px]', selected ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-primary)]']">{{ option.title }}</div>
																							<div v-if="option.desc" class="text-[12px] text-[var(--text-tertiary)] mt-0.5 leading-snug">{{ option.desc }}</div>
																						</div>
																						<Check v-if="selected" class="w-4 h-4 text-[var(--text-primary)] shrink-0 ml-2" />
																					</div>
																				</li>
																			</ListboxOption>
																		</ListboxOptions>
																	</transition>
																</div>
															</Listbox>
														</div>
													</div>
												</div>
											</div>

											<div class="mt-10">
												<div class="text-[15px] font-semibold text-[var(--text-primary)] mb-3">{{ $t('settings.personalization_tab.custom_instructions') }}</div>
												<textarea v-model="personalization.custom_instructions" :placeholder="$t('settings.personalization_tab.custom_inst_placeholder')" class="w-full h-[80px] p-4 text-[15px] bg-transparent border border-[var(--border-main)] rounded-xl outline-none focus:border-[var(--border-blue)] focus:ring-1 focus:ring-[var(--border-blue)] resize-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"></textarea>
											</div>
										</div>

										<!-- About you -->
										<div class="pb-8 border-b border-[var(--border-light)]">
											<div class="text-[20px] font-semibold text-[var(--text-primary)] mb-6">{{ $t('settings.personalization_tab.about_you') }}</div>

											<div class="space-y-6">
												<div>
													<div class="text-[15px] text-[var(--text-primary)] mb-2">{{ $t('settings.personalization_tab.nickname') }}</div>
													<input type="text" v-model="personalization.nickname" :placeholder="$t('settings.personalization_tab.nickname_placeholder')" class="w-full px-4 py-3 text-[15px] bg-transparent border border-[var(--border-main)] rounded-xl outline-none focus:border-[var(--border-blue)] focus:ring-1 focus:ring-[var(--border-blue)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]" />
												</div>
												<div>
													<div class="text-[15px] text-[var(--text-primary)] mb-2">{{ $t('settings.personalization_tab.occupation') }}</div>
													<div class="relative">
														<input type="text" v-model="personalization.occupation" class="w-full px-4 py-3 text-[15px] bg-transparent border border-[var(--border-main)] rounded-xl outline-none focus:border-[var(--border-blue)] focus:ring-1 focus:ring-[var(--border-blue)] text-[var(--text-primary)]" />
														<!-- Carousel placeholder overlay -->
														<div v-if="!personalization.occupation" class="absolute left-4 top-1/2 -translate-y-1/2 h-[20px] overflow-hidden pointer-events-none">
															<div :class="occupationNoTransition ? '' : 'transition-transform duration-400 ease-in-out'" :style="{ transform: occupationTransitioning ? 'translateY(-50%)' : 'translateY(0)' }">
																<div class="h-[20px] flex items-center text-[15px] text-[var(--text-tertiary)]">{{ currentOccupationPlaceholder }}</div>
																<div class="h-[20px] flex items-center text-[15px] text-[var(--text-tertiary)]">{{ nextOccupationPlaceholder }}</div>
															</div>
														</div>
													</div>
												</div>
												<div>
													<div class="text-[15px] text-[var(--text-primary)] mb-2">{{ $t('settings.personalization_tab.your_details') }}</div>
													<textarea v-model="personalization.your_details" :placeholder="$t('settings.personalization_tab.your_details_placeholder')" class="w-full h-[80px] p-4 text-[15px] bg-transparent border border-[var(--border-main)] rounded-xl outline-none focus:border-[var(--border-blue)] focus:ring-1 focus:ring-[var(--border-blue)] resize-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"></textarea>
												</div>
											</div>
										</div>

										<!-- Memory -->
										<div class="pb-8 border-b border-[var(--border-light)]">
											<div class="flex items-center justify-between mb-6">
												<div class="flex items-center gap-2">
													<div class="text-[20px] font-semibold text-[var(--text-primary)]">{{ $t('settings.personalization_tab.memory') }}</div>
													<CircleHelp :size="16" class="text-[var(--text-tertiary)] cursor-pointer" />
												</div>
												<button class="px-4 py-1.5 rounded-full border border-[var(--border-main)] text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors">{{ $t('settings.personalization_tab.manage') }}</button>
											</div>

											<div class="space-y-6">
												<div class="flex items-start justify-between">
													<div class="pr-8">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.ref_saved_mem') }}</div>
														<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.ref_saved_mem_desc') }}</div>
													</div>
													<Switch v-model="personalization.ref_saved_mem" :class="personalization.ref_saved_mem ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
														<span :class="personalization.ref_saved_mem ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
													</Switch>
												</div>
												<div class="flex items-start justify-between">
													<div class="pr-8">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.ref_chat_history') }}</div>
														<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.ref_chat_history_desc') }}</div>
													</div>
													<Switch v-model="personalization.ref_chat_history" :class="personalization.ref_chat_history ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
														<span :class="personalization.ref_chat_history ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
													</Switch>
												</div>
											</div>
											<div class="mt-8 text-[13px] text-[var(--text-tertiary)]">
												{{ $t('settings.personalization_tab.memory_footer').replace('{link}', '') }}
												<a href="#" class="underline hover:text-[var(--text-primary)] ml-1">{{ $t('settings.personalization_tab.learn_more') }}</a>
											</div>
										</div>

										<!-- Advanced -->
										<div v-if="false" class="pb-12">
											<button @click="isAdvancedOpen = !isAdvancedOpen" class="flex items-center gap-2 text-[20px] font-semibold text-[var(--text-primary)] mb-6 hover:opacity-80 transition-opacity outline-none">
												{{ $t('settings.personalization_tab.advanced') }}
												<ChevronUp v-if="isAdvancedOpen" :size="20" class="text-[var(--text-primary)]" />
												<ChevronDown v-else :size="20" class="text-[var(--text-primary)]" />
											</button>

											<div v-show="isAdvancedOpen" class="space-y-6 pt-2">
												<div class="flex items-start justify-between pb-6 border-b border-[var(--border-light)]">
													<div class="pr-8">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.web_search') }}</div>
														<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.web_search_desc') }}</div>
													</div>
													<Switch v-model="personalization.web_search" :class="personalization.web_search ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
														<span :class="personalization.web_search ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
													</Switch>
												</div>
												<div class="flex items-start justify-between pb-6 border-b border-[var(--border-light)]">
													<div class="pr-8">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.canvas') }}</div>
														<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.canvas_desc') }}</div>
													</div>
													<Switch v-model="personalization.canvas" :class="personalization.canvas ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
														<span :class="personalization.canvas ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
													</Switch>
												</div>
												<div class="flex items-start justify-between pb-6 border-b border-[var(--border-light)]">
													<div class="pr-8">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.voice') }}</div>
														<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.voice_desc') }}</div>
													</div>
													<Switch v-model="personalization.voice" :class="personalization.voice ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
														<span :class="personalization.voice ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
													</Switch>
												</div>
												<div class="flex items-start justify-between pb-6 border-b border-[var(--border-light)]">
													<div class="pr-8">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.adv_voice') }}</div>
														<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.adv_voice_desc') }}</div>
													</div>
													<Switch v-model="personalization.adv_voice" :class="personalization.adv_voice ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
														<span :class="personalization.adv_voice ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
													</Switch>
												</div>
												<div class="flex items-start justify-between pb-6 border-b border-[var(--border-light)]">
													<div class="pr-8">
														<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.connector_search') }}</div>
														<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.connector_search_desc') }}</div>
													</div>
													<Switch v-model="personalization.connector_search" :class="personalization.connector_search ? 'bg-[#0f6fff]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
														<span :class="personalization.connector_search ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
													</Switch>
												</div>
											</div>
										</div>
									</div>

									<div v-else-if="activeItem === 'Billing'" class="w-full">
										<div class="max-w-[600px]">
											<!-- Invoices -->
											<div>
												<!-- <div class="flex items-center gap-2 mb-4">
													<FileText :size="20" class="text-[var(--text-primary)]" />
													<div class="text-[18px] font-semibold text-[var(--text-primary)]">{{ $t('settings.billing_tab.invoices') }}</div>
												</div> -->
												<div class="border border-[var(--border-light)] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
													<FileText :size="40" class="text-[var(--text-tertiary)] opacity-40 mb-3" />
													<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.billing_tab.no_invoices') }}</div>
													<div class="text-[13px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.billing_tab.no_invoices_desc') }}</div>
												</div>
											</div>
										</div>
									</div>

									<div v-else-if="activeItem === 'Data controls'" class="w-full">
										<div class="max-w-[600px]">
											<!-- Improve model -->
											<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)] cursor-pointer hover:opacity-80 transition-opacity">
												<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.improve_model') }}</div>
												<div class="flex items-center gap-1 text-[var(--text-tertiary)]">
													<span class="text-[14px]">{{ $t('settings.data_controls_tab.on') }}</span>
													<ChevronRight :size="16" />
												</div>
											</div>

											<!-- Shared links -->
											<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
												<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.shared_links') }}</div>
												<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
													{{ $t('settings.data_controls_tab.manage') }}
												</button>
											</div>

											<!-- Archived chats -->
											<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
												<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.archived_chats') }}</div>
												<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
													{{ $t('settings.data_controls_tab.manage') }}
												</button>
											</div>

											<!-- Archive all chats -->
											<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
												<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.archive_all') }}</div>
												<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
													{{ $t('settings.data_controls_tab.archive_all_btn') }}
												</button>
											</div>

											<!-- Delete all chats -->
											<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
												<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.delete_all') }}</div>
												<button class="px-4 py-2 text-[13px] font-medium text-red-500 border border-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
													{{ $t('settings.data_controls_tab.delete_all_btn') }}
												</button>
											</div>

											<!-- Export data -->
											<div class="flex items-center justify-between py-5 border-b border-[var(--border-light)]">
												<div class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('settings.data_controls_tab.export_data') }}</div>
												<button class="px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
													{{ $t('settings.data_controls_tab.export_btn') }}
												</button>
											</div>
										</div>
									</div>

									<div v-else-if="activeItem === 'Security'" class="w-full">
										<div class="max-w-[600px]">
											<!-- Title -->
											<!-- <div class="text-[24px] font-semibold text-[var(--text-primary)] mb-8">{{ $t('settings.security_tab.title') }}</div> -->

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

									<!-- Placeholder for other active items -->
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
import { ref, reactive, watch, computed, onMounted, onUnmounted } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild, Switch, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'
import BuyVipDialog from './BuyVipDialog.vue'
import { User, SlidersHorizontal, BarChart3, Calendar, Mail, Database, Globe, LayoutGrid, Puzzle, Link, Rocket, CircleHelp, ArrowUpRight, X, ChevronDown, ChevronUp, Sparkles, LogOut, SquarePen, CreditCard, ChevronRight, Shield, Check, FileText } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const uiStore = useUIStore()
const userStore = useUserStore()
const { locale, setLocale, t, tm, rt } = useI18n()
const activeItem = ref('Account')

const personalization = reactive({
	gentle_considerate: 'default',
	passionate: 'default',
	titles_lists: 'default',
	emojis: 'default',
	custom_instructions: '',
	nickname: '',
	occupation: '',
	your_details: '',
	ref_saved_mem: true,
	ref_chat_history: true,
	web_search: true,
	canvas: true,
	voice: true,
	adv_voice: true,
	connector_search: false,
})
const isAdvancedOpen = ref(false)
const selectedStyleTone = ref('default')

// Occupation placeholder carousel
const occupationPlaceholderIndex = ref(0)
const occupationTransitioning = ref(false)
const occupationNoTransition = ref(false)
let occupationTimer: ReturnType<typeof setInterval> | null = null

const occupationPlaceholders = computed((): string[] => {
	const list = tm('settings.personalization_tab.occupation_placeholders') as any
	if (!Array.isArray(list)) return []
	return list.map((item: any) => rt(item))
})

const currentOccupationPlaceholder = computed(() => {
	const list = occupationPlaceholders.value
	if (!list.length) return ''
	return list[occupationPlaceholderIndex.value % list.length]
})

const nextOccupationPlaceholder = computed(() => {
	const list = occupationPlaceholders.value
	if (!list.length) return ''
	return list[(occupationPlaceholderIndex.value + 1) % list.length]
})

function startOccupationCarousel() {
	if (occupationTimer) return
	occupationTimer = setInterval(() => {
		occupationTransitioning.value = true
		setTimeout(() => {
			// Disable transition, snap back to 0, update index
			occupationNoTransition.value = true
			occupationTransitioning.value = false
			occupationPlaceholderIndex.value = (occupationPlaceholderIndex.value + 1) % occupationPlaceholders.value.length
			// Re-enable transition on next frame
			requestAnimationFrame(() => {
				occupationNoTransition.value = false
			})
		}, 400)
	}, 3000)
}

function stopOccupationCarousel() {
	if (occupationTimer) {
		clearInterval(occupationTimer)
		occupationTimer = null
	}
}

onMounted(() => {
	startOccupationCarousel()
})

onUnmounted(() => {
	stopOccupationCarousel()
})

const styleTones = computed(() => [
	{ value: 'default', title: t('settings.personalization_tab.style_tones.default.title'), desc: t('settings.personalization_tab.style_tones.default.desc') },
	{ value: 'professional', title: t('settings.personalization_tab.style_tones.professional.title'), desc: t('settings.personalization_tab.style_tones.professional.desc') },
	{ value: 'friendly', title: t('settings.personalization_tab.style_tones.friendly.title'), desc: t('settings.personalization_tab.style_tones.friendly.desc') },
	{ value: 'direct', title: t('settings.personalization_tab.style_tones.direct.title'), desc: t('settings.personalization_tab.style_tones.direct.desc') },
	{ value: 'creative', title: t('settings.personalization_tab.style_tones.creative.title'), desc: t('settings.personalization_tab.style_tones.creative.desc') },
	{ value: 'practical', title: t('settings.personalization_tab.style_tones.practical.title'), desc: t('settings.personalization_tab.style_tones.practical.desc') },
	{ value: 'tech', title: t('settings.personalization_tab.style_tones.tech.title'), desc: t('settings.personalization_tab.style_tones.tech.desc') },
	{ value: 'sarcastic', title: t('settings.personalization_tab.style_tones.sarcastic.title'), desc: t('settings.personalization_tab.style_tones.sarcastic.desc') },
])

const gentleOptions = computed(() => [
	{ value: 'increase', title: t('settings.personalization_tab.characteristics_options.gentle.increase.title'), desc: t('settings.personalization_tab.characteristics_options.gentle.increase.desc') },
	{ value: 'default', title: t('settings.personalization_tab.characteristics_options.gentle.default.title'), desc: '' },
	{ value: 'decrease', title: t('settings.personalization_tab.characteristics_options.gentle.decrease.title'), desc: t('settings.personalization_tab.characteristics_options.gentle.decrease.desc') },
])

const passionateOptions = computed(() => [
	{ value: 'increase', title: t('settings.personalization_tab.characteristics_options.passionate.increase.title'), desc: t('settings.personalization_tab.characteristics_options.passionate.increase.desc') },
	{ value: 'default', title: t('settings.personalization_tab.characteristics_options.passionate.default.title'), desc: '' },
	{ value: 'decrease', title: t('settings.personalization_tab.characteristics_options.passionate.decrease.title'), desc: t('settings.personalization_tab.characteristics_options.passionate.decrease.desc') },
])

const titlesListsOptions = computed(() => [
	{ value: 'increase', title: t('settings.personalization_tab.characteristics_options.titles_lists.increase.title'), desc: t('settings.personalization_tab.characteristics_options.titles_lists.increase.desc') },
	{ value: 'default', title: t('settings.personalization_tab.characteristics_options.titles_lists.default.title'), desc: '' },
	{ value: 'decrease', title: t('settings.personalization_tab.characteristics_options.titles_lists.decrease.title'), desc: t('settings.personalization_tab.characteristics_options.titles_lists.decrease.desc') },
])

const emojisOptions = computed(() => [
	{ value: 'increase', title: t('settings.personalization_tab.characteristics_options.emojis.increase.title'), desc: t('settings.personalization_tab.characteristics_options.emojis.increase.desc') },
	{ value: 'default', title: t('settings.personalization_tab.characteristics_options.emojis.default.title'), desc: '' },
	{ value: 'decrease', title: t('settings.personalization_tab.characteristics_options.emojis.decrease.title'), desc: t('settings.personalization_tab.characteristics_options.emojis.decrease.desc') },
])

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

const currentLanguageLabel = computed(() => languages.find((l) => l.value === locale.value)?.label ?? 'English')
const showVipModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const records = ref<any[]>([])
const isLoadingRecords = ref(false)

const menuItems = computed(() => [
	{ name: t('common.account'), icon: User, value: 'Account' },
	{ name: t('common.settings'), icon: SlidersHorizontal, value: 'Settings' },
	{ name: t('settings.usage'), icon: BarChart3, value: 'Usage' },
	{ name: t('settings.billing'), icon: CreditCard, value: 'Billing' },
	{ name: t('settings.data_controls'), icon: Database, value: 'Data controls' },
	{ name: t('settings.personalization'), icon: LayoutGrid, value: 'Personalization' },
	{ name: t('settings.security'), icon: Shield, value: 'Security' },
])

const notifications = reactive({
	exclusive: true,
	queue: true,
})

const security = reactive({
	authenticator: false,
	textMessage: false,
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
