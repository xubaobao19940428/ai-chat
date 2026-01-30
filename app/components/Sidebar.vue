<template>
	<!-- Manus Style Desktop Sidebar -->
	<aside :class="['hidden lg:flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-r border-[var(--border-light)] transition-all duration-300 relative overflow-hidden flex-shrink-0', uiStore.sidebarCollapsed ? 'w-[68px]' : 'w-[300px]']">
		<!-- Top Section: Logo & Collapse -->
		<div class="flex items-center justify-between h-[56px] py-[12px] pe-[10px] ps-[12px]">
			<div v-show="!uiStore.sidebarCollapsed" class="clickable">
				<div class="flex items-center gap-2">
					<svg height="28" width="28" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="text-[var(--text-primary)]">
						<path d="M17.6335 22.5843C19.2956 21.5297 20.4448 15.874 20.192 14.1899C20.192 14.1899 19.9286 13.2857 19.2857 13.2857C18.6429 13.2857 18.3754 13.963 18.3754 13.963C18.3754 13.963 17.278 18.0192 16.2857 18.4766C15.2934 18.934 14.3312 18.4766 14.3312 18.4766C15.0597 21.2397 15.9713 23.6388 17.6335 22.5843Z" fill="currentColor"></path>
						<path d="M7.71498 12.0001C8.30182 11.4302 10.0059 10.9969 11.7867 11.7858C13.5676 12.5746 13.8721 15.2062 13.1206 16.0674C12.3692 16.9286 10.7152 16.0674 10.7152 16.0674" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.71429"></path>
						<path d="M6.43004 5.1428C5.79407 4.42578 5.14453 4.07134 4.50157 3.75595" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.71429"></path>
						<path d="M9.12714 3.9793C9.00084 3.21423 8.78655 2.57138 8.57227 1.71423" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.71429"></path>
						<path d="M12.0007 4.49997C12.1175 3.60306 12.4293 2.78568 12.8193 2.14282" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.71429"></path>
					</svg>
                    <span class="text-[18px] font-bold text-[var(--text-primary)] font-serif tracking-tight">Manus</span>
				</div>
			</div>
			<div @click="uiStore.toggleSidebar" class="flex items-center justify-center rounded-md hover:bg-[var(--bg-hover)] cursor-pointer size-[32px] transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left text-[var(--text-secondary)] size-[18px]">
					<rect width="18" height="18" x="3" y="3" rx="2"></rect>
					<path d="M9 3v18"></path>
				</svg>
			</div>
		</div>

		<!-- Nav Items Section -->
		<div class="flex flex-col flex-1 min-h-0 p-[8px] pb-0 gap-px transition-all">
			<!-- New Task -->
			<div @click="handleNewChat" class="flex items-center rounded-[12px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] pointer-events-auto ps-[9px] pe-[2px]">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
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
			<div class="flex items-center rounded-[12px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] pointer-events-auto ps-[9px] pe-[2px] group">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)]">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
						<path d="m21 21-4.34-4.34"></path>
						<circle cx="11" cy="11" r="8"></circle>
					</svg>
				</div>
				<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex gap-[4px] items-center text-[14px] font-medium text-[var(--text-primary)]">
					<span class="truncate">Search</span>
				</div>
                <div v-show="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
					<div class="text-[var(--text-tertiary)] text-xs hidden group-hover:inline-flex items-center gap-1 pe-[8px]">
						⌘ K
					</div>
				</div>
			</div>

			<!-- Library -->
			<div class="flex items-center rounded-[12px] clickable cursor-pointer transition-colors w-full gap-[12px] h-[36px] hover:bg-[var(--bg-hover)] pointer-events-auto ps-[9px] pe-[2px]">
				<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)]">
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
				<div class="w-full border-t-[1px] border-[var(--border-light)] opacity-50 my-2"></div>
				<div class="flex flex-col flex-1 min-h-0 overflow-x-hidden overflow-y-auto custom-scrollbar pt-0 px-[8px]">
					<!-- Projects Toggle -->
					<div @click="toggleProjects" class="group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] clickable hover:bg-[var(--bg-hover)] transition-colors active:bg-[var(--bg-hover)] rounded-[12px] mb-1">
						<div class="flex items-center flex-1 min-w-0 gap-0.5">
							<span class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-bold min-w-0 truncate tracking-wide uppercase">Projects</span>
							<svg v-if="!uiStore.sidebarCollapsed" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="['lucide lucide-chevron-up transition-all shrink-0 group-hover:opacity-100 text-[var(--text-tertiary)]', projectsCollapsed ? 'rotate-180' : '']">
								<path d="m18 15-6-6-6 6"></path>
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
						<div @click="selectProject(null)" :class="['w-full flex items-center rounded-[12px] h-[36px] ps-[10px] pe-[8px] gap-[8px] transition-colors clickable', conversationStore.selectedGroupId === null ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
							<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M4 6h16M4 12h16M4 18h7" />
								</svg>
							</div>
							<span v-show="!uiStore.sidebarCollapsed" class="text-[var(--text-primary)] text-[14px] font-medium truncate">Direct chat</span>
						</div>
						<div v-for="project in projectStore.projects" :key="project.id" @click="selectProject(project.id)" :class="['w-full flex items-center rounded-[12px] h-[36px] ps-[10px] pe-[8px] gap-[8px] transition-colors clickable', conversationStore.selectedGroupId === project.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
							<div class="shrink-0 size-[12px] rounded-full bg-blue-500 opacity-80" :class="project.color"></div>
							<span v-show="!uiStore.sidebarCollapsed" class="text-[var(--text-primary)] text-[14px] font-medium truncate">{{ project.name }}</span>
						</div>
					</div>

					<!-- Recent Chat Header -->
					<div class="group flex items-center justify-between ps-[10px] pe-[2px] py-[2px] h-[36px] gap-[12px] rounded-[12px] mb-1">
						<span class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-bold min-w-0 truncate tracking-wide uppercase">Recent Chat</span>
					</div>

					<!-- Chat List -->
					<div class="flex flex-col gap-px">
						<div v-for="conversation in sortedConversations" :key="conversation.id" @click="handleSelectConversation(conversation.id)" :class="['group flex items-center rounded-[12px] clickable cursor-pointer transition-all w-full gap-[12px] h-[36px] ps-[9px] pe-[2px]', conversationStore.currentConversationId === conversation.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
							<div class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-60">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
								</svg>
							</div>
							<div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0 flex items-center text-[14px] text-[var(--text-primary)] font-medium overflow-hidden">
								<span class="truncate">{{ conversation.title || 'New conversation' }}</span>
							</div>
							<div v-show="!uiStore.sidebarCollapsed" class="shrink-0 flex items-center">
								<div @click.stop="handleDeleteConversation(conversation.id)" class="size-7 flex rounded-[8px] items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)] transition-all text-[var(--text-tertiary)]">
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
		<div class="flex flex-col justify-center items-start gap-[8px] bg-[var(--bg-sidebar)] p-[8px] overflow-hidden border-t border-[var(--border-light)] transition-all duration-300">
			<!-- Share Card -->
			<button v-show="!uiStore.sidebarCollapsed" class="relative w-full rounded-[12px] border border-[var(--border-light)] clickable hover:opacity-90 text-sm text-[var(--text-primary)] transition-all bg-[var(--bg-main)] shadow-sm">
				<div class="flex w-full items-center justify-between ps-[9px] pe-[0px] py-[8px] rounded-[12px]">
					<div class="flex-1 min-w-0 flex items-center gap-[12px]">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-heart flex-shrink-0">
							<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"></path>
							<path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95"></path>
							<path d="m2 15 6 6"></path>
							<path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91"></path>
						</svg>
						<div class="flex flex-col text-start overflow-hidden">
							<span class="text-[var(--text-primary)] font-semibold text-[13px] leading-[18px] truncate max-w-[180px]">Share Manus</span>
							<span class="text-[var(--text-tertiary)] text-[11px] leading-[14px] truncate">Get 500 credits</span>
						</div>
					</div>
					<div class="flex items-center justify-center size-[32px] opacity-60">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right">
							<path d="m9 18 6-6-6-6"></path>
						</svg>
					</div>
				</div>
			</button>

			<!-- Icons Footer -->
			<div class="flex items-center w-full p-[2px] transition-all" :class="uiStore.sidebarCollapsed ? 'flex-col gap-2' : 'justify-between'">
				<div class="flex items-center" :class="uiStore.sidebarCollapsed ? 'flex-col gap-1' : 'gap-[4px]'">
					<!-- Settings -->
					<div class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--bg-hover)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings2 text-[var(--text-secondary)] size-[18px]">
							<path d="M14 17H5"></path>
							<path d="M19 7h-9"></path>
							<circle cx="17" cy="17" r="3"></circle>
							<circle cx="7" cy="7" r="3"></circle>
						</svg>
					</div>
					<!-- Appearance -->
					<div @click="toggleTheme" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--bg-hover)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" width="16" height="16" :class="['text-[var(--text-secondary)] size-[18px]', uiStore.currentTheme === 'dark' ? 'text-[var(--text-primary)]' : '']">
							<path d="M15.4286 7.55357H10.125L12.7768 2.25L15.4286 7.55357Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"></path>
							<circle cx="5.25" cy="12.75" r="2.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></circle>
							<path d="M10.5 10.5H15V14.25C15 14.6642 14.6642 15 14.25 15H11.25C10.8358 15 10.5 14.6642 10.5 14.25V10.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M3 3H7.5V6.75C7.5 7.16421 7.16421 7.5 6.75 7.5H3.75C3.33579 7.5 3 7.16421 3 6.75V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
					<!-- Device Info -->
					<div v-show="!uiStore.sidebarCollapsed" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--bg-hover)] size-8 shrink-0 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone text-[var(--text-secondary)] size-[18px]">
							<rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
							<path d="M12 18h.01"></path>
						</svg>
					</div>
				</div>

				<div v-show="!uiStore.sidebarCollapsed" class="flex items-center gap-[4px]">
					<!-- Documentation -->
					<div class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--bg-hover)] size-8">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book text-[var(--text-secondary)] size-[18px]">
							<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
						</svg>
					</div>
					<!-- Profile/Account -->
					<!-- Profile/Account -->
					<div v-if="userStore.token" @click="userStore.logout()" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--bg-hover)] size-8" title="Log out">
						<div class="size-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] text-[10px] flex items-center justify-center font-bold">
							{{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
						</div>
					</div>
					<div v-else @click="uiStore.openLoginModal()" class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--bg-hover)] size-8" title="Log in">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in text-[var(--text-secondary)] size-[18px]">
							<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
							<polyline points="10 17 15 12 10 7"></polyline>
							<line x1="15" x2="3" y1="12" y2="12"></line>
						</svg>
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
