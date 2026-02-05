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
												<X :size="20" :stroke-width="2.5" />
											</button>
										</div>
										<button @click="handleNewChat" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--Button-primary-black)] hover:opacity-90 text-[var(--text-onblack)] rounded-[14px] transition-all font-bold text-sm shadow-[var(--shadow-S)]">
											<Plus :size="16" />
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
														<Home :size="18" class="text-[var(--icon-primary)]" />
													</div>
													<span class="font-bold tracking-tight">Home</span>
												</NuxtLink>
												<NuxtLink to="/chat" :class="['flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-sm group', $route.path === '/chat' ? 'bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] shadow-[var(--shadow-XS)] ring-1 ring-[var(--border-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] font-bold']" @click="uiStore.closeMobileMenu">
													<div class="w-8 h-8 rounded-full bg-[var(--background-white-main)] flex items-center justify-center border border-[var(--border-main)] shadow-[var(--shadow-XS)]">
														<MessageCircle :size="18" class="text-[var(--icon-primary)]" />
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
												<ChevronDown :size="12" :stroke-width="2.5" :class="['transition-transform duration-200', !projectsCollapsed ? 'rotate-180' : '']" />
											</button>

											<div v-show="!projectsCollapsed" class="space-y-1">
												<button @click="selectProject(null)" :class="['w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all text-sm group', conversationStore.selectedGroupId === null ? 'bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] shadow-[var(--shadow-XS)] ring-1 ring-[var(--border-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] font-bold']">
													<div class="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-main)] bg-[var(--background-white-main)]">
														<AlignJustify :size="16" :stroke-width="2.5" />
													</div>
													<span class="font-bold tracking-tight">Direct chat</span>
												</button>

												<div v-for="project in projectStore.projects" :key="project.id" @click="selectProject(project.id)" :class="['flex items-center gap-3 px-3 py-2 rounded-2xl transition-all text-sm cursor-pointer font-bold', conversationStore.selectedGroupId === project.id ? 'bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] shadow-[var(--shadow-XS)] ring-1 ring-[var(--border-main)]' : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)]']">
													<div class="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-main)] bg-blue-500/10 text-blue-500" :class="project.color">
														<Folder :size="16" :stroke-width="2.5" />
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
													<MessageSquare :size="16" class="flex-shrink-0 opacity-40" />
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
												<Sun v-if="uiStore.currentTheme === 'dark'" :size="20" class="text-[var(--icon-secondary)]" />
												<Moon v-else :size="20" class="text-[var(--icon-secondary)]" />
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
												<LogOut :size="20" />
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
import {
	X,
	Plus,
	Home,
	MessageCircle,
	ChevronDown,
	AlignJustify,
	Folder,
	MessageSquare,
	Sun,
	Moon,
	LogOut,
} from 'lucide-vue-next'
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
