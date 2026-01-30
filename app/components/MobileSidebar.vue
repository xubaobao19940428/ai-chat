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
												<svg viewBox="0 0 35 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-6 text-[var(--logo-color)]">
													<path
														d="M12.1055 21.3699C12.1055 21.9859 12.1201 22.4699 12.1495 22.8219C12.1788 23.1739 12.2595 23.4452 12.3915 23.6359C12.5235 23.8119 12.7141 23.9292 12.9635 23.9879C13.2128 24.0465 13.5575 24.0905 13.9975 24.1199V24.9999H7.04549V24.1199C7.48549 24.0905 7.83749 24.0465 8.10149 23.9879C8.36549 23.9292 8.56349 23.8119 8.69549 23.6359C8.82749 23.4599 8.91549 23.2105 8.95949 22.8879C9.00349 22.5505 9.02549 22.1032 9.02549 21.5459V18.8179C9.02549 17.9819 9.01079 17.2852 8.98149 16.7279C8.96679 16.1705 8.93009 15.7892 8.87149 15.5839C8.82749 15.3932 8.76879 15.2465 8.69549 15.1439C8.63679 15.0265 8.53409 14.9385 8.38749 14.8799C8.25549 14.8065 8.07949 14.7625 7.85949 14.7479C7.63949 14.7185 7.35349 14.7039 7.00149 14.7039V13.9559L11.2475 13.1199L11.5115 15.0339H11.6435C12.2595 14.3445 12.8755 13.8532 13.4915 13.5599C14.1221 13.2665 14.8481 13.1199 15.6695 13.1199C16.6375 13.1199 17.4368 13.2885 18.0675 13.6259C18.6981 13.9632 19.1748 14.4472 19.4975 15.0779H19.5855C20.1135 14.4619 20.7441 13.9852 21.4775 13.6479C22.2108 13.2959 22.9955 13.1199 23.8315 13.1199C24.7115 13.1199 25.4741 13.2299 26.1195 13.4499C26.7795 13.6699 27.2928 13.9852 27.6595 14.3959C27.9528 14.7332 28.1655 15.1732 28.2975 15.7159C28.4441 16.2585 28.5175 17.0139 28.5175 17.9819V21.3699C28.5175 21.9712 28.5321 22.4479 28.5615 22.7999C28.6055 23.1519 28.6935 23.4232 28.8255 23.6139C28.9575 23.8045 29.1481 23.9292 29.3975 23.9879C29.6468 24.0465 29.9915 24.0905 30.4315 24.1199V24.9999H23.4795V24.1199C23.9195 24.1052 24.2641 24.0685 24.5135 24.0099C24.7775 23.9365 24.9755 23.8119 25.1075 23.6359C25.2541 23.4452 25.3421 23.1885 25.3715 22.8659C25.4155 22.5432 25.4375 22.1032 25.4375 21.5459V18.6639C25.4375 17.9012 25.3935 17.2559 25.3055 16.7279C25.2175 16.1999 25.0781 15.7745 24.8875 15.4519C24.6968 15.1292 24.4401 14.9019 24.1175 14.7699C23.8095 14.6232 23.4281 14.5499 22.9735 14.5499C22.4601 14.5499 22.0348 14.6745 21.6975 14.9239C21.3748 15.1732 21.1035 15.4959 20.8835 15.8919C20.5021 16.5812 20.3115 17.4392 20.3115 18.4659V21.3699C20.3115 21.9712 20.3261 22.4479 20.3555 22.7999C20.3848 23.1519 20.4655 23.4232 20.5975 23.6139C20.7295 23.8045 20.9201 23.9292 21.1695 23.9879C21.4335 24.0465 21.7928 24.0905 22.2475 24.1199V24.9999H15.2735V24.1199C15.7135 24.0905 16.0581 24.0465 16.3075 23.9879C16.5715 23.9292 16.7695 23.8119 16.9015 23.6359C17.0481 23.4599 17.1361 23.2105 17.1655 22.8879C17.2095 22.5505 17.2315 22.1032 17.2315 21.5459V18.6639C17.2315 17.9012 17.1875 17.2559 17.0995 16.7279C17.0115 16.1999 16.8648 15.7745 16.6595 15.4519C16.4688 15.1292 16.2121 14.9019 15.8895 14.7699C15.5668 14.6232 15.1635 14.5499 14.6795 14.5499C14.1955 14.5499 13.7921 14.6672 13.4695 14.9019C13.1615 15.1365 12.9048 15.4519 12.6995 15.8479C12.5088 16.1999 12.3621 16.6032 12.2595 17.0579C12.1568 17.5125 12.1055 17.9819 12.1055 18.4659V21.3699Z"
														fill="currentColor" />
												</svg>
												<span class="text-lg font-bold text-[var(--logo-color)] tracking-tight">manus</span>
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
