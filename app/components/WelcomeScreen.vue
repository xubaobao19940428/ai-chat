<template>
	<div class="flex flex-col h-full bg-[#f9f9f9] dark:bg-black relative overflow-hidden">
		<!-- Main Content Area -->
		<div class="flex-1 flex flex-col items-center pt-24 sm:pt-32 px-4 z-10 overflow-y-auto custom-scrollbar">
			<div class="w-full max-w-4xl mx-auto flex flex-col items-center">
				<!-- Greeting Section -->
				<div class="text-center mb-10 flex flex-col items-center">
					<div class="w-12 h-12 text-black/10 dark:text-white/10 mb-8">
						<svg viewBox="0 0 24 24" fill="none" class="w-full h-full animate-pulse" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 2L15 8L21 9L16.5 13.5L18 19.5L12 16.5L6 19.5L7.5 13.5L3 9L9 8L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="0.5" />
						</svg>
					</div>
					<h2 class="text-4xl sm:text-5xl font-black text-black dark:text-white mb-4 tracking-tight leading-tight">{{ title }}</h2>
					<p class="text-lg text-black/40 dark:text-white/40 font-bold tracking-tight">{{ subtitle }}</p>
				</div>

				<!-- Premium Manus-Style Input Area -->
				<div class="w-full max-w-3xl mx-auto mb-10">
					<div class="bg-white dark:bg-[#111111] border border-gray-200/60 dark:border-white/10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-500 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:border-gray-300 dark:focus-within:border-white/20">
						<!-- Input Area -->
						<div class="px-8 pt-8 pb-2">
							<textarea v-model="inputMessage" :placeholder="placeholder" rows="1" class="w-full bg-transparent text-lg text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none resize-none max-h-64 overflow-y-auto leading-relaxed font-bold tracking-tight" :disabled="isLoading" @keydown.enter.exact.prevent="handleSubmit" @keydown.enter.shift.exact="inputMessage += '\n'" @input="autoResize" ref="textareaRef"></textarea>
						</div>

						<!-- Tool Buttons Row -->
						<div class="flex items-center justify-between px-6 pb-6 pt-2">
							<!-- Left Side Icons -->
							<div class="flex items-center gap-1">
								<button class="p-2 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors" title="Add">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6" />
									</svg>
								</button>
								<button class="p-2 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors" title="Tool">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								</button>
							</div>

							<!-- Right Side Icons -->
							<div class="flex items-center gap-2">
								<ModelSelector />
								<div class="w-px h-6 bg-black/[0.05] dark:bg-white/[0.05] mx-1"></div>
								<button class="p-2 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</button>
								<button class="p-2 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
									</svg>
								</button>
								<button @click="handleSubmit" :disabled="!inputMessage.trim() || isLoading" class="w-10 h-10 bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 disabled:opacity-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
									</svg>
								</button>
							</div>
						</div>

						<!-- Connection Banner -->
						<div class="px-8 py-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-black/30 dark:text-white/20">
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<circle cx="12" cy="12" r="3" stroke-width="2" />
									<path
										d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
										stroke-width="2" />
								</svg>
								<span>Connect your tools to Manus</span>
							</div>
							<div class="flex items-center gap-1">
								<div class="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5 border border-white dark:border-black shadow-sm"></div>
								<div class="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5 border border-white dark:border-black shadow-sm -ml-2"></div>
								<div class="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5 border border-white dark:border-black shadow-sm -ml-2"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Suggestions -->
				<div class="mb-16">
					<div class="flex flex-wrap justify-center gap-3">
						<button v-for="suggestion in visibleSuggestions" :key="suggestion.id" @click="handleApplyPrompt(suggestion)" class="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#111111] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white rounded-2xl border border-gray-200/50 dark:border-white/5 transition-all text-sm font-bold shadow-sm">
							<span class="text-base grayscale opacity-40">{{ suggestion.icon }}</span>
							<span>{{ suggestion.label }}</span>
						</button>
						<button v-if="!showAllSuggestions && PROMPT_SUGGESTIONS.length > 5" @click="showAllSuggestions = true" class="flex items-center px-6 py-3 bg-white dark:bg-[#111111] text-black/30 dark:text-white/20 hover:text-black dark:hover:text-white rounded-2xl transition-all text-sm font-bold border border-gray-200/50 dark:border-white/5">
							<span>More</span>
						</button>
					</div>
				</div>

				<!-- Footer Decorative Cards (matching screenshot) -->
				<div class="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
					<div class="p-6 rounded-[2rem] bg-white dark:bg-[#111111] border border-gray-200/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
						<div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
							</svg>
						</div>
						<h4 class="font-bold text-black dark:text-white text-sm mb-1">Download app to access Manus</h4>
						<p class="text-xs text-black/30 dark:text-white/20 font-medium">Native experience for desktop</p>
					</div>
					<div class="p-6 rounded-[2rem] bg-white dark:bg-[#111111] border border-gray-200/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
						<div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<h4 class="font-bold text-black dark:text-white text-sm mb-1">Get new capabilities with...</h4>
						<p class="text-xs text-black/30 dark:text-white/20 font-medium">Explore the latest AI models</p>
					</div>
					<div class="p-6 rounded-[2rem] bg-white dark:bg-[#111111] border border-gray-200/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
						<div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<h4 class="font-bold text-black dark:text-white text-sm mb-1">Let Manus know more about...</h4>
						<p class="text-xs text-black/30 dark:text-white/20 font-medium">Personalize your workspace</p>
					</div>
				</div>

				<!-- Original Bot Categories Section (Preserved logic) -->
				<div class="w-full pb-32">
					<div class="flex items-center gap-4 mb-10 px-4 opacity-20">
						<div class="h-px flex-1 bg-black dark:bg-white"></div>
						<span class="text-[10px] font-black uppercase tracking-[0.3em]">Available Discovery</span>
						<div class="h-px flex-1 bg-black dark:bg-white"></div>
					</div>

					<template v-if="discoveryStore.isLoading">
						<div class="flex justify-center py-20">
							<div class="w-10 h-10 border-[3px] border-black/5 dark:border-white/10 border-t-black/20 dark:border-t-white/40 rounded-full animate-spin"></div>
						</div>
					</template>
					<template v-else>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							<BotCategory v-for="group in discoveryStore.groups" :key="group.id" :title="group.title" :bots="mapGroupToBots(group)" class="animate-in fade-in slide-in-from-bottom-4 duration-700" />
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { type Bot } from '../utils/bots'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '../utils/prompts'
import { type DiscoveryGroup } from '../utils/api'
import { useModelStore } from '../stores/models'
import { useDiscoveryStore } from '../stores/discovery'

// Props
interface Props {
	mode?: 'chat' | 'image' | 'search'
	isLoading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
	mode: 'chat',
	isLoading: false,
})

// Emits
const emit = defineEmits<{
	(e: 'sendMessage', content: string, model: string): void
	(e: 'modelChange', modelId: string): void
}>()

// State
const inputMessage = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const modelStore = useModelStore()
const discoveryStore = useDiscoveryStore()
const showAllSuggestions = ref(false)
const activeSubPrompts = ref<string[]>([])

// Computed
const title = computed(() => {
	if (props.mode === 'image') return 'AI 绘画创作'
	if (props.mode === 'search') return 'AI 全网搜索'
	return '晚上好, Bot'
})

const visibleSuggestions = computed(() => {
	if (showAllSuggestions.value) return PROMPT_SUGGESTIONS
	return PROMPT_SUGGESTIONS.slice(0, 5)
})

const subtitle = computed(() => {
	if (props.mode === 'image') return '描述你想象中的画面'
	if (props.mode === 'search') return '即时获取最新网络资讯'
	return '今天有什么需要帮忙的?'
})

const placeholder = computed(() => {
	if (props.mode === 'image') return '例如：一只在大海冲浪的赛博朋克猫...'
	if (props.mode === 'search') return '搜索网络...'
	return 'Type a message...'
})

// Methods
const mapGroupToBots = (group: DiscoveryGroup): Bot[] => {
	return group.items.map((item) => ({
		id: String(item.related_id), // Use related_id as bot ID for chat context
		name: item.title,
		description: item.subtitle,
		icon: item.cover,
		type: item.type === 'character' ? 'standard' : (item.type as any),
		mode: item.type === 'character' ? 'chat' : 'chat',
	}))
}

// Methods
const autoResize = () => {
	nextTick(() => {
		if (textareaRef.value) {
			textareaRef.value.style.height = 'auto'
			textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 128)}px`
		}
	})
}

const handleApplyPrompt = (suggestion: PromptSuggestion) => {
	inputMessage.value = suggestion.prompt
	if (suggestion.subPrompts) {
		activeSubPrompts.value = suggestion.subPrompts
	} else {
		activeSubPrompts.value = []
	}
	autoResize()
	if (textareaRef.value) textareaRef.value.focus()
}

const handleApplySubPrompt = (sub: string) => {
	inputMessage.value = sub
	activeSubPrompts.value = []
	autoResize()
	if (textareaRef.value) textareaRef.value.focus()
}

const handleSubmit = () => {
	if (!inputMessage.value.trim() || props.isLoading) return

	emit('sendMessage', inputMessage.value.trim(), modelStore.selectedModelId || 'gpt-4o-mini')
	inputMessage.value = ''
	activeSubPrompts.value = []
	if (textareaRef.value) {
		textareaRef.value.style.height = 'auto'
	}
}
</script>

<style scoped>
/* Copied animations from ChatView */
@keyframes bounce {
	0%,
	80%,
	100% {
		transform: scale(0);
		opacity: 0.5;
	}
	40% {
		transform: scale(1);
		opacity: 1;
	}
}

.animate-bounce {
	animation: bounce 1.4s infinite ease-in-out;
}

.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
	width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: rgba(156, 163, 175, 0.3);
	border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background-color: rgba(156, 163, 175, 0.5);
}
</style>
