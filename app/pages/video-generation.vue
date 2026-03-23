<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden pt-4">
		<!-- Tab Switcher (Fixed at Top, Outside Scroll Area) -->
		<!-- <div class="flex justify-center py-4 bg-[var(--background-gray-main)] border-b border-transparent">
			<div
				class="bg-[var(--fill-tsp-gray-main)] p-1 rounded-full border border-[var(--border-main)] flex items-center">
				<button @click="activeTab = 'inspiration'"
					class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
					:class="activeTab === 'inspiration' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">Inspiration</button>
				<button @click="activeTab = 'creations'"
					class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
					:class="activeTab === 'creations' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">My
					Videos</button>
			</div>
		</div> -->

		<!-- Category Filter Chips (Fixed, Outside Scroll Area) -->
		<div v-if="activeTab === 'inspiration'" class="flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
			<button v-for="cat in categories" :key="cat.id" @click="handleCategoryChange(cat.id)" :class="['px-4 py-1.5 text-[13px] font-medium rounded-full border transition-all whitespace-nowrap', selectedCategory === cat.id ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]']">
				{{ $t('video_generation.categories.' + cat.name) }}
			</button>
		</div>

		<!-- Scrollable Content Area -->
		<main class="flex-1 overflow-y-auto px-4 py-6 pb-56 custom-scrollbar relative">
			<div class="max-w-full mx-auto">
				<!-- Tab Content -->
				<div v-if="activeTab === 'inspiration'">
					<!-- Masonry Skeleton Grid -->
					<div v-if="discoveryStore.isLoading && exampleVideos.length === 0" class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
						<div v-for="i in 8" :key="i" class="break-inside-avoid relative rounded-2xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] animate-pulse shadow-sm">
							<div :style="{ aspectRatio: skeletonRatios[i - 1] }" class="bg-[var(--fill-tsp-gray-main)]"></div>
							<div class="absolute inset-x-0 bottom-0 p-6 space-y-3">
								<div class="h-3 bg-[var(--text-primary)]/10 rounded w-full"></div>
								<div class="h-3 bg-[var(--text-primary)]/10 rounded w-2/3"></div>
								<div class="h-8 bg-[var(--text-primary)]/10 rounded-full w-24 mt-4"></div>
							</div>
						</div>
					</div>

					<!-- Masonry Grid Layout for Inspiration -->
					<MasonryGrid v-else :items="exampleVideos" v-slot="{ item: example }">
						<div class="group relative rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-card)] border border-[var(--border-main)] hover:border-[var(--text-tertiary)] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md h-fit" @click="useExample(example.prompt)" @mouseenter="hoveredIndex = example.id" @mouseleave="hoveredIndex = null">
							<img :src="example.thumbnail" loading="lazy" class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 bg-[#f0eeeb] dark:bg-[#2c2c2c]" :alt="example.prompt" :style="{ minHeight: '200px' }" @load="($event.target as HTMLImageElement).style.minHeight = 'auto'" />

							<!-- Hover Video (PC Only) -->
							<video v-if="hoveredIndex === example.id && example.videoUrl" :src="example.videoUrl" autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover hidden md:block z-0" />

							<!-- Hover Prompt Overlay -->
							<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10 pointer-events-none">
								<p class="text-white text-[13px] font-medium line-clamp-2 italic mb-3 leading-snug">"{{ example.prompt }}"</p>
								<div class="flex items-center">
									<span class="px-4 py-1.5 rounded-full bg-white text-[11px] font-bold text-black uppercase tracking-wider backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto" @click.stop="useExample(example.prompt)">{{ $t('common.use_prompt') }}</span>
								</div>
							</div>

							<!-- Play Icon Overlay (Mobile priority, PC hover hidden) -->
							<div class="absolute inset-0 flex items-center justify-center pointer-events-none z-20 md:opacity-0 md:group-hover:hidden transition-opacity duration-300">
								<div class="size-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 pointer-events-auto transition-transform cursor-pointer" @click.stop="selectedVideo = example">
									<Play :size="28" class="text-white ml-1" fill="currentColor" />
								</div>
							</div>
						</div>
					</MasonryGrid>

					<!-- Load More Trigger & Loading State -->
					<div ref="loadMoreTrigger" class="h-40 flex flex-col items-center justify-center mt-12 mb-20">
						<div v-if="discoveryStore.isLoadingMore" class="flex flex-col items-center gap-4">
							<div class="relative size-12 flex items-center justify-center">
								<div class="absolute inset-0 bg-[var(--text-primary)]/5 rounded-full animate-ping-slow"></div>
								<Loader2 class="animate-spin text-[var(--text-primary)]" :size="24" />
							</div>
							<span class="text-[11px] font-black text-[var(--text-primary)] tracking-[0.3em] uppercase opacity-60">{{ $t('common.expanding_vision') }}</span>
						</div>
						<div v-else-if="!discoveryStore.hasMore && exampleVideos.length > 0" class="flex flex-col items-center gap-3 opacity-30">
							<div class="w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-primary)] to-transparent"></div>
							<span class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.4em] uppercase">{{ $t('common.end_of_list') }}</span>
							<div class="w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-primary)] to-transparent"></div>
						</div>
					</div>
				</div>

				<div v-else>
					<!-- Noir Excellence Empty State (V2 Integrated) -->
					<div v-if="generatedVideos.length === 0 && activeTasks.length === 0" class="py-32 flex flex-col items-center justify-center relative overflow-hidden">
						<!-- Architectural Shadow/Light (Theme Aware) -->
						<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--text-primary)]/[0.015] blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-40"></div>

						<!-- Precision Particles -->
						<div class="absolute inset-0 pointer-events-none">
							<div
								v-for="i in 8"
								:key="i"
								class="absolute size-[1px] bg-[var(--text-primary)]/10 animate-float"
								:style="{
									top: `${Math.random() * 60 + 20}%`,
									left: `${Math.random() * 60 + 20}%`,
									animationDelay: `${Math.random() * 10}s`,
									animationDuration: `${Math.random() * 15 + 10}s`,
								}"></div>
						</div>

						<div class="relative group cursor-default">
							<!-- Architectural Sphere -->
							<div class="absolute inset-0 bg-gradient-to-tr from-[var(--text-primary)]/5 to-[var(--text-primary)]/0 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-1000"></div>
							<div class="relative size-32 rounded-3xl bg-[var(--bg-main)] backdrop-blur-[40px] border border-[var(--border-main)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-700 group-hover:border-[var(--text-tertiary)]/30 group-hover:shadow-[var(--shadow-L)]">
								<!-- Architectural Lens Icon -->
								<svg viewBox="0 0 40 40" class="size-12 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors duration-500" fill="none" stroke="currentColor">
									<rect x="8" y="12" width="24" height="16" rx="3" stroke-width="1.5" />
									<path d="M18 16L24 20L18 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M8 32H32M12 28H28" stroke-width="1" stroke-opacity="0.1" />
								</svg>
							</div>
						</div>

						<div class="text-center mt-14 relative z-10 space-y-3">
							<h3 class="text-[15px] font-black text-[var(--text-primary)] tracking-[0.25em] uppercase">Cinematic Dimensions</h3>
							<p class="text-[var(--text-tertiary)] text-[13.5px] max-w-[320px] px-4 leading-relaxed font-normal tracking-wide italic opacity-80">Every visionary motion sequence is preserved in the Aura collection. Begin your orchestration.</p>
						</div>

						<button @click="triggerFocus" class="mt-14 px-12 py-3 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl hover:shadow-[var(--shadow-M)] flex items-center gap-4 group/btn">
							<span>Start Directing</span>
							<div class="size-1 bg-[var(--bg-main)] rounded-full group-hover:scale-150 transition-transform"></div>
						</button>
					</div>

					<!-- Premium Video Gallery Grid -->
					<div v-if="generatedVideos.length > 0 || activeTasks.length > 0" class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
						<!-- Noir Video Task Cards (Integrated) -->
						<div v-for="task in activeTasks" :key="task.id" class="break-inside-avoid relative rounded-2xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] transition-all duration-700 shadow-2xl group/gen">
							<!-- Technical Preview Area -->
							<div class="relative aspect-video flex items-center justify-center overflow-hidden bg-black">
								<!-- Premium Placeholder Background -->
								<img v-if="!task.videoUrl" src="/noir_placeholder.png" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />

								<!-- Precision Scanner (Theme Aware) -->
								<div v-if="!task.videoUrl" class="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan-y z-10 pointer-events-none"></div>

								<!-- Negative-to-Positive Reveal -->
								<template v-if="task.videoUrl">
									<img v-if="task.videoUrl.startsWith('data:image')" :src="task.videoUrl" class="w-full h-full object-cover animate-noir-reveal relative z-20" />
									<video v-else :src="task.videoUrl" class="w-full h-full object-cover animate-noir-reveal relative z-20" autoplay muted loop playsinline></video>
								</template>

								<!-- Industrial Loader (Integrated) -->
								<div v-else class="flex flex-col items-center gap-8 z-20">
									<div class="relative size-24 flex items-center justify-center">
										<div class="absolute inset-0 bg-[var(--text-primary)]/[0.03] rounded-full animate-ping-slow"></div>
										<!-- Precision Ring -->
										<svg class="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
											<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" class="text-[var(--text-primary)]" stroke-opacity="0.05" stroke-width="1" />
											<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" class="text-[var(--text-primary)] transition-all duration-1000 ease-linear" stroke-width="2" stroke-linecap="round" stroke-dasharray="290" :stroke-dashoffset="290 - (290 * task.progress) / 100" />
										</svg>
										<span class="text-[16px] font-mono font-bold text-[var(--text-primary)] tracking-tighter">{{ task.progress }}%</span>
									</div>
									<div class="flex flex-col items-center gap-2">
										<p class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.3em] uppercase opacity-60">
											{{ task.status }}
										</p>
									</div>
								</div>
							</div>

							<!-- Technical Footer -->
							<div class="p-6 bg-[var(--bg-main)] relative z-30 border-t border-[var(--border-main)]">
								<div class="flex items-center justify-between mb-4">
									<div class="flex items-center gap-3">
										<div class="size-1.5 bg-[var(--text-primary)] animate-pulse rounded-full"></div>
										<span class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.2em] uppercase">SYSTEM_ACTIVE</span>
									</div>
									<span v-if="task.usage" class="text-[10px] font-mono text-[var(--text-tertiary)] bg-[var(--fill-tsp-gray-main)] px-2.5 py-1 rounded-[6px] border border-[var(--border-main)]"> {{ task.usage.credits }} UNITS </span>
								</div>
								<p class="text-[var(--text-secondary)] text-[12.5px] font-normal line-clamp-2 leading-relaxed tracking-wide italic leading-snug">"{{ task.prompt }}"</p>
							</div>
						</div>

						<div v-for="(video, index) in filteredGeneratedVideos" :key="video.id" class="break-inside-avoid group relative rounded-[24px] overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-purple-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">
							<!-- Video Container -->
							<div class="relative overflow-hidden aspect-video bg-[var(--bg-hover)]">
								<template v-if="video.status === 1">
									<img v-if="!playingVideoId || playingVideoId !== video.id" :src="video.thumbnail || getRecordPrimaryUrl(video)" class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
									<video v-else :src="getRecordPrimaryUrl(video)" class="w-full h-full object-cover" controls autoplay playsinline></video>
									<div class="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[24px]"></div>

									<!-- Play Button Overlay -->
									<div v-if="!playingVideoId || playingVideoId !== video.id" class="absolute inset-0 flex items-center justify-center cursor-pointer" @click="playingVideoId = video.id">
										<div class="size-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
											<Play :size="28" class="text-white ml-1" fill="currentColor" />
										</div>
									</div>

									<!-- Duration Badge -->
									<div class="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
										{{ formatDuration(5) }}
									</div>
								</template>

								<!-- Processing State in History -->
								<div v-else class="h-full relative flex flex-col items-center justify-center overflow-hidden bg-black/40">
									<img src="/noir_placeholder.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
									<div class="relative z-10 flex flex-col items-center gap-4">
										<div class="size-10 rounded-full border border-white/10 border-t-white/40 animate-spin"></div>
										<span class="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">Processing</span>
									</div>
								</div>
							</div>

							<!-- Content Overlay (Sophisticated Gradient) -->
							<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-5 pointer-events-none group-hover:pointer-events-auto">
								<!-- Top Actions (Glassmorphism) -->
								<div class="flex justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
									<button @click.stop="handleDownload(getRecordPrimaryUrl(video))" class="size-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all shadow-2xl group/btn">
										<Download :size="18" class="group-hover/btn:scale-110 transition-transform" />
									</button>
								</div>

								<!-- Bottom Info -->
								<div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
									<div class="flex items-center gap-2 mb-2">
										<span class="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/80 uppercase tracking-wider">
											{{ formatModel(getRecordModel(video)) }}
										</span>
										<span class="text-[10px] font-medium text-white/60">
											{{ formatDate(video.created_at) }}
										</span>
									</div>

									<!-- Technical Metadata (Noir Style for Video) -->
									<div v-if="getRecordParams(video)" class="flex flex-wrap gap-2 mb-4 opacity-70">
										<div v-if="getRecordParams(video).aspect_ratio" class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											{{ getRecordParams(video).aspect_ratio }}
										</div>
										<div v-if="getRecordParams(video).resolution" class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											{{ getRecordParams(video).resolution }}
										</div>
										<div v-if="getRecordParams(video).duration" class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">{{ getRecordParams(video).duration }}S</div>
										<div v-if="getRecordParams(video).seed" class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">SEED: {{ getRecordParams(video).seed }}</div>
									</div>

									<p class="text-white text-[13px] font-medium mb-4 line-clamp-3 leading-relaxed italic">"{{ getRecordPrompt(video) || 'No description' }}"</p>
									<button @click.stop="useExample(getRecordPrompt(video))" class="w-full py-2.5 bg-white text-black rounded-xl font-bold text-[12px] hover:bg-purple-50 transition-colors shadow-xl flex items-center justify-center gap-2 group/reuse">
										<Zap :size="14" fill="currentColor" class="text-purple-600 group-hover/reuse:animate-pulse" />
										Reuse Prompt
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<!-- UnifiedInput -->
		<div class="absolute bottom-12 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
			<div class="w-full max-w-[840px] relative pointer-events-auto">
				<UnifiedInput
					ref="unifiedInputRef"
					capability="video_generation"
					:is-loading="isGenerating"
					@send="handleUnifiedSend"
				/>
			</div>
		</div>
	</div>

	<!-- Video Preview Modal -->
	<Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
		<div v-if="selectedVideo" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-2xl bg-black/90" @click="selectedVideo = null">
			<!-- Close Button -->
			<button class="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[110]" @click="selectedVideo = null">
				<X :size="24" />
			</button>

			<div class="relative w-full max-w-5xl flex flex-col items-center gap-6" @click.stop>
				<!-- Video Player -->
				<div class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 bg-black">
					<video :key="selectedVideo.videoUrl" :src="selectedVideo.videoUrl" controls autoplay loop playsinline class="w-full h-full object-contain" />
				</div>

				<!-- Info & Prompt -->
				<div class="w-full max-w-3xl flex flex-col gap-4 text-center">
					<p class="text-white/90 text-[15px] sm:text-lg font-medium italic leading-relaxed line-clamp-4 px-4">"{{ selectedVideo.prompt }}"</p>
					<div class="flex justify-center mt-2">
						<button
							@click="
								() => {
									useExample(selectedVideo!.prompt)
									selectedVideo = null
								}
							"
							class="px-8 py-3 rounded-full bg-white text-black font-bold text-sm tracking-wide hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl">
							USE THIS PROMPT
						</button>
					</div>
				</div>
			</div>
		</div>
	</Transition>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { ImagePlus, Plus, Check, Zap, Loader2, X, Film, Download, ChevronDown, Sparkles, Play, Clock } from 'lucide-vue-next'
import { getModels, getAsyncTaskOutputs, uploadFile, getRecordPrompt, getRecordPrimaryUrl, getRecordModel, getRecordParams, type AIModel, type AsyncTaskRecord } from '@/utils/api'
import { useModelStore } from '@/stores/models'
import UnifiedInput from '~/components/UnifiedInput.vue'
import ModelSelector from '@/components/ModelSelector.vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '@/stores/conversation'
import { useChatStore } from '@/stores/chat'
import { useVideoDiscoveryStore } from '~/stores/discovery'

const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const modelStore = useModelStore()
const discoveryStore = useVideoDiscoveryStore()
const unifiedInputRef = ref<InstanceType<typeof UnifiedInput> | null>(null)
const selectedModel = computed(() => modelStore.selectedModel)
const isVideoModel = computed(() => {
	const model = selectedModel.value
	return model?.capabilities?.includes('video_generation') || model?.model_input?.capability === 'video_generation' || false
})

// --- Typewriter Placeholder Effect ---
const hoveredIndex = ref<number | null>(null)
const selectedVideo = ref<{ prompt: string; videoUrl: string } | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
const displayedPlaceholder = ref('')
let typewriterInterval: ReturnType<typeof setInterval> | null = null

const runTypewriter = () => {
	if (typewriterInterval) clearInterval(typewriterInterval)
	displayedPlaceholder.value = ''
	let i = 0
	const text = 'Describe a video and click generate...'
	typewriterInterval = setInterval(() => {
		if (i < text.length) {
			displayedPlaceholder.value += text[i]
			i++
		} else {
			clearInterval(typewriterInterval!)
		}
	}, 20)
}

// --- Dynamic Input Logic ---
const modelInputFields = computed(() => {
	if (!isVideoModel.value) return {}
	return selectedModel.value?.model_input?.fields || {}
})

const dynamicSelectFields = computed(() => {
	const fields = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if ((field as any).type === 'select') {
			fields.push({ key, ...(field as any) })
		}
	}
	return fields
})

const supportsImageUpload = computed(() => {
	const fields = modelInputFields.value
	return !!(fields['image'] || fields['images'] || fields['image_urls'] || fields['image_url'] || fields['input_images'] || fields['input_image'])
})

const dynamicParams = ref<Record<string, any>>({})

// Initialize default values when model changes
watch(
	() => selectedModel.value,
	(newModel) => {
		const fields = newModel?.model_input?.fields || {}
		const newParams: Record<string, any> = {}
		for (const [key, field] of Object.entries(fields)) {
			if (field.default !== undefined) {
				newParams[key] = field.default
			} else if (field.type === 'select' && field.options && field.options.length > 0) {
				newParams[key] = field.options[0] // fallback to first option
			}
		}
		dynamicParams.value = newParams
	},
	{ immediate: true },
)

const activeDropdownField = ref<string | null>(null)

const toggleDropdown = (key: string) => {
	activeDropdownField.value = activeDropdownField.value === key ? null : key
}

const activeTab = ref<'inspiration' | 'creations'>('inspiration')
const prompt = ref('')
const skeletonRatios = Array.from({ length: 8 }, () => `9/${Math.floor(12 + Math.random() * 8)}`)
interface ActiveTask {
	id: string
	taskId?: string
	prompt: string
	progress: number
	status: string
	videoUrl?: string
	usage?: any
}

const activeTasks = ref<ActiveTask[]>([])
const isGenerating = computed(() => activeTasks.value.length > 0)
const selectedCategory = ref(46)
const openDropdown = ref<string | null>(null)
const playingVideoId = ref<number | null>(null)

// File Upload State
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedImageKey = ref('')
const previewImageUrl = ref('')
const inputRef = ref<HTMLDivElement | null>(null)
const openStartFrameDropdown = ref(false)
const showAssetPicker = ref(false)

const onAssetSelected = (assets: Array<{ key: string; url: string }>) => {
	if (assets.length > 0) {
		uploadedImageKey.value = assets[0]?.key || ''
		previewImageUrl.value = assets[0]?.url || ''
	}
}

const categories = [
	{
		id: 46,
		name: 'all',
	},
	{
		id: 38,
		name: 'drama',
	},
	{
		id: 39,
		name: 'dance',
	},
	{
		id: 42,
		name: 'advertising',
	},
	{
		id: 43,
		name: 'chinese_fantasy',
	},
	{
		id: 40,
		name: 'scifi_action',
	},
	{
		id: 41,
		name: 'anime_game',
	},
	{
		id: 47,
		name: 'healing',
	},
	// {
	// 	id: 45,
	// 	name: 'uncategorized',
	// },
]

const generatedVideos = ref<AsyncTaskRecord[]>([])
const filteredGeneratedVideos = computed(() => {
	const activeIds = new Set(activeTasks.value.map((t) => t.taskId).filter(Boolean))
	return generatedVideos.value.filter((img) => !activeIds.has(img.provider_task_id))
})

const fetchHistory = async () => {
	try {
		const res = await getAsyncTaskOutputs({ capability: 'video', page_size: 50 })
		if (res.data && res.data.list) {
			generatedVideos.value = res.data.list
		}
	} catch (error) {
		console.error('Failed to fetch history:', error)
	}
}

const controlBarRef = ref<HTMLDivElement | null>(null)

const isElementInViewport = (el: HTMLElement) => {
	const rect = el.getBoundingClientRect()
	return rect.top < window.innerHeight && rect.bottom > 0
}

const handleClickOutside = (event: MouseEvent) => {
	if (activeDropdownField.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
		activeDropdownField.value = null
	}
	// Also handle start frame dropdown
	if (openStartFrameDropdown.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
		openStartFrameDropdown.value = false
	}
}

onMounted(() => {
	runTypewriter()
	if (discoveryStore.allItems.length === 0) {
		discoveryStore.fetchDiscovery(selectedCategory.value)
	}
	window.addEventListener('mousedown', handleClickOutside)

	// Initialize Infinite Scroll — auto-fill if viewport not full
	const tryLoadMore = async () => {
		while (
			loadMoreTrigger.value &&
			discoveryStore.hasMore &&
			!discoveryStore.isLoadingMore &&
			!discoveryStore.isLoading &&
			isElementInViewport(loadMoreTrigger.value)
		) {
			await discoveryStore.fetchMore()
			await nextTick()
		}
	}

	observer = new IntersectionObserver(
		(entries) => {
			if (entries[0]?.isIntersecting) {
				tryLoadMore()
			}
		},
		{ threshold: 0.1 },
	)
	if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
})

onUnmounted(() => {
	if (typewriterInterval) clearInterval(typewriterInterval)
	window.removeEventListener('mousedown', handleClickOutside)
	if (observer) observer.disconnect()
})

const triggerFocus = () => {
	if (inputRef.value) {
		inputRef.value.focus()
	}
}

const formatDate = (timestamp: number) => {
	if (!timestamp) return ''
	const date = new Date(timestamp * 1000)
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

const formatModel = (modelStr?: string) => {
	if (!modelStr) return 'RUNWAY'
	const parts = modelStr.split(':')
	const name = parts.length > 1 ? parts[1] : parts[0]
	return (name || '').replace(/-/g, ' ').toUpperCase()
}

const formatDuration = (seconds: number) => {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins}:${secs.toString().padStart(2, '0')}`
}

const exampleVideos = computed(() => {
	return discoveryStore.allItems.map((item) => ({
		id: item.id,
		prompt: item.related_data?.prompt || item.subtitle || '',
		thumbnail: item.related_data?.thumbnail || item.cover || '',
		videoUrl: item.related_data?.assets?.[0] || '',
	}))
})

const useExample = (examplePrompt: string) => {
	prompt.value = examplePrompt
	unifiedInputRef.value?.setContent(examplePrompt)
	const mainEl = document.querySelector('main')
	if (mainEl) mainEl.scrollTo({ top: mainEl.scrollHeight, behavior: 'smooth' })
}

const handleInput = (e: Event) => {
	const target = e.target as HTMLDivElement
	prompt.value = target.innerText
}

const handleEnterKey = (e: KeyboardEvent) => {
	if (e.shiftKey) {
		return
	}
	e.preventDefault()
	// generateVideo() - replaced by UnifiedInput
}

const handlePaste = (e: ClipboardEvent) => {
	e.preventDefault()
	const text = e.clipboardData?.getData('text/plain') || ''
	document.execCommand('insertText', false, text)
}

const triggerFileUpload = () => {
	fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
	const target = event.target as HTMLInputElement
	const file = target.files?.[0]
	if (!file) return

	isUploading.value = true
	try {
		const { key, url } = await uploadFile(file)
		uploadedImageKey.value = key
		previewImageUrl.value = url
	} catch (error) {
		console.error('Failed to upload file:', error)
	} finally {
		isUploading.value = false
		if (fileInput.value) fileInput.value.value = ''
	}
}

const removeAttachedImage = () => {
	uploadedImageKey.value = ''
	previewImageUrl.value = ''
}

const handleUnifiedSend = async (payload: { content: string; params: Record<string, any>; files: any[]; mediaFiles: any[] }) => {
	if (!payload.content.trim() || !selectedModel.value) return

	const params: Record<string, any> = { ...payload.params }
	const file_ids: string[] = []
	const image_urls: string[] = []
	const files: any[] = []
	const modelFields = selectedModel.value?.model_input?.fields || {}

	if (payload.mediaFiles.length > 0) {
		// Map files by their paramKey to the correct API parameter
		for (const mf of payload.mediaFiles) {
			if (!mf?.url) continue
			const pk = mf.paramKey || ''

			if (pk === 'image' && 'image' in modelFields) {
				params['image'] = mf.url
			} else if (pk === 'init_image' && ('init_image' in modelFields || 'start_image' in modelFields)) {
				params['init_image' in modelFields ? 'init_image' : 'start_image'] = mf.url
			} else if (pk === 'end_image' && 'end_image' in modelFields) {
				params['end_image'] = mf.url
			} else if (pk === 'video' && 'video' in modelFields) {
				params['video'] = mf.url
			} else if (pk === 'input_images') {
				if (!params['input_images']) params['input_images'] = []
				params['input_images'].push(mf.url)
			} else if (pk === 'input_videos') {
				if (!params['input_videos']) params['input_videos'] = []
				params['input_videos'].push(mf.url)
			} else if (!pk) {
				// Legacy fallback: no paramKey, try to map by model fields
				if ('init_image' in modelFields) params['init_image'] = mf.url
				else if ('image' in modelFields) params['image'] = mf.url
			}

			if (mf.key) image_urls.push(mf.key)
			files.push(mf)
		}
	}

	const model = `${selectedModel.value.provider}:${selectedModel.value.model}`

	try {
		chatStore.setLoading(true)

		const conversationId = await conversationStore.createConversation({
			model: model,
			model_id: selectedModel.value.id,
			group_id: conversationStore.selectedGroupId || 0,
			params: { ...params, file_ids, image_urls, files },
			capability: 'video',
		})

		conversationStore.addMessage(conversationId, {
			role: 'user',
			content: payload.content,
		})

		chatStore.setPendingMessage(payload.content)

		router.push(`/chat/${conversationId}`)
	} catch (e) {
		console.error('Failed to start chat:', e)
		chatStore.setLoading(false)
	}
}

const generateVideo = async () => {
	if (!prompt.value.trim() || !selectedModel.value) return

	const currentPrompt = prompt.value
	prompt.value = ''
	if (inputRef.value) inputRef.value.innerText = ''

	const payload: { [key: string]: any } = {
		...dynamicParams.value,
	}

	const file_ids: string[] = []
	const image_urls: string[] = []
	const files: any[] = []

	// Add image if supported
	if (supportsImageUpload.value && previewImageUrl.value) {
		const imageField = modelInputFields.value['image_urls'] ? 'image_urls' : 'image'
		if (imageField === 'image_urls') {
			payload['image_urls'] = [previewImageUrl.value]
		} else {
			payload['image'] = previewImageUrl.value
		}
		image_urls.push(uploadedImageKey.value)
		files.push({ key: uploadedImageKey.value, url: previewImageUrl.value, name: 'Start Frame', type: 'image/jpeg' })
	}

	const model = `${selectedModel.value.provider}:${selectedModel.value.model}`

	try {
		chatStore.setLoading(true)

		const conversationId = await conversationStore.createConversation({
			character_id: 1,
			model: model,
			model_id: selectedModel.value.id,
			group_id: conversationStore.selectedGroupId || 0,
			params: { ...payload, file_ids, image_urls, files },
			capability: 'video',
		})

		conversationStore.addMessage(conversationId, {
			role: 'user',
			content: currentPrompt,
		})

		chatStore.setPendingMessage(currentPrompt)

		removeAttachedImage()

		router.push(`/chat/${conversationId}`)
	} catch (e) {
		console.error('Failed to start chat:', e)
		chatStore.setLoading(false)
	}
}

const handleDownload = (videoUrl: string) => {
	window.open(videoUrl, '_blank')
}

const toggleStartFrameDropdown = () => {
	openStartFrameDropdown.value = !openStartFrameDropdown.value
}

const handleStartFrameUpload = () => {
	triggerFileUpload()
	openStartFrameDropdown.value = false
}

const handleSelectAsset = () => {
	openStartFrameDropdown.value = false
	showAssetPicker.value = true
}

const setParamAndClose = (key: string, val: any) => {
	dynamicParams.value[key] = val
	toggleDropdown(key)
}

const handleCategoryChange = (id: number) => {
	if (selectedCategory.value === id) return
	selectedCategory.value = id
	discoveryStore.fetchDiscovery(id)
}
</script>

<style scoped lang="scss">
.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: var(--border-light) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: var(--border-light);
		border-radius: 10px;

		&:hover {
			background: var(--text-disable);
		}
	}
}

.no-scrollbar {
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

::selection {
	background: var(--background-selection);
	color: inherit;
}

[contenteditable]:empty:before {
	content: attr(data-placeholder);
	color: var(--text-disable);
	pointer-events: none;
	display: block;
}

[contenteditable] {
	white-space: pre-wrap;
	word-break: break-word;
}

.delay-75 {
	transition-delay: 75ms;
}

.delay-100 {
	transition-delay: 100ms;
}

@keyframes pulse-slow {
	0%,
	100% {
		opacity: 0.1;
	}

	50% {
		opacity: 0.3;
	}
}

.animate-pulse-slow {
	animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes scan-y {
	0% {
		top: 0;
		opacity: 0;
	}

	10% {
		opacity: 1;
	}

	90% {
		opacity: 1;
	}

	100% {
		top: 100%;
		opacity: 0;
	}
}

.animate-scan-y {
	animation: scan-y 3s linear infinite;
}

@keyframes noir-reveal {
	0% {
		filter: brightness(0) contrast(200%) blur(10px);
		opacity: 0;
		transform: scale(1.05);
	}

	50% {
		filter: brightness(1.5) contrast(150%) blur(5px);
		opacity: 0.8;
	}

	100% {
		filter: brightness(1) contrast(100%) blur(0);
		opacity: 1;
		transform: scale(1);
	}
}

.animate-noir-reveal {
	animation: noir-reveal 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes ping-slow {
	0% {
		transform: scale(1);
		opacity: 0.3;
	}

	100% {
		transform: scale(1.5);
		opacity: 0;
	}
}

.animate-ping-slow {
	animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.bg-mesh-video {
	background: radial-gradient(circle at 50% 50%, var(--bg-hover) 0%, var(--bg-main) 100%);
}

@keyframes rotate-progress {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

.animate-rotate-progress {
	animation: rotate-progress 2.5s linear infinite;
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0) translateX(0);
	}

	33% {
		transform: translateY(-20px) translateX(15px);
	}

	66% {
		transform: translateY(-8px) translateX(-15px);
	}
}

.animate-float {
	animation: float 10s ease-in-out infinite;
}
</style>
