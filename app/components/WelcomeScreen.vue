<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] relative overflow-hidden">
		<!-- Main Content Centered -->
		<div class="flex-1 flex flex-col items-center px-4 pt-[18vh]">
			<div id="chat-home-view-container" class="w-full max-w-full sm:max-w-[768px] sm:min-w-[390px] mx-auto">
				<div class="relative w-full flex flex-col items-center gap-[40px]">
					<!-- Title using conditional text -->
					<h1 class="text-[var(--text-primary)] text-center w-full font-serif text-[36px] mb-[34px] tracking-tight animate-fade-in-up" style="animation-delay: 0.2s; animation-fill-mode: forwards">
						<span v-if="activeTool && activeTool !== 'website'" class="opacity-0">What can I do for you?</span>
						<span v-else>What can I do for you?</span>
					</h1>
				</div>

				<!-- Input Card Area -->
				<div class="flex flex-col gap-1 w-full animate-fade-in-up" style="animation-delay: 0.3s; animation-fill-mode: forwards">
					<div class="flex flex-col w-full">
						<div class="relative bg-[var(--fill-tsp-gray-main)] rounded-[22px]">
							<!-- Main Input Box with dynamic padding if tool is active -->
							<div class="flex flex-col gap-3 rounded-[22px] relative bg-[var(--fill-input-chat)] py-3 w-full z-[20] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] border border-black/5 dark:border-[var(--border-main)] focus-within:border-black/10 transition-all duration-300">
								<!-- Text Area -->
								<div class="overflow-auto ps-4 pe-2 bg-transparent pt-[1px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full placeholder:text-[var(--text-disable)] text-[15px] leading-[24px] min-h-[50px] max-h-[216px]">
									<TiptapEditorContent :editor="editor" class="w-full" />
								</div>

								<!-- Toolbar -->
								<div class="px-3">
									<div class="flex gap-2 items-center">
										<div class="flex gap-2 items-center flex-shrink-0">
											<!-- Plus -->
											<Tooltip text="Add Attachment">
												<button class="rounded-full border border-[var(--border-main)] inline-flex items-center justify-center gap-1 clickable cursor-pointer text-xs text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] w-8 h-8 p-0 shrink-0 transition-colors">
													<Plus :size="18" />
												</button>
											</Tooltip>

											<!-- Browser/Globe Icon Pill -->
											<Tooltip v-if="!activeTool" text="Browse Web">
												<div class="flex items-center gap-[4px] p-[6px] px-[8px] cursor-pointer rounded-[100px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors">
													<Globe :size="16" class="text-[var(--text-secondary)]" />
													<span class="text-[12px] text-[var(--text-secondary)] font-medium">My Browser</span>
												</div>
											</Tooltip>

											<!-- Tool Pill (Active Mode) -->
											<div v-if="activeTool" class="flex items-center gap-[6px] pl-[10px] pr-[12px] py-[6px] cursor-pointer rounded-full bg-blue-50 text-blue-600 border border-blue-100 transition-colors group">
												<Tooltip text="Remove Tool">
													<button @click.stop="activeTool = null" class="hover:bg-blue-100 rounded-full p-0.5 transition-colors">
														<X :size="14" />
													</button>
												</Tooltip>
												<div class="flex items-center gap-1">
													<component :is="currentTool?.icon" v-if="currentTool?.icon" :size="14" />
													<!-- Special case for Slides if icon is null in config -->
													<svg v-else-if="activeTool === 'slides'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2">
														<path d="M6.99976 5.9974V4.26406C6.99976 3.38041 7.7161 2.66406 8.59976 2.66406H15.3998C16.2834 2.66406 16.9998 3.38041 16.9998 4.26406V5.9974" stroke-linecap="round" stroke-linejoin="round" />
														<path d="M5.00024 10V8C5.00024 6.89543 5.89567 6 7.00024 6H17.0002C18.1048 6 19.0002 6.89543 19.0002 8V10" stroke-linecap="round" stroke-linejoin="round" />
														<path d="M19 10H5C3.89543 10 3 10.8954 3 12V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V12C21 10.8954 20.1046 10 19 10Z" stroke-linecap="round" stroke-linejoin="round" />
													</svg>
													<span class="text-[13px] font-medium leading-none pb-[1px]">{{ currentTool?.name }}</span>
													<span v-if="activeTool === 'app'" class="ml-1 text-[11px] text-blue-400 font-normal">Beta</span>
												</div>
											</div>
										</div>

										<div class="min-w-0 flex gap-2 ml-auto flex-shrink items-center">
											<div class="flex items-center gap-1">
												<!-- Model Selection -->
												<Tooltip text="Switch Model">
													<ModelSelector variant="pill" :icon="MessageCircle" :show-icon="false" />
												</Tooltip>

												<Tooltip text="Voice Input">
													<button class="flex items-center justify-center cursor-pointer hover:bg-[var(--fill-tsp-gray-main)] size-8 flex-shrink-0 rounded-full transition-colors">
														<Mic :size="16" class="text-[var(--text-secondary)]" />
													</button>
												</Tooltip>
											</div>

											<!-- Send Button -->
											<Tooltip :text="hasContent ? 'Send Message' : 'Type something...'">
												<button @click="() => handleSendMessage()" :disabled="!hasContent" class="flex items-center justify-center w-8 h-8 rounded-full transition-all bg-[var(--text-primary)] text-white disabled:bg-[var(--fill-tsp-white-dark)] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95">
													<ArrowUp :size="18" :stroke-width="2.5" />
												</button>
											</Tooltip>
										</div>
									</div>
								</div>
							</div>

							<!-- "Connect your tools" Banner (Matches user screenshot) -->
							<div v-if="!activeTool || activeTool === 'website'" class="mx-3 mt-1 mb-1 py-2 px-3 flex items-center justify-between group animate-fade-in-up" style="animation-delay: 0.1s">
								<div class="flex items-center gap-2">
									<Cable :size="16" class="text-[var(--icon-secondary)]" />
									<span class="text-[13px] text-[var(--text-secondary)] font-medium">Connect your tools to Aura</span>
								</div>
								<div class="flex items-center gap-2">
									<div class="flex items-center -space-x-1">
										<img src="/other.png" alt="" class="h-[22px]" />
									</div>
									<button class="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1">
										<X :size="16" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Suggestions / Home View -->
				<div v-if="!activeTool" class="mt-8 flex flex-wrap justify-center gap-2 animate-fade-in-up" style="animation-delay: 0.4s; animation-fill-mode: forwards">
					<!-- Create slides -->
					<Tooltip text="Generate a presentation">
						<button @click="handleToolSelect('slides')" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors group">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="18" height="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
								<path d="M6.99976 5.9974V4.26406C6.99976 3.38041 7.7161 2.66406 8.59976 2.66406H15.3998C16.2834 2.66406 16.9998 3.38041 16.9998 4.26406V5.9974" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M5.00024 10V8C5.00024 6.89543 5.89567 6 7.00024 6H17.0002C18.1048 6 19.0002 6.89543 19.0002 8V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M19 10H5C3.89543 10 3 10.8954 3 12V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V12C21 10.8954 20.1046 10 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
							<span class="text-[var(--text-primary)] text-[14px]">Create slides</span>
						</button>
					</Tooltip>

					<!-- Build website -->
					<Tooltip text="Create a web page">
						<button @click="handleToolSelect('website')" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors group">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" width="18" height="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
								<path d="M15 1.5H3C2.17157 1.5 1.5 2.33947 1.5 3.375V14.625C1.5 15.6605 2.17157 16.5 3 16.5H15C15.8284 16.5 16.5 15.6605 16.5 14.625V3.375C16.5 2.33947 15.8284 1.5 15 1.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M2 5H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M7 9L5.5 10.5L7 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M11 9L12.5 10.5L11 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
							<span class="text-[var(--text-primary)] text-[14px]">Build website</span>
						</button>
					</Tooltip>

					<!-- Develop apps -->
					<Tooltip text="Build a mobile app">
						<button @click="handleToolSelect('app')" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors group">
							<Smartphone :size="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
							<span class="text-[var(--text-primary)] text-[14px]">Develop apps</span>
						</button>
					</Tooltip>

					<!-- Design -->
					<Tooltip text="Create images or designs">
						<button @click="handleToolSelect('design')" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors group">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" width="18" height="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
								<path d="M3.457 8.86C3.98 8.58 4.576 8.465 5.166 8.524c.59.06 1.15.293 1.608.67.458.378.793.882.965 1.45.17.568.169 1.174-.004 1.741-.173.568-.511 1.071-.97 1.447-.46.375-1.02.606-1.61.663-2.323.224-2.583.27-2.816 1.396" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M13.348 1.275c.5 0 .983.2 1.337.554.354.354.553.835.553 1.336 0 .502-.2 1.982-.553 2.337l-7.351 7.35-1.895-.99" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
							<span class="text-[var(--text-primary)] text-[14px]">Design</span>
						</button>
					</Tooltip>

					<div class="relative" ref="moreMenuRef">
						<Tooltip text="Explore more tools">
							<button @click.stop="isMoreMenuOpen = !isMoreMenuOpen" class="h-10 px-[14px] text-sm py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center clickable hover:bg-[var(--fill-tsp-white-light)] text-[var(--text-primary)] transition-colors" :class="{ 'bg-[var(--fill-tsp-white-light)]': isMoreMenuOpen }">More</button>
						</Tooltip>

						<!-- More Dropdown Menu -->
						<div v-if="isMoreMenuOpen" class="absolute bottom-full mb-2 right-0 w-[220px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border-main)] py-2 z-50 animate-slide-up">
							<div v-for="item in moreMenuItems" :key="item.name" class="flex items-center gap-3 px-4 py-[10px] hover:bg-[var(--fill-tsp-white-light)] cursor-pointer group transition-colors" @click="handleToolSelect(item.id || item.name)">
								<component :is="item.icon" :size="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
								<span class="text-[14px] text-[var(--text-primary)] font-normal flex-1">{{ item.name }}</span>
								<ArrowUpRight v-if="item.name === 'Playbook'" :size="14" class="text-[var(--text-tertiary)]" />
							</div>
						</div>
					</div>
				</div>

				<!-- Expanded Tool View -->
				<div v-if="activeTool && currentTool" class="mt-8 flex flex-col gap-8 w-full animate-fade-in-up">
					<!-- Website Layout -->
					<div v-if="activeTool === 'website'" class="flex flex-col gap-6 w-full">
						<ToolChips title="What would you like to build?" :chips="currentTool.chips || []" :links="currentTool.links || []" @select="handlePromptSelect" @link-click="handleLinkClick" />

						<ToolIntegrations v-if="currentTool.showIntegrations" />
					</div>

					<!-- Schedule Layout -->
					<div v-if="activeTool === 'schedule'" class="flex flex-col gap-6 w-full">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-[14px] font-medium text-[var(--text-primary)]">Get started with</h3>
							<div class="flex items-center gap-2">
								<button class="h-8 w-8 rounded-lg border border-[var(--border-main)] flex items-center justify-center hover:bg-[var(--fill-tsp-white-light)] transition-colors">
									<Calendar :size="16" class="text-[var(--text-secondary)]" />
								</button>
								<button class="h-8 px-3 rounded-lg border border-[var(--border-main)] flex items-center gap-1.5 hover:bg-[var(--fill-tsp-white-light)] transition-colors">
									<Plus :size="16" class="text-[var(--text-secondary)]" />
									<span class="text-[13px] font-medium text-[var(--text-primary)]">New schedule</span>
								</button>
							</div>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<button v-for="(item, index) in currentTool.prompts" :key="index" @click="handlePromptSelect(item.text)" class="flex items-center justify-between p-4 px-5 rounded-2xl border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] transition-colors group text-left">
								<div class="flex items-center gap-4 min-w-0">
									<div class="w-5 h-5 flex items-center justify-center flex-shrink-0">
										<component :is="item.icon" :size="16" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
									</div>
									<span class="text-[14px] text-[var(--text-primary)] truncate font-normal">{{ item.text }}</span>
								</div>
								<ArrowUpRight :size="14" class="text-[var(--text-tertiary)] flex-shrink-0" />
							</button>
						</div>
					</div>

					<!-- Default Tool Layout (Slides, App, Design) -->
					<div v-else class="flex flex-col gap-8 w-full">
						<SamplePrompts v-if="currentTool.prompts && currentTool.prompts.length" :prompts="currentTool.prompts" :title="activeTool === 'app' || activeTool === 'design' || activeTool === 'research' || activeTool === 'spreadsheet' ? '' : 'Sample prompts'" :layout="activeTool === 'app' || activeTool === 'design' || activeTool === 'research' || activeTool === 'spreadsheet' ? 'list' : 'grid'" @select="handlePromptSelect" />

						<TemplateSelector v-if="currentTool.templates && currentTool.templates.length" :templates="currentTool.templates" />
					</div>
				</div>

				<!-- Footer Promo Cards -->
				<div v-if="!activeTool" class="mt-20 flex gap-3 overflow-x-auto pb-4 scrollbar-none animate-fade-in-up" style="animation-delay: 0.5s; animation-fill-mode: forwards">
					<div class="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] min-h-[92px] p-4 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] clickable transition-colors">
						<div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
							<Puzzle :size="24" class="text-blue-600" />
						</div>
						<p class="text-[var(--text-primary)] text-sm font-medium leading-tight">Get new capabilities with custom skills</p>
					</div>
					<div class="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] min-h-[92px] p-4 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] clickable transition-colors">
						<div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-2">
							<Mail :size="24" class="text-red-600" />
						</div>
						<p class="text-[var(--text-primary)] text-sm font-medium leading-tight">Stay updated with the latest news</p>
					</div>
					<div class="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] min-h-[92px] p-4 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] clickable transition-colors">
						<div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-2">
							<Globe :size="24" class="text-green-600" />
						</div>
						<p class="text-[var(--text-primary)] text-sm font-medium leading-tight">Explore the global community</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick, h } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversation'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'
import { useModelStore } from '../stores/models'
import { useEditor, EditorContent as TiptapEditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
	Plus,
	Globe,
	X,
	Mic,
	ArrowUp,
	Cable,
	Smartphone,
	Calendar,
	Search,
	Table,
	BarChart3,
	Video,
	Volume2,
	MessageSquare,
	ArrowUpRight,
	Signal,
	Newspaper,
	BarChart2,
	Cake,
	SlidersHorizontal,
	Presentation,
	Puzzle,
	Mail,
	MessageCircle,
	FileText,
	Briefcase,
	Building2,
	Cloud,
	User,
	Link,
	Image,
	Code,
	ShoppingBag,
	Sparkles,
	Paintbrush,
} from 'lucide-vue-next'
import ModelSelector from './ModelSelector.vue'
import SamplePrompts from './SamplePrompts.vue'
import TemplateSelector from './TemplateSelector.vue'
import ToolChips from './ToolChips.vue'
import ToolIntegrations from './ToolIntegrations.vue'
import Tooltip from './Tooltip.vue'

// --- Custom Icons ---
const FigmaIcon = () =>
	h(
		'svg',
		{
			viewBox: '0 0 64 64',
			fill: 'none',
			xmlns: 'http://www.w3.org/2000/svg',
			width: '14',
			height: '14',
		},
		[
			h('path', { d: 'M0 12C0 5.37258 5.37258 0 12 0H52C58.6274 0 64 5.37258 64 12V52C64 58.6274 58.6274 64 52 64H12C5.37258 64 0 58.6274 0 52V12Z', fill: '#1A1A19' }),
			h('g', { clipPath: 'url(#4cad070dcef6f451302f6d4293cb31e20)' }, [
				h('path', { d: 'M32.1387 31.9163C32.1387 27.7816 35.4905 24.4297 39.6253 24.4297C43.76 24.4297 47.1119 27.7816 47.1119 31.9163C47.1119 36.0511 43.76 39.403 39.6253 39.403C35.4905 39.403 32.1387 36.0511 32.1387 31.9163Z', fill: '#1ABCFE' }),
				h('path', { d: 'M17.166 46.887C17.166 42.7523 20.5179 39.4004 24.6526 39.4004H32.1393V46.887C32.1393 51.0218 28.7874 54.3737 24.6526 54.3737C20.5179 54.3737 17.166 51.0218 17.166 46.887Z', fill: '#0ACF83' }),
				h('path', { d: 'M32.1406 9.45508V24.4283H39.6273C43.762 24.4283 47.1139 21.0765 47.1139 16.9417C47.1139 12.807 43.762 9.45508 39.6273 9.45508H32.1406Z', fill: '#FF7262' }),
				h('path', { d: 'M17.166 16.9417C17.166 21.0765 20.5179 24.4283 24.6526 24.4283H32.1393V9.45508H24.6526C20.5179 9.45508 17.166 12.807 17.166 16.9417Z', fill: '#F24E1E' }),
				h('path', { d: 'M17.166 31.9163C17.166 36.0511 20.5179 39.403 24.6526 39.403H32.1393V24.4297H24.6526C20.5179 24.4297 17.166 27.7816 17.166 31.9163Z', fill: '#A259FF' }),
			]),
			h('defs', [h('clipPath', { id: '4cad070dcef6f451302f6d4293cb31e20' }, [h('rect', { width: '45.3818', height: '45.3818', fill: 'white', transform: 'translate(9.30859 9.30859)' })])]),
		],
	)

// --- Types ---
type ToolType = 'slides' | 'website' | 'app' | 'design' | 'schedule' | 'research' | 'spreadsheet' | null

interface ToolConfig {
	id: ToolType
	name: string
	icon: any
	color: string
	placeholder: string
	prompts?: Array<{ text: string; icon?: any }>
	templates?: Array<any>
	chips?: Array<{ text: string; icon?: any }>
	links?: Array<{ text: string; icon?: any }>
	showIntegrations?: boolean
}

const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()
const userStore = useUserStore()
const emit = defineEmits(['send-message'])

const activeTool = ref<ToolType>(null)
const hasContent = ref(false)

const isMoreMenuOpen = ref(false)
const moreMenuRef = ref<HTMLElement | null>(null)

const moreMenuItems = [
	{ name: 'Schedule task', id: 'schedule', icon: Calendar },
	{ name: 'Wide Research', id: 'research', icon: Search },
	{ name: 'Spreadsheet', id: 'spreadsheet', icon: Table },
	{ name: 'Visualization', icon: BarChart3 },
	{ name: 'Video', icon: Video },
	{ name: 'Audio', icon: Volume2 },
	{ name: 'Chat mode', icon: MessageSquare },
	{ name: 'Playbook', icon: ArrowUpRight },
]

const handleClickOutside = (event: MouseEvent) => {
	if (moreMenuRef.value && !moreMenuRef.value.contains(event.target as Node)) {
		isMoreMenuOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
	runTypewriter()
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
	if (typewriterInterval) clearInterval(typewriterInterval)
})

const props = defineProps<{
	mode?: string
	isLoading?: boolean
}>()

// --- Tool Configurations ---
const tools: Record<string, ToolConfig> = {
	slides: {
		id: 'slides',
		name: 'Slides',
		icon: null, // Dynamic in template
		color: 'text-blue-500',
		placeholder: 'Describe your presentation topic',
		prompts: [{ text: 'Design a pitch deck for a startup seeking funding' }, { text: 'Create a sales presentation for a B2B software solution' }, { text: 'Prepare a training module on cybersecurity best practices' }, { text: 'Create a presentation on the impact of AI on the future of work' }],
		templates: [
			{ id: 't1', name: 'The Golden Age of Jazz', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop' },
			{ id: 't2', name: 'Future of AI', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop' },
			{ id: 't3', name: 'A Journey Begins', image: 'https://images.unsplash.com/photo-1478720568477-152d9b167518?w=400&h=300&fit=crop' },
		],
	},
	website: {
		id: 'website',
		name: 'Website',
		icon: Code,
		color: 'text-purple-500',
		placeholder: 'Describe the website you want to build',
		chips: [
			{ text: 'Landing page', icon: FileText },
			{ text: 'Dashboard', icon: BarChart2 },
			{ text: 'Portfolio', icon: Briefcase },
			{ text: 'Corporate', icon: Building2 },
			{ text: 'SaaS', icon: Cloud },
			{ text: 'Link in bio', icon: User },
			{ text: 'E-commerce', icon: ShoppingBag },
		],
		links: [
			{ text: 'Add website reference', icon: Link },
			{ text: 'Import from Figma', icon: FigmaIcon },
		],
		showIntegrations: true,
		prompts: [],
		templates: [],
	},
	app: {
		id: 'app',
		name: 'Develop apps',
		icon: Smartphone,
		color: 'text-green-500',
		placeholder: 'Describe the mobile app you want to build',
		prompts: [{ text: 'Make a scheduling tool with events, reminders, and calendar view' }, { text: 'Make a weather app showing current conditions and forecasts' }, { text: 'Make a habit-building tool with daily tracking' }, { text: 'Build a personal expense tracker with categories and monthly summaries' }, { text: 'Build a shopping list tool with item adding and check-off' }],
		templates: [],
	},
	design: {
		id: 'design',
		name: 'Design',
		icon: Paintbrush,
		color: 'text-pink-500',
		placeholder: 'Describe the image you want to create',
		prompts: [{ icon: Sparkles, text: 'Try Nano Banana' }, { text: 'Meditation app UI/UX' }, { text: 'Coffee brand design' }, { text: 'Music festival print materials' }, { text: 'Data infographic' }, { text: 'App illustrations' }],
		templates: [],
	},
	schedule: {
		id: 'schedule',
		name: 'Schedule task',
		icon: Calendar,
		color: 'text-blue-500',
		placeholder: 'Describe the task you want to schedule',
		prompts: [
			{ text: 'Daily tech briefing', icon: Signal },
			{ text: '24 hours hot topics feed', icon: Newspaper },
			{ text: 'Monthly market trend analysis', icon: BarChart2 },
			{ text: 'Weekly picks for food and fun', icon: Cake },
			{ text: 'Track weekly industry trends', icon: SlidersHorizontal },
			{ text: 'Market insights before the bell', icon: Presentation },
		],
		templates: [],
	},
	research: {
		id: 'research',
		name: 'Wide Research',
		icon: Search,
		color: 'text-blue-500',
		placeholder: 'Search for anything you want to know',
		prompts: [{ text: 'Map 250 NeurIPS researchers with areas affiliations citations and mobility insights' }, { text: 'Compare 100 sneakers across features pricing segments aesthetics resale metrics performance' }, { text: 'Profile 20 NASA legends with biographies missions ages quotes and notable milestones' }, { text: 'Create 50 New York event posters in diverse energetic visual styles' }, { text: 'Extract 100 prompts and build structured Notion database entries' }],
		templates: [],
	},
	spreadsheet: {
		id: 'spreadsheet',
		name: 'Spreadsheet',
		icon: Table,
		color: 'text-blue-500',
		placeholder: 'Search for anything you want to know',
		prompts: [{ text: 'Calculate IRR for Anysphere investment with cash flows' }, { text: 'Create a discounted cash flow model with formulas' }, { text: 'Track project tasks across lifecycle with clean design' }, { text: 'Analyze North America natural gas data from IMF' }, { text: 'Track personal finances with daily logs and categories' }],
		templates: [],
	},
}

const currentTool = computed(() => (activeTool.value ? tools[activeTool.value] : null))

const genericPlaceholder = 'Assign a task or ask anything'
const displayedPlaceholder = ref('')
let typewriterInterval: any = null

const runTypewriter = () => {
	if (typewriterInterval) clearInterval(typewriterInterval)
	displayedPlaceholder.value = ''
	let i = 0
	typewriterInterval = setInterval(() => {
		if (i < genericPlaceholder.length) {
			displayedPlaceholder.value += genericPlaceholder[i]
			i++
			// Force Tiptap to refresh its decoration
			if (editor.value) {
				editor.value.view.dispatch(editor.value.state.tr)
			}
		} else {
			clearInterval(typewriterInterval)
		}
	}, 20)
}

const editor = useEditor({
	content: '',
	extensions: [
		StarterKit,
		Placeholder.configure({
			placeholder: () => {
				const toolId = activeTool.value
				const tool = toolId ? tools[toolId] : null
				return tool ? tool.placeholder : displayedPlaceholder.value
			},
		}),
	],
	editorProps: {
		attributes: {
			class: 'tiptap ProseMirror w-full bg-transparent border-none focus:ring-0 p-0 text-[16px] leading-[26px] text-[var(--text-primary)] font-normal resize-none custom-scrollbar min-h-[60px] outline-none',
			enterkeyhint: 'enter',
			translate: 'no',
		},
	},
	onUpdate: ({ editor }) => {
		hasContent.value = !editor.isEmpty
	},
})

watch(activeTool, (newTool) => {
	if (!newTool) {
		runTypewriter()
	}
})

const modelStore = useModelStore()

function handleSendMessage(directContent?: string) {
	const content = directContent || editor.value?.getText() || ''
	if (!content.trim()) return
	try {
		// 直接使用完整的 provider:model 格式
		const modelId = modelStore.selectedModelId || 'openai:gpt-4o-mini'

		console.log('WelcomeScreen: Sending message with model:', modelId)
		emit('send-message', content, modelId)
		editor.value?.commands.clearContent()

		// Reset tool after sending
		activeTool.value = null
	} catch (e) {
		console.error('Failed to start chat:', e)
	}
}

// Handle clicking a tool suggestion
function handleToolSelect(toolId: string) {
	activeTool.value = toolId as ToolType
	isMoreMenuOpen.value = false

	// The input wrapper has a 300ms transition (duration-300).
	// We wait for the layout to settle before focusing to avoid cursor jumping.
	setTimeout(() => {
		if (editor.value) {
			// Ensure focus and move cursor to the end
			editor.value.commands.focus()
			const { size } = editor.value.state.doc.content
			editor.value.commands.setTextSelection(size)
			// Secondary focus command as a fallback
			editor.value.commands.focus('end')
		}
	}, 350)
}

// Handle clicking a sample prompt
function handlePromptSelect(text: string) {
	if (!editor.value) return
	editor.value.commands.setContent(text)
	// Focus first to ensure the editor is ready for selection
	editor.value.commands.focus()
	// Small delay to ensure Tiptap has processed the content update
	nextTick(() => {
		if (editor.value) {
			const { size } = editor.value.state.doc.content
			editor.value.commands.setTextSelection(size)
			editor.value.commands.focus('end')
		}
	})
}

// Set up key handler when editor is ready
watch(editor, (instance) => {
	if (instance) {
		instance.setOptions({
			editorProps: {
				handleKeyDown: (view, event) => {
					if (event.key === 'Enter' && !event.shiftKey) {
						event.preventDefault()
						handleSendMessage()
						return true
					}
					return false
				},
			},
		})
	}
})

function handleLinkClick(text: string) {
	if (text === 'Add website reference') {
		uiStore.openWebsiteReferenceModal()
	}
}

onBeforeUnmount(() => {
	editor.value?.destroy()
})
</script>

<style scoped lang="scss">
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in-up {
	opacity: 0;
	animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: rgba(156, 163, 175, 0.1) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.1);
		border-radius: 10px;
	}
}

// Hide scrollbar but keep functionality
.scrollbar-none {
	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
}
</style>

<style lang="scss">
/* Tiptap Styles */
.tiptap {
	outline: none !important;
}

.tiptap p.is-editor-empty:first-child::before {
	color: var(--text-tertiary);
	content: attr(data-placeholder);
	float: left;
	height: 0;
	pointer-events: none;
}
</style>
