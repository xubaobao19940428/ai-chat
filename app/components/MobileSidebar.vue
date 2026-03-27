<template>
	<TransitionRoot :show="uiStore.mobileMenuOpen" as="template">
		<Dialog as="div" class="relative z-50 lg:hidden" @close="uiStore.closeMobileMenu">
			<TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
				enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/50 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-hidden">
				<div class="absolute inset-0 overflow-hidden">
					<div class="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
						<TransitionChild as="template" enter="transform transition ease-in-out duration-300"
							enter-from="-translate-x-full" enter-to="translate-x-0"
							leave="transform transition ease-in-out duration-300" leave-from="translate-x-0"
							leave-to="-translate-x-full">
							<DialogPanel class="pointer-events-auto w-screen max-w-[280px]">
								<div
									class="flex h-full flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] overflow-hidden">

									<!-- Header -->
									<div class="flex items-center justify-between h-[56px] px-[12px] shrink-0">
										<div class="flex items-center gap-1 ps-[8px]">
											<div class="flex items-center size-8 justify-center shrink-0">
												<img src="/favicon.svg" class="size-6 pointer-events-none"
													alt="MixU Logo" />
											</div>
											<span
												class="text-lg font-bold text-[var(--text-primary)] tracking-tight ml-1">MixU</span>
										</div>
										<div @click="uiStore.closeMobileMenu"
											class="flex items-center justify-center rounded-md hover:bg-[var(--bg-hover)] cursor-pointer size-[32px] shrink-0 transition-colors">
											<X class="text-[var(--text-secondary)] size-[18px]" />
										</div>
									</div>

									<!-- Scrollable Area -->
									<div
										class="flex flex-col flex-1 min-h-0 overflow-x-hidden overflow-y-auto p-[8px] pb-0 gap-px">
										<!-- New Chat -->
										<div @click="handleNewChat"
											class="flex items-center rounded-[10px] cursor-pointer transition-colors w-full h-[40px] shrink-0 hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px] gap-[12px]">
											<div
												class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
												<SquarePen :size="18" />
											</div>
											<span class="text-[14px] font-medium text-[var(--text-primary)]">{{
												$t('search.new_task') }}</span>
										</div>

										<!-- Nav items (no shortcuts on mobile) -->
										<div v-for="item in navItems" :key="item.id" @click="item.handler"
											class="flex items-center rounded-[10px] cursor-pointer transition-colors w-full h-[40px] shrink-0 hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px] gap-[12px]">
											<div
												class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
												<component :is="item.icon" :size="18" />
											</div>
											<span
												class="flex-1 text-[14px] font-medium text-[var(--text-primary)] truncate">{{
													item.label }}</span>
										</div>

										<!-- More Tools -->
										<div class="flex flex-col pb-0 gap-px mt-1 shrink-0">
											<div @click="toggleMoreTools"
												class="group flex items-center justify-between rounded-[10px] h-[36px] cursor-pointer hover:bg-[var(--bg-hover)] transition-colors ps-[10px] pe-[2px]">
												<span
													class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium uppercase tracking-tight">{{
														$t('common.more_tools') }}</span>
												<ChevronUp :size="14"
													:class="['transition-all shrink-0 text-[var(--text-tertiary)] me-1', moreCollapsed ? 'rotate-180' : '']" />
											</div>
											<div v-show="!moreCollapsed" class="flex flex-col gap-px">
												<div v-for="item in moreNavItems" :key="item.id" @click="item.handler"
													class="flex items-center rounded-[10px] cursor-pointer transition-colors w-full h-[40px] hover:bg-[var(--bg-hover)] ps-[9px] pe-[2px] gap-[12px]">
													<div
														class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-primary)]">
														<component :is="item.icon" :size="18" />
													</div>
													<span
														class="text-[14px] font-medium text-[var(--text-primary)] truncate">{{
															item.label }}</span>
												</div>
											</div>
										</div>

										<!-- Divider -->
										<div class="border-t border-[var(--border-light)] opacity-50 my-2 shrink-0">
										</div>

										<!-- Projects -->
										<div
											class="group flex items-center justify-between rounded-[10px] mb-1 h-[36px] shrink-0 hover:bg-[var(--bg-hover)] transition-colors ps-[10px] pe-[2px] py-[2px]">
											<div @click="toggleProjects"
												class="flex-1 flex items-center gap-1 cursor-pointer h-full">
												<span
													class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium uppercase tracking-tight">{{
														$t('common.projects') }}</span>
												<ChevronUp :size="14"
													:class="['transition-all shrink-0 text-[var(--text-tertiary)]', projectsCollapsed ? 'rotate-180' : '']" />
											</div>
											<div @click.stop="openCreateProjectModal"
												class="flex items-center justify-center size-[32px] rounded-[8px] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors">
												<Plus :size="16" class="text-[var(--text-tertiary)]" />
											</div>
										</div>

										<div v-show="!projectsCollapsed" class="flex flex-col gap-px mb-3 shrink-0">
											<div @click="selectProject(null)"
												:class="['w-full flex items-center rounded-[10px] h-[40px] transition-colors cursor-pointer ps-[10px] pe-[8px] gap-[8px]', conversationStore.selectedGroupId === null || conversationStore.selectedGroupId === 0 ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
												<div
													class="shrink-0 size-[18px] flex items-center justify-center text-[var(--text-secondary)] opacity-80">
													<AlignJustify :size="16" />
												</div>
												<span
													class="text-[14px] text-[var(--text-primary)] font-medium truncate">{{
														$t('common.all_sessions') }}</span>
											</div>
											<div v-for="group in projectStore.projects" :key="group.id"
												@click="selectProject(group.id)"
												:class="['w-full flex items-center rounded-[10px] h-[40px] transition-colors cursor-pointer ps-[10px] pe-[8px] gap-[8px]', conversationStore.selectedGroupId == group.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
												<div class="shrink-0 size-[18px] flex items-center justify-center opacity-80"
													:style="{ color: getProjectColor(group.color) }">
													<component :is="getProjectIcon(group.icon)" :size="16" />
												</div>
												<span
													class="text-[14px] text-[var(--text-primary)] font-medium truncate">{{
														group.name }}</span>
											</div>
										</div>

										<!-- Recent Chat -->
										<div @click="mobileRecentCollapsed = !mobileRecentCollapsed"
											class="group flex items-center h-[36px] shrink-0 ps-[10px] mb-1 rounded-[10px] clickable hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
											<div class="flex items-center flex-1 min-w-0 gap-0.5">
												<span
													class="text-[12px] leading-[18px] text-[var(--text-tertiary)] font-medium uppercase tracking-tight">{{
														$t('common.recent_chat') }}</span>
												<ChevronUp :size="14"
													:class="['transition-all shrink-0 group-hover:opacity-100 text-[var(--text-tertiary)]', mobileRecentCollapsed ? 'rotate-180' : '']" />
											</div>
										</div>
										<div v-show="!mobileRecentCollapsed" class="flex flex-col gap-px">
											<!-- Loading skeleton -->
											<template
												v-if="conversationStore.isGroupSwitching || (conversationStore.isLoading && conversationStore.conversations.length === 0)">
												<div v-for="i in 5" :key="i"
													class="h-[40px] rounded-[10px] bg-[var(--bg-hover)] animate-pulse mx-1">
												</div>
											</template>
											<template v-else-if="sortedConversations.length === 0">
												<div class="flex flex-col items-center justify-center py-6 gap-2">
													<MessageSquare :size="20"
														class="text-[var(--text-tertiary)] opacity-40" />
													<p
														class="text-[12px] text-[var(--text-tertiary)] text-center leading-relaxed">
														{{ $t('chat.no_history') }}<br />{{ $t('chat.start_new_chat') }}
													</p>
												</div>
											</template>
											<template v-else>
												<div v-for="conversation in sortedConversations" :key="conversation.id"
													@click="handleSelectConversation(conversation.id)"
													:class="['flex items-center rounded-[10px] cursor-pointer transition-colors w-full h-[40px] ps-[9px] pe-[2px] gap-[12px]', conversationStore.currentConversationId == conversation.id ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]']">
													<div
														class="shrink-0 size-[18px] flex items-center justify-center overflow-hidden">
														<img v-if="getConversationAvatar(conversation)"
															:src="getConversationAvatar(conversation)"
															class="size-full object-cover rounded-[4px]" />
														<template v-else>
															<div v-if="conversation.characterId && conversation.characterId > 1"
																class="size-full flex items-center justify-center rounded-[4px]">
																<Sparkles :size="15"
																	class="text-[var(--text-primary)] opacity-60" />
															</div>
															<Image
																v-else-if="conversation.capability === 'image' || conversation.capability === 'image_generation'"
																:size="15"
																class="text-[var(--text-primary)] opacity-60" />
															<Play
																v-else-if="conversation.capability === 'video' || conversation.capability === 'video_generation'"
																:size="15" fill="currentColor"
																class="text-[var(--text-primary)] opacity-60" />
															<MessageSquare v-else :size="16"
																class="text-[var(--text-primary)] opacity-60" />
														</template>
													</div>
													<span
														class="flex-1 text-[14px] text-[var(--text-primary)] font-medium truncate">{{
															conversation.title ||
															$t('chat.new_conversation_default') }}</span>
												</div>
											</template>
										</div>
									</div>

									<!-- Bottom -->
									<div
										class="flex items-center justify-between p-[8px] border-t border-[var(--border-light)] shrink-0">
										<div class="flex items-center gap-[4px]">
											<div @click="uiStore.openSettingsModal()"
												class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 transition-colors">
												<Settings2 :size="18" class="text-[var(--icon-primary)]" />
											</div>
											<div @click="toggleTheme"
												class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 transition-colors">
												<Sun v-if="uiStore.currentTheme === 'dark'" :size="18"
													class="text-[var(--icon-primary)]" />
												<Moon v-else :size="18" class="text-[var(--icon-primary)]" />
											</div>
										</div>

										<!-- User -->
										<div v-if="userStore.token" class="flex items-center gap-2">
											<div class="flex items-center gap-2 cursor-pointer"
												@click="uiStore.openSettingsModal()">
												<div
													class="w-7 h-7 rounded-full bg-[var(--Button-primary-black)] text-[var(--text-onblack)] flex items-center justify-center text-xs font-bold shrink-0">
													{{ userStore.userInfo?.nickname?.charAt(0)?.toUpperCase() || 'U' }}
												</div>
												<span
													class="text-[13px] font-medium text-[var(--text-primary)] max-w-[100px] truncate">{{
														userStore.userInfo?.nickname || 'User' }}</span>
											</div>
											<div @click="userStore.logout()"
												class="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-8 transition-colors">
												<LogOut :size="16" class="text-[var(--icon-secondary)]" />
											</div>
										</div>
										<button v-else @click="uiStore.openLoginModal()"
											class="px-3 py-1.5 bg-[var(--Button-primary-black)] hover:opacity-90 text-[var(--text-onblack)] rounded-[8px] text-sm font-medium transition-opacity">
											{{ $t('common.sign_in') }}
										</button>
									</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>

	<ProjectModal :show="showCreateProjectModal" @close="showCreateProjectModal = false" />
</template>

<script setup lang="ts">
import { ref, markRaw, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { X, SquarePen, Search, Library, AlignJustify, Folder, MessageSquare, Settings2, Sun, Moon, LogOut, Bot, Compass, BookOpen, Image, Video, ChevronUp, Plus, DollarSign, Book, GraduationCap, Pencil, PenTool, Code, Terminal, Music, Coffee, Paintbrush, Palette, Stethoscope, Asterisk, Flower, Briefcase, BarChart, CircleDot, Dumbbell, Notebook, Scale, Globe, Plane, Earth, Wrench, PawPrint, FlaskConical, Brain, Heart, Sprout, Sparkles, Play } from 'lucide-vue-next'
import { useConversationStore } from '../stores/conversation'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'
import { useProjectStore } from '../stores/projects'
import { useDiscoveryStore } from '../stores/discovery'
import ProjectModal from './ProjectModal.vue'
import { encodeId } from '../utils/sqids'

const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()
const userStore = useUserStore()
const projectStore = useProjectStore()
const discoveryStore = useDiscoveryStore()

const projectsCollapsed = ref(false)
const moreCollapsed = ref(false)
const mobileRecentCollapsed = ref(false)
const showCreateProjectModal = ref(false)

const sortedConversations = computed(() =>
	[...conversationStore.conversations].sort((a, b) =>
		new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
	)
)

const projectIconMap: Record<string, any> = {
	Folder, DollarSign, Book, GraduationCap, Pencil, PenTool,
	Code, Terminal, Music, Coffee, Paintbrush, Palette,
	Stethoscope, Asterisk, Flower, Briefcase, BarChart, CircleDot,
	Dumbbell, Notebook, Scale, Globe, Plane, Earth,
	Wrench, PawPrint, FlaskConical, Brain, Heart, Sprout,
}

const colorPresets = [
	{ name: 'black', hex: 'var(--text-secondary)' },
	{ name: 'red', hex: '#EF4444' },
	{ name: 'orange', hex: '#F97316' },
	{ name: 'yellow', hex: '#EAB308' },
	{ name: 'green', hex: '#22C55E' },
	{ name: 'blue', hex: '#3B82F6' },
	{ name: 'purple', hex: '#A855F7' },
	{ name: 'pink', hex: '#EC4899' },
]

const getProjectColor = (colorName?: string) => {
	const c = colorPresets.find(c => c.name === colorName)
	return c ? c.hex : 'var(--text-secondary)'
}

const getProjectIcon = (iconName?: string) => {
	return projectIconMap[iconName || 'Folder'] || Folder
}

onMounted(() => {
	if (discoveryStore.allItems.length === 0) {
		discoveryStore.fetchDiscovery('tag')
	}
})

const navItems = [
	{ id: 'search', label: 'Search', icon: markRaw(Search), shortcut: '⌘ K', handler: () => { uiStore.openSearchModal(); uiStore.closeMobileMenu() } },
	{ id: 'library', label: 'Library', icon: markRaw(Library), handler: () => { uiStore.closeMobileMenu() } },
]

const moreNavItems = [
	{ id: 'ai-bots', label: 'AI bots', icon: markRaw(Compass), handler: () => { router.push('/explore'); uiStore.closeMobileMenu() } },
	{ id: 'ai-reading', label: 'AI Reading', icon: markRaw(BookOpen), handler: () => { router.push('/ai-search'); uiStore.closeMobileMenu() } },
	{ id: 'ai-image', label: 'AI Image Generator', icon: markRaw(Image), handler: () => { router.push('/image-generation'); uiStore.closeMobileMenu() } },
	{ id: 'ai-video', label: 'AI Video Generator', icon: markRaw(Video), handler: () => { router.push('/video-generation'); uiStore.closeMobileMenu() } },
]

const toggleProjects = () => {
	projectsCollapsed.value = !projectsCollapsed.value
}

const openCreateProjectModal = () => {
	showCreateProjectModal.value = true
}

const toggleMoreTools = () => {
	moreCollapsed.value = !moreCollapsed.value
}

const selectProject = (id: number | null) => {
	conversationStore.setSelectedGroupId(id)
	uiStore.closeMobileMenu()
}

const handleNewChat = () => {
	router.push('/chat')
	uiStore.closeMobileMenu()
}

const handleSelectConversation = (id: number | string) => {
	const conversation = conversationStore.conversations.find(c => String(c.id) === String(id))
	if (conversation?.characterId && conversation.characterId > 1) {
		router.push(`/character/${encodeId(conversation.characterId)}?conv=${encodeId(id)}`)
	} else {
		router.push(`/chat/${encodeId(id)}`)
	}
	uiStore.closeMobileMenu()
}

const getConversationAvatar = (conversation: any) => {
	if (!conversation.characterId || conversation.characterId <= 1) return undefined
	const bot = discoveryStore.allItems.find(b => Number(b.related_id || b.id) === Number(conversation.characterId))
	return bot?.cover || undefined
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
