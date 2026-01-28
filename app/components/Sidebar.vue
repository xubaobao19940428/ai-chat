<template>
	<!-- Manus Style Desktop Sidebar -->
	<aside :class="['hidden lg:flex flex-col h-full bg-[var(--background-nav)] text-[var(--text-secondary)] border-r border-[var(--border-main)] transition-all duration-300 relative overflow-hidden flex-shrink-0', uiStore.sidebarCollapsed ? 'w-[68px]' : 'w-[300px]']">
		<!-- Top Section: Logo & Collapse -->
		<div class="flex items-center justify-between h-[56px] py-[12px] pe-[10px] ps-[12px]">
			<div v-show="!uiStore.sidebarCollapsed" class="clickable">
				<div class="flex items-center gap-0.5">
					<svg height="28" width="28" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="text-[var(--logo-color)]">
						<path d="M17.6335 22.5843C19.2956 21.5297 20.4448 15.874 20.192 14.1899C20.192 14.1899 19.9286 13.2857 19.2857 13.2857C18.6429 13.2857 18.3754 13.963 18.3754 13.963C18.3754 13.963 17.278 18.0192 16.2857 18.4766C15.2934 18.934 14.3312 18.4766 14.3312 18.4766C15.0597 21.2397 15.9713 23.6388 17.6335 22.5843Z" fill="currentColor"></path>
						<path d="M7.71498 12.0001C8.30182 11.4302 10.0059 10.9969 11.7867 11.7858C13.5676 12.5746 13.8721 15.2062 13.1206 16.0674C12.3692 16.9286 10.7152 16.0674 10.7152 16.0674" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.71429"></path>
						<path d="M6.43004 5.1428C5.79407 4.42578 5.14453 4.07134 4.50157 3.75595" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.71429"></path>
						<path d="M9.12714 3.9793C9.00084 3.21423 8.78655 2.57138 8.57227 1.71423" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.71429"></path>
						<path d="M12.0007 4.49997C12.1175 3.60306 12.4293 2.78568 12.8193 2.14282" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.71429"></path>
					</svg>
					<svg xmlns="http://www.w3.org/2000/svg" width="64" height="28" viewBox="0 0 88 38" fill="none" class="text-[var(--logo-color)]">
						<path
							d="M75.9757 24.9999H75.2937V20.9959H76.2177C76.4677 22.0519 76.8267 22.8219 77.2957 23.3059C77.7657 23.7899 78.3737 24.0319 79.1217 24.0319C79.6647 24.0319 80.0827 23.9219 80.3757 23.7019C80.6837 23.4672 80.8377 23.1519 80.8377 22.7559C80.8377 22.3452 80.6547 21.9492 80.2877 21.5679C79.9217 21.1719 79.3277 20.7539 78.5057 20.3139C77.3917 19.7126 76.5917 19.1186 76.1077 18.5319C75.6237 17.9306 75.3817 17.2559 75.3817 16.5079C75.3817 16.0239 75.4697 15.5766 75.6457 15.1659C75.8367 14.7406 76.0857 14.3739 76.3937 14.0659C76.7167 13.7579 77.0977 13.5232 77.5377 13.3619C77.9777 13.1859 78.4547 13.0979 78.9677 13.0979C79.4227 13.0979 79.8697 13.1639 80.3097 13.2959C80.7647 13.4279 81.1607 13.6112 81.4977 13.8459L81.8937 13.3179H82.4657V16.6399H81.6077C81.2707 15.8039 80.9187 15.2026 80.5517 14.8359C80.1997 14.4692 79.7677 14.2859 79.2537 14.2859C78.8437 14.2859 78.5137 14.3959 78.2637 14.6159C78.0297 14.8359 77.9117 15.1292 77.9117 15.4959C77.9117 15.9066 78.0877 16.2952 78.4397 16.6619C78.8067 17.0286 79.4077 17.4319 80.2437 17.8719C80.8307 18.1946 81.3367 18.5099 81.7617 18.8179C82.1877 19.1259 82.5317 19.4412 82.7957 19.7639C83.0597 20.0719 83.2507 20.4019 83.3677 20.7539C83.4997 21.0912 83.5657 21.4579 83.5657 21.8539C83.5657 22.3672 83.4707 22.8292 83.2797 23.2399C83.0897 23.6506 82.8177 24.0026 82.4657 24.2959C82.1137 24.5892 81.6887 24.8166 81.1897 24.9779C80.7057 25.1392 80.1637 25.2199 79.5617 25.2199C78.9317 25.2199 78.3447 25.1392 77.8017 24.9779C77.2597 24.8019 76.8117 24.5526 76.4597 24.2299L75.9757 24.9999Z"
							fill="currentColor"></path>
					</svg>
				</div>
			</div>
			<div @click="uiStore.toggleSidebar" class="flex items-center justify-center rounded-md hover:bg-[var(--fill-tsp-gray-main)] cursor-pointer size-[32px] transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left text-[var(--icon-primary)] size-[18px]">
					<rect width="18" height="18" x="3" y="3" rx="2"></rect>
					<path d="M9 3v18"></path>
				</svg>
			</div>
		</div>

		<!-- Nav Items Section -->
		<div class="flex flex-col flex-1 min-h-0 p-[8px] pb-0 gap-px transition-all">
			<!-- New Task -->
			<div @click="handleNewChat" class="flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] bg-[var(--fill-tsp-white-main)] hover:bg-[var(--fill-tsp-white-light)] pointer-events-auto ps-[9px] pe-[2px]">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--icon-primary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen">
						<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
						<path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
					</svg>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">New task</span>
				</div>
			</div>

			<!-- Search -->
			<div class="flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--fill-tsp-white-light)] pointer-events-auto ps-[9px] pe-[2px] group">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--icon-primary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
						<path d="m21 21-4.34-4.34"></path>
						<circle cx="11" cy="11" r="8"></circle>
					</svg>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">Search</span>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
					<div class="text-[var(--text-tertiary)] text-sm hidden group-hover:inline-flex items-center gap-1 pe-[8px]">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-command inline-flex">
							<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path></svg
						>K
					</div>
				</div>
			</div>

			<!-- Library -->
			<div class="flex items-center rounded-[10px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--fill-tsp-white-light)] pointer-events-auto ps-[9px] pe-[2px]">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--icon-primary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big">
						<rect width="8" height="18" x="3" y="3" rx="1"></rect>
						<path d="M7 3v18"></path>
						<path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"></path>
					</svg>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">Library</span>
				</div>
			</div>

			<!-- History Content (Scrollable) -->
			<div class="flex flex-col flex-1 min-h-0 -mx-[8px] transition-all overflow-hidden" style="opacity: 1">
				<div class="w-full border-t-[1px] border-[var(--border-main)] opacity-0 transition-opacity duration-200"></div>
				<div class="flex flex-col flex-1 min-h-0 overflow-x-hidden overflow-y-auto custom-scrollbar pt-2 px-[8px]">
					<!-- Projects Toggle -->
					<div @click="toggleProjects" class="group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors active:bg-[var(--fill-tsp-white-dark)] rounded-[10px] mb-1">
						<div class="flex items-center flex-1 min-w-0 gap-0.5">
							<span class="text-[13px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">Projects</span>
							<svg v-if="!uiStore.sidebarCollapsed" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="['lucide lucide-chevron-up transition-all shrink-0 group-hover:opacity-100', projectsCollapsed ? 'rotate-180' : '']">
								<path d="m18 15-6-6-6 6"></path>
							</svg>
						</div>
						<div v-if="!uiStore.sidebarCollapsed" @click.stop="openCreateProjectModal" class="flex items-center justify-center size-[32px] rounded-[8px] hover:bg-[var(--fill-tsp-white-main)] clickable transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus text-[var(--icon-tertiary)]">
								<path d="M5 12h14"></path>
								<path d="M12 5v14"></path>
							</svg>
						</div>
					</div>

					<!-- Project List -->
					<div v-show="!projectsCollapsed" class="flex flex-col gap-px mb-4">
						<div @click="selectProject(null)" :class="['w-full flex items-center rounded-[10px] h-[36px] ps-[10px] pe-[8px] gap-[8px] transition-colors clickable', conversationStore.selectedGroupId === null ? 'bg-[var(--fill-tsp-white-main)]' : 'hover:bg-[var(--fill-tsp-white-light)]']">
							<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--icon-primary)] opacity-60">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M4 6h16M4 12h16M4 18h7" />
								</svg>
							</div>
							<span v-show="!uiStore.sidebarCollapsed" class="text-[var(--text-primary)] text-[14px] font-medium truncate">Direct chat</span>
						</div>
						<div v-for="project in projectStore.projects" :key="project.id" @click="selectProject(project.id)" :class="['w-full flex items-center rounded-[10px] h-[36px] ps-[10px] pe-[8px] gap-[8px] transition-colors clickable', conversationStore.selectedGroupId === project.id ? 'bg-[var(--fill-tsp-white-main)]' : 'hover:bg-[var(--fill-tsp-white-light)]']">
							<div class="shrink-0 size-[14px] rounded-sm bg-blue-500 opacity-60" :class="project.color"></div>
							<span v-show="!uiStore.sidebarCollapsed" class="text-[var(--text-primary)] text-[14px] font-medium truncate">{{ project.name }}</span>
						</div>
					</div>

					<!-- Recent Chat Header -->
					<div class="group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] rounded-[10px] mb-1">
						<span class="text-[13px] leading-[18px] text-[var(--text-tertiary)] font-medium min-w-0 truncate tracking-tight uppercase">Recent Chat</span>
					</div>

					<!-- Chat List -->
					<div class="flex flex-col gap-px">
						<div v-for="conversation in sortedConversations" :key="conversation.id" @click="handleSelectConversation(conversation.id)" :class="['group flex items-center rounded-[10px] clickable cursor-pointer transition-all w-full gap-[12px] h-[36px] ps-[9px] pe-[2px]', conversationStore.currentConversationId === conversation.id ? 'bg-[var(--fill-tsp-white-main)]' : 'hover:bg-[var(--fill-tsp-white-light)]']">
							<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--icon-primary)] opacity-40">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
								</svg>
							</div>
							<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
								<span class="truncate">{{ conversation.title || 'New conversation' }}</span>
							</div>
							<div v-show="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
								<div @click.stop="handleDeleteConversation(conversation.id)" class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--fill-tsp-white-main)] transition-all">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
										<path d="M3 6h18"></path>
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="flex flex-col justify-center items-start gap-[8px] bg-[var(--background-nav)] p-[8px] overflow-hidden border-t border-[var(--border-main)] transition-all duration-300">
			<!-- Share Card -->
			<button v-show="!uiStore.sidebarCollapsed" class="relative w-full rounded-[12px] border border-[var(--border-light)] clickable hover:opacity-90 text-sm text-[var(--text-primary)] transition-all">
				<div class="flex w-full items-center justify-between ps-[9px] pe-[0px] py-[8px] bg-[var(--background-card-gray)] rounded-[12px]">
					<div class="flex-1 min-w-0 flex items-center gap-[12px]">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--icon-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-heart flex-shrink-0">
							<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"></path>
							<path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95"></path>
							<path d="m2 15 6 6"></path>
							<path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91"></path>
						</svg>
						<div class="flex flex-col text-start overflow-hidden">
							<span class="text-[var(--text-primary)] font-serif text-[14px] leading-[20px] truncate max-w-[180px]">Share Manus with a friend</span>
							<span class="text-[var(--text-tertiary)] text-[12px] leading-[16px] truncate">Get 500 credits each</span>
						</div>
					</div>
					<div class="flex items-center justify-center size-[32px] opacity-60">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right">
							<path d="m9 18 6-6-6-6"></path>
						</svg>
					</div>
				</div>
			</button>

			<!-- Icons Footer -->
			<div class="flex items-center w-full p-[2px] transition-all" :class="uiStore.sidebarCollapsed ? 'flex-col gap-2' : 'justify-between'">
				<div class="flex items-center" :class="uiStore.sidebarCollapsed ? 'flex-col gap-1' : 'gap-[4px]'">
					<!-- Settings -->
					<div class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings2 text-[var(--icon-primary)] size-[18px]">
							<path d="M14 17H5"></path>
							<path d="M19 7h-9"></path>
							<circle cx="17" cy="17" r="3"></circle>
							<circle cx="7" cy="7" r="3"></circle>
						</svg>
					</div>
					<!-- Appearance -->
					<div @click="toggleTheme" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" width="16" height="16" :class="['text-[var(--icon-primary)] size-[18px]', uiStore.currentTheme === 'dark' ? 'opacity-100' : 'opacity-60']">
							<path d="M15.4286 7.55357H10.125L12.7768 2.25L15.4286 7.55357Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"></path>
							<circle cx="5.25" cy="12.75" r="2.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></circle>
							<path d="M10.5 10.5H15V14.25C15 14.6642 14.6642 15 14.25 15H11.25C10.8358 15 10.5 14.6642 10.5 14.25V10.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M3 3H7.5V6.75C7.5 7.16421 7.16421 7.5 6.75 7.5H3.75C3.33579 7.5 3 7.16421 3 6.75V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
					<!-- Device Info -->
					<div v-show="!uiStore.sidebarCollapsed" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone text-[var(--icon-primary)] size-[18px]">
							<rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
							<path d="M12 18h.01"></path>
						</svg>
					</div>
				</div>

				<div v-show="!uiStore.sidebarCollapsed" class="flex items-center gap-[4px]">
					<!-- Documentation -->
					<a href="https://manus.im/docs" target="_blank" rel="noreferrer" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book text-[var(--icon-primary)] size-[18px]">
							<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
						</svg>
					</a>
					<!-- Profile/Account -->
					<div class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8">
						<div class="size-6 rounded-full bg-[var(--Button-primary-black)] text-white text-[10px] flex items-center justify-center font-bold">
							{{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Project Creation Modal -->
		<ProjectModal :show="showCreateProjectModal" :editing-project="editingProject" @close="handleCloseProjectModal" @success="handleProjectSuccess" />
	</aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversation'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'
import { useProjectStore } from '../stores/projects'

const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()
const userStore = useUserStore()
const projectStore = useProjectStore()

const projectsCollapsed = ref(false)
const showCreateProjectModal = ref(false)
const editingProject = ref<any>(null)

const sortedConversations = computed(() => {
	return [...conversationStore.conversations].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
})

const toggleProjects = () => {
	projectsCollapsed.value = !projectsCollapsed.value
}

const openCreateProjectModal = () => {
	editingProject.value = null
	showCreateProjectModal.value = true
}

const handleCloseProjectModal = () => {
	showCreateProjectModal.value = false
	editingProject.value = null
}

const handleProjectSuccess = () => {
	projectsCollapsed.value = false
}

const selectProject = (id: number | null) => {
	conversationStore.setSelectedGroupId(id)
}

const handleNewChat = async () => {
	try {
		const id = await conversationStore.createConversation({
			character_id: 1,
			group_id: conversationStore.selectedGroupId || 0,
		})
		router.push(`/chat/${id}`)
	} catch (e) {
		console.error('Failed to create chat:', e)
	}
}

const handleSelectConversation = (id: number | string) => {
	conversationStore.switchConversation(id)
	router.push(`/chat/${id}`)
}

const handleDeleteConversation = async (id: number | string) => {
	if (confirm('确定要删除这个对话吗？')) {
		await conversationStore.deleteConversation(id)
		if (conversationStore.conversations.length > 0) {
			router.push(`/chat/${conversationStore.conversations[0]?.id}`)
		} else {
			router.push('/')
		}
	}
}

const toggleTheme = () => {
	if (uiStore.themeMode === 'system') {
		uiStore.setThemeMode('light')
	} else if (uiStore.themeMode === 'light') {
		uiStore.setThemeMode('dark')
	} else {
		uiStore.setThemeMode('system')
	}
}

onMounted(() => {
	uiStore.initTheme()
})
</script>

<style scoped lang="scss">
.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: rgba(156, 163, 175, 0.1) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.1);
		border-radius: 10px;

		&:hover {
			background-color: rgba(156, 163, 175, 0.3);
		}
	}
}

.clickable {
	cursor: pointer;
	user-select: none;
	-webkit-tap-highlight-color: transparent;
}
</style>
