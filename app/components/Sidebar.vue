<template>
	<!-- Aura Desktop Sidebar -->
	<aside :class="['hidden lg:flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-r border-[var(--border-light)] transition-all duration-300 relative z-[40] overflow-hidden flex-shrink-0', uiStore.sidebarCollapsed ? 'w-[68px]' : 'w-[300px]']">
		<!-- Top Section: Logo & Collapse -->
		<div class="flex items-center justify-between h-[56px] py-[12px] pe-[10px] ps-[12px] shrink-0">
			<!-- Logo Section -->
			<div class="flex items-center gap-1 ps-[8px] clickable">
				<div class="flex items-center size-8 justify-center shrink-0">
					<img src="/favicon.svg" class="size-6 pointer-events-none" alt="Aura Logo" />
				</div>
				<span v-show="!uiStore.sidebarCollapsed" class="text-lg font-bold text-[var(--text-primary)] tracking-tight ml-1">aura</span>
			</div>

			<div @click="uiStore.toggleSidebar" class="flex items-center justify-center rounded-md hover:bg-[var(--bg-hover)] cursor-pointer size-[32px] shrink-0 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left text-[var(--text-secondary)] size-[18px]">
					<rect width="18" height="18" x="3" y="3" rx="2"></rect>
					<path d="M9 3v18"></path>
				</svg>
			</div>
		</div>

		<!-- Nav Items Section -->
		<div class="flex flex-col flex-1 min-h-0 p-[8px] pb-0 gap-px transition-all">
			<!-- New Task -->
			<div @click="handleNewChat" :class="['flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px]', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px]']">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen">
						<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
						<path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
					</svg>
				</div>
				<div v-if="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">New task</span>
				</div>
			</div>

			<!-- Search -->
			<div @click="uiStore.openSearchModal" :class="['flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px] group', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px]']">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.34-4.34"></path>
					</svg>
				</div>
				<div v-if="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">Search</span>
				</div>
				<div v-if="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
					<div class="text-[var(--text-tertiary)] text-sm hidden group-hover:inline-flex items-center gap-1 pe-[8px]">⌘ K</div>
				</div>
			</div>

			<!-- Library -->
			<div :class="['flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px]', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px]']">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big">
						<rect width="8" height="18" x="3" y="3" rx="1"></rect>
						<path d="M7 3v18"></path>
						<path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"></path>
					</svg>
				</div>
				<div v-if="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">Library</span>
				</div>
			</div>

			<!-- History Content (Scrollable) -->
			<div class="flex flex-col flex-1 min-h-0 -mx-[8px] transition-all overflow-hidden" style="opacity: 1">
				<div class="w-full border-t-[1px] border-[var(--border-light)] opacity-50 my-2"></div>
				<div class="flex flex-col flex-1 min-h-0 overflow-x-hidden overflow-y-auto custom-scrollbar pt-0 px-[8px]">
					<!-- Projects Toggle -->
					<div @click="toggleProjects" :class="['group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] clickable hover:bg-[var(--bg-hover)] transition-colors active:bg-[var(--bg-hover)] rounded-[10px] mb-1', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px]']">
						<div v-if="!uiStore.sidebarCollapsed" class="flex items-center flex-1 min-w-0 gap-0.5">
							<span class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">Projects</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="['lucide lucide-chevron-up transition-all shrink-0 group-hover:opacity-100 text-[var(--text-tertiary)]', projectsCollapsed ? 'rotate-180' : '']">
								<path d="m18 15-6-6-6 6"></path>
							</svg>
						</div>
						<div v-else class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-tertiary)] opacity-60">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
								<line x1="9" x2="9" y1="3" y2="21"/>
							</svg>
						</div>
						<div v-if="!uiStore.sidebarCollapsed" @click.stop="openCreateProjectModal" class="flex items-center justify-center size-[32px] rounded-[8px] hover:bg-[var(--bg-hover)] clickable transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus text-[var(--text-tertiary)]">
								<path d="M5 12h14"></path>
								<path d="M12 5v14"></path>
							</svg>
						</div>
					</div>

					<!-- Project List -->
					<div v-show="!projectsCollapsed" class="flex flex-col gap-px mb-4">
						<div v-if="projectStore.isLoading" class="flex flex-col gap-2 px-2 py-1">
							<div v-for="i in 3" :key="i" class="h-8 w-full bg-[var(--bg-hover)] rounded-lg animate-pulse"></div>
						</div>
						<template v-else>
							<div @click="selectProject(null)" :class="['w-full flex items-center rounded-[10px] h-[36px] pe-[8px] gap-[8px] transition-colors clickable', conversationStore.selectedGroupId === null || conversationStore.selectedGroupId === 0 ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px]']">
								<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M4 6h16M4 12h16M4 18h7" />
									</svg>
								</div>
								<div v-if="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
									<span class="truncate">All Sessions</span>
								</div>
							</div>
							<div v-for="group in projectStore.projects" :key="group.id" @click="selectProject(group.id)" :class="['w-full group flex items-center rounded-[10px] h-[36px] pe-[8px] gap-[8px] transition-colors clickable relative', conversationStore.selectedGroupId == group.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px]']">
								<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
									</svg>
								</div>
								<div v-if="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
									<span class="truncate">{{ group.name }}</span>
								</div>
								<!-- Project Actions -->
								<div v-if="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center gap-0.5">
									<div @click.stop="handleEditProject(group)" class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-sidebar)] transition-all text-[var(--text-tertiary)]">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
											<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
										</svg>
									</div>
									<div @click.stop="handleDeleteProject(group.id)" class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-sidebar)] transition-all text-[var(--text-tertiary)]">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
											<path d="M3 6h18"></path>
											<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
											<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
										</svg>
									</div>
								</div>
							</div>
						</template>
					</div>

					<!-- Recent Chat Header -->
					<div v-if="!uiStore.sidebarCollapsed" class="group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] rounded-[10px] mb-1">
						<span class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">Recent Chat</span>
					</div>
					<div v-else class="h-[1px] bg-[var(--border-light)] opacity-50 my-2 mx-2"></div>

					<!-- Chat List -->
					<div class="flex flex-col gap-px">
						<template v-if="conversationStore.isLoading && conversationStore.conversations.length === 0">
							<div class="flex flex-col gap-2 px-2 py-1">
								<div v-for="i in 5" :key="i" class="h-8 w-full bg-[var(--bg-hover)] rounded-lg animate-pulse"></div>
							</div>
						</template>
						<template v-else>
							<div v-for="conversation in sortedConversations" :key="conversation.id" @click="handleSelectConversation(String(conversation.id))" :class="['group flex items-center rounded-[10px] clickable cursor-pointer transition-all w-full gap-[12px] h-[36px] pe-[2px]', conversationStore.currentConversationId == conversation.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px]']">
								<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-60">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
									</svg>
								</div>
								<div v-if="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
									<span class="truncate">{{ conversation.title || 'New conversation' }}</span>
								</div>
								<div v-if="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
									<!-- Conversation Action Menu -->
									<Menu as="div" class="relative inline-block text-left">
										<MenuButton @click.stop="handleMenuClick($event, conversation.id)" class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)] transition-all text-[var(--text-tertiary)]">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-horizontal">
												<circle cx="12" cy="12" r="1" />
												<circle cx="19" cy="12" r="1" />
												<circle cx="5" cy="12" r="1" />
											</svg>
										</MenuButton>

										<transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
											<Teleport to="body">
												<MenuItems
													v-if="activeMenuId === conversation.id"
													:style="menuPosition"
													class="fixed z-[9999] w-48 origin-top-right rounded-[12px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-main)] focus:outline-none py-1.5 overflow-hidden"
												>
													<div class="px-1 py-1">
														<MenuItem v-slot="{ active }">
															<button @click="handleShare(conversation)" :class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">
																	<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
																	<polyline points="16 6 12 2 8 6" />
																	<line x1="12" x2="12" y1="2" y2="15" />
																</svg>
																Share
															</button>
														</MenuItem>
														<MenuItem v-slot="{ active }">
															<button @click="uiStore.openRenameModal(conversation)" :class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">
																	<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
																	<path d="m15 5 4 4" />
																</svg>
																Rename
															</button>
														</MenuItem>
														
														<!-- Move to Project -->
														<div class="h-px bg-[var(--border-main)] my-1"></div>
														<div class="px-3 py-1.5 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight">Move to Project</div>
														
														<template v-if="projectStore.projects.length > 0">
															<MenuItem v-for="proj in projectStore.projects" :key="proj.id" v-slot="{ active }">
																<button @click="handleMoveToProject(conversation.id, proj.id)" :class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
																	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">
																		<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
																	</svg>
																	<span class="truncate">{{ proj.name }}</span>
																</button>
															</MenuItem>
														</template>

														<div class="h-px bg-[var(--border-main)] my-1"></div>

														<MenuItem v-slot="{ active }">
															<button @click="handleDeleteConversation(String(conversation.id))" :class="[active ? 'bg-red-50 text-red-600' : 'text-red-500', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm transition-colors']">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
																	<path d="M3 6h18" />
																	<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
																	<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
																</svg>
																Delete
															</button>
														</MenuItem>
													</div>
												</MenuItems>
											</Teleport>
										</transition>
									</Menu>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="flex flex-col justify-center items-start gap-[8px] bg-[var(--bg-sidebar)] p-[8px] overflow-hidden border-t border-[var(--border-light)] shrink-0 transition-all duration-300">
			<!-- Share Card -->
			<button v-if="!uiStore.sidebarCollapsed" class="relative w-full rounded-[12px] border border-[var(--border-light)] clickable hover:opacity-90 text-sm text-[var(--text-primary)] transition-all bg-[var(--background-card-gray)] shadow-sm">
				<div class="flex w-full items-center justify-between ps-[9px] pe-[0px] py-[8px] rounded-[12px]">
					<div class="flex-1 min-w-0 flex items-center gap-[12px]">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-heart flex-shrink-0">
							<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"></path>
							<path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95"></path>
							<path d="m2 15 6 6"></path>
							<path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91"></path>
						</svg>
						<div class="flex flex-col text-start overflow-hidden">
							<span class="text-[var(--text-primary)] font-serif text-[14px] leading-[20px] truncate max-w-[200px]">Share Aura</span>
							<span class="text-[var(--text-tertiary)] text-[12px] leading-[16px] truncate">Get 500 credits</span>
						</div>
					</div>
					<div class="flex items-center justify-center size-[32px] opacity-60">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right">
							<path d="m9 18 6-6-6-6"></path>
						</svg>
					</div>
				</div>
			</button>
			<button v-else class="flex items-center justify-center w-full h-[40px] rounded-[10px] border border-[var(--border-light)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-all">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-heart shrink-0">
					<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"></path>
					<path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95"></path>
					<path d="m2 15 6 6"></path>
					<path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91"></path>
				</svg>
			</button>

			<div class="flex items-center w-full p-[2px] justify-between">
				<div class="flex items-center gap-[4px]">
					<!-- Settings -->
					<div @click="uiStore.openSettingsModal()" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-2 text-[var(--icon-primary)] size-[18px]">
							<path d="M14 17H5"></path>
							<path d="M19 7h-9"></path>
							<circle cx="17" cy="17" r="3"></circle>
							<circle cx="7" cy="7" r="3"></circle>
						</svg>
					</div>

					<!-- Tools / Apps -->
					<div class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" width="16" height="16" class="text-[var(--icon-primary)] size-[18px]">
							<path d="M15.4286 7.55357H10.125L12.7768 2.25L15.4286 7.55357Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"></path>
							<circle cx="5.25" cy="12.75" r="2.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></circle>
							<path d="M10.5 10.5H15V14.25C15 14.6642 14.6642 15 14.25 15H11.25C10.8358 15 10.5 14.6642 10.5 14.25V10.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M3 3H7.5V6.75C7.5 7.16421 7.16421 7.5 6.75 7.5H3.75C3.33579 7.5 3 7.16421 3 6.75V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
					<!-- Smartphone / Apps -->
					<div @click="uiStore.openMobileMenu()" class="flex items-center justify-center lg:hidden cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone text-[var(--icon-primary)] size-[18px]">
							<rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
							<path d="M12 18h.01"></path>
						</svg>
					</div>
				</div>

				<div v-show="!uiStore.sidebarCollapsed" class="flex items-center gap-[4px]">
					<!-- Book / Docs -->
					<a href="https://aura.im/docs" target="_blank" rel="noreferrer" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book text-[var(--icon-primary)] size-[18px]">
							<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
						</svg>
					</a>
				</div>
			</div>
		</div>

		<!-- Global Modals -->
		<ProjectModal :show="uiStore.showProjectModal" :editingProject="currentEditingProject" @close="handleCloseProjectModal" @success="projectStore.fetchProjects" />
	</aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useConversationStore } from '../stores/conversation'
import { useProjectStore } from '../stores/projects'
import { useUIStore } from '../stores/ui'
import ProjectModal from './ProjectModal.vue'

const router = useRouter()
const conversationStore = useConversationStore()
const projectStore = useProjectStore()
const uiStore = useUIStore()
const currentEditingProject = ref<any>(null)
const projectsCollapsed = ref(false)

// Action Menu State
const activeMenuId = ref<string | number | null>(null)
const menuPosition = ref({ top: '0px', left: '0px' })

const sortedConversations = computed(() => {
	return [...conversationStore.conversations].sort((a, b) => {
		return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
	})
})

const toggleProjects = () => {
	projectsCollapsed.value = !projectsCollapsed.value
}

const selectProject = (id: string | number | null) => {
	conversationStore.setSelectedGroupId(id === null ? null : Number(id))
}

const handleSelectConversation = (id: string) => {
	router.push(`/chat/${id}`)
}

const handleNewChat = () => {
	router.push('/')
}

const handleDeleteConversation = async (id: string) => {
	if (confirm('Delete this conversation?')) {
		await conversationStore.deleteConversation(id)
	}
}

const handleOpenNewTab = (id: string | number) => {
	window.open(`/chat/${id}`, '_blank')
}

const handleMoveToProject = async (conversationId: string | number, projectId: string | number) => {
	await conversationStore.moveToProject(conversationId, Number(projectId))
	activeMenuId.value = null
}

const handleShare = (conversation: any) => {
	console.log('Sharing conversation:', conversation)
	// Implement share logic or copy link
	const url = window.location.origin + '/chat/' + conversation.id
	navigator.clipboard.writeText(url)
	alert('Link copied to clipboard!')
}

const handleMenuClick = (event: MouseEvent, id: string | number) => {
	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
	activeMenuId.value = id
	// Adjust position to be below the button, aligned to its left
	menuPosition.value = {
		top: `${rect.bottom + 8}px`,
		left: `${rect.right - 224}px`, // 224 is w-56
	}
}

const openCreateProjectModal = () => {
	currentEditingProject.value = null
	uiStore.setProjectModal(true)
}

const handleEditProject = (project: any) => {
	currentEditingProject.value = project
	uiStore.setProjectModal(true)
}

const handleCloseProjectModal = () => {
	uiStore.setProjectModal(false)
	currentEditingProject.value = null
}

const handleDeleteProject = async (id: string | number) => {
	if (confirm('Delete this project? All associated chats will also be deleted.')) {
		await projectStore.deleteProject(Number(id))
	}
}

onMounted(() => {
	if (conversationStore.conversations.length === 0) {
		conversationStore.fetchConversations()
	}
	if (projectStore.projects.length === 0) {
		projectStore.projects = [] // Initialize if empty
	}
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: var(--border-light);
	border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: var(--text-tertiary);
}

.clickable {
	cursor: pointer;
	user-select: none;
}
</style>
