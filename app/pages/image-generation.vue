<template>
  <div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">
    <!-- Header (Fixed) -->
    <header
      class="flex-shrink-0 flex items-center justify-between py-3.5 px-6 border-b border-[var(--border-light)] bg-[var(--bg-main)]/80 backdrop-blur-md sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-semibold text-[var(--text-primary)] tracking-tight">Image Generator</h1>
      </div>

      <!-- Tab Switcher (Project Segment Style) -->
      <div class="bg-[var(--fill-tsp-gray-main)] p-1 rounded-full border border-[var(--border-main)] flex items-center">
        <button @click="activeTab = 'inspiration'"
          class="px-5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
          :class="activeTab === 'inspiration' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
          Inspiration
        </button>
        <button @click="activeTab = 'creations'"
          class="px-5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
          :class="activeTab === 'creations' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
          My Gallery
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button class="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors">
          <LayoutGrid :size="18" />
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto px-8 py-10 pb-56 custom-scrollbar relative">
      <div class="max-w-[1440px] mx-auto">

        <!-- Category Filter Chips (Pill Style) -->
        <div v-if="activeTab === 'inspiration'" class="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="[
            'px-4 py-1.5 text-[13px] font-medium rounded-full border transition-all whitespace-nowrap',
            selectedCategory === cat
              ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm'
              : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]'
          ]">
            {{ cat }}
          </button>
        </div>

        <!-- Masonry Grid Layout -->
        <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <template v-if="activeTab === 'inspiration'">
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
          </template>

          <template v-else>
            <!-- My Gallery Tab -->
            <div v-if="generatedImages.length === 0" class="col-span-full py-32 flex flex-col items-center opacity-30">
              <div
                class="size-16 rounded-[20px] bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] flex items-center justify-center mb-4">
                <ImageIcon :size="28" class="text-[var(--text-primary)]" />
              </div>
              <h3 class="text-lg font-bold text-[var(--text-primary)]">Gallery is empty</h3>
              <p class="text-[var(--text-tertiary)] text-sm mt-1">Generate your first image to see it here.</p>
            </div>

            <div v-for="(image, index) in generatedImages" :key="index"
              class="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-card)] border border-[var(--border-main)] hover:border-[var(--text-tertiary)] transition-all shadow-sm">
              <img :src="image.url || image.cover_url" class="w-full h-auto object-cover" />
              <div
                class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-4">
                <div class="flex justify-end">
                  <button @click.stop="handleDownload(image.url || image.cover_url)"
                    class="size-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <Download :size="16" />
                  </button>
                </div>
                <div>
                  <p class="text-white text-xs font-medium mb-3 line-clamp-2">"{{ image.prompt || image.meta?.prompt ||
                    'No description' }}"</p>
                  <button @click.stop="useExample(image.prompt || image.meta?.prompt || '')"
                    class="w-full py-2 bg-white text-black rounded-lg font-bold text-[12px] hover:bg-gray-100 transition-colors">
                    Reuse Prompt
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>

    <!-- Floating Pill Control Bar (Bottom - Aligned with Manus Design) -->
    <div class="fixed bottom-12 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
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
            <div class="relative group/menu">
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] transition-colors">
                <Monitor :size="13" class="text-[var(--text-secondary)]" />
                <span class="text-[11px] font-bold text-[var(--text-secondary)]">{{ selectedModel?.display_name ||
                  'Engine'
                }}</span>
                <ChevronDown :size="12" class="text-[var(--text-tertiary)]" />
              </button>
              <div
                class="absolute bottom-full left-0 mb-3 w-48 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl shadow-xl p-1.5 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible translate-y-2 group-hover/menu:translate-y-0 transition-all duration-200 z-[60]">
                <button v-for="m in models" :key="m.model" @click="selectedModel = m"
                  class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors">
                  <span class="text-[12px] font-medium"
                    :class="selectedModel?.model === m.model ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{
                      m.display_name }}</span>
                  <div v-if="selectedModel?.model === m.model" class="size-1.5 rounded-full bg-indigo-500"></div>
                </button>
              </div>
            </div>

            <!-- Aspect Ratio -->
            <div class="relative group/ratio">
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] transition-colors text-[11px] font-bold text-[var(--text-secondary)]">
                {{ selectedAspectRatio }}
              </button>
              <div
                class="absolute bottom-full left-0 mb-3 grid grid-cols-3 gap-1 w-40 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl shadow-xl p-2 opacity-0 invisible group-hover/ratio:opacity-100 group-hover/ratio:visible translate-y-2 group-hover/ratio:translate-y-0 transition-all duration-200 z-[60]">
                <button v-for="r in ['1:1', '16:9', '9:16', '3:2', '2:3', '4:5']" :key="r"
                  @click="selectedAspectRatio = r" class="py-2.5 rounded-lg transition-all text-[11px] font-bold border"
                  :class="selectedAspectRatio === r ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]' : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-hover)]'">
                  {{ r }}
                </button>
              </div>
            </div>

            <!-- Style Selection -->
            <div class="relative group/style">
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] transition-colors">
                <span class="text-[11px] font-bold text-[var(--text-secondary)]">{{ selectedStyle }}</span>
                <ChevronDown :size="12" class="text-[var(--text-tertiary)]" />
              </button>
              <div
                class="absolute bottom-full left-0 mb-3 w-40 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl shadow-xl p-1.5 opacity-0 invisible group-hover/style:opacity-100 group-hover/style:visible translate-y-2 group-hover/style:translate-y-0 transition-all duration-200 z-[60] max-h-48 overflow-y-auto custom-scrollbar">
                <button v-for="s in ['No Style', 'Cinematic', 'Realistic', 'Anime', 'Oil Painting', 'Digital Art']"
                  :key="s" @click="selectedStyle = s"
                  class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left">
                  <span class="text-[12px] font-medium"
                    :class="selectedStyle === s ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{ s
                    }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Input Row -->
          <div class="flex items-center gap-3 px-2 pb-1.5">
            <button
              class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--bg-hover)]">
              <Paperclip :size="20" />
            </button>

            <textarea v-model="prompt" rows="1" placeholder="Describe what you want to create..."
              class="flex-1 bg-transparent border-none text-[var(--text-primary)] placeholder-[var(--text-disable)] focus:ring-0 resize-none font-medium text-[15px] py-1.5 max-h-40 no-scrollbar"
              @keydown.enter.prevent="generateImage"></textarea>

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
  Sparkles,
  Image as ImageIcon,
  Download,
  LayoutGrid,
  ChevronDown,
  Monitor
} from 'lucide-vue-next'
import {
  getModels,
  createAsyncTask,
  queryAsyncTask,
  getAsyncTaskOutputs,
  type AIModel
} from '@/utils/api'

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

// Model & Options State
const models = ref<AIModel[]>([])
const selectedModel = ref<AIModel | null>(null)
const selectedAspectRatio = ref('1:1')
const selectedStyle = ref('No Style')

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
  const mainEl = document.querySelector('main')
  if (mainEl) mainEl.scrollTo({ top: mainEl.scrollHeight, behavior: 'smooth' })
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
      model: selectedModel.value.model,
      prompt: prompt.value,
      aspect_ratio: selectedAspectRatio.value,
      style: selectedStyle.value !== 'No Style' ? selectedStyle.value : undefined
    })
    if (res.data?.pid) pollTaskStatus(res.data.pid)
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
</style>
