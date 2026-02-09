<template>
  <div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">

    <!-- Tab Switcher (Fixed at Top, Outside Scroll Area) -->
    <div class="flex justify-center py-4 bg-[var(--background-gray-main)] border-b border-transparent">
      <div class="bg-[var(--fill-tsp-gray-main)] p-1 rounded-full border border-[var(--border-main)] flex items-center">
        <button @click="activeTab = 'inspiration'"
          class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
          :class="activeTab === 'inspiration' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
          Inspiration
        </button>
        <button @click="activeTab = 'creations'"
          class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
          :class="activeTab === 'creations' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
          My Gallery
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
            <div v-for="(example, index) in exampleImages" :key="index"
              class="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-card)] border border-[var(--border-main)] hover:border-[var(--text-tertiary)] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              @click="useExample(example.prompt)">
              <img :src="example.url"
                class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                :alt="example.prompt" />
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <p class="text-white text-[13px] font-medium line-clamp-2 italic mb-3 leading-snug">"{{ example.prompt
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
          <div v-if="generatedImages.length === 0" class="py-40 flex flex-col items-center justify-center">
            <div class="relative mb-8">
              <div class="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse-slow"></div>
              <div
                class="relative size-24 rounded-[32px] bg-[var(--bg-main)] border border-[var(--border-main)] flex items-center justify-center shadow-2xl">
                <ImageIcon :size="40" class="text-indigo-500" />
              </div>
              <div
                class="absolute -right-2 -bottom-2 size-10 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100 rotate-12">
                <Sparkles :size="20" class="text-amber-500" />
              </div>
            </div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Your Gallery Awaits</h3>
            <p class="text-[var(--text-tertiary)] text-[15px] mt-2 max-w-[280px] text-center leading-relaxed">
              Transform your ideas into stunning visuals. Every creation will be preserved here.
            </p>
            <button @click="triggerFocus"
              class="mt-8 px-8 py-3 bg-[var(--text-primary)] text-white rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95">
              Start Creating
            </button>
          </div>

          <!-- Premium Gallery Grid -->
          <div v-else class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            <div v-for="(image, index) in generatedImages" :key="index"
              class="break-inside-avoid group relative rounded-[24px] overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-indigo-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">

              <!-- Image Container with Inner Shadow -->
              <div class="relative overflow-hidden aspect-auto">
                <img :src="image.url || image.cover_url"
                  class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[24px]"></div>
              </div>

              <!-- Content Overlay (Sophisticated Gradient) -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-5">

                <!-- Top Actions (Glassmorphism) -->
                <div
                  class="flex justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  <button @click.stop="handleDownload(image.url || image.cover_url)"
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
                      {{ formatModel(image.meta?.model || (image as any).model) }}
                    </span>
                    <span class="text-[10px] font-medium text-white/60">
                      {{ formatDate(image.created_at) }}
                    </span>
                  </div>
                  <p class="text-white text-[13px] font-medium mb-4 line-clamp-3 leading-relaxed italic">
                    "{{ image.prompt || image.meta?.prompt || 'No description' }}"
                  </p>
                  <button @click.stop="useExample(image.prompt || image.meta?.prompt || '')"
                    class="w-full py-2.5 bg-white text-black rounded-xl font-bold text-[12px] hover:bg-indigo-50 transition-colors shadow-xl flex items-center justify-center gap-2 group/reuse">
                    <Zap :size="14" fill="currentColor" class="text-indigo-600 group-hover/reuse:animate-pulse" />
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

    <!-- Floating Pill Control Bar (Bottom - Aligned with Manus Design) -->
    <div class="absolute bottom-12 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
      <div class="w-full max-w-[840px] relative pointer-events-auto">
        <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0">
          <div v-if="isGenerating"
            class="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-full shadow-lg">
            <Loader2 :size="14" class="animate-spin text-indigo-500" />
            <span class="text-[11px] font-bold text-[var(--text-primary)]">{{ generationProgress }}%
              Generating...</span>
          </div>
        </transition>

        <div
          class="bg-[var(--bg-main)]/90 backdrop-blur-xl rounded-[28px] border border-[var(--border-main)] p-2 shadow-[var(--shadow-pill)] flex flex-col gap-1 transition-all">
          <!-- Selector Row -->
          <div class="flex items-center gap-1.5 px-1.5 py-1">
            <!-- Model Selection -->
            <div class="relative">
              <button @click="openDropdown = openDropdown === 'model' ? null : 'model'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] transition-colors">
                <Monitor :size="13" class="text-[var(--text-secondary)]" />
                <span class="text-[11px] font-bold text-[var(--text-secondary)]">{{ selectedModel?.display_name ||
                  'Engine'
                  }}</span>
                <ChevronDown :size="12" class="text-[var(--text-tertiary)]" />
              </button>
              <div v-if="openDropdown === 'model'"
                class="absolute bottom-full left-0 mb-3 w-48 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl shadow-xl p-1.5 z-[60]">
                <button v-for="m in models" :key="m.model" @click="selectedModel = m; openDropdown = null"
                  class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors">
                  <span class="text-[12px] font-medium"
                    :class="selectedModel?.model === m.model ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{
                      m.display_name }}</span>
                  <div v-if="selectedModel?.model === m.model" class="size-1.5 rounded-full bg-indigo-500"></div>
                </button>
              </div>
            </div>

            <!-- Aspect Ratio -->
            <div class="relative">
              <button @click="openDropdown = openDropdown === 'ratio' ? null : 'ratio'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] transition-colors text-[11px] font-bold text-[var(--text-secondary)]">
                {{ selectedAspectRatio }}
              </button>
              <div v-if="openDropdown === 'ratio'"
                class="absolute bottom-full left-0 mb-3 grid grid-cols-3 gap-1 w-40 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl shadow-xl p-2 z-[60]">
                <button v-for="r in ['1:1', '16:9', '9:16', '3:2', '2:3', '4:5']" :key="r"
                  @click="selectedAspectRatio = r; openDropdown = null"
                  class="py-2.5 rounded-lg transition-all text-[11px] font-bold border"
                  :class="selectedAspectRatio === r ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]' : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-hover)]'">
                  {{ r }}
                </button>
              </div>
            </div>

            <!-- Style Selection -->
            <div class="relative">
              <button @click="openDropdown = openDropdown === 'style' ? null : 'style'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] transition-colors">
                <span class="text-[11px] font-bold text-[var(--text-secondary)]">{{ selectedStyle }}</span>
                <ChevronDown :size="12" class="text-[var(--text-tertiary)]" />
              </button>
              <div v-if="openDropdown === 'style'"
                class="absolute bottom-full left-0 mb-3 w-40 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl shadow-xl p-1.5 z-[60] max-h-48 overflow-y-auto custom-scrollbar">
                <button v-for="s in ['No Style', 'Cinematic', 'Realistic', 'Anime', 'Oil Painting', 'Digital Art']"
                  :key="s" @click="selectedStyle = s; openDropdown = null"
                  class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left">
                  <span class="text-[12px] font-medium"
                    :class="selectedStyle === s ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{ s
                    }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Uploaded Image Preview Area -->
          <div v-if="previewImageUrl" class="px-4 pt-2">
            <div class="relative inline-block group/preview">
              <img :src="previewImageUrl"
                class="w-20 h-20 object-cover rounded-xl border border-[var(--border-main)] shadow-sm" />
              <button @click="removeAttachedImage"
                class="absolute -top-1.5 -right-1.5 size-5 bg-[var(--text-primary)] text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity">
                <X :size="12" stroke-width="3" />
              </button>
            </div>
          </div>

          <!-- Input Row -->
          <div class="flex items-center gap-3 px-2 pb-1.5">
            <button @click="triggerFileUpload" :disabled="isUploading"
              class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--bg-hover)] disabled:opacity-50">
              <Paperclip v-if="!isUploading" :size="20" />
              <Loader2 v-else :size="20" class="animate-spin" />
            </button>

            <!-- Hidden File Input -->
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />

            <div ref="inputRef" contenteditable="true"
              class="flex-1 bg-transparent border-none text-[var(--text-primary)] focus:outline-none font-medium text-[15px] py-1.5 max-h-40 overflow-y-auto no-scrollbar relative min-h-[36px] outline-none"
              :data-placeholder="'Describe what you want to create...'" @input="handleInput"
              @keydown.enter="handleEnterKey" @paste="handlePaste"></div>

            <button @click="generateImage" :disabled="!prompt.trim() || isGenerating"
              class="size-10 rounded-full bg-[var(--text-primary)] text-white flex items-center justify-center hover:opacity-90 active:scale-95 disabled:opacity-20 transition-all shadow-md">
              <Zap v-if="!isGenerating" :size="20" fill="currentColor" />
              <Loader2 v-else :size="20" class="animate-spin" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Paperclip,
  Zap,
  Loader2,
  Monitor,
  X,
  Image as ImageIcon,
  Download,
  ChevronDown,
  LayoutGrid,
  Sparkles
} from 'lucide-vue-next'
import {
  getModels,
  createAsyncTask,
  queryAsyncTask,
  getAsyncTaskOutputs,
  uploadFile,
  type AIModel
} from '@/utils/api'

definePageMeta({
  hideTopBar: true
})

// Define AsyncTaskOutput locally
export interface AsyncTaskOutput {
  id: number
  type: string
  cover_url: string
  url: string
  task_id: string
  status: number
  created_at: number
  prompt?: string
  meta?: any
}

const activeTab = ref<'inspiration' | 'creations'>('inspiration')
const prompt = ref('')
const isGenerating = ref(false)
const generationProgress = ref(0)
const selectedCategory = ref('All')
const openDropdown = ref<string | null>(null)

// Model & Options State
const models = ref<AIModel[]>([])
const selectedModel = ref<AIModel | null>(null)
const selectedAspectRatio = ref('1:1')
const selectedStyle = ref('No Style')

// File Upload State
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedImageKey = ref('')
const previewImageUrl = ref('')
const inputRef = ref<HTMLDivElement | null>(null)

const categories = [
  'All', 'Trending', 'Sci-Fi', 'Nature', 'Portrait', 'Abstract'
]

const generatedImages = ref<AsyncTaskOutput[]>([])
let pollingTimer: any = null

const fetchHistory = async () => {
  try {
    const res = await getAsyncTaskOutputs({ type: 'image', page_size: 50 })
    if (res.data && res.data.list) {
      generatedImages.value = res.data.list
    }
  } catch (error) {
    console.error('Failed to fetch history:', error)
  }
}

const fetchModels = async () => {
  try {
    const res = await getModels({ capability: 'image_generation' })
    if (res.data) {
      models.value = res.data
      selectedModel.value = models.value.find(m => m.is_default) || models.value[0] || null
    }
  } catch (error) {
    console.error('Failed to fetch models:', error)
  }
}

onMounted(() => {
  fetchModels()
  fetchHistory()
})

onUnmounted(() => {
  if (pollingTimer) clearTimeout(pollingTimer)
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
  if (!modelStr) return 'STABLE DIFFUSION'
  // Remove provider prefix if exists
  const parts = modelStr.split(':')
  const name = parts.length > 1 ? parts[1] : parts[0]
  return (name || '').replace(/-/g, ' ').toUpperCase()
}

const exampleImages = [
  { prompt: 'A mystical cyberpunk cat sitting on a neon rooftop, 8k cinematic.', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600' },
  { prompt: 'Ethereal forest with floating islands and crystal waterfalls.', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600' },
  { prompt: 'Hyper-realistic portrait of an iron knight with glowing blue eyes.', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600' },
  { prompt: 'Vibrant futuristic sneaker design with energy circuits.', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600' },
  { prompt: 'Retro-futuristic vaporwave city during sunset, pink and teal.', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600' },
  { prompt: 'Ancient dragon made of black smoke and lightning clouds.', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600' }
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
    // Let default behavior (new line) happen
    return
  }
  e.preventDefault()
  generateImage()
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
    // Reset input value to allow re-uploading same file
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
      } else if (task.status === -1) {
        isGenerating.value = false
      } else {
        pollingTimer = setTimeout(() => pollTaskStatus(pid), 2000)
      }
    }
  } catch (error) {
    isGenerating.value = false
  }
}

const generateImage = async () => {
  if (!prompt.value.trim() || isGenerating.value || !selectedModel.value) return
  isGenerating.value = true
  generationProgress.value = 0
  try {
    const res = await createAsyncTask({
      capability: 'image_generation',
      model: `${selectedModel.value.provider}:${selectedModel.value.model}`,
      prompt: prompt.value,
      aspect_ratio: selectedAspectRatio.value,
      style: selectedStyle.value !== 'No Style' ? selectedStyle.value : undefined,
      image: uploadedImageKey.value || undefined
    })
    if (res.data?.pid) {
      pollTaskStatus(res.data.pid)
      // Clear input after success
      prompt.value = ''
      if (inputRef.value) inputRef.value.innerText = ''
    }
    else throw new Error()
  } catch (error) {
    isGenerating.value = false
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
</style>
