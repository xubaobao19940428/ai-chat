<template>
	<TransitionRoot :show="uiStore.mobileMenuOpen" as="template">
		<Dialog as="div" class="relative z-50 lg:hidden" @close="uiStore.closeMobileMenu">
			<TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/80 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-hidden">
				<div class="absolute inset-0 overflow-hidden">
					<div class="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
						<TransitionChild as="template" enter="transform transition ease-in-out duration-300" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-300" leave-from="translate-x-0" leave-to="-translate-x-full">
							<DialogPanel class="pointer-events-auto w-screen max-w-[280px]">
								<div class="flex h-full flex-col overflow-y-auto bg-[var(--background-white-main)] shadow-[var(--shadow-XL)] border-r border-[var(--border-main)] transition-colors">
									<!-- Header -->
									<div class="p-4 border-b border-[var(--border-main)]">
										<div class="flex items-center justify-between mb-4 px-1">
											<div class="flex items-center gap-1.5 h-8">
												<div class="flex items-center size-8 justify-center shrink-0">
													<img src="/favicon.svg" class="size-6 pointer-events-none" alt="Aura Logo" />
												</div>
												<span class="text-lg font-bold text-[var(--logo-color)] tracking-tight">aura</span>
											</div>
											<button @click="uiStore.closeMobileMenu" class="p-2 hover:bg-[var(--fill-tsp-white-main)] rounded-xl transition-colors text-[var(--icon-disable)]">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
												</svg>
											</button>
										</div>
										<button @click="handleNewChat" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--Button-primary-black)] hover:opacity-90 text-[var(--text-onblack)] rounded-[14px] transition-all font-bold text-sm shadow-[var(--shadow-S)]">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
											</svg>
											<span>New task</span>
										</button>
									</div>

									<!-- Menu List -->
									<div class="flex-1 overflow-y-auto py-4">
										<!-- Tools -->
										<div class="px-4 mb-6">
											<div class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-3 px-3 flex items-center gap-2">
												<span>Tools</span>
											</div>
											<div class="space-y-1">
												<NuxtLink to="/" :class="['flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-sm group', $route.path === '/' ? 'bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] shadow-[var(--shadow-XS)] ring-1 ring-[var(--border-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] font-bold']" @click="uiStore.closeMobileMenu">
													<div class="w-8 h-8 rounded-full bg-[var(--background-white-main)] flex items-center justify-center border border-[var(--border-main)] shadow-[var(--shadow-XS)]">
														<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--icon-primary)]">
															<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
															<polyline points="9 22 9 12 15 12 15 22"></polyline>
														</svg>
													</div>
													<span class="font-bold tracking-tight">Home</span>
												</NuxtLink>
												<NuxtLink to="/chat" :class="['flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-sm group', $route.path === '/chat' ? 'bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] shadow-[var(--shadow-XS)] ring-1 ring-[var(--border-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] font-bold']" @click="uiStore.closeMobileMenu">
													<div class="w-8 h-8 rounded-full bg-[var(--background-white-main)] flex items-center justify-center border border-[var(--border-main)] shadow-[var(--shadow-XS)]">
														<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--icon-primary)]">
															<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
														</svg>
													</div>
													<span class="font-bold tracking-tight">AI Chat</span>
												</NuxtLink>
											</div>
										</div>

										<!-- Projects -->
										<div class="px-4 mb-6">
											<button @click="toggleProjects" class="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-3 px-3 flex items-center justify-between group">
												<div class="flex items-center gap-2">
													<span>Projects</span>
												</div>
												<svg class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': !projectsCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
												</svg>
											</button>

											<div v-show="!projectsCollapsed" class="space-y-1">
												<button @click="selectProject(null)" :class="['w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all text-sm group', conversationStore.selectedGroupId === null ? 'bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] shadow-[var(--shadow-XS)] ring-1 ring-[var(--border-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] font-bold']">
													<div class="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-main)] bg-[var(--background-white-main)]">
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h7" />
														</svg>
													</div>
													<span class="font-bold tracking-tight">Direct chat</span>
												</button>

												<div v-for="project in projectStore.projects" :key="project.id" @click="selectProject(project.id)" :class="['flex items-center gap-3 px-3 py-2 rounded-2xl transition-all text-sm cursor-pointer font-bold', conversationStore.selectedGroupId === project.id ? 'bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] shadow-[var(--shadow-XS)] ring-1 ring-[var(--border-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)]']">
													<div class="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-main)] bg-blue-500/10 text-blue-500" :class="project.color">
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
														</svg>
													</div>
													<span class="truncate">{{ project.name }}</span>
												</div>
											</div>
										</div>

										<!-- History -->
										<div class="px-4 mb-6">
											<div class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-3 px-3">
												<span>Recent Chat</span>
											</div>
											<div class="space-y-1">
												<div
													v-for="conversation in conversationStore.conversations.slice(0, 10)"
													:key="conversation.id"
													@click="handleSelectConversation(conversation.id)"
													:class="['flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-sm font-bold', conversationStore.currentConversationId === conversation.id ? 'bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] shadow-[var(--shadow-XS)] ring-1 ring-[var(--border-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)]']">
													<svg class="w-4 h-4 flex-shrink-0 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
													</svg>
													<span class="flex-1 truncate">{{ conversation.title || 'New conversation' }}</span>
												</div>
											</div>
										</div>
									</div>

									<!-- Bottom Section -->
									<div class="p-4 border-t border-[var(--border-main)] space-y-2">
										<!-- Appearance Toggle -->
										<button @click="toggleTheme" class="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-[var(--background-white-main)] text-sm text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] transition-all shadow-[var(--shadow-XS)] border border-[var(--border-main)]">
											<div class="flex items-center gap-3">
												<svg v-if="uiStore.currentTheme === 'dark'" class="w-5 h-5 text-[var(--icon-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
												</svg>
												<svg v-else class="w-5 h-5 text-[var(--icon-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
												</svg>
												<span class="font-bold tracking-tight">Appearance</span>
											</div>
											<span class="text-[10px] font-black uppercase tracking-widest text-[var(--text-disable)]">{{ uiStore.themeMode }}</span>
										</button>

										<!-- User Info -->
										<div v-if="userStore.token" class="flex items-center gap-3 px-3 py-3 rounded-2xl bg-[var(--background-white-main)] border border-[var(--border-main)] shadow-[var(--shadow-XS)]">
											<div class="w-10 h-10 bg-[var(--Button-primary-black)] text-white rounded-full flex items-center justify-center text-base font-black">
												{{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
											</div>
											<div class="flex-1 min-w-0">
												<div class="text-sm font-black text-[var(--text-primary)] truncate tracking-tight">{{ userStore.userInfo?.nickname || 'User' }}</div>
												<div class="text-[10px] text-[var(--text-disable)] truncate font-bold uppercase tracking-tighter">{{ userStore.userInfo?.email }}</div>
											</div>
											<button @click="userStore.logout()" class="p-2 text-[var(--icon-disable)] hover:text-[var(--function-error)] transition-colors">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
												</svg>
											</button>
										</div>
										<button v-else @click="uiStore.openLoginModal()" class="w-full py-3 bg-[var(--Button-primary-black)] hover:opacity-90 text-[var(--text-onblack)] rounded-2xl font-black text-sm transition-all shadow-[var(--shadow-S)]">Log in</button>
									</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>

	<!-- Modals -->
	<ProjectModal :show="showCreateProjectModal" @close="showCreateProjectModal = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversation'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'
import { useProjectStore } from '../stores/projects'
import ProjectModal from './ProjectModal.vue'

const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()
const userStore = useUserStore()
const projectStore = useProjectStore()

const projectsCollapsed = ref(false)
const showCreateProjectModal = ref(false)

const toggleProjects = () => {
	projectsCollapsed.value = !projectsCollapsed.value
}

const openCreateProjectModal = () => {
	showCreateProjectModal.value = true
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
