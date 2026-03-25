<template>
	<div
		class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden pt-4">
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
					Gallery</button>
			</div>
		</div> -->

		<!-- Category Filter Chips (Fixed, Outside Scroll Area) -->
		<div v-if="activeTab === 'inspiration'" class="flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
			<button v-for="cat in categories" :key="cat.id" @click="handleCategoryChange(cat.id)"
				:class="['flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-full border transition-all whitespace-nowrap', selectedCategory === cat.id ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]']">
				<Heart v-if="cat.id === 'favorites'" :size="13" class="!stroke-transparent"
					:class="selectedCategory === 'favorites' ? 'fill-white' : 'fill-black'" />
				{{ $t('image_generation.categories.' + cat.name) }}
			</button>
		</div>

		<!-- Scrollable Content Area -->
		<main class="flex-1 overflow-y-auto px-4 py-6 pb-56 custom-scrollbar relative" ref="scrollContainer">
			<div class="max-w-full mx-auto">
				<!-- Tab Content -->
				<div v-if="activeTab === 'inspiration'">
					<!-- Masonry Skeleton Grid -->
					<div v-if="discoveryStore.isLoading && exampleImages.length === 0"
						class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
						<div v-for="i in 8" :key="i"
							class="break-inside-avoid relative rounded-2xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] animate-pulse shadow-sm">
							<div :style="{ aspectRatio: skeletonRatios[i - 1] }" class="bg-[var(--fill-tsp-gray-main)]">
							</div>
							<div class="absolute inset-x-0 bottom-0 p-6 space-y-3">
								<div class="h-3 bg-[var(--text-primary)]/10 rounded w-full"></div>
								<div class="h-3 bg-[var(--text-primary)]/10 rounded w-2/3"></div>
								<div class="h-8 bg-[var(--text-primary)]/10 rounded-full w-24 mt-4"></div>
							</div>
						</div>
					</div>
					<!-- Masonry Grid Layout for Inspiration -->
					<MasonryGrid v-else :items="exampleImages" v-slot="{ item: example }">
						<div class="group relative rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-card)] border border-[var(--border-main)] hover:border-[var(--text-tertiary)] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md h-fit"
							@click="useExample(example)">
							<img :src="example.url" loading="lazy"
								class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 bg-[#f0eeeb] dark:bg-[#2c2c2c]"
								:alt="example.prompt" :style="{ aspectRatio: '3/4' }"
								@load="(e: Event) => { const img = e.target as HTMLImageElement; img.style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}` }" />
							<!-- Center heart animation -->
							<div v-if="heartAnimId === example.id"
								class="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
								<Heart :size="100"
									class="absolute fill-red-500/50 !stroke-transparent animate-heart-ripple-1" />
								<Heart :size="100"
									class="absolute fill-red-500/30 !stroke-transparent animate-heart-ripple-2" />
								<Heart :size="100" class="fill-red-500 !stroke-transparent animate-heart-burst" />
							</div>
							<!-- Top Left: Model Name (always visible) -->
							<div v-if="example.model || example.title" class="absolute top-2.5 left-2.5 z-20">
								<span class="px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-semibold text-black/80 leading-tight shadow-sm">{{ example.model || example.title }}</span>
							</div>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
								<!-- Top Right: Favorite -->
								<div class="absolute top-3 right-3 pointer-events-auto transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75"
									:class="isFavorited(Number(example.id)) ? '!opacity-100 !translate-y-0' : ''">
									<button @click.stop="handleFavorite(Number(example.id))" class="outline-none size-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
										<Heart :size="16"
											:class="['!stroke-transparent drop-shadow-md', isFavorited(Number(example.id)) ? 'fill-red-500' : 'fill-white/80']" />
									</button>
								</div>
								<!-- Bottom -->
								<div class="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
									<!-- Left: Model info -->
									<div
										class="flex-1 min-w-0 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
										<p class="text-white text-[13px] font-semibold truncate">{{ example.model ||
											example.title }}</p>
										<p v-if="example.description"
								class="text-white text-[13px] line-clamp-5 mt-0.5">{{ example.description
								}}</p>
										<a v-if="example.author" :href="`https://x.com/${example.author}`" target="_blank" rel="noopener noreferrer" @click.stop class="text-white/50 text-[11px] mt-0.5 hover:text-white/80 hover:underline transition-colors pointer-events-auto block">@{{
									example.author }}</a>
									</div>
									<!-- Right: Use prompt -->
									<span
										class="shrink-0 px-4 py-1.5 rounded-full bg-white text-[11px] font-bold text-black uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 pointer-events-auto cursor-pointer hover:bg-white/90 inline-flex items-center gap-1"
										@click.stop="useExample(example)"><Sparkles :size="12" />{{ $t('common.use_prompt') }}</span>
								</div>
							</div>
						</div>
					</MasonryGrid>

					<!-- Load More Trigger & Loading State -->
					<div ref="loadMoreTrigger" class="h-40 flex flex-col items-center justify-center mt-12 mb-20">
						<div v-if="discoveryStore.isLoadingMore" class="flex flex-col items-center gap-4">
							<div class="relative size-12 flex items-center justify-center">
								<div class="absolute inset-0 bg-[var(--text-primary)]/5 rounded-full animate-ping-slow">
								</div>
								<Loader2 class="animate-spin text-[var(--text-primary)]" :size="24" />
							</div>
							<span
								class="text-[11px] font-black text-[var(--text-primary)] tracking-[0.3em] uppercase opacity-60">{{
									$t('common.expanding_vision') }}</span>
						</div>
						<div v-else-if="!discoveryStore.hasMore && exampleImages.length > 0"
							class="flex flex-col items-center gap-3 opacity-30">
							<div
								class="w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-primary)] to-transparent">
							</div>
							<span
								class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.4em] uppercase">{{
									$t('common.end_of_list') }}</span>
							<div
								class="w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-primary)] to-transparent">
							</div>
						</div>
					</div>
				</div>

				<div v-else>
					<!-- Noir Excellence Empty State (V2 Integrated) -->
					<div v-if="generatedImages.length === 0 && activeTasks.length === 0"
						class="py-32 flex flex-col items-center justify-center relative overflow-hidden">
						<!-- Architectural Shadow/Light (Theme Aware) -->
						<div
							class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--text-primary)]/[0.015] blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-40">
						</div>

						<!-- Precision Particles -->
						<div class="absolute inset-0 pointer-events-none">
							<div v-for="i in 8" :key="i"
								class="absolute size-[1px] bg-[var(--text-primary)]/10 animate-float" :style="{
									top: `${Math.random() * 60 + 20}%`,
									left: `${Math.random() * 60 + 20}%`,
									animationDelay: `${Math.random() * 10}s`,
									animationDuration: `${Math.random() * 15 + 10}s`,
								}"></div>
						</div>

						<div class="relative group cursor-default">
							<!-- Architectural Sphere -->
							<div
								class="absolute inset-0 bg-gradient-to-tr from-[var(--text-primary)]/5 to-[var(--text-primary)]/0 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-1000">
							</div>
							<div
								class="relative size-32 rounded-3xl bg-[var(--bg-main)] backdrop-blur-[40px] border border-[var(--border-main)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-700 group-hover:border-[var(--text-tertiary)]/30 group-hover:shadow-[var(--shadow-L)]">
								<!-- Architectural Lens Icon -->
								<svg viewBox="0 0 40 40"
									class="size-12 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors duration-500"
									fill="none" stroke="currentColor">
									<rect x="10" y="10" width="20" height="20" rx="3" stroke-width="1.5" />
									<circle cx="20" cy="20" r="4" stroke-width="1.2" stroke-dasharray="2 2"
										class="animate-rotate-progress" />
									<path d="M10 15H30M10 25H30M15 10V30M25 10V30" stroke-width="0.5"
										stroke-opacity="0.1" />
								</svg>
							</div>
						</div>

						<div class="text-center mt-14 relative z-10 space-y-3">
							<h3 class="text-[15px] font-black text-[var(--text-primary)] tracking-[0.25em] uppercase">
								The Archive of Vision</h3>
							<p
								class="text-[var(--text-tertiary)] text-[13.5px] max-w-[320px] px-4 leading-relaxed font-normal tracking-wide italic opacity-80">
								Every rendered reality finds its place in the MixU collection. Start your first
								orchestration.</p>
						</div>

						<button @click="triggerFocus"
							class="mt-14 px-12 py-3 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl hover:shadow-[var(--shadow-M)] flex items-center gap-4 group/btn">
							<span>Start Rendering</span>
							<div
								class="size-1 bg-[var(--bg-main)] rounded-full group-hover:scale-150 transition-transform">
							</div>
						</button>
					</div>

					<!-- Premium Gallery Grid -->
					<div v-if="generatedImages.length > 0 || activeTasks.length > 0"
						class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
						<!-- Noir Generation Task Cards (Integrated) -->
						<div v-for="task in activeTasks" :key="task.id"
							class="break-inside-avoid relative rounded-2xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] transition-all duration-700 shadow-2xl group/gen">
							<!-- Technical Preview Area -->
							<div
								class="relative aspect-square flex items-center justify-center overflow-hidden bg-black">
								<!-- Premium Placeholder Background -->
								<img v-if="!task.imageUrl" src="/noir_placeholder.png"
									class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />

								<!-- Precision Scanner (Theme Aware) -->
								<div v-if="!task.imageUrl"
									class="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan-y z-10 pointer-events-none">
								</div>

								<!-- Negative-to-Positive Reveal -->
								<img v-if="task.imageUrl" :src="task.imageUrl"
									class="w-full h-full object-cover animate-noir-reveal relative z-20" />

								<!-- Industrial Loader (Integrated) -->
								<div v-else class="flex flex-col items-center gap-8 z-20">
									<div class="relative size-24 flex items-center justify-center">
										<div
											class="absolute inset-0 bg-[var(--text-primary)]/[0.03] rounded-full animate-ping-slow">
										</div>
										<!-- Precision Ring -->
										<svg class="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
											<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor"
												class="text-[var(--text-primary)]" stroke-opacity="0.05"
												stroke-width="1" />
											<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor"
												class="text-[var(--text-primary)] transition-all duration-1000 ease-linear"
												stroke-width="2" stroke-linecap="round" stroke-dasharray="290"
												:stroke-dashoffset="290 - (290 * task.progress) / 100" />
										</svg>
										<span
											class="text-[16px] font-mono font-bold text-[var(--text-primary)] tracking-tighter">{{
												task.progress }}%</span>
									</div>
									<div class="flex flex-col items-center gap-2">
										<p
											class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.3em] uppercase opacity-60">
											{{ task.status }}
										</p>
										<div class="flex gap-2">
											<div v-for="i in 3" :key="i"
												class="size-[2px] bg-[var(--text-primary)] animate-pulse"
												:style="{ animationDelay: `${i * 0.3}s` }"></div>
										</div>
									</div>
								</div>
							</div>

							<!-- Technical Footer -->
							<div class="p-6 bg-[var(--bg-main)] relative z-30 border-t border-[var(--border-main)]">
								<div class="flex items-center justify-between mb-4">
									<div class="flex items-center gap-3">
										<div class="size-1.5 bg-[var(--text-primary)] animate-pulse rounded-full"></div>
										<span
											class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.2em] uppercase">SYSTEM_ACTIVE</span>
									</div>
									<span v-if="task.usage"
										class="text-[10px] font-mono text-[var(--text-tertiary)] bg-[var(--fill-tsp-gray-main)] px-2.5 py-1 rounded-[6px] border border-[var(--border-main)]">
										{{ task.usage.credits }} UNITS </span>
								</div>
								<p
									class="text-[var(--text-secondary)] text-[12.5px] font-normal line-clamp-2 leading-relaxed tracking-wide italic leading-snug">
									"{{ task.prompt }}"</p>

								<div v-if="task.taskId"
									class="mt-5 pt-5 border-t border-dashed border-[var(--border-main)] flex items-center justify-between opacity-50">
									<div class="flex flex-col">
										<span
											class="text-[8px] text-[var(--text-tertiary)] uppercase font-black tracking-widest">RECORD_ID</span>
										<span
											class="text-[10px] text-[var(--text-secondary)] font-mono tracking-tighter">{{
												task.taskId.substring(0, 16) }}</span>
									</div>
								</div>
							</div>
						</div>

						<div v-for="(image, index) in filteredGeneratedImages" :key="image.id"
							class="break-inside-avoid group relative rounded-[24px] overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-indigo-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">
							<!-- Image Container with Inner Shadow -->
							<div class="relative overflow-hidden aspect-auto min-h-[100px] bg-[var(--bg-hover)]">
								<!-- Image Grid Cell -->
								<template v-if="image.status === 1">
									<img :src="image.thumbnail || getRecordPrimaryUrl(image)"
										class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" />
								</template>

								<!-- Processing State in History -->
								<div v-else
									class="h-full min-h-[240px] relative flex flex-col items-center justify-center overflow-hidden bg-black/40">
									<img src="/noir_placeholder.png"
										class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
									<div class="relative z-10 flex flex-col items-center gap-4">
										<div
											class="size-10 rounded-full border border-white/10 border-t-white/40 animate-spin">
										</div>
										<span
											class="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">Synchronizing</span>
									</div>
								</div>

								<div class="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[24px]"></div>
							</div>

							<!-- Content Overlay (Sophisticated Gradient) -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-5">
								<!-- Top Actions (Glassmorphism) -->
								<div
									class="flex justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
									<button @click.stop="handleDownload(getRecordPrimaryUrl(image))"
										class="size-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all shadow-2xl group/btn">
										<Download :size="18" class="group-hover/btn:scale-110 transition-transform" />
									</button>
								</div>

								<!-- Bottom Info -->
								<div
									class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
									<div class="flex items-center gap-2 mb-2">
										<span
											class="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/80 uppercase tracking-wider">
											{{ formatModel(getRecordModel(image)) }}
										</span>
										<span class="text-[10px] font-medium text-white/60">
											{{ formatDate(image.created_at) }}
										</span>
									</div>

									<!-- Technical Metadata (Noir Style) -->
									<div v-if="getRecordParams(image)" class="flex flex-wrap gap-2 mb-4 opacity-70">
										<div v-if="getRecordParams(image).aspect_ratio"
											class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											{{ getRecordParams(image).aspect_ratio }}
										</div>
										<div v-if="getRecordParams(image).resolution"
											class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											{{ getRecordParams(image).resolution }}
										</div>
										<div v-if="getRecordParams(image).num_inference_steps"
											class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											{{ getRecordParams(image).num_inference_steps }} STEPS</div>
										<div v-if="getRecordParams(image).seed"
											class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											SEED: {{ getRecordParams(image).seed }}</div>
									</div>

									<p
										class="text-white text-[13px] font-medium mb-4 line-clamp-3 leading-relaxed italic">
										"{{
											getRecordPrompt(image) || 'No description' }}"</p>
									<button @click.stop="useExample({ prompt: getRecordPrompt(image) })"
										class="w-full py-2.5 bg-white text-black rounded-xl font-bold text-[12px] hover:bg-indigo-50 transition-colors shadow-xl flex items-center justify-center gap-2 group/reuse">
										<Zap :size="14" fill="currentColor"
											class="text-indigo-600 group-hover/reuse:animate-pulse" />
										Reuse Prompt
									</button>
								</div>
							</div>

							<!-- Static Reveal Info -->
							<div
								class="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/20 backdrop-blur-md opacity-100 group-hover:opacity-0 transition-opacity duration-300">
								<p class="text-white/80 text-[10px] font-medium truncate max-w-[120px]">
									{{ formatDate(image.created_at) }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<!-- UnifiedInput -->
		<div class="absolute bottom-12 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
			<div class="w-full max-w-[840px] relative pointer-events-auto">
				<UnifiedInput ref="unifiedInputRef" capability="image_generation" :is-loading="isGenerating"
					@send="handleUnifiedSend" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { Link2, ImagePlus, Palette, Square, Gem, Sparkle, Paperclip, Zap, Loader2, Monitor, X, Image as ImageIcon, Download, ChevronDown, LayoutGrid, Sparkles, Plus, Heart } from 'lucide-vue-next'
import { getModels, getAsyncTaskOutputs, uploadFile, getRecordPrompt, getRecordPrimaryUrl, getRecordModel, getRecordParams, type AIModel, type AsyncTaskRecord } from '@/utils/api'
import { useRouter } from 'vue-router'
import { useConversationStore } from '@/stores/conversation'
import { useChatStore } from '@/stores/chat'
import { useImageDiscoveryStore } from '~/stores/discovery'
import { useModelStore } from '@/stores/models'
import UnifiedInput from '~/components/UnifiedInput.vue'
import { useFavorite } from '~/composables/useFavorite'

const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const discoveryStore = useImageDiscoveryStore()
const modelStore = useModelStore()
const unifiedInputRef = ref<InstanceType<typeof UnifiedInput> | null>(null)

const activeTab = ref<'inspiration' | 'creations'>('inspiration')
const prompt = ref('')
const skeletonRatios = Array.from({ length: 8 }, () => `1/${(0.8 + Math.random() * 0.6).toFixed(2)}`)
interface ActiveTask {
	id: string
	taskId?: string
	prompt: string
	progress: number
	status: string
	imageUrl?: string
	usage?: any
}

const activeTasks = ref<ActiveTask[]>([])
const isGenerating = computed(() => activeTasks.value.length > 0)
const selectedCategory = ref<number | string>(35)
const scrollContainer = ref<HTMLElement | null>(null)
const openDropdown = ref<string | null>(null)

// --- Typewriter Placeholder Effect ---
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
const displayedPlaceholder = ref('')
let typewriterInterval: ReturnType<typeof setInterval> | null = null

const runTypewriter = () => {
	if (typewriterInterval) clearInterval(typewriterInterval)
	displayedPlaceholder.value = ''
	let i = 0
	const text = 'Describe an image and click generate...'
	typewriterInterval = setInterval(() => {
		if (i < text.length) {
			displayedPlaceholder.value += text[i]
			i++
		} else {
			clearInterval(typewriterInterval!)
		}
	}, 20)
}

// Model & Options State
const selectedModel = computed(() => modelStore.selectedModel)
const isImageModel = computed(() => {
	const model = selectedModel.value
	return model?.capabilities?.includes('image_generation') || model?.model_input?.capability === 'image_generation' || false
})

const dynamicParams = ref<Record<string, any>>({})

const modelInputFields = computed(() => {
	if (!isImageModel.value) return {}
	return selectedModel.value?.model_input?.fields || {}
})

const supportsImageUpload = computed(() => {
	const fields = modelInputFields.value
	return !!(fields['image'] || fields['images'] || fields['image_urls'] || fields['image_url'] || fields['input_images'] || fields['input_image'] || fields['init_image'] || fields['ref_image'])
})

const supportsMultipleImages = computed(() => {
	return 'input_images' in modelInputFields.value
})

const dynamicSelectFields = computed(() => {
	const fields = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if (field.type === 'select') {
			fields.push({ key, ...(field as any) })
		}
	}
	return fields
})

const dynamicNumberFields = computed(() => {
	const fields = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if (field.type === 'number') {
			fields.push({ key, ...(field as any) })
		}
	}
	return fields
})

watch(
	selectedModel,
	() => {
		if (selectedModel.value?.model_input?.fields) {
			const fields = selectedModel.value.model_input.fields
			dynamicParams.value = {}
			for (const [key, field] of Object.entries(fields)) {
				if (field.default !== undefined) {
					dynamicParams.value[key] = field.default
				} else if (field.options && field.options.length > 0) {
					dynamicParams.value[key] = field.options[0]
				} else if (field.type === 'number') {
					dynamicParams.value[key] = field.min || 1
				}
			}
		}
	},
	{ immediate: true },
)

// File Upload State
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedImages = ref<Array<{ key: string; url: string; uploading?: boolean }>>([])
const openImageUploadDropdown = ref(false)
const showAssetPicker = ref(false)
const inputRef = ref<HTMLDivElement | null>(null)

const onAssetsSelected = (assets: Array<{ key: string; url: string }>) => {
	if (supportsMultipleImages.value) {
		uploadedImages.value.push(...assets)
	} else {
		if (assets[0]) uploadedImages.value = [assets[0]]
	}
}

const categories = [
	{ id: 35, name: 'all' },
	{ id: 24, name: 'portrait' },
	{ id: 30, name: 'brand' },
	{ id: 32, name: 'poster' },
	{ id: 28, name: 'illustration' },
	{ id: 31, name: 'product' },
	{ id: 25, name: 'architecture' },
	{ id: 27, name: 'film' },
	{ id: 26, name: 'lifestyle' },
	{ id: 33, name: 'scifi' },
	{ id: 29, name: 'ui' },
	// { id: 34, name: 'uncategorized' },
	{ id: 'favorites', name: 'favorites' },
]

const generatedImages = ref<AsyncTaskRecord[]>([])
const filteredGeneratedImages = computed(() => {
	const activeIds = new Set(activeTasks.value.map((t) => t.taskId).filter(Boolean))
	return generatedImages.value.filter((img) => !activeIds.has(img.provider_task_id))
})

const fetchHistory = async () => {
	try {
		const res = await getAsyncTaskOutputs({ capability: 'image', page_size: 50 })
		if (res.data && res.data.list) {
			generatedImages.value = res.data.list
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
	if (openDropdown.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
		openDropdown.value = null
	}
	if (openImageUploadDropdown.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
		openImageUploadDropdown.value = false
	}
}

const toggleImageUploadDropdown = () => {
	openImageUploadDropdown.value = !openImageUploadDropdown.value
}

const triggerUploadAndClose = () => {
	triggerFileUpload()
	openImageUploadDropdown.value = false
}

const selectAssetAndClose = () => {
	openImageUploadDropdown.value = false
	showAssetPicker.value = true
}

const setParamAndClose = (key: string, val: any) => {
	dynamicParams.value[key] = val
	openDropdown.value = null
}

onMounted(() => {
	runTypewriter()
	fetchHistory()
	if (discoveryStore.allItems.length === 0) {
		discoveryStore.fetchDiscovery(selectedCategory.value)
	}
	window.addEventListener('mousedown', handleClickOutside)

	// Initialize Infinite Scroll — auto-fill if viewport not full
	const tryLoadMore = async () => {
		if (selectedCategory.value === 'favorites') return
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
		{ threshold: 0.1 }
	)
	if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
})

onUnmounted(() => {
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
	if (!modelStr) return 'STABLE DIFFUSION'
	// Remove provider prefix if exists
	const parts = modelStr.split(':')
	const name = parts.length > 1 ? parts[1] : parts[0]
	return (name || '').replace(/-/g, ' ').toUpperCase()
}

const allExampleImages = computed(() => {
	return discoveryStore.allItems.map((item) => ({
		id: item.related_id || item.id,
		prompt: item.related_data?.prompt || '',
		url: item.related_data?.thumbnail || item.related_data?.assets?.[0] || '',
		model: item.related_data?.model || '',
		title: item.title || '',
		subtitle: item.subtitle || '',
		description: item.related_data?.description || item.subtitle || '',
		author: item.related_data?.author || '',
		config: item.related_data?.config || {},
	}))
})

const exampleImages = computed(() => {
	if (selectedCategory.value === 'favorites') {
		return favoriteItems.value.map((item: any) => ({
			id: item.id,
			prompt: item.prompt || '',
			url: item.thumbnail || item.original_url || '',
			model: item.model || '',
			title: '',
			subtitle: '',
			description: item.description || '',
			author: item.author || '',
			config: item.config || {},
		}))
	}
	return allExampleImages.value
})

// Favorites
const { isFavorited, toggleFavorite, favoriteItems, isFavoritesLoading, hasMoreFavorites, fetchFavoriteList } = useFavorite('prompt_image')
const heartAnimId = ref<number | string | null>(null)

const handleFavorite = (id: number) => {
	if (!isFavorited(id)) {
		heartAnimId.value = id
		setTimeout(() => { heartAnimId.value = null }, 900)
	}
	toggleFavorite(id)
}

const useExample = (example: Record<string, any>) => {
	prompt.value = example.prompt
	unifiedInputRef.value?.setContent(example.prompt)

	// Match and select the model if provided
	if (example.model) {
		const match = modelStore.models.find((m: any) =>
			m.model === example.model || m.display_name === example.model || `${m.provider}:${m.model}` === example.model
		)
		if (match) {
			modelStore.selectModel(`${match.provider}:${match.model}`, 'image_generation')
		}
	}

	// Apply config params (aspect_ratio, style, etc.)
	if (example.config && Object.keys(example.config).length > 0) {
		unifiedInputRef.value?.setParams(example.config)
	}

	const mainEl = document.querySelector('main')
	if (mainEl) mainEl.scrollTo({ top: mainEl.scrollHeight, behavior: 'smooth' })
}

const handleInput = (e: Event) => {
	const target = e.target as HTMLDivElement
	prompt.value = target.innerText
}

const handleEnterKey = (e: KeyboardEvent) => {
	if (e.shiftKey) {
		// Let default behavior (new line) happen
		return
	}
	e.preventDefault()
	// generateImage() - replaced by UnifiedInput
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
	const files = target.files
	if (!files || files.length === 0) return

	openImageUploadDropdown.value = false
	const fileArray = Array.from(files)

	// Immediately show local blob previews
	const previews = fileArray.map((file) => ({
		key: '',
		url: URL.createObjectURL(file),
		uploading: true,
	}))

	if (supportsMultipleImages.value) {
		const startIndex = uploadedImages.value.length
		uploadedImages.value.push(...previews)
		// Upload each file and replace blob URL in-place
		for (let i = 0; i < fileArray.length; i++) {
			try {
				const res = await uploadFile(fileArray[i]!, 'generation')
				const item = uploadedImages.value[startIndex + i]
				if (res && item) {
					URL.revokeObjectURL(item.url)
					uploadedImages.value[startIndex + i] = { key: res.key, url: res.url, uploading: false }
				}
			} catch (error) {
				console.error('Failed to upload file:', error)
				uploadedImages.value.splice(startIndex + i, 1)
			}
		}
	} else {
		if (previews[0]) {
			uploadedImages.value = [previews[0]]
		}
		try {
			const res = await uploadFile(fileArray[0]!, 'generation')
			const item = uploadedImages.value[0]
			if (res && item) {
				URL.revokeObjectURL(item.url)
				const newImages: Array<{ key: string; url: string; uploading?: boolean }> = [{ key: res.key, url: res.url, uploading: false }]
				uploadedImages.value = newImages
			}
		} catch (error) {
			console.error('Failed to upload file:', error)
			uploadedImages.value = []
		}
	}

	if (fileInput.value) fileInput.value.value = ''
}

const removeImage = (index: number) => {
	uploadedImages.value.splice(index, 1)
}

const handleUnifiedSend = async (payload: { content: string; params: Record<string, any>; files: any[]; mediaFiles: any[] }) => {
	if (!payload.content.trim() || !selectedModel.value) return

	const params: Record<string, any> = { ...payload.params }
	const file_ids: string[] = []
	const image_urls: string[] = []
	const files: any[] = []
	const modelFields = selectedModel.value?.model_input?.fields || {}

	if (payload.mediaFiles.length > 0) {
		if ('input_images' in modelFields) {
			params.input_images = payload.mediaFiles.map((i) => i.url)
			image_urls.push(...payload.mediaFiles.map((i) => i.key))
			files.push(...payload.mediaFiles)
		} else if ('image' in modelFields) {
			params.image = payload.mediaFiles[0]?.url
			image_urls.push(payload.mediaFiles[0]?.key || '')
			files.push(payload.mediaFiles[0])
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
			capability: 'image',
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

const generateImage = async () => {
	if (!prompt.value.trim() || !selectedModel.value) return

	const currentPrompt = prompt.value
	prompt.value = ''
	if (inputRef.value) inputRef.value.innerText = ''

	const payload: { [key: string]: any } = {
		...dynamicParams.value,
	}

	const readyImages = uploadedImages.value.filter((i) => !i.uploading && i.url)
	const file_ids: string[] = []
	const image_urls: string[] = []
	const files: any[] = []

	if (readyImages.length > 0) {
		if ('input_images' in modelInputFields.value) {
			payload.input_images = readyImages.map((i) => i.url)
			image_urls.push(...readyImages.map((i) => i.key))
			files.push(...readyImages)
		} else if ('image' in modelInputFields.value) {
			payload.image = readyImages[0]?.url
			image_urls.push(readyImages[0]?.key || '')
			files.push(readyImages[0])
		}
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
			capability: 'image',
		})

		conversationStore.addMessage(conversationId, {
			role: 'user',
			content: currentPrompt,
		})

		chatStore.setPendingMessage(currentPrompt)

		uploadedImages.value = []

		router.push(`/chat/${conversationId}`)
	} catch (e) {
		console.error('Failed to start chat:', e)
		chatStore.setLoading(false)
	}
}

const getPreviewStyle = (ratio: string) => {
	const baseSize = 120
	let width = baseSize
	let height = baseSize

	switch (ratio) {
		case '4:3':
			height = (baseSize * 3) / 4
			break
		case '3:2':
			height = (baseSize * 2) / 3
			break
		case '16:9':
			height = (baseSize * 9) / 16
			break
		case '2.35:1':
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

	return {
		width: `${width}px`,
		height: `${height}px`,
	}
}

const handleCategoryChange = (id: number | string) => {
	if (selectedCategory.value === id) return
	selectedCategory.value = id
	// Reset scroll position to top
	if (scrollContainer.value) scrollContainer.value.scrollTop = 0
	if (id === 'favorites') {
		fetchFavoriteList(true)
	} else {
		discoveryStore.fetchDiscovery(id as number)
	}
}


const handleDownload = (imageUrl: string) => {
	window.open(imageUrl, '_blank')
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

textarea::placeholder {
	color: var(--text-disable);
}

::selection {
	background: var(--background-selection);
	color: inherit;
}

[contenteditable]:empty:before {
	content: attr(data-placeholder);
	color: var(--text-disable);
	font-weight: 500;
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

/* Custom Shimmer/Pulse for empty state */
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

@keyframes scanner {
	0% {
		transform: translateX(-100%);
		opacity: 0;
	}

	10% {
		opacity: 0.5;
	}

	50% {
		opacity: 1;
	}

	90% {
		opacity: 0.5;
	}

	100% {
		transform: translateX(100%);
		opacity: 0;
	}
}

.animate-scanner {
	animation: scanner 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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

.bg-mesh {
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
	animation: rotate-progress 2s linear infinite;
}

@keyframes float {

	0%,
	100% {
		transform: translateY(0) translateX(0);
	}

	33% {
		transform: translateY(-15px) translateX(10px);
	}

	66% {
		transform: translateY(-5px) translateX(-10px);
	}
}

.animate-float {
	animation: float 8s ease-in-out infinite;
}

@keyframes heart-burst {
	0% {
		transform: scale(0);
		opacity: 0;
	}

	20% {
		transform: scale(1.4);
		opacity: 1;
	}

	40% {
		transform: scale(1);
		opacity: 1;
	}

	60% {
		transform: scale(1.15);
		opacity: 0.9;
	}

	100% {
		transform: scale(1.6);
		opacity: 0;
	}
}

.animate-heart-burst {
	animation: heart-burst 0.9s cubic-bezier(0.17, 0.67, 0.35, 1.2) forwards;
	filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.5));
}

@keyframes heart-ripple {
	0% {
		transform: scale(1);
		opacity: 0.6;
	}

	100% {
		transform: scale(1.8);
		opacity: 0;
	}
}

.animate-heart-ripple-1 {
	animation: heart-ripple 0.7s 0.1s ease-out forwards;
	opacity: 0;
}

.animate-heart-ripple-2 {
	animation: heart-ripple 0.7s 0.25s ease-out forwards;
	opacity: 0;
}
</style>
