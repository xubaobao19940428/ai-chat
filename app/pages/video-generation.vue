<template>
    <div
        class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">

        <!-- Tab Switcher (Fixed at Top, Outside Scroll Area) -->
        <div class="flex justify-center py-4 bg-[var(--background-gray-main)] border-b border-transparent">
            <div
                class="bg-[var(--fill-tsp-gray-main)] p-1 rounded-full border border-[var(--border-main)] flex items-center">
                <button @click="activeTab = 'inspiration'"
                    class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
                    :class="activeTab === 'inspiration' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
                    Inspiration
                </button>
                <button @click="activeTab = 'creations'"
                    class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
                    :class="activeTab === 'creations' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
                    My Videos
                </button>
            </div>
        </div>

        <!-- Category Filter Chips (Fixed, Outside Scroll Area) -->
        <div v-if="activeTab === 'inspiration'" class="flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
            <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="[
                'px-4 py-1.5 text-[13px] font-medium rounded-full border transition-all whitespace-nowrap',
                selectedCategory === cat
                    ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm'
                    : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]'
            ]">
                {{ cat }}
            </button>
        </div>

        <!-- Scrollable Content Area -->
        <main class="flex-1 overflow-y-auto px-4 py-6 pb-56 custom-scrollbar relative">
            <div class="max-w-full mx-auto">
                <!-- Tab Content -->
                <div v-if="activeTab === 'inspiration'">
                    <!-- Masonry Grid Layout for Inspiration -->
                    <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        <div v-for="(example, index) in exampleVideos" :key="index"
                            class="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-card)] border border-[var(--border-main)] hover:border-[var(--text-tertiary)] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                            @click="useExample(example.prompt)">
                            <img :src="example.thumbnail"
                                class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                :alt="example.prompt" />
                            <!-- Play Icon Overlay -->
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div
                                    class="size-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play :size="28" class="text-white ml-1" fill="currentColor" />
                                </div>
                            </div>
                            <div
                                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                <p class="text-white text-[13px] font-medium line-clamp-2 italic mb-3 leading-snug">"{{
                                    example.prompt
                                }}"</p>
                                <div class="flex items-center">
                                    <span
                                        class="px-4 py-1.5 rounded-full bg-white text-[11px] font-bold text-black uppercase tracking-wider backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Use
                                        Prompt</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <!-- Enhanced Empty State -->
                    <div v-if="generatedVideos.length === 0" class="py-40 flex flex-col items-center justify-center">
                        <div class="relative mb-8">
                            <div
                                class="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-150 animate-pulse-slow">
                            </div>
                            <div
                                class="relative size-24 rounded-[32px] bg-[var(--bg-main)] border border-[var(--border-main)] flex items-center justify-center shadow-2xl">
                                <Film :size="40" class="text-purple-500" />
                            </div>
                            <div
                                class="absolute -right-2 -bottom-2 size-10 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100 rotate-12">
                                <Sparkles :size="20" class="text-amber-500" />
                            </div>
                        </div>
                        <h3 class="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Your Video Gallery
                            Awaits</h3>
                        <p
                            class="text-[var(--text-tertiary)] text-[15px] mt-2 max-w-[280px] text-center leading-relaxed">
                            Transform your ideas into stunning videos. Every creation will be preserved here.
                        </p>
                        <button @click="triggerFocus"
                            class="mt-8 px-8 py-3 bg-[var(--text-primary)] text-white rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95">
                            Start Creating
                        </button>
                    </div>

                    <!-- Premium Video Gallery Grid -->
                    <div v-else class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        <div v-for="(video, index) in generatedVideos" :key="index"
                            class="break-inside-avoid group relative rounded-[24px] overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-purple-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">

                            <!-- Video Container -->
                            <div class="relative overflow-hidden aspect-video">
                                <img v-if="!playingVideoId || playingVideoId !== video.id" :src="video.cover_url"
                                    class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                                <video v-else :src="video.url" class="w-full h-full object-cover" controls autoplay
                                    playsinline></video>
                                <div class="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[24px]"></div>

                                <!-- Play Button Overlay -->
                                <div v-if="!playingVideoId || playingVideoId !== video.id"
                                    class="absolute inset-0 flex items-center justify-center cursor-pointer"
                                    @click="playingVideoId = video.id">
                                    <div
                                        class="size-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                                        <Play :size="28" class="text-white ml-1" fill="currentColor" />
                                    </div>
                                </div>

                                <!-- Duration Badge -->
                                <div
                                    class="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                                    {{ formatDuration(video.duration || video.meta?.duration || 5) }}
                                </div>
                            </div>

                            <!-- Content Overlay (Sophisticated Gradient) -->
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-5 pointer-events-none group-hover:pointer-events-auto">

                                <!-- Top Actions (Glassmorphism) -->
                                <div
                                    class="flex justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                    <button @click.stop="handleDownload(video.url)"
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
                                            {{ formatModel(video.meta?.model || (video as any).model) }}
                                        </span>
                                        <span class="text-[10px] font-medium text-white/60">
                                            {{ formatDate(video.created_at) }}
                                        </span>
                                    </div>
                                    <p
                                        class="text-white text-[13px] font-medium mb-4 line-clamp-3 leading-relaxed italic">
                                        "{{ video.prompt || video.meta?.prompt || 'No description' }}"
                                    </p>
                                    <button @click.stop="useExample(video.prompt || video.meta?.prompt || '')"
                                        class="w-full py-2.5 bg-white text-black rounded-xl font-bold text-[12px] hover:bg-purple-50 transition-colors shadow-xl flex items-center justify-center gap-2 group/reuse">
                                        <Zap :size="14" fill="currentColor"
                                            class="text-purple-600 group-hover/reuse:animate-pulse" />
                                        Reuse Prompt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Floating Pill Control Bar (Bottom) - Krea Style -->
        <div class="absolute bottom-12 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
            <div
                class="relative z-40 mx-auto flex w-full flex-col items-center justify-center gap-1.5 pointer-events-auto">

                <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0">
                    <div v-if="isGenerating"
                        class="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-full shadow-lg">
                        <Loader2 :size="14" class="animate-spin text-purple-500" />
                        <span class="text-[11px] font-bold text-[var(--text-primary)]">
                            {{ generationProgress }}% Generating... (~{{ estimatedTimeRemaining }})
                        </span>
                    </div>
                </transition>

                <div ref="controlBarRef"
                    class="group/promptbox bg-[var(--background-gray-main)] border-[var(--border-main)] text-[var(--text-primary)] flex w-[90%] rounded-[2rem] transform flex-col border-[0.5px] p-3 shadow-2xl transition-all duration-100 ease-out sm:w-fit sm:min-w-[620px]"
                    style="height: 110px">
                    <div class="flex w-full min-w-0 flex-row items-end h-full">
                        <div class="flex w-full min-w-0 flex-col justify-between h-full gap-2 sm:mr-2.5">

                            <!-- Input Area -->
                            <div class="relative w-full h-full pt-1.5">
                                <textarea v-model="prompt"
                                    class="scrollbar-hide relative max-h-48 min-h-[1.5lh] w-full max-w-[calc(100vw-200px)] min-w-full cursor-text resize-none overflow-y-auto border-0 bg-transparent px-2.5 py-1.5 text-base leading-6 font-normal placeholder-[var(--text-secondary)] focus:ring-0 sm:min-w-[400px] md:max-w-[calc(100vw-440px)] md:min-w[full] outline-none"
                                    placeholder="Describe a video and click generate..." autocomplete="off" rows="1"
                                    @keydown.enter="handleEnterKey" style="height: 36px"></textarea>
                            </div>

                            <!-- Buttons Row -->
                            <div class="flex flex-wrap gap-1 text-[13px] font-medium tracking-tight mt-auto">
                                <!-- Start Frame Upload with Popover -->
                                <input type="file" ref="fileInput" accept="image/png, image/jpeg, video/mp4"
                                    class="hidden" @change="handleFileUpload" />
                                <div class="group/button relative">
                                    <button @click="openDropdown = openDropdown === 'startFrame' ? null : 'startFrame'"
                                        class="focus-visible:ring-ring/50 inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:opacity-50 h-[30px] px-3 py-1 rounded-full shadow-none border border-transparent"
                                        :class="openDropdown === 'startFrame' ? 'bg-white shadow-sm' : 'bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)]'"
                                        type="button" :disabled="isUploading">
                                        <ImagePlus v-if="!isUploading && !previewImageUrl" :size="14" />
                                        <Loader2 v-else-if="isUploading" :size="14" class="animate-spin" />
                                        <img v-else-if="previewImageUrl" :src="previewImageUrl"
                                            class="w-4 h-4 rounded-sm object-cover" />
                                        Start frame
                                    </button>

                                    <!-- Start Frame Popover -->
                                    <div v-if="openDropdown === 'startFrame'"
                                        class="absolute bottom-[36px] left-0 pb-2 z-[60] min-w-[300px]">
                                        <div
                                            class="rounded-[28px] bg-white dark:bg-[#1a1a1a] border border-[var(--border-main)] p-4 shadow-2xl min-w-[300px] flex flex-col gap-4">
                                            <p
                                                class="text-[14px] font-medium text-[var(--text-primary)] text-center leading-snug px-2">
                                                Start frame anchors the opening of your video. Upload an image/video or
                                                select one from your assets.
                                            </p>

                                            <div class="flex flex-col gap-2">
                                                <!-- Upload Button -->
                                                <button @click="triggerFileUpload(); openDropdown = null"
                                                    class="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-full py-3 text-[14px] font-medium transition-colors">
                                                    <div
                                                        class="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                                                        <Plus :size="10" stroke-width="3" />
                                                    </div>
                                                    Upload
                                                </button>

                                                <!-- Select Asset Button (Dummy function for now) -->
                                                <button @click="openDropdown = null"
                                                    class="w-full flex items-center justify-center gap-2 bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full py-3 text-[14px] font-medium transition-colors border border-transparent">
                                                    <ImagePlus :size="16" />
                                                    Select asset
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- End Frame (Disabled mimic) -->
                                <div class="relative">
                                    <button
                                        class="focus-visible:ring-ring/50 inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-all outline-none pointer-events-none opacity-50 h-[30px] px-3 py-1 rounded-full bg-[var(--fill-tsp-gray-main)] shadow-none border border-[var(--border-main)]"
                                        type="button" disabled>
                                        <ImagePlus :size="14" />
                                        End frame
                                    </button>
                                </div>

                                <!-- Style Select (Dummy mimic) -->
                                <div class="group/button relative">
                                    <button
                                        class="inline-flex h-[30px] shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--border-main)] bg-[var(--fill-tsp-gray-main)] px-3 py-1 font-medium whitespace-nowrap shadow-none outline-none transition-all hover:bg-[var(--bg-hover)] relative flex cursor-pointer">
                                        Style
                                    </button>
                                </div>

                                <!-- Resolution Select -->
                                <div class="group/button relative">
                                    <button @click="openDropdown = openDropdown === 'resolution' ? null : 'resolution'"
                                        class="inline-flex h-[30px] shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-[var(--fill-tsp-gray-main)] px-3 py-1 font-medium whitespace-nowrap shadow-none outline-none transition-all hover:bg-[var(--bg-hover)] relative flex w-[60px] cursor-pointer"
                                        :class="openDropdown === 'resolution' ? 'bg-white shadow-sm' : ''">
                                        {{ selectedResolution }}
                                    </button>
                                    <div v-if="openDropdown === 'resolution'"
                                        class="absolute bottom-[38px] left-1/2 -translate-x-1/2 pb-2 z-[60]">
                                        <div
                                            class="rounded-[28px] bg-white dark:bg-[#1a1a1a] border border-[var(--border-main)] p-4 shadow-2xl min-w-[170px] flex flex-col gap-3">
                                            <span
                                                class="text-[#737373] dark:text-[#a3a3a3] font-medium text-[12px] text-center pt-1">Resolution</span>
                                            <div class="flex flex-col gap-1">
                                                <button v-for="res in ['720p', '480p']" :key="res"
                                                    @click="selectedResolution = res; openDropdown = null"
                                                    class="w-full flex items-center justify-between gap-4 py-2.5 px-3 rounded-2xl hover:bg-[var(--bg-hover)] transition-colors">
                                                    <span class="text-[14px] font-bold text-black dark:text-white">{{
                                                        res }}</span>
                                                    <div class="flex items-center justify-center">
                                                        <div v-if="selectedResolution === res"
                                                            class="w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                                                            <Check :size="12" class="text-white dark:text-black"
                                                                stroke-width="4" />
                                                        </div>
                                                        <div v-else
                                                            class="w-5 h-5 rounded-full border-[2.5px] border-black dark:border-white">
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Aspect Ratio Select -->
                                <div class="group/button relative">
                                    <button @click="openDropdown = openDropdown === 'ratio' ? null : 'ratio'"
                                        class="inline-flex h-[30px] shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--border-main)] bg-[var(--fill-tsp-gray-main)] px-3 py-1 font-medium whitespace-nowrap shadow-none outline-none transition-all hover:bg-[var(--bg-hover)] flex w-10 cursor-pointer">
                                        <span>
                                            <div v-if="selectedAspectRatio === '16:9'"
                                                class="w-4 h-2.5 border-[2px] border-current rounded-[2px]"></div>
                                            <div v-if="selectedAspectRatio === '1:1'"
                                                class="w-3.5 h-3.5 border-[2px] border-current rounded-[2px]"></div>
                                            <div v-if="selectedAspectRatio === '9:16'"
                                                class="w-2.5 h-4 border-[2px] border-current rounded-[2px]"></div>
                                        </span>
                                    </button>
                                    <div v-if="openDropdown === 'ratio'"
                                        class="absolute bottom-[38px] left-1/2 -translate-x-1/2 pb-2 z-[60]">
                                        <div
                                            class="rounded-[24px] bg-[var(--background-card)] border border-[var(--border-main)] p-3 shadow-2xl flex flex-col gap-3">
                                            <span
                                                class="text-[var(--text-primary)] px-2 font-medium text-[13px] text-center pt-2">Aspect
                                                Ratio</span>
                                            <div class="flex gap-2">
                                                <button @click="selectedAspectRatio = '16:9'; openDropdown = null"
                                                    class="flex flex-col items-center justify-center gap-3 w-[84px] h-[84px] rounded-[16px] transition-colors"
                                                    :class="selectedAspectRatio === '16:9' ? 'bg-[var(--fill-tsp-gray-main)]' : 'bg-transparent hover:bg-[var(--bg-hover)]'">
                                                    <div
                                                        class="w-[28px] h-[18px] border-[2.5px] border-[var(--text-primary)] rounded-[4px]">
                                                    </div>
                                                    <span
                                                        class="text-[12px] font-medium text-[var(--text-primary)]">Landscape</span>
                                                </button>
                                                <button @click="selectedAspectRatio = '9:16'; openDropdown = null"
                                                    class="flex flex-col items-center justify-center gap-3 w-[84px] h-[84px] rounded-[16px] transition-colors"
                                                    :class="selectedAspectRatio === '9:16' ? 'bg-[var(--fill-tsp-gray-main)]' : 'bg-transparent hover:bg-[var(--bg-hover)]'">
                                                    <div
                                                        class="w-[16px] h-[26px] border-[2.5px] border-[var(--text-primary)] rounded-[4px]">
                                                    </div>
                                                    <span
                                                        class="text-[12px] font-medium text-[var(--text-primary)]">Portrait</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Generate Button Area -->
                        <div class="flex items-end self-end ml-2 mb-1">
                            <button @click="generateVideo" :disabled="!prompt.trim() || isGenerating"
                                class="inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 h-10 w-10 active-scale-95 relative rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] hover:opacity-90 shadow-md">
                                <Sparkles v-if="!isGenerating" :size="18" fill="currentColor" />
                                <Loader2 v-else :size="18" class="animate-spin absolute" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
    ImagePlus,
    Plus,
    Check,
    Zap,
    Loader2,
    X,
    Film,
    Download,
    ChevronDown,
    Sparkles,
    Play,
    Clock
} from 'lucide-vue-next'
import {
    getModels,
    createAsyncTask,
    queryAsyncTask,
    getAsyncTaskOutputs,
    uploadFile,
    type AIModel
} from '@/utils/api'
import type { VideoTaskOutput } from '@/api/video'


const activeTab = ref<'inspiration' | 'creations'>('inspiration')
const prompt = ref('')
const isGenerating = ref(false)
const generationProgress = ref(0)
const selectedCategory = ref('All')
const playingVideoId = ref<number | null>(null)
const openDropdown = ref<string | null>(null)

// Model Store
import { useModelStore } from '@/stores/models'
const modelStore = useModelStore()
const selectedModel = computed(() => modelStore.selectedModel)


const selectedAspectRatio = ref('16:9')
const selectedDuration = ref(5)
const selectedResolution = ref('720p')

// File Upload State
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedImageKey = ref('')
const previewImageUrl = ref('')
const inputRef = ref<HTMLDivElement | null>(null)

const categories = [
    'All', 'Trending', 'Cinematic', 'Animation', 'Nature', 'Abstract'
]

const generatedVideos = ref<VideoTaskOutput[]>([])
let pollingTimer: any = null

const estimatedTimeRemaining = computed(() => {
    const remaining = Math.max(0, 100 - generationProgress.value)
    const seconds = Math.round((remaining / 100) * (selectedDuration.value === 5 ? 120 : 180))
    if (seconds > 60) {
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    }
    return `${seconds}s`
})

const fetchHistory = async () => {
    try {
        const res = await getAsyncTaskOutputs({ type: 'video', page_size: 50 })
        if (res.data && res.data.list) {
            generatedVideos.value = res.data.list
        }
    } catch (error) {
        console.error('Failed to fetch history:', error)
    }
}



const controlBarRef = ref<HTMLDivElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (openDropdown.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
        openDropdown.value = null
    }
}

onMounted(() => {
    fetchHistory()
    window.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
    if (pollingTimer) clearTimeout(pollingTimer)
    window.removeEventListener('mousedown', handleClickOutside)
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
        minute: '2-digit'
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

const exampleVideos = [
    { prompt: 'A mystical whale swimming through a glowing underwater city at night.', thumbnail: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=600' },
    { prompt: 'Timelapse of cherry blossoms blooming in a Japanese garden.', thumbnail: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=600' },
    { prompt: 'Cinematic drone shot over a foggy mountain range at sunrise.', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600' },
    { prompt: 'Abstract flowing liquid metal transforming into geometric shapes.', thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=600' },
    { prompt: 'A futuristic city with flying cars and neon lights at night.', thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=600' },
    { prompt: 'Slow motion of a hummingbird drinking nectar from a flower.', thumbnail: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=600' }
]

const useExample = (examplePrompt: string) => {
    prompt.value = examplePrompt
    if (inputRef.value) {
        inputRef.value.innerText = examplePrompt
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
        return
    }
    e.preventDefault()
    generateVideo()
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

const pollTaskStatus = async (pid: string) => {
    try {
        const res = await queryAsyncTask({ pid })
        const task = res.data
        if (task) {
            generationProgress.value = task.progress || 0
            if (task.status === 1) {
                isGenerating.value = false
                generationProgress.value = 100
                await fetchHistory()
                activeTab.value = 'creations'
            } else if (task.status === -1 || task.status === -2) {
                isGenerating.value = false
            } else {
                pollingTimer = setTimeout(() => pollTaskStatus(pid), 3000)
            }
        }
    } catch (error) {
        isGenerating.value = false
    }
}

const generateVideo = async () => {
    if (!prompt.value.trim() || isGenerating.value || !selectedModel.value) return
    isGenerating.value = true
    generationProgress.value = 0
    try {
        const res = await createAsyncTask({
            capability: 'video_generation',
            model: `${selectedModel.value.provider}:${selectedModel.value.model}`,
            prompt: prompt.value,
            aspect_ratio: selectedAspectRatio.value,
            duration: selectedDuration.value,
            resolution: selectedResolution.value,
            image: uploadedImageKey.value || undefined
        })
        if (res.data?.pid) {
            pollTaskStatus(res.data.pid)
            prompt.value = ''
            if (inputRef.value) inputRef.value.innerText = ''
        }
        else throw new Error()
    } catch (error) {
        isGenerating.value = false
    }
}

const handleDownload = (videoUrl: string) => {
    window.open(videoUrl, '_blank')
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
</style>
