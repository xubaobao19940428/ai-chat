<template>
	<!-- MixU Desktop Sidebar -->
	<aside
		:class="['hidden lg:flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-primary)] border-r border-[var(--border-light)] transition-all duration-300 relative z-[40] overflow-hidden flex-shrink-0', uiStore.sidebarCollapsed ? 'w-[68px]' : 'w-[300px]']">
		<!-- Top Section: Logo & Collapse -->
		<div
			:class="['flex items-center h-[56px] py-[12px] shrink-0', uiStore.sidebarCollapsed ? 'justify-center ps-0 pe-0' : 'justify-between pe-[10px] ps-[12px]']">
			<!-- Logo Section -->
			<div v-show="!uiStore.sidebarCollapsed" class="flex items-center gap-1 ps-[8px] clickable">
				<div class="flex items-center size-8 justify-center shrink-0">
					<img src="/favicon.svg" class="size-6 pointer-events-none" alt="MixU Logo" />
				</div>
				<span class="text-lg font-bold text-[var(--text-primary)] tracking-tight ml-1">MixU</span>
			</div>

			<div @click="uiStore.toggleSidebar"
				class="flex items-center justify-center rounded-md hover:bg-[var(--bg-hover)] cursor-pointer size-[32px] shrink-0 transition-colors">
				<PanelLeft class="text-[var(--text-primary)] size-[18px]" />
			</div>
		</div>

		<!-- Nav Items Section -->
		<div
			class="flex flex-col flex-1 min-h-0 p-[8px] pb-0 gap-px transition-all overflow-x-hidden overflow-y-auto custom-scrollbar">
			<!-- Static New Task Item (Not draggable as requested) -->
			<div @click="handleNewChat"
				:class="['flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full h-[36px] shrink-0 hover:bg-[var(--bg-hover)] group relative', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] pe-[2px] gap-[12px]']">
				<Tooltip :text="$t('chat.new_chat')" position="right" :disabled="!uiStore.sidebarCollapsed" fullWidth>
					<div
						:class="['flex items-center', uiStore.sidebarCollapsed ? 'justify-center' : 'w-full gap-[12px]']">
						<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
							<SquarePen :size="18" />
						</div>
						<div v-if="!uiStore.sidebarCollapsed"
							class="flex-1 min-w-0 flex items-center text-[14px] font-medium text-[var(--text-primary)]">
							<span class="truncate">{{ $t('chat.new_chat') }}</span>
						</div>
					</div>
				</Tooltip>
				<div v-if="!uiStore.sidebarCollapsed"
					class="absolute right-0 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
					<div class="text-[var(--text-tertiary)] text-sm inline-flex items-center gap-1 pe-[8px]">⌘ K</div>
				</div>
			</div>

			<!-- Search Button -->
			<div @click="uiStore.openSearchModal()"
				:class="['flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full h-[36px] shrink-0 hover:bg-[var(--bg-hover)]', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] pe-[2px] gap-[12px]']">
				<Tooltip :text="$t('common.search')" position="right" :disabled="!uiStore.sidebarCollapsed" fullWidth>
					<div
						:class="['flex items-center', uiStore.sidebarCollapsed ? 'justify-center' : 'w-full gap-[12px]']">
						<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
							<Search :size="18" />
						</div>
						<div v-if="!uiStore.sidebarCollapsed"
							class="flex-1 min-w-0 flex items-center text-[14px] font-medium text-[var(--text-primary)]">
							<span class="truncate">{{ $t('common.search') }}</span>
						</div>
					</div>
				</Tooltip>
			</div>

			<!-- Main Nav Items (Draggable) -->
			<div v-for="(item, index) in sidebarNavItems" :key="item.id" draggable="true"
				@dragstart="handleDragStart($event, 'main', index)"
				@dragover.prevent="handleDragOver($event, 'main', index)" @drop="handleDrop($event, 'main', index)"
				@dragend="handleDragEnd" @dragenter="draggingOverZone = 'main-' + index"
				@dragleave="draggingOverZone = null" @click="item.handler" :class="[
					'flex items-center rounded-[10px] clickable cursor-pointer transition-all w-full h-[36px] shrink-0 hover:bg-[var(--bg-hover)] group relative',
					uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] gap-[12px]',
					isNavActive(item.id) ? 'bg-[var(--bg-hover)]' : 'bg-[var(--bg-sidebar)]',
					draggingItem?.index === index && draggingItem?.source === 'main' ? 'opacity-20 scale-95' : 'opacity-100',
					draggingOverZone === 'main-' + index ? 'bg-[var(--bg-hover)] ring-2 ring-[var(--border-main)]' : '',
				]">
				<div v-if="draggingOverZone === 'main-' + index"
					class="absolute -top-0.5 left-0 right-0 h-0.5 bg-[var(--text-tertiary)] rounded-full opacity-50">
				</div>
				<Tooltip :text="item.label" position="right" :disabled="!uiStore.sidebarCollapsed" fullWidth>
					<div
						:class="['flex items-center w-full h-full', uiStore.sidebarCollapsed ? 'justify-center' : 'gap-[12px]']">
						<div class="shrink-0 size-[18px] flex items-center justify-center"
							:class="item.iconClass || 'text-[var(--text-primary)]'">
							<component :is="item.icon" :size="18" />
						</div>
						<div v-if="!uiStore.sidebarCollapsed"
							class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
							<span class="truncate">{{ $t('common.' + item.id) }}</span>
						</div>
					</div>
				</Tooltip>
			</div>

			<!-- Empty Main Drop Zone: allows dragging items back from More when main is empty -->
			<div v-if="sidebarNavItems.length === 0 && draggingItem?.source === 'more' && !uiStore.sidebarCollapsed"
				@dragover.prevent="handleDragOver($event, 'main', 0)" @drop="handleDrop($event, 'main', 0)"
				@dragenter="draggingOverZone = 'empty-main'" @dragleave="draggingOverZone = null"
				:class="['mx-1 p-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all duration-300',
					draggingOverZone === 'empty-main' ? 'bg-[var(--bg-hover)] border-[var(--text-tertiary)] scale-[1.02] shadow-sm' : 'bg-[var(--bg-sidebar)] border-[var(--border-main)] animate-pulse-subtle']">
				<span class="text-[12px] font-medium text-[var(--text-tertiary)] opacity-80">{{ $t('common.drag_here')
				}}</span>
			</div>

			<!-- More Menu (Accordion + Hover Popover) -->
			<div v-if="moreItems.length > 0" class="flex flex-col gap-px relative shrink-0">
				<Tooltip :text="$t('common.more_tools')" position="right" :disabled="!uiStore.sidebarCollapsed"
					fullWidth>
					<div @click="handleMoreMenuOpen" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
						@dragover.prevent="handleDragOver($event, 'more-btn')"
						@drop="handleDrop($event, 'more-container')" @dragenter="draggingOverZone = 'more-btn'"
						@dragleave="draggingOverZone = null"
						:class="['w-full flex items-center rounded-[10px] clickable cursor-pointer transition-all h-[36px] hover:bg-[var(--bg-hover)] group mb-1 relative', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] pe-[10px] justify-between', draggingOverZone === 'more-btn' ? 'bg-[var(--bg-hover)] ring-2 ring-[var(--border-main)]' : '']">
						<div :class="['flex items-center', uiStore.sidebarCollapsed ? 'justify-center' : 'gap-[12px]']">
							<div
								class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
								<LayoutGrid :size="18" />
							</div>
							<span v-if="!uiStore.sidebarCollapsed"
								class="text-[14px] font-medium text-[var(--text-primary)] truncate">{{ isMoreMenuOpen ?
									$t('common.collapse') : $t('common.more_tools') }}</span>
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
								class="w-60 origin-left rounded-[16px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-main)] py-1.5 overflow-hidden">
								<div class="px-1 py-1">
									<button v-for="(item, index) in moreItems" :key="item.name" draggable="true"
										@dragstart="handleDragStart($event, 'more', index)"
										@click="handleMoreItemClick(item)"
										class="group flex w-full items-center gap-3 rounded-[10px] ps-3.5 pe-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
										<component :is="item.icon" :size="18"
											class="opacity-80 group-hover:opacity-100 transition-opacity" />
										<span class="flex-1 text-left">{{ $t('common.' + item.id) }}</span>
										<ArrowUpRight :size="16" class="opacity-40 group-hover:opacity-100" />
									</button>
								</div>
								<div class="px-3 py-2 border-t border-[var(--border-light)] mt-1">
									<div
										class="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] font-medium">
										<Lightbulb :size="12" />
										{{ $t('common.drag_to_sort') }}
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
						@dragleave="draggingOverZone = null" @click="handleMoreItemClick(item)" :class="[
							'group flex w-full items-center rounded-[10px] h-[36px] transition-all hover:bg-[var(--bg-hover)] relative',
							uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[16px] pe-[12px] gap-[12px]',
							isNavActive(item.id) ? 'bg-[var(--bg-hover)]' : 'bg-[var(--bg-sidebar)]',
							draggingItem?.index === index && draggingItem?.source === 'more' ? 'opacity-20 scale-95' : 'opacity-100',
							draggingOverZone === 'more-' + index ? 'bg-[var(--bg-hover)] ring-2 ring-[var(--border-main)]' : '',
						]">
						<div v-if="draggingOverZone === 'more-' + index"
							class="absolute -top-0.5 left-[16px] right-[12px] h-0.5 bg-[var(--text-tertiary)] rounded-full opacity-50">
						</div>
						<div
							class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)] group-hover:opacity-100 transition-opacity">
							<component :is="item.id === 'ai-bots' ? Compass : item.icon" :size="18" />
						</div>
						<div v-if="!uiStore.sidebarCollapsed"
							class="flex-1 min-w-0 flex items-center justify-between text-[13px] font-medium text-[var(--text-primary)]">
							<span class="truncate">{{ $t('common.' + item.id) }}</span>
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
						class="shrink-0 size-6 flex items-center justify-center rounded-lg bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors group-hover/collapse:bg-[var(--border-main)]">
						<LayoutGrid :size="14" />
					</div>
					<span
						class="text-[12px] font-medium text-[var(--text-tertiary)] opacity-80 group-hover/collapse:opacity-100">{{
							$t('common.drag_to_collapse') }}</span>
				</div>
			</transition>

			<!-- History Content -->
			<div class="w-full border-t-[1px] border-[var(--border-light)] opacity-50 my-1 shrink-0"></div>
			<div class="flex flex-col shrink-0">
				<!-- Projects Toggle -->
				<div @click="toggleProjects"
					:class="['group flex items-center rounded-[10px] mb-1 h-[36px] clickable hover:bg-[var(--bg-hover)] transition-colors active:bg-[var(--bg-hover)] transition-all', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px] pe-[2px] py-[2px] justify-between gap-[12px]']">
					<div v-if="!uiStore.sidebarCollapsed" class="flex items-center flex-1 min-w-0 gap-0.5">
						<span
							class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">{{
								$t('common.projects') }}</span>
						<ChevronRight :size="14"
							:class="['transition-all shrink-0 group-hover:opacity-100 text-[var(--text-tertiary)]', projectsCollapsed ? '' : 'rotate-90']" />
					</div>
					<div v-else
						class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
						<PanelLeft class="text-[var(--text-primary)] size-[18px]" />
					</div>
					<div v-if="!uiStore.sidebarCollapsed" @click.stop="openCreateProjectModal" role="button"
						:aria-label="$t('common.add')"
						class="flex items-center justify-center size-[32px] rounded-[8px] hover:bg-[var(--bg-hover)] clickable transition-colors">
						<Plus :size="16" class="text-[var(--text-tertiary)]" />
					</div>
				</div>

				<!-- Project List -->
				<div v-show="!projectsCollapsed" class="flex flex-col gap-px mb-1">
					<div v-if="projectStore.isLoading" class="flex flex-col gap-2 px-2 py-1">
						<div v-for="i in 3" :key="i" class="h-8 w-full bg-[var(--bg-hover)] rounded-lg animate-pulse">
						</div>
					</div>
					<template v-else>
						<div @click="selectProject(null)"
							:class="['w-full flex items-center rounded-[10px] h-[36px] transition-colors clickable transition-all relative', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px] pe-[8px] gap-[8px]', 'hover:bg-[var(--bg-hover)]', conversationStore.isGroupSwitching ? 'opacity-50 pointer-events-none' : '']">
							<div v-if="isProjectActive(null)"
								class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[var(--text-primary)]">
							</div>
							<div
								class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
								<AlignJustify :size="16" />
							</div>
							<div v-if="!uiStore.sidebarCollapsed"
								class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
								<span class="truncate">{{ $t('common.all_sessions') }}</span>
							</div>
						</div>
						<div v-for="group in projectStore.projects" :key="group.id" @click="selectProject(group.id)"
							:class="['w-full group flex items-center rounded-[10px] h-[36px] transition-colors clickable relative transition-all', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px] pe-[8px] gap-[8px]', 'hover:bg-[var(--bg-hover)]', conversationStore.isGroupSwitching ? 'opacity-50 pointer-events-none' : '']">
							<div v-if="isProjectActive(group.id)"
								class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[var(--text-primary)]">
							</div>
							<div class="shrink-0 size-[18px] flex items-center justify-center opacity-80"
								:style="{ color: getProjectColor(group.color) }">
								<component :is="getProjectIcon(group.icon)" :size="16" />
							</div>
							<div v-if="!uiStore.sidebarCollapsed"
								class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
								<span class="truncate">{{ group.name }}</span>
							</div>
							<!-- Project Actions -->
							<div v-if="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center gap-0.5">
								<div @click.stop="handleEditProject(group)" role="button"
									:aria-label="$t('common.edit')"
									class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-sidebar)] transition-all text-[var(--text-primary)]">
									<Pencil :size="14" />
								</div>
								<div @click.stop="handleDeleteProject(group.id)" role="button"
									:aria-label="$t('common.delete')"
									class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-sidebar)] transition-all text-[var(--text-primary)]">
									<Trash2 :size="14" />
								</div>
							</div>
						</div>
					</template>
				</div>

				<!-- Recent Chat Header -->
				<Tooltip :text="$t('common.recent_chat')" position="right" :disabled="!uiStore.sidebarCollapsed"
					fullWidth>
					<div @click="uiStore.sidebarCollapsed ? uiStore.toggleSidebar() : (recentChatsCollapsed = !recentChatsCollapsed)"
						:class="['group flex items-center rounded-[10px] mb-1 h-[36px] clickable hover:bg-[var(--bg-hover)] transition-colors', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[10px] pe-[2px] py-[2px] justify-between gap-[12px]']">
						<div v-if="!uiStore.sidebarCollapsed" class="flex items-center flex-1 min-w-0 gap-0.5">
							<span
								class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">{{
									$t('common.recent_chat') }}</span>
							<ChevronRight :size="14"
								:class="['transition-all shrink-0 group-hover:opacity-100 text-[var(--text-tertiary)]', recentChatsCollapsed ? '' : 'rotate-90']" />
						</div>
						<div v-else
							class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
							<MessageSquare :size="16" class="text-[var(--text-primary)]" />
						</div>
					</div>
				</Tooltip>

				<!-- Chat List -->
				<div v-show="!recentChatsCollapsed && !uiStore.sidebarCollapsed" class="flex flex-col gap-px">
					<template
						v-if="conversationStore.isGroupSwitching || (conversationStore.isLoading && conversationStore.conversations.length === 0)">
						<div class="flex flex-col gap-2 px-2 py-1">
							<div v-for="i in 5" :key="i"
								class="h-8 w-full bg-[var(--bg-hover)] rounded-lg animate-pulse"></div>
						</div>
					</template>
					<template v-else-if="sortedConversations.length === 0">
						<div v-if="!uiStore.sidebarCollapsed"
							class="flex flex-col items-center justify-center py-6 px-3 gap-2">
							<MessageSquare :size="20" class="text-[var(--text-tertiary)] opacity-40" />
							<p class="text-[12px] text-[var(--text-tertiary)] text-center leading-relaxed">{{
								$t('chat.no_history') }}<br />{{ $t('chat.start_new_chat') }}</p>
						</div>
					</template>
					<template v-else>
						<div v-for="conversation in sortedConversations" :key="conversation.id"
							@click="handleSelectConversation(String(conversation.id))"
							:data-cap="conversation.capability"
							:class="['group flex items-center rounded-[10px] clickable cursor-pointer transition-all w-full h-[36px]', isConversationActive(conversation.id) ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]', uiStore.sidebarCollapsed ? 'justify-center ps-0' : 'ps-[9px] pe-[2px] gap-[12px]']">
							<div
								class="shrink-0 size-[18px] flex items-center justify-center overflow-hidden transition-all">
								<img v-if="getConversationAvatar(conversation)"
									:src="getConversationAvatar(conversation)"
									class="size-full object-cover rounded-[4px] border border-[var(--border-light)]/50" />
								<template v-else>
									<div v-if="conversation.characterId && conversation.characterId > 1"
										class="size-full flex items-center justify-center rounded-[4px]">
										<Sparkles :size="15"
											class="text-[var(--text-primary)] opacity-60 group-hover:opacity-100 transition-opacity" />
									</div>
									<Image
										v-else-if="conversation.capability === 'image' || conversation.capability === 'image_generation'"
										:size="15"
										class="text-[var(--text-primary)] opacity-60 group-hover:opacity-100 transition-opacity" />
									<Play
										v-else-if="conversation.capability === 'video' || conversation.capability === 'video_generation'"
										:size="15" fill="currentColor"
										class="text-[var(--text-primary)] opacity-60 group-hover:opacity-100 transition-opacity" />
									<MessageSquare v-else :size="16"
										class="text-[var(--text-primary)] opacity-60 group-hover:opacity-100 transition-opacity" />
								</template>
							</div>
							<div v-if="!uiStore.sidebarCollapsed"
								class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
								<span class="truncate">{{ conversation.title || $t('chat.new_conversation_default')
								}}</span>
							</div>
							<div v-if="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
								<!-- Conversation Action Menu -->
								<Menu as="div" class="relative inline-block text-left">
									<MenuButton @click.stop="handleMenuClick($event, conversation.id)"
										:aria-label="$t('common.more')"
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
												data-menu-dropdown
												class="fixed z-[9999] w-48 origin-top-right rounded-[12px] bg-[var(--bg-main)] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-main)] focus:outline-none py-1.5 overflow-hidden">
												<div class="px-1 py-1">
													<MenuItem v-slot="{ active }">
													<button @click="handleShare(conversation)"
														:class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
														<Share :size="16" class="shrink-0 opacity-60" />
														{{ $t('chat.share') }}
													</button>
													</MenuItem>
													<MenuItem v-slot="{ active }">
													<button @click="uiStore.openRenameModal(conversation)"
														:class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
														<Pencil :size="16" class="shrink-0 opacity-60" />
														{{ $t('chat.rename') }}
													</button>
													</MenuItem>

													<!-- Move to Project -->
													<div class="h-px bg-[var(--border-main)] my-1"></div>
													<div
														class="px-3 py-1.5 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-tight">
														{{ $t('chat.move_to_project') }}</div>

													<template v-if="projectStore.projects.length > 0">
														<MenuItem v-for="proj in projectStore.projects" :key="proj.id"
															v-slot="{ active }">
														<button @click="handleMoveToProject(conversation.id, proj.id)"
															:class="[active ? 'bg-[var(--fill-tsp-white-main)]' : '', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--text-primary)] transition-colors']">
															<FolderOpen :size="16" class="shrink-0 opacity-60" />
															<span class="truncate">{{ proj.name }}</span>
														</button>
														</MenuItem>
													</template>

													<div class="h-px bg-[var(--border-main)] my-1"></div>

													<MenuItem v-slot="{ active }">
													<button @click="handleDeleteConversation(String(conversation.id))"
														:class="[active ? 'bg-red-50 text-red-600' : 'text-red-500', 'group flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm transition-colors']">
														<Trash2 :size="16" class="shrink-0" />
														{{ $t('chat.delete') }}
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

		<!-- Bottom Section -->
		<div
			class="flex flex-col justify-center items-start gap-[8px] bg-[var(--bg-sidebar)] p-[8px] overflow-hidden border-t border-[var(--border-light)] shrink-0 transition-all duration-300">
			<!-- Share Card -->
			<!-- <button v-if="!uiStore.sidebarCollapsed"
				class="relative w-full rounded-[12px] border border-[var(--border-light)] clickable hover:opacity-90 text-sm text-[var(--text-primary)] transition-all bg-[var(--background-card-gray)] shadow-sm">
				<div class="flex w-full items-center justify-between ps-[9px] pe-[0px] py-[8px] rounded-[12px]">
					<div class="flex-1 min-w-0 flex items-center gap-[12px]">
						<HandHeart :size="18" class="flex-shrink-0 text-[var(--text-primary)]" />
						<div class="flex flex-col text-start overflow-hidden">
							<span
								class="text-[var(--text-primary)] font-serif text-[14px] leading-[20px] truncate max-w-[200px]">Share
								MixU</span>
							<span class="text-[var(--text-tertiary)] text-[12px] leading-[16px] truncate">Get 500
								credits</span>
						</div>
					</div>
					<div class="flex items-center justify-center size-[32px] opacity-60">
						<ChevronRight :size="18" />
					</div>
				</div>
			</button> -->
			<!-- <button v-else
				class="flex items-center justify-center w-full h-[40px] rounded-[10px] border border-[var(--border-light)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-all">
				<HandHeart :size="18" class="shrink-0" />
			</button> -->

			<div
				:class="['flex w-full p-[2px] transition-all', uiStore.sidebarCollapsed ? 'flex-col items-center justify-center gap-2' : 'items-center justify-between px-1']">
				<!-- Expanded: User Profile -->
				<div v-if="!uiStore.sidebarCollapsed" class="flex items-center gap-2.5 min-w-0 flex-1">
					<div
						class="size-8 rounded-full bg-[var(--fill-tsp-gray-main)] flex items-center justify-center text-[13px] font-bold text-[var(--text-primary)] uppercase shrink-0 border border-[var(--border-main)]">
						{{ userStore.userInfo?.email?.charAt(0) || 'U' }}
					</div>
					<div class="min-w-0 flex-1">
						<div class="text-[13px] font-medium text-[var(--text-primary)] truncate leading-tight">{{
							userStore.userInfo?.email?.split('@')[0] || 'User' }}</div>
						<div class="text-[11px] text-[var(--text-tertiary)] leading-tight mt-0.5">{{
							$t('common.free_plan_label') }}</div>
					</div>
				</div>
				<!-- Collapsed: avatar only -->
				<Tooltip v-if="uiStore.sidebarCollapsed" :text="userStore.userInfo?.email?.split('@')[0] || 'User'"
					position="right">
					<div class="size-8 rounded-full bg-[var(--fill-tsp-gray-main)] flex items-center justify-center text-[13px] font-bold text-[var(--text-primary)] uppercase shrink-0 border border-[var(--border-main)] cursor-pointer"
						@click="uiStore.openSettingsModal()">
						{{ userStore.userInfo?.email?.charAt(0) || 'U' }}
					</div>
				</Tooltip>
				<!-- Settings + Mobile -->
				<div :class="['flex items-center', uiStore.sidebarCollapsed ? 'flex-col gap-2' : 'gap-[4px]']">
					<Tooltip :text="$t('common.settings')" position="right" :disabled="!uiStore.sidebarCollapsed">
						<div @click="uiStore.openSettingsModal()" role="button" :aria-label="$t('common.settings')"
							class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
							<Settings2 :size="18" class="text-[var(--icon-primary)]" />
						</div>
					</Tooltip>
					<div @click="uiStore.openMobileMenu()" role="button" :aria-label="$t('common.menu')"
						class="flex items-center justify-center lg:hidden cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<Smartphone :size="18" class="text-[var(--icon-primary)]" />
					</div>
				</div>
			</div>
		</div>

		<!-- Global Modals -->
		<ProjectModal :show="uiStore.showProjectModal" :editingProject="currentEditingProject"
			@close="handleCloseProjectModal" @success="projectStore.fetchProjects" />

		<!-- Confirm Dialog -->
		<ConfirmDialog :show="confirmDialog.show" :title="confirmDialog.title" :message="confirmDialog.message"
			@confirm="confirmDialog.onConfirm" @cancel="confirmDialog.show = false" />
	</aside>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
	PanelLeft,
	SquarePen,
	Search,
	Library,
	LayoutGrid,
	ChevronRight,
	ChevronUp,
	Plus,
	Folder,
	FolderOpen,
	MessageSquare,
	MoreHorizontal,
	Pencil,
	Trash2,
	Settings2,
	BookOpen,
	HandHeart,
	Smartphone,
	Share,
	Lightbulb,
	ArrowUpRight,
	Sparkles,
	Image,
	Video,
	AlignJustify,
	PanelLeftClose,
	Shapes,
	Bot,
	Play,
	Compass,
	DollarSign,
	Book,
	GraduationCap,
	PenTool,
	Code,
	Terminal,
	Music,
	Coffee,
	Paintbrush,
	Palette,
	Stethoscope,
	Asterisk,
	Flower,
	Briefcase,
	BarChart,
	CircleDot,
	Dumbbell,
	Notebook,
	Scale,
	Globe,
	Plane,
	Earth,
	Wrench,
	PawPrint,
	FlaskConical,
	Brain,
	Heart,
	Sprout,
	Cpu,
	Camera,
	Gamepad2,
	Headphones,
	Layers,
	Layout,
	Map,
	Microscope,
	Monitor,
	Moon,
	Sun,
	Shield,
	Star,
	Target,
	Tv,
	Umbrella,
	Zap,
	Archive,
	Calendar,
	Cloud,
	Crown,
	Flag,
	Gift,
	Key,
	Link,
	Lock,
	Magnet,
	Medal,
	Rocket,
	Trophy,
} from 'lucide-vue-next'
import { useConversationStore } from '../stores/conversation'
import { useProjectStore } from '../stores/projects'
import { useUIStore } from '../stores/ui'
import { useDiscoveryStore } from '../stores/discovery'
import { useUserStore } from '../stores/user'
import { useModelStore } from '../stores/models'
import ProjectModal from './ProjectModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import Tooltip from './Tooltip.vue'
import { encodeId } from '../utils/sqids'

const router = useRouter()
const route = useRoute()

// Route map for nav active state
const NAV_ROUTE_MAP: Record<string, string> = {
	library: '/library',
	'ai-bots': '/explore',
	'ai-image': '/image-generation',
	'ai-video': '/video-generation',
}
const isNavActive = (id: string) => {
	const target = NAV_ROUTE_MAP[id]
	return target ? route.path.startsWith(target) : false
}

const isChatRoute = computed(() => route.path.startsWith('/chat'))

const isConversationActive = (id: number | string) => {
	return isChatRoute.value && conversationStore.currentConversationId == id
}

const isProjectActive = (groupId: number | null) => {
	if (groupId === null) return conversationStore.selectedGroupId === null || conversationStore.selectedGroupId === 0
	return conversationStore.selectedGroupId == groupId
}
const conversationStore = useConversationStore()
const projectStore = useProjectStore()
const uiStore = useUIStore()
const discoveryStore = useDiscoveryStore()
const userStore = useUserStore()
const modelStore = useModelStore()

onMounted(() => {
	if (discoveryStore.allItems.length === 0) {
		discoveryStore.fetchDiscovery('tag')
	}
})
const currentEditingProject = ref<any>(null)
const projectsCollapsed = ref(false)
const recentChatsCollapsed = ref(false)

// Confirm Dialog State
const confirmDialog = ref({
	show: false,
	title: '',
	message: '',
	onConfirm: () => { },
})

const projectIconMap: Record<string, any> = {
	Folder,
	DollarSign,
	Book,
	GraduationCap,
	Pencil,
	PenTool,
	Code,
	Terminal,
	Music,
	Coffee,
	Paintbrush,
	Palette,
	Stethoscope,
	Asterisk,
	Flower,
	Briefcase,
	BarChart,
	CircleDot,
	Dumbbell,
	Notebook,
	Scale,
	Globe,
	Plane,
	Earth,
	Wrench,
	PawPrint,
	FlaskConical,
	Brain,
	Heart,
	Sprout,
	Cpu,
	Camera,
	Gamepad2,
	Headphones,
	Layers,
	Layout,
	Lightbulb,
	Map,
	Microscope,
	Monitor,
	Moon,
	Sun,
	Shield,
	Smartphone,
	Sparkles,
	Star,
	Target,
	Tv,
	Umbrella,
	Zap,
	Archive,
	Calendar,
	Cloud,
	Compass,
	Crown,
	Flag,
	Gift,
	Key,
	Link,
	Lock,
	Magnet,
	Medal,
	Rocket,
	Trophy,
}

const colorPresets = [
	{ name: 'black', hex: 'var(--text-primary)' },
	{ name: 'red', hex: '#EF4444' },
	{ name: 'orange', hex: '#F97316' },
	{ name: 'yellow', hex: '#EAB308' },
	{ name: 'green', hex: '#22C55E' },
	{ name: 'blue', hex: '#3B82F6' },
	{ name: 'purple', hex: '#A855F7' },
	{ name: 'pink', hex: '#EC4899' },
]

const getProjectColor = (colorName?: string) => {
	const c = colorPresets.find((c) => c.name === colorName)
	return c ? c.hex : 'var(--text-primary)'
}

const getProjectIcon = (iconName?: string) => {
	return projectIconMap[iconName || 'Folder'] || Folder
}

const openConfirm = (title: string, message: string, onConfirm: () => void) => {
	confirmDialog.value = { show: true, title, message, onConfirm }
}

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
			const def = getNavItemDef(moved.id)
			if (def) sidebarNavItems.value.splice(targetIndex, 0, def)
		}
	}
	// Scenario 4: Drag from main to more (container or item)
	else if (source === 'main' && (target === 'more' || target === 'more-container')) {
		const moved = sidebarNavItems.value.splice(sourceIndex, 1)[0]
		if (moved) {
			const newMoreItem = getMoreItemDef(moved.id) || {
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
	saveSidebarLayout()
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
	if (item.id === 'ai-image') {
		router.push('/image-generation')
	} else if (item.id === 'ai-video') {
		router.push('/video-generation')
	} else if (item.id === 'ai-bots') {
		router.push('/explore')
	} else if (item.id === 'ai-reading') {
		// Mock for now or point to search/docs if relevant
		router.push('/ai-search')
	} else if (item.id === 'library') {
		router.push('/library')
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

const selectProject = async (id: string | number | null) => {
	await conversationStore.setSelectedGroupId(id === null ? null : Number(id))

	// Only navigate if it's a specific project, "All Sessions" (id === null) just filters
	if (id !== null) {
		const firstConv = sortedConversations.value[0]
		if (firstConv) {
			router.push(`/chat/${encodeId(firstConv.id)}`)
		} else {
			router.push('/chat')
		}
	}
}

const handleSelectConversation = (id: string) => {
	const conversation = conversationStore.conversations.find((c) => String(c.id) === id)
	if (conversation?.characterId && conversation.characterId > 1) {
		router.push(`/character/${encodeId(conversation.characterId)}?conv=${encodeId(id)}`)
	} else {
		router.push(`/chat/${encodeId(id)}`)
	}
}

const getConversationAvatar = (conversation: any) => {
	if (!conversation.characterId || conversation.characterId <= 1) return undefined
	const bot = discoveryStore.allItems.find((b) => Number(b.related_id || b.id) === Number(conversation.characterId))
	return bot?.cover || undefined
}

const handleNewChat = () => {
	router.push('/chat')
}

const sidebarNavItems = ref([
	{
		id: 'library',
		label: 'Library',
		icon: markRaw(Library),
		handler: () => {
			router.push('/library')
		},
		iconClass: 'text-[var(--text-primary)]',
	},
])

const moreItems = ref([
	{ id: 'ai-bots', name: 'AI bots', icon: markRaw(Compass) },
	// { id: 'ai-reading', name: 'AI Reading', icon: markRaw(BookOpen) },
	{ id: 'ai-image', name: 'AI Image Generator', icon: markRaw(Image) },
	{ id: 'ai-video', name: 'AI Video Generator', icon: markRaw(Video) },
])

// ── Sidebar layout persistence (per user) ────────────────────────────────────
const SIDEBAR_KEY = (email: string) => `sidebar-order-${email}`

// All possible items that can appear in either zone
const NAV_DEFS: Record<string, any> = {
	library: {
		id: 'library',
		label: 'Library',
		icon: markRaw(Library),
		handler: () => {
			router.push('/library')
		},
		iconClass: 'text-[var(--text-primary)]',
	},
	'ai-bots': {
		id: 'ai-bots',
		label: 'AI bots',
		icon: markRaw(Compass),
		handler: () => {
			router.push('/explore')
		},
		iconClass: 'text-[var(--text-primary)]',
	},
	// 'ai-reading': {
	// 	id: 'ai-reading',
	// 	label: 'AI Reading',
	// 	icon: markRaw(BookOpen),
	// 	handler: () => {
	// 		router.push('/ai-search')
	// 	},
	// 	iconClass: 'text-[var(--text-secondary)]',
	// },
	'ai-image': {
		id: 'ai-image',
		label: 'AI Image Generator',
		icon: markRaw(Image),
		handler: () => {
			router.push('/image-generation')
		},
		iconClass: 'text-[var(--text-primary)]',
	},
	'ai-video': {
		id: 'ai-video',
		label: 'AI Video Generator',
		icon: markRaw(Video),
		handler: () => {
			router.push('/video-generation')
		},
		iconClass: 'text-[var(--text-primary)]',
	},
}
const MORE_DEFS: Record<string, any> = {
	'ai-bots': { id: 'ai-bots', name: 'AI bots', icon: markRaw(Compass) },
	// 'ai-reading': { id: 'ai-reading', name: 'AI Reading', icon: markRaw(BookOpen) },
	'ai-image': { id: 'ai-image', name: 'AI Image Generator', icon: markRaw(Image) },
	'ai-video': { id: 'ai-video', name: 'AI Video Generator', icon: markRaw(Video) },

	library: { id: 'library', name: 'Library', icon: markRaw(Library) },
}

const getNavItemDef = (id: string): any => NAV_DEFS[id]
const getMoreItemDef = (id: string): any => MORE_DEFS[id]

const saveSidebarLayout = () => {
	const email = userStore.userInfo?.email
	if (!email || !import.meta.client) return
	localStorage.setItem(
		SIDEBAR_KEY(email),
		JSON.stringify({
			main: sidebarNavItems.value.map((i) => i.id),
			more: moreItems.value.map((i) => i.id),
		}),
	)
}

const loadSidebarLayout = () => {
	const email = userStore.userInfo?.email
	if (!email || !import.meta.client) return
	const raw = localStorage.getItem(SIDEBAR_KEY(email))
	if (!raw) return
	try {
		const { main, more } = JSON.parse(raw)
		if (Array.isArray(main)) {
			const filtered = main.filter((id: string) => id !== 'search')
			const items = filtered.map(getNavItemDef).filter(Boolean)
			sidebarNavItems.value = items
		}
		if (Array.isArray(more)) {
			const filtered = more.filter((id: string) => id !== 'search')
			moreItems.value = filtered.map(getMoreItemDef).filter(Boolean)
		}
	} catch { }
}

// Load layout whenever user info becomes available (covers login + page refresh)
watch(
	() => userStore.userInfo?.email,
	(email) => {
		if (email) loadSidebarLayout()
	},
	{ immediate: true },
)

const handleDeleteConversation = (id: string) => {
	openConfirm('Delete Conversation', 'This conversation will be permanently deleted.', async () => {
		const wasActive = conversationStore.currentConversationId == id
		await conversationStore.deleteConversation(id)
		confirmDialog.value.show = false
		uiStore.showToast('Conversation deleted')
		if (wasActive) {
			const nextId = conversationStore.currentConversationId
			if (nextId) {
				router.push(`/chat/${encodeId(nextId)}`)
			} else {
				router.push('/chat')
			}
		}
	})
}

const handleOpenNewTab = (id: string | number) => {
	window.open(`/chat/${id}`, '_blank')
}

const handleMoveToProject = async (conversationId: string | number, projectId: string | number) => {
	await conversationStore.moveToProject(conversationId, Number(projectId))
	activeMenuId.value = null
}

const handleShare = (conversation: any) => {
	const url = window.location.origin + '/chat/' + conversation.id
	navigator.clipboard.writeText(url).then(() => {
		uiStore.showToast('Link copied to clipboard')
	})
}

const handleMenuClick = (event: MouseEvent, id: string | number) => {
	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
	activeMenuId.value = id

	const menuWidth = 192 // w-48
	const margin = 4

	// Always start below the button (closest to the click point)
	menuPosition.value = {
		top: `${rect.bottom + margin}px`,
		left: `${rect.right - menuWidth}px`,
	}

	// After render, check overflow with real menu height and flip above if needed
	nextTick(() => {
		const menuEl = document.querySelector('[data-menu-dropdown]') as HTMLElement
		if (!menuEl) return
		const menuRect = menuEl.getBoundingClientRect()
		const viewportHeight = window.innerHeight

		if (menuRect.bottom > viewportHeight - margin) {
			// Overflows bottom → flip: menu bottom aligns just above the button top
			const newTop = rect.top - menuRect.height - margin
			menuPosition.value = {
				top: `${Math.max(margin, newTop)}px`,
				left: `${rect.right - menuWidth}px`,
			}
		}
	})
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

const handleDeleteProject = (id: string | number) => {
	openConfirm('Delete Project', 'This project and all its associated chats will be permanently deleted.', async () => {
		await projectStore.deleteProject(Number(id))
		confirmDialog.value.show = false
		uiStore.showToast('Project deleted')
	})
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
