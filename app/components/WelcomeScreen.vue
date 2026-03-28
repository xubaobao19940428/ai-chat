<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] relative overflow-hidden">
		<!-- Main Content Centered -->
		<div class="flex-1 flex flex-col items-center px-4 pt-[18vh]">
			<div id="chat-home-view-container" class="w-full max-w-full sm:max-w-[840px] sm:min-w-[390px] mx-auto">
				<div class="relative w-full flex flex-col items-center gap-[40px]">
					<!-- Title using conditional text -->
					<h1 class="text-[var(--text-primary)] text-center w-full font-serif text-[36px] mb-[34px] tracking-tight animate-fade-in-up"
						style="animation-delay: 0.2s; animation-fill-mode: forwards">
						<span v-if="activeTool && activeTool !== 'website'" class="opacity-0">{{
							$t('chat.welcome_title') }}</span>
						<span v-else>{{ $t('chat.welcome_title') }}</span>
					</h1>
				</div>

				<!-- Input Card Area -->
				<div class="flex flex-col gap-1 w-full animate-fade-in-up"
					style="animation-delay: 0.3s; animation-fill-mode: forwards">
					<UnifiedInput ref="unifiedInputRef" :capability="currentCapability" :is-loading="props.isLoading"
						:allow-model-switch="true" :active-tag="activeChip ? $t(activeChip.key) : undefined"
						:active-tag-icon="activeChip?.icon" @send="handleUnifiedSend" @clear-tag="clearActiveChip" />
				</div>

				<!-- Quick Action Chips (Chat mode only) -->
				<div v-if="!isMediaModel && !activeTool" class="mt-4 animate-fade-in-up"
					style="animation-delay: 0.4s; animation-fill-mode: forwards">
					<!-- Chip buttons row (hide when a chip is active) -->
					<div v-if="!activeChip" class="flex flex-wrap justify-center gap-2">
						<button v-for="chip in visibleQuickChips" :key="chip.key"
							@click="handleQuickChipClick(chip)"
							class="quick-chip group">
							<component :is="chip.icon" :size="16"
								class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
							<span>{{ $t(chip.key) }}</span>
						</button>
						<button v-if="!showAllChips" @click="showAllChips = true" class="quick-chip">
							<span>{{ $t('chat.quick_see_more') }}</span>
						</button>
					</div>

					<!-- Expanded sub-items grid -->
					<Transition enter-active-class="transition duration-200 ease-out"
						enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
						leave-active-class="transition duration-150 ease-in"
						leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
						<div v-if="activeChip" class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
							<button v-for="(sub, idx) in activeChip.subs" :key="idx"
								@click="handleSubClick(sub)"
								class="quick-sub-card group">
								<component :is="sub.icon" :size="18"
									class="shrink-0 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
								<span class="flex-1 text-left text-[13px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate">
									{{ sub.text }}
								</span>
								<ArrowUpRight :size="14"
									class="shrink-0 text-[var(--text-disable)] group-hover:text-[var(--text-tertiary)] transition-colors" />
							</button>
						</div>
					</Transition>
				</div>

				<!-- Style Recommendations for Image/Video Models -->
				<div v-if="isMediaModel && !activeTool" class="mt-6 w-full animate-fade-in-up"
					style="animation-delay: 0.4s; animation-fill-mode: forwards">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-[15px] font-semibold text-[var(--text-primary)]">
							{{ currentCapability === 'image_generation' ? $t('chat.try_style_image') :
								$t('chat.try_style_video') }}
						</h3>
						<NuxtLink
							:to="currentCapability === 'image_generation' ? '/image-generation' : '/video-generation'"
							class="text-[13px] text-[var(--text-primary)] hover:opacity-70 transition-opacity flex items-center gap-1">
							{{ $t('chat.view_more') }}
							<span class="text-[11px]">&rarr;</span>
						</NuxtLink>
					</div>
					<!-- Loading skeleton -->
					<div v-if="isStyleLoading" class="grid grid-cols-3 sm:grid-cols-5 gap-3">
						<div v-for="i in 5" :key="i"
							class="rounded-2xl overflow-hidden bg-[var(--bg-hover)] animate-pulse"
							style="aspect-ratio: 3/4"></div>
					</div>
					<!-- Style cards -->
					<div v-else-if="styleRecommendations.length > 0" class="grid grid-cols-3 sm:grid-cols-5 gap-3">
						<div v-for="item in styleRecommendations" :key="item.id"
							class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-card)] border border-[var(--border-main)] hover:border-[var(--border-light)] transition-all duration-300 shadow-sm hover:shadow-md"
							@click="applyStylePrompt(item)" @mouseenter="hoveredStyleId = item.id"
							@mouseleave="hoveredStyleId = null">
							<img :src="item.related_data?.thumbnail || item.cover" :alt="item.title" loading="lazy"
								class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 bg-[#f0eeeb] dark:bg-[#2c2c2c]"
								style="aspect-ratio: 3/4" />
							<!-- Hover Video (PC Only, video model) -->
							<video v-if="isVideoModel && hoveredStyleId === item.id && item.related_data?.assets?.[0]"
								:src="item.related_data.assets[0]" autoplay muted loop playsinline
								class="absolute inset-0 w-full h-full object-cover hidden md:block z-0" />
							<!-- Hover overlay -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
								<!-- Top Right: Favorite -->
								<div class="absolute top-2.5 right-2.5 pointer-events-auto transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75"
									:class="isStyleFavorited(Number(item.related_id || item.id)) ? '!opacity-100 !translate-y-0' : ''">
									<button @click.stop="handleStyleFavorite(Number(item.related_id || item.id))"
										class="outline-none size-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
										<Heart :size="16"
											:class="['!stroke-transparent drop-shadow-md', isStyleFavorited(Number(item.related_id || item.id)) ? 'fill-red-500' : 'fill-white/80']" />
									</button>
								</div>
								<!-- Bottom Center: Use prompt -->
								<div class="absolute inset-x-0 bottom-0 p-3 flex justify-center">
									<span
										class="shrink-0 px-4 py-1.5 rounded-full bg-white text-[11px] font-bold text-black uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 pointer-events-auto cursor-pointer hover:bg-white/90 inline-flex items-center gap-1"
										@click.stop="applyStylePrompt(item)">
										<Sparkles :size="12" />{{ $t('common.use_prompt') }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>


				<!-- Expanded Tool View -->
				<div v-if="activeTool && currentTool" class="mt-8 flex flex-col gap-8 w-full animate-fade-in-up">
					<!-- Website Layout -->
					<div v-if="activeTool === 'website'" class="flex flex-col gap-6 w-full">
						<ToolChips title="What would you like to build?" :chips="currentTool.chips || []"
							:links="currentTool.links || []" @select="handlePromptSelect"
							@link-click="handleLinkClick" />

						<ToolIntegrations v-if="currentTool.showIntegrations" />
					</div>

					<!-- Default Tool Layout (Slides, App, Design) -->
					<div v-else class="flex flex-col gap-8 w-full">
						<SamplePrompts v-if="currentTool.prompts && currentTool.prompts.length"
							:prompts="currentTool.prompts"
							:title="activeTool === 'app' || activeTool === 'design' || activeTool === 'research' || activeTool === 'spreadsheet' ? '' : 'Sample prompts'"
							:layout="activeTool === 'app' || activeTool === 'design' || activeTool === 'research' || activeTool === 'spreadsheet' ? 'list' : 'grid'"
							@select="handlePromptSelect" />

						<TemplateSelector v-if="currentTool.templates && currentTool.templates.length"
							:templates="currentTool.templates" />
					</div>
				</div>

				<!-- <div v-if="!activeTool && !isMediaModel"
					class="mt-20 flex gap-3 overflow-x-auto pb-4 scrollbar-none animate-fade-in-up"
					style="animation-delay: 0.5s; animation-fill-mode: forwards">
					<div
						class="flex-shrink-0 w-full sm:w-[calc(100%-8px)] min-h-[92px] p-4 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] clickable transition-colors">
						<div
							class="w-10 h-10 rounded-lg bg-[var(--function-success-tsp)] flex items-center justify-center mb-2">
							<Globe :size="24" class="text-[var(--function-success)]" />
						</div>
						<p class="text-[var(--text-primary)] text-sm font-medium leading-tight">{{
							$t('chat.explore_community') }}</p>
					</div>
				</div> -->
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
import { Plus, Globe, X, Mic, ArrowUp, Cable, Smartphone, Calendar, Search, Table, BarChart3, Video, Volume2, MessageSquare, ArrowUpRight, Signal, Newspaper, BarChart2, Cake, SlidersHorizontal, Presentation, Puzzle, Mail, MessageCircle, FileText, Briefcase, Building2, Cloud, User, Link, Image, Code, ShoppingBag, Sparkles, Paintbrush, Loader2, Square, Clock, Check, Palette, Gem, Monitor, LayoutGrid, Pencil, BookOpen, ScanSearch, AlignLeft, TrendingUp, Brain, Type, Languages, ImagePlus, Lightbulb } from 'lucide-vue-next'
import { uploadFile, generateImageStream, generateVideoStream } from '../utils/api'
import { getDiscoveryItems, type DiscoveryItem } from '../api/discovery'
import { useFavorite } from '~/composables/useFavorite'
import { Heart } from 'lucide-vue-next'
import ModelSelector from './ModelSelector.vue'
import UnifiedInput from './UnifiedInput.vue'
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
const { t } = useI18n()
const emit = defineEmits(['send-message'])

const activeTool = ref<ToolType>(null)
const hasContent = ref(false)
const unifiedInputRef = ref<InstanceType<typeof UnifiedInput> | null>(null)

const currentCapability = computed(() => {
	const model = modelStore.selectedModel
	const cap = model?.model_input?.capability || model?.capabilities?.[0]
	if (cap === 'image_generation' || cap === 'image') return 'image_generation' as const
	if (cap === 'video_generation' || cap === 'video') return 'video_generation' as const
	return 'chat' as const
})

function handleUnifiedSend(payload: { content: string; params: Record<string, any>; files: any[]; mediaFiles: any[] }) {
	const content = payload.content
	if (!content.trim() && payload.files.length === 0) return

	const modelId = modelStore.selectedModelId || 'openai:gpt-4o-mini'
	const image_urls: string[] = []
	const file_ids: string[] = []

	payload.files.forEach((f: any) => {
		if (f.type?.startsWith('image/')) {
			image_urls.push(f.key)
		} else {
			file_ids.push(f.key)
		}
	})

	const payloadOptions: any = { ...payload.params, file_ids, image_urls, files: payload.files }

	// Media field mapping
	const model = modelStore.selectedModel
	const fields = model?.model_input?.fields || {}
	if (payload.mediaFiles.length > 0) {
		if ('input_images' in fields) {
			payloadOptions.input_images = payload.mediaFiles.map((f) => f.url)
		} else if ('image' in fields) {
			payloadOptions.image = payload.mediaFiles[0]?.url
		} else if ('images' in fields) {
			payloadOptions.images = payload.mediaFiles.map((f) => f.url)
		} else if ('ref_image' in fields) {
			payloadOptions.ref_image = payload.mediaFiles[0]?.url
		}
	}

	const capability = currentCapability.value === 'image_generation' ? 'image' : currentCapability.value === 'video_generation' ? 'video' : 'chat'
	emit('send-message', content, modelId, payloadOptions, capability)

	activeTool.value = null
}
const showConnectBanner = ref(true)

// --- Quick Action Chips ---
const QUICK_CHIPS_INITIAL = 4

interface QuickChipSub {
	icon: any
	text: string
	prompt: string
}

interface QuickChip {
	key: string
	icon: any
	prompt: string
	subs: QuickChipSub[]
}

const allQuickChips: QuickChip[] = [
	{
		key: 'chat.quick_help_write', icon: markRaw(Pencil), prompt: 'Help me write ',
		subs: [
			{ icon: markRaw(FileText), text: 'Write a professional email', prompt: 'Help me write a professional email about ' },
			{ icon: markRaw(Pencil), text: 'Write a blog post', prompt: 'Help me write a blog post about ' },
			{ icon: markRaw(Briefcase), text: 'Write a cover letter', prompt: 'Help me write a cover letter for ' },
			{ icon: markRaw(FileText), text: 'Write a product description', prompt: 'Help me write a product description for ' },
			{ icon: markRaw(MessageCircle), text: 'Write a social media post', prompt: 'Help me write a social media post about ' },
			{ icon: markRaw(Pencil), text: 'Write a poem or story', prompt: 'Help me write a creative piece about ' },
			{ icon: markRaw(FileText), text: 'Write a business proposal', prompt: 'Help me write a business proposal for ' },
			{ icon: markRaw(Pencil), text: 'Write a speech', prompt: 'Help me write a speech about ' },
			{ icon: markRaw(FileText), text: 'Write a resume summary', prompt: 'Help me write a resume summary for ' },
		],
	},
	{
		key: 'chat.quick_learn', icon: markRaw(BookOpen), prompt: 'Learn about ',
		subs: [
			{ icon: markRaw(Lightbulb), text: 'Time management strategies', prompt: 'Learn about time management strategies' },
			{ icon: markRaw(TrendingUp), text: 'Stock trading basics', prompt: 'Learn about stock trading basics' },
			{ icon: markRaw(Briefcase), text: 'Negotiation skills for deals', prompt: 'Learn about negotiation skills for business deals' },
			{ icon: markRaw(MessageCircle), text: 'Handling difficult conversations', prompt: 'Learn about handling difficult conversations' },
			{ icon: markRaw(BookOpen), text: 'Machine learning fundamentals', prompt: 'Learn about machine learning fundamentals' },
			{ icon: markRaw(Globe), text: 'World history highlights', prompt: 'Learn about world history highlights' },
			{ icon: markRaw(Code), text: 'Web development roadmap', prompt: 'Learn about web development roadmap' },
			{ icon: markRaw(Brain), text: 'Psychology of habits', prompt: 'Learn about the psychology of habits' },
			{ icon: markRaw(BarChart2), text: 'Personal finance planning', prompt: 'Learn about personal finance planning' },
		],
	},
	{
		key: 'chat.quick_analyze_image', icon: markRaw(ScanSearch), prompt: 'Analyze Image ',
		subs: [
			{ icon: markRaw(ScanSearch), text: 'Describe image contents', prompt: 'Describe what you see in this image in detail' },
			{ icon: markRaw(FileText), text: 'Extract text from image', prompt: 'Extract and organize all text from this image' },
			{ icon: markRaw(Search), text: 'Identify objects in image', prompt: 'Identify and list all objects in this image' },
			{ icon: markRaw(TrendingUp), text: 'Analyze chart or graph', prompt: 'Analyze this chart and explain the key insights' },
			{ icon: markRaw(Paintbrush), text: 'Get design feedback', prompt: 'Provide design feedback on this image' },
			{ icon: markRaw(ScanSearch), text: 'Compare two images', prompt: 'Compare these images and highlight the differences' },
			{ icon: markRaw(Code), text: 'Convert UI to code', prompt: 'Convert this UI design image to HTML/CSS code' },
			{ icon: markRaw(FileText), text: 'Analyze document scan', prompt: 'Analyze this scanned document and extract key info' },
			{ icon: markRaw(Palette), text: 'Extract color palette', prompt: 'Extract the color palette from this image' },
		],
	},
	{
		key: 'chat.quick_summarize', icon: markRaw(AlignLeft), prompt: 'Summarize ',
		subs: [
			{ icon: markRaw(FileText), text: 'Article into bullet points', prompt: 'Summarize this article in bullet points: ' },
			{ icon: markRaw(AlignLeft), text: 'Meeting notes concisely', prompt: 'Create concise meeting notes from: ' },
			{ icon: markRaw(Lightbulb), text: 'Key takeaways from a report', prompt: 'Extract the key takeaways from this report: ' },
			{ icon: markRaw(BookOpen), text: 'Book into chapter summaries', prompt: 'Summarize this book chapter by chapter: ' },
			{ icon: markRaw(Briefcase), text: 'Executive summary for a doc', prompt: 'Create an executive summary of: ' },
			{ icon: markRaw(AlignLeft), text: 'Simplify complex text', prompt: 'Simplify this text for a general audience: ' },
			{ icon: markRaw(FileText), text: 'Extract action items', prompt: 'Extract all action items from: ' },
			{ icon: markRaw(MessageCircle), text: 'Summarize a conversation', prompt: 'Summarize this conversation thread: ' },
			{ icon: markRaw(AlignLeft), text: 'Condense into one paragraph', prompt: 'Condense this into one paragraph: ' },
		],
	},
	{
		key: 'chat.quick_analyze_data', icon: markRaw(TrendingUp), prompt: 'Analyze Data ',
		subs: [
			{ icon: markRaw(TrendingUp), text: 'Find trends and patterns', prompt: 'Identify the key trends in this data: ' },
			{ icon: markRaw(FileText), text: 'Generate analysis report', prompt: 'Generate a data analysis report for: ' },
			{ icon: markRaw(BarChart2), text: 'Calculate key statistics', prompt: 'Calculate key statistics for: ' },
			{ icon: markRaw(BarChart3), text: 'Suggest best visualizations', prompt: 'Suggest the best chart types for this data: ' },
			{ icon: markRaw(Search), text: 'Spot anomalies and outliers', prompt: 'Identify anomalies or outliers in: ' },
			{ icon: markRaw(TrendingUp), text: 'Forecast future trends', prompt: 'Make predictions based on this data: ' },
			{ icon: markRaw(Table), text: 'Clean and organize data', prompt: 'Clean and organize this dataset: ' },
			{ icon: markRaw(BarChart2), text: 'Compare datasets', prompt: 'Compare these two datasets and highlight differences: ' },
			{ icon: markRaw(FileText), text: 'Create pivot table summary', prompt: 'Create a pivot table summary for: ' },
		],
	},
	{
		key: 'chat.quick_brainstorm', icon: markRaw(Brain), prompt: 'Brainstorm ',
		subs: [
			{ icon: markRaw(Lightbulb), text: 'Startup ideas in tech', prompt: 'Brainstorm innovative startup ideas in tech' },
			{ icon: markRaw(Brain), text: 'Marketing campaign concepts', prompt: 'Brainstorm marketing campaign concepts for ' },
			{ icon: markRaw(Sparkles), text: 'Creative product features', prompt: 'Brainstorm creative product features for ' },
			{ icon: markRaw(MessageCircle), text: 'Content ideas for a blog', prompt: 'Brainstorm content ideas for a blog about ' },
			{ icon: markRaw(Lightbulb), text: 'Solutions to a problem', prompt: 'Brainstorm creative solutions for ' },
			{ icon: markRaw(Brain), text: 'Team building activities', prompt: 'Brainstorm team building activity ideas' },
			{ icon: markRaw(Sparkles), text: 'Brand naming ideas', prompt: 'Brainstorm brand name ideas for ' },
			{ icon: markRaw(Lightbulb), text: 'Monetization strategies', prompt: 'Brainstorm monetization strategies for ' },
			{ icon: markRaw(Brain), text: 'Workshop topic ideas', prompt: 'Brainstorm workshop topic ideas for ' },
		],
	},
	{
		key: 'chat.quick_improve_writing', icon: markRaw(Type), prompt: 'Improve writing ',
		subs: [
			{ icon: markRaw(Briefcase), text: 'Make it more formal', prompt: 'Rewrite this in a more formal tone: ' },
			{ icon: markRaw(AlignLeft), text: 'Make it more concise', prompt: 'Make this more concise without losing meaning: ' },
			{ icon: markRaw(Check), text: 'Fix grammar and spelling', prompt: 'Fix grammar and spelling errors in: ' },
			{ icon: markRaw(Type), text: 'Make it more persuasive', prompt: 'Rewrite this to be more persuasive: ' },
			{ icon: markRaw(Lightbulb), text: 'Simplify the language', prompt: 'Simplify the language in: ' },
			{ icon: markRaw(Pencil), text: 'Add more detail', prompt: 'Expand this with more detail and examples: ' },
			{ icon: markRaw(MessageCircle), text: 'Make it more casual', prompt: 'Rewrite this in a more casual tone: ' },
			{ icon: markRaw(Type), text: 'Improve readability', prompt: 'Improve the readability of: ' },
			{ icon: markRaw(Sparkles), text: 'Make it more engaging', prompt: 'Rewrite this to be more engaging: ' },
		],
	},
	{
		key: 'chat.quick_translate', icon: markRaw(Languages), prompt: 'Translate ',
		subs: [
			{ icon: markRaw(Languages), text: 'text by maintaining the length', prompt: 'Translate text by maintaining the length: ' },
			{ icon: markRaw(Languages), text: 'text in a natural and local way', prompt: 'Translate text in a natural and local way: ' },
			{ icon: markRaw(Languages), text: 'text while keeping the original meaning intact', prompt: 'Translate text while keeping the original meaning intact: ' },
			{ icon: markRaw(Languages), text: 'text into multiple languages', prompt: 'Translate text into multiple languages: ' },
			{ icon: markRaw(Languages), text: 'text to English', prompt: 'Translate this to English: ' },
			{ icon: markRaw(Languages), text: 'text to Chinese', prompt: 'Translate this to Chinese: ' },
			{ icon: markRaw(Languages), text: 'text to Japanese', prompt: 'Translate this to Japanese: ' },
			{ icon: markRaw(Languages), text: 'text to Spanish', prompt: 'Translate this to Spanish: ' },
			{ icon: markRaw(Languages), text: 'text to French', prompt: 'Translate this to French: ' },
		],
	},
	{
		key: 'chat.quick_generate_images', icon: markRaw(ImagePlus), prompt: 'Generate Images ',
		subs: [
			{ icon: markRaw(Gem), text: 'Logo design', prompt: 'Generate a logo design for ' },
			{ icon: markRaw(Monitor), text: 'Social media graphic', prompt: 'Generate a social media graphic for ' },
			{ icon: markRaw(ShoppingBag), text: 'Product mockup', prompt: 'Generate a product mockup for ' },
			{ icon: markRaw(Paintbrush), text: 'Digital illustration', prompt: 'Generate an illustration of ' },
			{ icon: markRaw(ImagePlus), text: 'Website hero image', prompt: 'Generate a hero image for a website about ' },
			{ icon: markRaw(LayoutGrid), text: 'Icon set design', prompt: 'Generate a set of icons for ' },
			{ icon: markRaw(Palette), text: 'Poster design', prompt: 'Generate a poster design for ' },
			{ icon: markRaw(Image), text: 'Background wallpaper', prompt: 'Generate a background wallpaper with ' },
			{ icon: markRaw(Sparkles), text: 'Character concept art', prompt: 'Generate character concept art for ' },
		],
	},
	{
		key: 'chat.quick_generate_ideas', icon: markRaw(Lightbulb), prompt: 'Generate Ideas ',
		subs: [
			{ icon: markRaw(Lightbulb), text: 'Side project ideas', prompt: 'Generate side project ideas for a developer' },
			{ icon: markRaw(Smartphone), text: 'App feature concepts', prompt: 'Generate app feature ideas for ' },
			{ icon: markRaw(Cake), text: 'Gift ideas for someone', prompt: 'Generate gift ideas for ' },
			{ icon: markRaw(Sparkles), text: 'Creative project names', prompt: 'Generate creative project names for ' },
			{ icon: markRaw(Presentation), text: 'Workshop topic ideas', prompt: 'Generate workshop topic ideas for ' },
			{ icon: markRaw(Brain), text: 'Research topic ideas', prompt: 'Generate research topic ideas in ' },
			{ icon: markRaw(Code), text: 'Open source project ideas', prompt: 'Generate open source project ideas for ' },
			{ icon: markRaw(Briefcase), text: 'Business model ideas', prompt: 'Generate business model ideas for ' },
			{ icon: markRaw(Pencil), text: 'Creative writing prompts', prompt: 'Generate creative writing prompts about ' },
		],
	},
]

const showAllChips = ref(false)
const activeChip = ref<QuickChip | null>(null)

const visibleQuickChips = computed(() =>
	showAllChips.value ? allQuickChips : allQuickChips.slice(0, QUICK_CHIPS_INITIAL)
)

const handleQuickChipClick = (chip: QuickChip) => {
	if (activeChip.value?.key === chip.key) {
		activeChip.value = null
		unifiedInputRef.value?.setContent('')
	} else {
		activeChip.value = chip
		unifiedInputRef.value?.setContent(chip.prompt)
		unifiedInputRef.value?.focus()
	}
}

const handleSubClick = (sub: QuickChipSub) => {
	unifiedInputRef.value?.setContent(sub.prompt)
	unifiedInputRef.value?.focus()
	activeChip.value = null
}

const clearActiveChip = () => {
	activeChip.value = null
	unifiedInputRef.value?.setContent('')
	unifiedInputRef.value?.focus()
}

const isMoreMenuOpen = ref(false)
const moreMenuRef = ref<HTMLElement | null>(null)

const moreMenuItems = [
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
	if (openMediaDropdown.value && mediaToolbarRef.value && !mediaToolbarRef.value.contains(event.target as Node)) {
		openMediaDropdown.value = null
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

const genericPlaceholder = computed(() => t('chat.assign_task'))
const displayedPlaceholder = ref('')
let typewriterInterval: any = null

const runTypewriter = () => {
	if (typewriterInterval) clearInterval(typewriterInterval)
	displayedPlaceholder.value = ''
	let i = 0
	const placeholder = genericPlaceholder.value
	typewriterInterval = setInterval(() => {
		if (i < placeholder.length) {
			displayedPlaceholder.value += placeholder[i]
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

const supportsFileUpload = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields || {}
	return !!(fields.file_ids || fields.image_urls || fields.image || fields.image_url || fields.input_images || fields.input_image || fields.init_image || fields.ref_image)
})

const supportsWebSearch = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields
	return !!fields?.enable_web_search
})

// --- Media model detection ---
const getModelCapability = (model: any): string => {
	return model?.model_input?.capability || model?.capabilities?.[0] || ''
}
const isImageModel = computed(() => {
	const cap = getModelCapability(modelStore.selectedModel)
	return cap === 'image_generation' || cap === 'image'
})
const isVideoModel = computed(() => {
	const cap = getModelCapability(modelStore.selectedModel)
	return cap === 'video_generation' || cap === 'video'
})
const isMediaModel = computed(() => isImageModel.value || isVideoModel.value)

const hoveredStyleId = ref<number | null>(null)

// --- Style recommendations for image/video models ---
const IMAGE_ALL_CATEGORY_ID = 35
const VIDEO_ALL_CATEGORY_ID = 46
const STYLE_PAGE_SIZE = 5
const STYLE_MAX_PAGE = 100

const styleRecommendations = ref<DiscoveryItem[]>([])
const isStyleLoading = ref(false)

const fetchStyleRecommendations = async () => {
	const categoryId = isImageModel.value ? IMAGE_ALL_CATEGORY_ID : VIDEO_ALL_CATEGORY_ID
	const randomPage = Math.floor(Math.random() * STYLE_MAX_PAGE) + 1
	isStyleLoading.value = true
	try {
		const res: any = await getDiscoveryItems(categoryId, { page: randomPage, page_size: STYLE_PAGE_SIZE })
		const list = res.data?.list || []
		if (list.length > 0) {
			styleRecommendations.value = list
		} else {
			const fallback: any = await getDiscoveryItems(categoryId, { page: 1, page_size: STYLE_PAGE_SIZE })
			styleRecommendations.value = fallback.data?.list || []
		}
	} catch (error) {
		console.error('Failed to fetch style recommendations:', error)
	} finally {
		isStyleLoading.value = false
	}
}

const applyStylePrompt = (item: DiscoveryItem) => {
	const prompt = item.related_data?.prompt || item.title || ''
	if (!prompt) return
	unifiedInputRef.value?.setContent(prompt)

	const model = item.related_data?.model
	if (model) {
		const capability = currentCapability.value
		const match = modelStore.models.find((m: any) =>
			m.model === model || m.display_name === model || `${m.provider}:${m.model}` === model
		)
		if (match) {
			modelStore.selectModel(`${match.provider}:${match.model}`, capability)
		}
	}
}

watch(isMediaModel, (val) => {
	if (val) {
		fetchStyleRecommendations()
	} else {
		styleRecommendations.value = []
	}
}, { immediate: true })

// Favorite for style recommendations
const styleFavoriteType = computed(() => isImageModel.value ? 'prompt_image' : 'prompt_video')
const { isFavorited: isStyleFavorited, toggleFavorite: toggleStyleFavorite } = useFavorite(styleFavoriteType.value)

const handleStyleFavorite = (id: number) => {
	toggleStyleFavorite(id)
}

const modelInputFields = computed(() => modelStore.selectedModel?.model_input?.fields || {})

const dynamicSelectFields = computed(() => {
	const result: Array<{ key: string; options: string[];[k: string]: any }> = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if ((field as any).type === 'select') {
			result.push({ key, ...(field as any) })
		}
	}
	return result
})

const dynamicNumberFields = computed(() => {
	const result: Array<{ key: string; min: number; max: number;[k: string]: any }> = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if ((field as any).type === 'number') {
			result.push({ key, ...(field as any) })
		}
	}
	return result
})

const getPreviewStyle = (ratio: string) => {
	const baseSize = 120
	let width = baseSize
	let height = baseSize
	switch (ratio) {
		case '16:9':
			width = baseSize
			height = (baseSize * 9) / 16
			break
		case '4:3':
			width = baseSize
			height = (baseSize * 3) / 4
			break
		case '3:2':
			width = baseSize
			height = (baseSize * 2) / 3
			break
		case '2.35:1':
			width = baseSize
			height = baseSize / 2.35
			break
		case '4:5':
			width = (baseSize * 4) / 5
			break
		case '2:3':
			width = (baseSize * 2) / 3
			break
		case '9:16':
			width = (baseSize * 9) / 16
			break
		case '1:1':
		default:
			width = baseSize
			height = baseSize
	}
	return { width: `${width}px`, height: `${height}px` }
}

const dynamicParams = ref<Record<string, any>>({})
const openMediaDropdown = ref<string | null>(null)
const isGeneratingMedia = ref(false)
const generateError = ref('')
const mediaToolbarRef = ref<HTMLElement | null>(null)

watch(
	() => modelStore.selectedModel,
	(model) => {
		if (!model?.model_input?.fields) {
			dynamicParams.value = {}
			return
		}
		const fields = model.model_input.fields
		const newParams: Record<string, any> = {}
		for (const [key, field] of Object.entries(fields)) {
			if ((field as any).default !== undefined) {
				newParams[key] = (field as any).default
			} else if ((field as any).type === 'select' && (field as any).options?.length > 0) {
				newParams[key] = (field as any).options[0]
			} else if ((field as any).type === 'number') {
				newParams[key] = (field as any).min || 1
			}
		}
		dynamicParams.value = newParams
	},
	{ immediate: true },
)

const handleMediaGenerate = async () => {
	handleSendMessage()
}

const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedFiles = ref<{ name: string; key: string; url: string; type: string }[]>([])
const isWebSearchEnabled = ref(true)

const triggerFileUpload = () => {
	fileInputRef.value?.click()
}

const handleFileUpload = async (event: Event) => {
	const target = event.target as HTMLInputElement
	if (!target.files?.length) return

	isUploading.value = true
	try {
		// Upload each file sequentially (or concurrently)
		for (let i = 0; i < target.files.length; i++) {
			const file = target.files.item(i)
			if (!file) continue
			const { key, url } = await uploadFile(file)
			uploadedFiles.value.push({
				name: file.name,
				key,
				url,
				type: file.type,
			})
		}
	} catch (error) {
		console.error('Failed to upload file(s):', error)
		uiStore.showToast('Failed to upload file(s)', 'error')
	} finally {
		isUploading.value = false
		if (fileInputRef.value) fileInputRef.value.value = ''
	}
}

const removeFile = (index: number) => {
	uploadedFiles.value.splice(index, 1)
}

function handleSendMessage(directContent?: string) {
	const content = directContent || editor.value?.getText() || ''
	if (!content.trim() && uploadedFiles.value.length === 0) return
	try {
		// 直接使用完整的 provider:model 格式
		const modelId = modelStore.selectedModelId || 'openai:gpt-4o-mini'

		// Group files by type
		const image_urls: string[] = []
		const file_ids: string[] = []
		const readyMedia: any[] = []

		uploadedFiles.value.forEach((f) => {
			if (f.type.startsWith('image/')) {
				// In a real implementation you might pass URL or a system key format.
				// Assuming the API wants the `key` or `url`.
				// Let's pass the remote URL or key.
				image_urls.push(f.key)
				readyMedia.push(f)
			} else {
				file_ids.push(f.key)
			}
		})

		// Merge file info with dynamic params (aspect ratio, duration, etc.)
		const cleanParams = Object.fromEntries(Object.entries(dynamicParams.value).filter(([, v]) => v !== null && v !== undefined && v !== ''))
		const capability = isImageModel.value ? 'image' : isVideoModel.value ? 'video' : 'chat'
		const payloadOptions: any = { ...cleanParams, file_ids, image_urls, files: uploadedFiles.value }

		// Advanced Media Field Mapping
		if (isImageModel.value || isVideoModel.value) {
			const fields = modelInputFields.value
			if ('input_images' in fields && readyMedia.length > 0) {
				payloadOptions.input_images = readyMedia.map((f) => f.url)
			} else if ('image' in fields && readyMedia.length > 0) {
				payloadOptions.image = readyMedia[0]?.url
			} else if ('images' in fields && readyMedia.length > 0) {
				payloadOptions.images = readyMedia.map((f) => f.url)
			} else if ('ref_image' in fields && readyMedia.length > 0) {
				payloadOptions.ref_image = readyMedia[0]?.url
			}
		}
		if (supportsWebSearch.value) {
			payloadOptions.enable_web_search = isWebSearchEnabled.value
		}

		emit('send-message', content, modelId, payloadOptions, capability)

		editor.value?.commands.clearContent()
		uploadedFiles.value = []

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
	unifiedInputRef.value?.setContent(text)
	unifiedInputRef.value?.focus()
	nextTick(() => { })
}

// Set up key handler when editor is ready
watch(editor, (instance) => {
	if (instance) {
		instance.setOptions({
			editorProps: {
				handleKeyDown: (view, event) => {
					if (event.key === 'Enter' && !event.shiftKey) {
						event.preventDefault()
						if (isMediaModel.value) handleMediaGenerate()
						else handleSendMessage()
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

function setMediaParamAndClose(key: string, val: any) {
	dynamicParams.value[key] = val
	openMediaDropdown.value = null
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

/* Hide scrollbar but keep functionality */
.scrollbar-none {
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

.quick-chip {
	@apply h-10 px-4 rounded-full border border-[var(--border-main)] flex items-center gap-2;
	@apply text-[14px] text-[var(--text-primary)] transition-all cursor-pointer;
	@apply hover:bg-[var(--fill-tsp-white-light)];
}

.quick-chip-active {
	@apply bg-[var(--fill-tsp-white-light)] border-[var(--text-tertiary)];
}

.quick-sub-card {
	@apply flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--border-main)];
	@apply transition-all cursor-pointer;
	@apply hover:bg-[var(--fill-tsp-white-light)] hover:border-[var(--text-tertiary)] hover:shadow-sm;
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
