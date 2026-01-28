<template>
	<!-- 桌面端侧边栏 -->
	<aside :class="['hidden lg:flex flex-col h-full bg-[#f9f9f9] dark:bg-black text-black/60 dark:text-white/40 border-r border-gray-100 dark:border-white/5 transition-all duration-300', uiStore.sidebarCollapsed ? 'w-20' : 'w-[260px]']">
		<!-- Fixed Top Section -->
		<div class="flex-shrink-0 p-3">
			<div class="flex items-center justify-between mb-4 px-2">
				<div v-show="!uiStore.sidebarCollapsed" class="flex items-center gap-2">
					<span class="font-bold text-gray-900 dark:text-white text-lg tracking-tight">Chatbot App</span>
					<!-- <button class="p-0.5" title="Collapse">
                         <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button> -->
				</div>
				<button @click="uiStore.toggleSidebar" class="p-2 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
					<svg class="w-5 h-5 transition-transform" :class="{ 'rotate-180': uiStore.sidebarCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>

			<button @click="handleNewChat" :class="['w-full flex items-center gap-3 px-3 py-3 bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-black dark:text-white rounded-xl transition-all shadow-sm mb-4 font-bold tracking-tight', uiStore.sidebarCollapsed ? 'justify-center' : '']" :title="uiStore.sidebarCollapsed ? 'New Chat' : ''">
				<svg class="w-5 h-5 flex-shrink-0 text-black/20 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span v-show="!uiStore.sidebarCollapsed">New task</span>
			</button>

			<!-- My Tools Section -->
			<div class="mb-4">
				<div v-show="!uiStore.sidebarCollapsed" class="px-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 dark:text-white/20 mb-3 flex items-center gap-2">
					<span>Tools</span>
				</div>
				<div class="space-y-0.5">
					<NuxtLink to="/chat" :class="['flex items-center gap-3 rounded-xl transition-all text-sm group', uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2', $route.path === '/chat' ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-black/50 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white']">
						<div class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all overflow-hidden shrink-0">
							<img src="/chatgpt-4o.svg" class="w-5 h-5 object-contain opacity-50 group-hover:opacity-100" alt="AI Chat" />
						</div>
						<span v-show="!uiStore.sidebarCollapsed" class="font-bold tracking-tight">AI Chat</span>
					</NuxtLink>
					<NuxtLink to="/image-generation" :class="['flex items-center gap-3 rounded-xl transition-all text-sm group', uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2', $route.path === '/image-generation' ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-black/50 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white']">
						<div class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all overflow-hidden shrink-0">
							<img src="/image-generation.svg" class="w-5 h-5 object-contain opacity-50 group-hover:opacity-100" alt="Image Generation" />
						</div>
						<span v-show="!uiStore.sidebarCollapsed" class="font-bold tracking-tight">Image Gen</span>
					</NuxtLink>
					<NuxtLink to="/ai-search" :class="['flex items-center gap-3 rounded-xl transition-all text-sm group', uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2', $route.path === '/ai-search' ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-black/50 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white']">
						<div class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all overflow-hidden shrink-0">
							<img src="/ai-search.svg" class="w-5 h-5 object-contain opacity-50 group-hover:opacity-100" alt="AI Search" />
						</div>
						<span v-show="!uiStore.sidebarCollapsed" class="font-bold tracking-tight">AI Search</span>
					</NuxtLink>
				</div>
			</div>

			<!-- Projects Section -->
			<div class="mb-4">
				<button v-show="!uiStore.sidebarCollapsed" @click="toggleProjects" class="w-full px-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 dark:text-white/20 mb-3 flex items-center justify-between group hover:text-black dark:hover:text-white transition-colors">
					<div class="flex items-center gap-2">
						<span>Projects</span>
					</div>
					<svg class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': !projectsCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				<div v-show="!projectsCollapsed" class="space-y-0.5 px-1">
					<button @click="selectProject(null)" :class="['w-full flex items-center gap-3 rounded-xl transition-all text-sm group px-3 py-2', conversationStore.selectedGroupId === null ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-black/50 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/5', uiStore.sidebarCollapsed ? 'justify-center' : '']">
						<div class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center grayscale opacity-50 transition-all overflow-hidden shrink-0">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
							</svg>
						</div>
						<span v-show="!uiStore.sidebarCollapsed" class="font-bold tracking-tight truncate">Direct chat</span>
					</button>

					<button @click="openCreateProjectModal" :class="['w-full flex items-center gap-3 rounded-xl transition-all text-sm group px-3 py-2 text-black/40 dark:text-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white', uiStore.sidebarCollapsed ? 'justify-center' : '']">
						<div class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center opacity-40 shrink-0">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
						</div>
						<span v-show="!uiStore.sidebarCollapsed" class="font-bold tracking-tight truncate">New project</span>
					</button>

					<div v-for="project in projectStore.projects" :key="project.id" @click="selectProject(project.id)" :class="['flex items-center gap-3 rounded-xl transition-all text-sm group px-3 py-2 cursor-pointer', conversationStore.selectedGroupId === project.id ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-black/50 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white', uiStore.sidebarCollapsed ? 'justify-center' : '']">
						<div class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center grayscale opacity-50 shrink-0 transition-transform group-hover:scale-105">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
							</svg>
						</div>
						<span v-show="!uiStore.sidebarCollapsed" class="font-bold tracking-tight truncate flex-1">{{ project.name }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Scrollable History Section -->
		<div class="flex-1 overflow-y-auto px-3">
			<div class="mt-4 pb-4">
				<div v-show="!uiStore.sidebarCollapsed" class="px-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 dark:text-white/20 mb-3">Your chat</div>
				<div class="space-y-0.5 px-1">
					<div v-if="conversationStore.conversations.length === 0 && !uiStore.sidebarCollapsed" class="px-3 py-4 text-xs font-bold text-black/20 dark:text-white/10">No history</div>
					<div
						v-for="conversation in conversationStore.conversations"
						:key="conversation.id"
						:class="['flex items-center rounded-xl cursor-pointer transition-colors text-sm group', uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2 gap-3', conversationStore.currentConversationId === conversation.id ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-black/50 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white']"
						@click="handleSelectConversation(conversation.id)">
						<svg class="w-4 h-4 flex-shrink-0 opacity-20 group-hover:opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
						</svg>

						<!-- Title / Edit Input -->
						<template v-if="!uiStore.sidebarCollapsed">
							<input v-if="editingId === conversation.id" v-model="editingTitle" @blur="saveTitle(conversation.id)" @keyup.enter="saveTitle(conversation.id)" @keyup.esc="cancelEditing" @click.stop ref="editInput" class="flex-1 min-w-0 bg-white dark:bg-[#2a2a2a] text-sm border-none focus:ring-1 focus:ring-black rounded px-1 -ml-1 outline-none font-bold" />
							<span v-else class="flex-1 truncate font-bold tracking-tight">{{ conversation.title }}</span>
						</template>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Links -->
		<div class="mt-auto p-3 border-t border-gray-200 dark:border-[#1a1a1a] space-y-1">
			<a href="#" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span v-show="!uiStore.sidebarCollapsed">Help & FAQ</span>
			</a>

			<!-- Theme Toggle -->
			<button @click="toggleTheme" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors w-full">
				<svg v-if="uiStore.currentTheme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
				<svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
				</svg>
				<ClientOnly>
					<span v-show="!uiStore.sidebarCollapsed">
						{{ uiStore.themeMode === 'system' ? 'System' : uiStore.currentTheme === 'dark' ? 'Dark' : 'Light' }}
					</span>
				</ClientOnly>
			</button>

			<div v-if="!userStore.token" class="pt-2 mt-2 border-t border-gray-200 dark:border-[#1a1a1a] flex flex-col gap-1">
				<button @click="uiStore.openLoginModal()" class="flex items-center gap-3 px-3 py-2 text-sm text-indigo-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors text-left w-full">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
					</svg>
					<span v-show="!uiStore.sidebarCollapsed">Log in</span>
				</button>
				<button @click="uiStore.openLoginModal()" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors text-left w-full">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
					</svg>
					<span v-show="!uiStore.sidebarCollapsed">Sign up</span>
				</button>
			</div>
			<div v-else class="pt-2 mt-2 border-t border-gray-200 dark:border-[#1a1a1a] flex flex-col gap-1">
				<div class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
					<div class="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
						{{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
					</div>
					<span v-show="!uiStore.sidebarCollapsed" class="truncate max-w-[120px]">{{ userStore.userInfo?.nickname || 'User' }}</span>
				</div>
				<button @click="userStore.logout()" class="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors text-left w-full">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					<span v-show="!uiStore.sidebarCollapsed">Log out</span>
				</button>
			</div>
		</div>

		<!-- Project Creation Modal -->
		<ProjectModal :show="showCreateProjectModal" :editing-project="editingProject" @close="handleCloseProjectModal" @success="handleProjectSuccess" />

		<!-- Group Delete Confirmation -->
		<ConfirmDialog :show="showDeleteConfirm" title="删除项目" :message="'确定要删除项目 ' + (projectToDelete?.name || '') + ' 吗？此操作不可撤销，项目内的对话将被取消关联。'" @confirm="handleDeleteProject" @cancel="showDeleteConfirm = false" />
	</aside>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
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
const showDeleteConfirm = ref(false)
const projectToDelete = ref<any>(null)

// Renaming State
const editingId = ref<number | string | null>(null)
const editingTitle = ref('')
const editInput = ref<HTMLInputElement | null>(null)

const startEditing = (conversation: any) => {
	editingId.value = conversation.id
	editingTitle.value = conversation.title
	nextTick(() => {
		// In Vue 3, refs inside v-for are arrays
		const input = Array.isArray(editInput.value) ? editInput.value[0] : editInput.value
		input?.focus()
		input?.select()
	})
}

const cancelEditing = () => {
	editingId.value = null
	editingTitle.value = ''
}

const saveTitle = async (id: number | string) => {
	if (!editingTitle.value.trim() || editingTitle.value === conversations.value.find((c) => c.id === id)?.title) {
		cancelEditing()
		return
	}

	await conversationStore.updateTitle(id, editingTitle.value.trim())
	cancelEditing()
}

const conversations = computed(() => conversationStore.conversations)

const toggleProjects = () => {
	projectsCollapsed.value = !projectsCollapsed.value
}

const openCreateProjectModal = () => {
	editingProject.value = null
	showCreateProjectModal.value = true
}

const openEditProjectModal = (project: any) => {
	editingProject.value = project
	showCreateProjectModal.value = true
}

const handleCloseProjectModal = () => {
	showCreateProjectModal.value = false
	editingProject.value = null
}

const handleProjectSuccess = () => {
	projectsCollapsed.value = false
}

const confirmDeleteProject = (project: any) => {
	projectToDelete.value = project
	showDeleteConfirm.value = true
}

const handleDeleteProject = async () => {
	if (!projectToDelete.value) return

	try {
		await projectStore.deleteProject(projectToDelete.value.id)
		// If the deleted project was selected, clear the filter
		if (conversationStore.selectedGroupId === projectToDelete.value.id) {
			conversationStore.setSelectedGroupId(null)
		}

		showDeleteConfirm.value = false
		projectToDelete.value = null
	} catch (e) {
		console.error('Delete project failed:', e)
	}
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
		uiStore.closeMobileMenu()
	} catch (e) {
		console.error('Failed to create chat:', e)
	}
}

const handleSelectConversation = (id: number | string) => {
	conversationStore.switchConversation(id)
	router.push(`/chat/${id}`)
	uiStore.closeMobileMenu()
}

const handleDeleteConversation = async (id: number | string) => {
	if (confirm('确定要删除这个对话吗？')) {
		await conversationStore.deleteConversation(id)
		if (conversationStore.conversations.length > 0) {
			const firstConversation = conversationStore.conversations[0]
			if (firstConversation) {
				router.push(`/chat/${firstConversation.id}`)
			} else {
				router.push('/')
			}
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
</script>

<style scoped lang="scss">
.overflow-y-auto {
	scrollbar-width: thin;
	scrollbar-color: rgba(156, 163, 175, 0.3) transparent;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.3);
		border-radius: 3px;

		&:hover {
			background-color: rgba(156, 163, 175, 0.5);
		}
	}
}
</style>
