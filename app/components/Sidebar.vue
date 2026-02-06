<template>
	<!-- Aura Desktop Sidebar -->
	<aside
		:class="['hidden lg:flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-r border-[var(--border-light)] transition-all duration-300 relative z-[40] overflow-hidden flex-shrink-0', uiStore.sidebarCollapsed ? 'w-[68px]' : 'w-[300px]']">
		<!-- Top Section: Logo & Collapse -->
		<div
			:class="['flex items-center h-[56px] py-[12px] shrink-0', uiStore.sidebarCollapsed ? 'justify-center ps-0 pe-0' : 'justify-between pe-[10px] ps-[12px]']">
			<!-- Logo Section -->
			<div v-show="!uiStore.sidebarCollapsed" class="flex items-center gap-1 ps-[8px] clickable">
				<div class="flex items-center size-8 justify-center shrink-0">
					<img src="/favicon.svg" class="size-6 pointer-events-none" alt="Aura Logo" />
				</div>
				<span class="text-lg font-bold text-[var(--text-primary)] tracking-tight ml-1">aura</span>
			</div>

			<div @click="uiStore.toggleSidebar"
				class="flex items-center justify-center rounded-md hover:bg-[var(--bg-hover)] cursor-pointer size-[32px] shrink-0 transition-colors">
				<PanelLeft class="text-[var(--text-secondary)] size-[18px]" />
			</div>
		</div>

		<!-- Nav Items Section -->
		<div class="flex flex-col flex-1 min-h-0 p-[8px] pb-0 gap-px transition-all">
			<!-- Static New Task Item (Not draggable as requested) -->
			<div @click="handleNewChat"
				:class="['flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full h-[36px] hover:bg-[var(--bg-hover)] group', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] pe-[2px] gap-[12px]']">
				<Tooltip text="New task" position="right" :disabled="!uiStore.sidebarCollapsed" fullWidth>
					<div
						:class="['flex items-center', uiStore.sidebarCollapsed ? 'justify-center' : 'w-full gap-[12px]']">
						<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
							<SquarePen :size="18" />
						</div>
						<div v-if="!uiStore.sidebarCollapsed"
							class="flex-1 min-w-0 flex items-center text-[14px] font-medium text-[var(--text-primary)]">
							<span class="truncate">New task</span>
						</div>
					</div>
				</Tooltip>
			</div>

			<!-- Main Nav Items (Draggable) -->
			<div v-for="(item, index) in sidebarNavItems" :key="item.id" draggable="true"
				@dragstart="handleDragStart($event, 'main', index)"
				@dragover.prevent="handleDragOver($event, 'main', index)" @drop="handleDrop($event, 'main', index)"
				@dragend="handleDragEnd" @dragenter="draggingOverZone = 'main-' + index"
				@dragleave="draggingOverZone = null" @click="item.handler"
				:class="['flex items-center rounded-[10px] bg-[var(--bg-sidebar)] clickable cursor-pointer transition-all w-full h-[36px] hover:bg-[var(--bg-hover)] group relative', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] gap-[12px]', draggingItem?.index === index && draggingItem?.source === 'main' ? 'opacity-20 scale-95' : 'opacity-100', draggingOverZone === 'main-' + index ? 'bg-[var(--bg-hover)] ring-2 ring-[var(--border-main)]' : '']">
				<div v-if="draggingOverZone === 'main-' + index"
					class="absolute -top-0.5 left-0 right-0 h-0.5 bg-[var(--text-tertiary)] rounded-full opacity-50">
				</div>
				<Tooltip :text="item.label" position="right" :disabled="!uiStore.sidebarCollapsed" fullWidth>
					<div
						:class="['flex items-center w-full h-full', uiStore.sidebarCollapsed ? 'justify-center' : 'gap-[12px]']">
						<div class="shrink-0 size-[18px] flex items-center justify-center"
							:class="item.iconClass || 'text-[var(--text-secondary)]'">
							<component :is="item.icon" :size="18" />
						</div>
						<div v-if="!uiStore.sidebarCollapsed"
							class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
							<span class="truncate">{{ item.label }}</span>
						</div>
						<div v-if="!uiStore.sidebarCollapsed && item.shortcut" class="shrink-0 flex items-center">
							<div
								class="text-[var(--text-tertiary)] text-sm hidden group-hover:inline-flex items-center gap-1 pe-[8px]">
								{{ item.shortcut }}
							</div>
						</div>
					</div>
				</Tooltip>
			</div>

			<!-- More Menu (Accordion + Hover Popover) -->
			<div v-if="moreItems.length > 0" class="flex flex-col gap-px relative">
				<Tooltip text="More Tools" position="right" :disabled="!uiStore.sidebarCollapsed" fullWidth>
					<div @click="handleMoreMenuOpen" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
						@dragover.prevent="handleDragOver($event, 'more-btn')"
						@drop="handleDrop($event, 'more-container')" @dragenter="draggingOverZone = 'more-btn'"
						@dragleave="draggingOverZone = null"
						:class="['w-full flex items-center rounded-[10px] clickable cursor-pointer transition-all h-[36px] hover:bg-[var(--bg-hover)] group mb-1 relative', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] pe-[10px] justify-between', draggingOverZone === 'more-btn' ? 'bg-[var(--bg-hover)] ring-2 ring-[var(--border-main)]' : '']">
						<div :class="['flex items-center', uiStore.sidebarCollapsed ? 'justify-center' : 'gap-[12px]']">
							<div
								class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)]">
								<LayoutGrid :size="18" />
							</div>
							<span v-if="!uiStore.sidebarCollapsed"
								class="text-[14px] font-medium text-[var(--text-primary)] truncate">{{ isMoreMenuOpen ?
									'Collapse' : 'More Tools' }}</span>
						</div>
						<ChevronRight v-if="!uiStore.sidebarCollapsed" :size="14"
							:class="['text-[var(--text-tertiary)] opacity-60 group-hover:opacity-100 transition-transform duration-200', isMoreMenuOpen ? 'rotate-90' : '']" />
					</div>
				</Tooltip>

				<!-- Hover Popover (Teleported) -->
				<Teleport to="body">
					<div v-if="isHoverMenuOpen && !isMoreMenuOpen" class="fixed z-[9998]" :style="hoverMenuPosition"
						@mouseenter="handlePopoverMouseEnter" @mouseleave="handleMouseLeave">
						<transition appear enter-active-class="transition duration-100 ease-out"
							enter-from-class="transform scale-95 opacity-0 translate-x-1"
							enter-to-class="transform scale-100 opacity-100 translate-x-0">
							<div
								class="w-56 origin-left rounded-[16px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-main)] py-1.5 overflow-hidden">
								<div class="px-1 py-1">
									<button v-for="(item, index) in moreItems" :key="item.name" draggable="true"
										@dragstart="handleDragStart($event, 'more', index)"
										@click="handleMoreItemClick(item)"
										class="group flex w-full items-center gap-3 rounded-[10px] ps-3.5 pe-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
										<component :is="item.icon" :size="18"
											class="opacity-80 group-hover:opacity-100 transition-opacity" />
										<span class="flex-1 text-left">{{ item.name }}</span>
										<ArrowUpRight :size="16" class="opacity-40 group-hover:opacity-100" />
									</button>
								</div>
								<div class="px-3 py-2 border-t border-[var(--border-light)] mt-1">
									<div
										class="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] font-medium">
										<Lightbulb :size="12" />
										Drag and drop to customize the sorting
									</div>
								</div>
							</div>
						</transition>
					</div>
				</Teleport>

				<!-- Inline Accordion Sub-items -->
				<div v-show="isMoreMenuOpen" class="flex flex-col gap-px overflow-hidden transition-all duration-300">
					<button v-for="(item, index) in moreItems" :key="item.name" draggable="true"
						@dragstart="handleDragStart($event, 'more', index)"
						@dragover.prevent="handleDragOver($event, 'more', index)"
						@drop="handleDrop($event, 'more', index)" @dragenter="draggingOverZone = 'more-' + index"
						@dragleave="draggingOverZone = null" @click="handleMoreItemClick(item)"
						:class="['group flex w-full items-center rounded-[10px] bg-[var(--bg-sidebar)] h-[36px] transition-all hover:bg-[var(--bg-hover)] relative', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[16px] pe-[12px] gap-[12px]', draggingItem?.index === index && draggingItem?.source === 'more' ? 'opacity-20 scale-95' : 'opacity-100', draggingOverZone === 'more-' + index ? 'bg-[var(--bg-hover)] ring-2 ring-[var(--border-main)]' : '']">
						<div v-if="draggingOverZone === 'more-' + index"
							class="absolute -top-0.5 left-[16px] right-[12px] h-0.5 bg-[var(--text-tertiary)] rounded-full opacity-50">
						</div>
						<div
							class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80 group-hover:opacity-100 transition-opacity">
							<component :is="item.icon" :size="18" />
						</div>
						<div v-if="!uiStore.sidebarCollapsed"
							class="flex-1 min-w-0 flex items-center justify-between text-[13px] font-medium text-[var(--text-primary)]">
							<span class="truncate">{{ item.name }}</span>
							<ArrowUpRight :size="14" class="opacity-0 group-hover:opacity-40 transition-opacity" />
						</div>
					</button>
				</div>
			</div>

			<!-- Standalone Drag to Collapse Zone (Only when More menu is empty and dragging) -->
			<transition enter-active-class="transition duration-300 ease-out"
				enter-from-class="opacity-0 transform translate-y-2 scale-95"
				enter-to-class="opacity-100 transform translate-y-0 scale-100"
				leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100"
				leave-to-class="opacity-0 scale-95">
				<div v-if="draggingItem?.source === 'main' && moreItems.length === 0 && !uiStore.sidebarCollapsed"
					@dragover.prevent="handleDragOver($event, 'more-container')"
					@drop="handleDrop($event, 'more-container')" @dragenter="draggingOverZone = 'empty-more'"
					@dragleave="draggingOverZone = null"
					:class="['mx-2 p-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 group/collapse transition-all duration-300', draggingOverZone === 'empty-more' ? 'bg-[var(--bg-hover)] border-[var(--text-tertiary)] scale-[1.02] shadow-sm' : 'bg-[var(--bg-sidebar)] border-[var(--border-main)] animate-pulse-subtle']">
					<div
						class="shrink-0 size-6 flex items-center justify-center rounded-lg bg-[var(--bg-hover)] text-[var(--text-tertiary)] transition-colors group-hover/collapse:bg-[var(--border-main)]">
						<LayoutGrid :size="14" />
					</div>
					<span
						class="text-[12px] font-medium text-[var(--text-tertiary)] opacity-80 group-hover/collapse:opacity-100">拖到这里可以将其收起</span>
				</div>
			</transition>

			<!-- History Content (Scrollable) -->
			<div class="flex flex-col flex-1 min-h-0 -mx-[8px] transition-all overflow-hidden" style="opacity: 1">
				<div class="w-full border-t-[1px] border-[var(--border-light)] opacity-50 my-2"></div>
				<div
					class="flex flex-col flex-1 min-h-0 overflow-x-hidden overflow-y-auto custom-scrollbar pt-0 px-[8px]">
					<!-- Projects Toggle -->
					<div @click="toggleProjects"
						:class="['group flex items-center rounded-[10px] mb-1 h-[36px] clickable hover:bg-[var(--bg-hover)] transition-colors active:bg-[var(--bg-hover)] transition-all', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px] pe-[2px] py-[2px] justify-between gap-[12px]']">
						<div v-if="!uiStore.sidebarCollapsed" class="flex items-center flex-1 min-w-0 gap-0.5">
							<span
								class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">Projects</span>
							<ChevronUp :size="14"
								:class="['transition-all shrink-0 group-hover:opacity-100 text-[var(--text-tertiary)]', projectsCollapsed ? 'rotate-180' : '']" />
						</div>
						<div v-else
							class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-tertiary)] opacity-60">
							<PanelLeftClose :size="16" />
						</div>
						<div v-if="!uiStore.sidebarCollapsed" @click.stop="openCreateProjectModal"
							class="flex items-center justify-center size-[32px] rounded-[8px] hover:bg-[var(--bg-hover)] clickable transition-colors">
							<Plus :size="16" class="text-[var(--text-tertiary)]" />
						</div>
					</div>

					<!-- Project List -->
					<div v-show="!projectsCollapsed" class="flex flex-col gap-px mb-4">
						<div v-if="projectStore.isLoading" class="flex flex-col gap-2 px-2 py-1">
							<div v-for="i in 3" :key="i"
								class="h-8 w-full bg-[var(--bg-hover)] rounded-lg animate-pulse"></div>
						</div>
						<template v-else>
							<div @click="selectProject(null)"
								:class="['w-full flex items-center rounded-[10px] h-[36px] transition-colors clickable transition-all', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px] pe-[8px] gap-[8px]', conversationStore.selectedGroupId === null || conversationStore.selectedGroupId === 0 ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
								<div
									class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80">
									<AlignJustify :size="16" />
								</div>
								<div v-if="!uiStore.sidebarCollapsed"
									class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
									<span class="truncate">All Sessions</span>
								</div>
							</div>
							<div v-for="group in projectStore.projects" :key="group.id" @click="selectProject(group.id)"
								:class="['w-full group flex items-center rounded-[10px] h-[36px] transition-colors clickable relative transition-all', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px] pe-[8px] gap-[8px]', conversationStore.selectedGroupId == group.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
								<div
									class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80">
									<Folder :size="16" />
								</div>
								<div v-if="!uiStore.sidebarCollapsed"
									class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
									<span class="truncate">{{ group.name }}</span>
								</div>
								<!-- Project Actions -->
								<div v-if="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center gap-0.5">
									<div @click.stop="handleEditProject(group)"
										class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-sidebar)] transition-all text-[var(--text-tertiary)]">
										<Pencil :size="14" />
									</div>
									<div @click.stop="handleDeleteProject(group.id)"
										class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-sidebar)] transition-all text-[var(--text-tertiary)]">
										<Trash2 :size="14" />
									</div>
								</div>
							</div>
						</template>
					</div>

					<!-- Recent Chat Header -->
					<div v-if="!uiStore.sidebarCollapsed"
						class="group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] rounded-[10px] mb-1">
						<span
							class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">Recent
							Chat</span>
					</div>
					<div v-else class="h-[1px] bg-[var(--border-light)] opacity-50 my-2 mx-2"></div>

					<!-- Chat List -->
					<div class="flex flex-col gap-px">
						<template v-if="conversationStore.isLoading && conversationStore.conversations.length === 0">
							<div class="flex flex-col gap-2 px-2 py-1">
								<div v-for="i in 5" :key="i"
									class="h-8 w-full bg-[var(--bg-hover)] rounded-lg animate-pulse"></div>
							</div>
						</template>
						<template v-else>
							<div v-for="conversation in sortedConversations" :key="conversation.id"
								@click="handleSelectConversation(String(conversation.id))"
								:class="['group flex items-center rounded-[10px] clickable cursor-pointer transition-all w-full h-[36px]', conversationStore.currentConversationId == conversation.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] pe-[2px] gap-[12px]']">
								<div
									class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-60">
									<MessageSquare :size="16" />
								</div>
								<div v-if="!uiStore.sidebarCollapsed"
									class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
									<span class="truncate">{{ conversation.title || 'New conversation' }}</span>
								</div>
								<div v-if="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
									<!-- Conversation Action Menu -->
									<Menu as="div" class="relative inline-block text-left">
										<MenuButton @click.stop="handleMenuClick($event, conversation.id)"
											class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)] transition-all text-[var(--text-tertiary)]">
											<MoreHorizontal :size="16" />
										</MenuButton>

										<transition enter-active-class="transition duration-100 ease-out"
											enter-from-class="transform scale-95 opacity-0"
											enter-to-class="transform scale-100 opacity-100"
											leave-active-class="transition duration-75 ease-in"
											leave-from-class="transform scale-100 opacity-100"
											leave-to-class="transform scale-95 opacity-0">
											<Teleport to="body">
												<MenuItems v-if="activeMenuId === conversation.id" :style="menuPosition"
													class="fixed z-[9999] w-48 origin-top-right rounded-[12px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-main)] focus:outline-none py-1.5 overflow-hidden">
													<div class="px-1 py-1">
														<MenuItem v-slot="{ active }">
														<button @click="handleShare(conversation)"
															:class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
															<Share :size="16" class="shrink-0 opacity-60" />
															Share
														</button>
														</MenuItem>
														<MenuItem v-slot="{ active }">
														<button @click="uiStore.openRenameModal(conversation)"
															:class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
															<Pencil :size="16" class="shrink-0 opacity-60" />
															Rename
														</button>
														</MenuItem>

														<!-- Move to Project -->
														<div class="h-px bg-[var(--border-main)] my-1"></div>
														<div
															class="px-3 py-1.5 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight">
															Move to Project</div>

														<template v-if="projectStore.projects.length > 0">
															<MenuItem v-for="proj in projectStore.projects"
																:key="proj.id" v-slot="{ active }">
															<button
																@click="handleMoveToProject(conversation.id, proj.id)"
																:class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
																<FolderOpen :size="16" class="shrink-0 opacity-60" />
																<span class="truncate">{{ proj.name }}</span>
															</button>
															</MenuItem>
														</template>

														<div class="h-px bg-[var(--border-main)] my-1"></div>

														<MenuItem v-slot="{ active }">
														<button
															@click="handleDeleteConversation(String(conversation.id))"
															:class="[active ? 'bg-red-50 text-red-600' : 'text-red-500', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm transition-colors']">
															<Trash2 :size="16" class="shrink-0" />
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
		<div
			class="flex flex-col justify-center items-start gap-[8px] bg-[var(--bg-sidebar)] p-[8px] overflow-hidden border-t border-[var(--border-light)] shrink-0 transition-all duration-300">
			<!-- Share Card -->
			<button v-if="!uiStore.sidebarCollapsed"
				class="relative w-full rounded-[12px] border border-[var(--border-light)] clickable hover:opacity-90 text-sm text-[var(--text-primary)] transition-all bg-[var(--background-card-gray)] shadow-sm">
				<div class="flex w-full items-center justify-between ps-[9px] pe-[0px] py-[8px] rounded-[12px]">
					<div class="flex-1 min-w-0 flex items-center gap-[12px]">
						<HandHeart :size="18" class="flex-shrink-0 text-[var(--text-primary)]" />
						<div class="flex flex-col text-start overflow-hidden">
							<span
								class="text-[var(--text-primary)] font-serif text-[14px] leading-[20px] truncate max-w-[200px]">Share
								Aura</span>
							<span class="text-[var(--text-tertiary)] text-[12px] leading-[16px] truncate">Get 500
								credits</span>
						</div>
					</div>
					<div class="flex items-center justify-center size-[32px] opacity-60">
						<ChevronRight :size="18" />
					</div>
				</div>
			</button>
			<button v-else
				class="flex items-center justify-center w-full h-[40px] rounded-[10px] border border-[var(--border-light)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-all">
				<HandHeart :size="18" class="shrink-0" />
			</button>

			<div
				:class="['flex w-full p-[2px] transition-all', uiStore.sidebarCollapsed ? 'flex-col items-center justify-center gap-2' : 'items-center justify-between']">
				<div
					:class="['flex items-center justify-center', uiStore.sidebarCollapsed ? 'flex-col gap-2' : 'gap-[4px]']">
					<!-- Settings -->
					<Tooltip text="Settings" position="right" :disabled="!uiStore.sidebarCollapsed">
						<div @click="uiStore.openSettingsModal()"
							class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
							<Settings2 :size="18" class="text-[var(--icon-primary)]" />
						</div>
					</Tooltip>

					<!-- Tools / Apps -->
					<Tooltip text="Tools & Apps" position="right" :disabled="!uiStore.sidebarCollapsed">
						<div
							class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
							<Shapes :size="18" class="text-[var(--icon-primary)]" />
						</div>
					</Tooltip>
					<!-- Smartphone / Apps -->
					<div @click="uiStore.openMobileMenu()"
						class="flex items-center justify-center lg:hidden cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<Smartphone :size="18" class="text-[var(--icon-primary)]" />
					</div>
				</div>

				<div
					:class="['flex items-center justify-center', uiStore.sidebarCollapsed ? 'flex-col gap-2' : 'gap-[4px]']">
					<!-- Book / Docs -->
					<Tooltip text="Documentation" position="right" :disabled="!uiStore.sidebarCollapsed">
						<a href="https://aura.im/docs" target="_blank" rel="noreferrer"
							class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
							<BookOpen :size="18" class="text-[var(--icon-primary)]" />
						</a>
					</Tooltip>
				</div>
			</div>
		</div>

		<!-- Global Modals -->
		<ProjectModal :show="uiStore.showProjectModal" :editingProject="currentEditingProject"
			@close="handleCloseProjectModal" @success="projectStore.fetchProjects" />
	</aside>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { PanelLeft, SquarePen, Search, Library, LayoutGrid, ChevronRight, ChevronUp, Plus, Folder, FolderOpen, MessageSquare, MoreHorizontal, Pencil, Trash2, Settings2, BookOpen, HandHeart, Smartphone, Share, Lightbulb, ArrowUpRight, Sparkles, Image, Video, AlignJustify, PanelLeftClose, Shapes } from 'lucide-vue-next'
import { useConversationStore } from '../stores/conversation'
import { useProjectStore } from '../stores/projects'
import { useUIStore } from '../stores/ui'
import ProjectModal from './ProjectModal.vue'
import Tooltip from './Tooltip.vue'

const router = useRouter()
const conversationStore = useConversationStore()
const projectStore = useProjectStore()
const uiStore = useUIStore()
const currentEditingProject = ref<any>(null)
const projectsCollapsed = ref(false)

const isMoreMenuOpen = ref(false)
const isHoverMenuOpen = ref(false)
const hoverMenuPosition = ref({ top: '0px', left: '0px' })
let hoverTimeout: any = null

const draggingItem = ref<{ source: 'main' | 'more'; index: number } | null>(null)
const draggingOverZone = ref<string | null>(null)

const handleDragStart = (event: DragEvent, source: 'main' | 'more', index: number) => {
	draggingItem.value = { source, index }
	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = 'move'
		event.dataTransfer.setData('source', source)
		event.dataTransfer.setData('index', index.toString())
	}
}

const handleDragOver = (event: DragEvent, target: 'main' | 'more' | 'more-container' | 'more-btn', index?: number) => {
	// Optimization: can add highlight logic here
}

const handleDrop = (event: DragEvent, target: 'main' | 'more' | 'more-container' | 'more-btn', targetIndex?: number) => {
	const source = event.dataTransfer?.getData('source') as 'main' | 'more'
	const sourceIndex = parseInt(event.dataTransfer?.getData('index') || '-1')

	if (sourceIndex === -1) return

	// Scenario 1: Reorder main nav
	if (source === 'main' && target === 'main' && targetIndex !== undefined) {
		const items = [...sidebarNavItems.value]
		const moved = items.splice(sourceIndex, 1)[0]
		if (moved) {
			items.splice(targetIndex, 0, moved)
			sidebarNavItems.value = items
		}
	}
	// Scenario 2: Reorder more sub-items
	else if (source === 'more' && target === 'more' && targetIndex !== undefined) {
		const items = [...moreItems.value]
		const moved = items.splice(sourceIndex, 1)[0]
		if (moved) {
			items.splice(targetIndex, 0, moved)
			moreItems.value = items
		}
	}
	// Scenario 3: Drag from more to main
	else if (source === 'more' && target === 'main' && targetIndex !== undefined) {
		const moved = moreItems.value.splice(sourceIndex, 1)[0]
		if (moved) {
			const newMainItem = {
				id: moved.id,
				label: moved.name,
				icon: markRaw(moved.icon),
				handler: () => handleMoreItemClick(moved),
			}
			sidebarNavItems.value.splice(targetIndex, 0, newMainItem as any)
		}
	}
	// Scenario 4: Drag from main to more (container or item)
	else if (source === 'main' && (target === 'more' || target === 'more-container')) {
		const moved = sidebarNavItems.value.splice(sourceIndex, 1)[0]
		if (moved) {
			const newMoreItem = {
				id: moved.id,
				name: moved.label,
				icon: moved.icon,
			}
			if (targetIndex !== undefined) {
				moreItems.value.splice(targetIndex, 0, newMoreItem as any)
			} else {
				moreItems.value.push(newMoreItem as any)
			}
		}
	}

	draggingItem.value = null
	draggingOverZone.value = null
}

const handleDragEnd = () => {
	draggingItem.value = null
	draggingOverZone.value = null
}

const handleMoreMenuOpen = () => {
	isMoreMenuOpen.value = !isMoreMenuOpen.value
	if (isMoreMenuOpen.value) {
		isHoverMenuOpen.value = false
	}
}

const handleMouseEnter = (event: MouseEvent) => {
	if (isMoreMenuOpen.value) return

	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
	hoverMenuPosition.value = {
		top: `${rect.top}px`,
		left: `${rect.right + 8}px`,
	}

	if (hoverTimeout) clearTimeout(hoverTimeout)
	isHoverMenuOpen.value = true
}

const handlePopoverMouseEnter = () => {
	if (hoverTimeout) clearTimeout(hoverTimeout)
	isHoverMenuOpen.value = true
}

const handleMouseLeave = () => {
	hoverTimeout = setTimeout(() => {
		isHoverMenuOpen.value = false
	}, 100)
}

const handleMoreItemClick = (item: any) => {
	console.log('Clicked item:', item.name || item.label)

	if (item.id === 'ai-image') {
		router.push('/image-generation')
	} else if (item.id === 'ai-bots') {
		router.push('/explore')
	} else if (item.id === 'ai-reading') {
		// Mock for now or point to search/docs if relevant
		router.push('/ai-search')
	} else {
		// Default fallback
		console.warn('No navigation defined for item:', item.id)
	}
}

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
	router.push('/chat')
}

const sidebarNavItems = ref([
	{
		id: 'search',
		label: 'Search',
		icon: markRaw(Search),
		shortcut: '⌘ K',
		handler: () => {
			console.log('Search clicked')
			uiStore.openSearchModal()
		},
		iconClass: 'text-[var(--text-secondary)]',
	},
	{
		id: 'library',
		label: 'Library',
		icon: markRaw(Library),
		handler: () => { },
		iconClass: 'text-[var(--text-secondary)]',
	},
])

const moreItems = ref([
	{ id: 'ai-bots', name: 'AI bots', icon: markRaw(Sparkles) },
	{ id: 'ai-reading', name: 'AI Reading', icon: markRaw(BookOpen) },
	{ id: 'ai-image', name: 'AI Image Generator', icon: markRaw(Image) },
	{ id: 'ai-video', name: 'AI Video Generator', icon: markRaw(Video) },
])

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

onMounted(async () => {
	// Load from local storage first for instant UI
	await conversationStore.initFromLocalStorage()

	// Always fetch from server to sync state
	conversationStore.fetchConversations()

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

@keyframes pulse-subtle {

	0%,
	100% {
		opacity: 1;
		border-color: var(--border-main);
	}

	50% {
		opacity: 0.8;
		border-color: var(--text-tertiary);
	}
}

.animate-pulse-subtle {
	animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
