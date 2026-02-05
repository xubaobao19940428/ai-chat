<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-[#fcfbfb] dark:bg-[#000000] transition-colors">
    <!-- 主内容区域 -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-6xl mx-auto px-4 py-8 min-h-full flex flex-col">
        
        <!-- 欢迎/示例区域 -->
        <div :class="['flex-1 flex flex-col', generatedImages.length === 0 ? 'justify-center' : '']">
          <!-- 标题和副标题 -->
          <div class="text-center mb-12">
            <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">AI Art & Image Generator</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">What would you like to create today?</p>
          </div>

          <!-- 示例图片网格 -->
          <div v-if="generatedImages.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto w-full mb-8">
            <button
              v-for="(example, index) in exampleImages"
              :key="index"
              class="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-gray-200 dark:border-[#2a2a2a] hover:border-gray-300 dark:hover:border-[#333333] transition-all text-left bg-white dark:bg-[#1a1a1a]"
              @click="useExample(example.prompt)"
            >
              <!-- 背景图片/渐变 -->
              <div :class="['absolute inset-0 bg-gradient-to-br opacity-80 transition-transform duration-500 group-hover:scale-110', example.bgGradient]"></div>
              
              <!-- 内容 -->
              <div class="absolute inset-0 p-5 flex flex-col justify-end">
                <p class="text-sm text-white font-medium line-clamp-3 leading-relaxed drop-shadow-md">{{ example.prompt }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- 生成历史 -->
        <div v-if="generatedImages.length > 0" class="w-full mb-24">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Your Creations
            </h2>
            <button @click="clearHistory" class="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Clear History
            </button>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <div
              v-for="(image, index) in generatedImages"
              :key="index"
              class="group relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a]"
            >
              <img :src="image.url" :alt="image.prompt" class="w-full h-full object-cover" />
              <!-- 悬停覆盖层 -->
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                <p class="text-white text-xs line-clamp-2 mb-3">{{ image.prompt }}</p>
                <div class="flex gap-2">
                  <button class="flex-1 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded hover:bg-white/30 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 生成中占位符 -->
            <div v-if="isGenerating" class="aspect-square rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] flex flex-col items-center justify-center p-6 animate-pulse border border-gray-200 dark:border-[#2a2a2a]">
              <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Generating...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div class="flex-shrink-0 bg-[#fcfbfb] dark:bg-[#000000] border-t border-gray-200 dark:border-[#1a1a1a] p-6 z-10 transition-colors">
      <div class="max-w-4xl mx-auto">
        <div class="relative bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] focus-within:border-indigo-500 dark:focus-within:border-[#333333] transition-colors">
          <textarea
            v-model="prompt"
            rows="1"
            placeholder="Type and describe your image idea here to generate"
            class="w-full pl-12 pr-16 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none resize-none max-h-32 overflow-y-auto text-base"
            @keydown.enter.prevent="generateImage"
            style="min-height: 60px;"
          ></textarea>
          
          <!-- Attachment Icon -->
          <button class="absolute left-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
            <Paperclip :size="24" />
          </button>

          <!-- Generate Button -->
          <button
            @click="generateImage"
            :disabled="!prompt.trim() || isGenerating"
            class="absolute right-2 top-2 p-2 bg-indigo-600 dark:bg-white text-white dark:text-black rounded-xl hover:bg-indigo-700 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
             <Zap v-if="!isGenerating" :size="24" />
             <Loader2 v-else :size="24" class="animate-spin" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Paperclip, Zap, Loader2 } from 'lucide-vue-next'

const prompt = ref('')
const isGenerating = ref(false)
const generatedImages = ref<Array<{ url: string; prompt: string }>>([])

const clearHistory = () => {
  if (confirm('Are you sure you want to clear your generation history?')) {
    generatedImages.value = []
  }
}

const exampleImages = [
  {
    bgGradient: 'from-indigo-900 via-purple-900 to-pink-900',
    prompt: 'Mario Bros as a Japanese anime cartoon style, inspired by Studio Ghibli\'s.'
  },
  {
    bgGradient: 'from-amber-700 via-orange-800 to-red-900',
    prompt: 'A cute anthropomorphic red fox character with large eyes, sitting in a sunlit field.'
  },
  {
    bgGradient: 'from-blue-900 via-slate-800 to-gray-900',
    prompt: 'Futuristic cyberpunk city with neon lights and flying cars in the rain.'
  },
  {
    bgGradient: 'from-emerald-900 via-teal-900 to-cyan-900',
    prompt: 'A magical forest with glowing mushrooms and fireflies at night.'
  }
]

const useExample = (examplePrompt: string) => {
  prompt.value = examplePrompt
}

const generateImage = async () => {
  if (!prompt.value.trim() || isGenerating.value) return

  isGenerating.value = true

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 添加到生成历史
    generatedImages.value.unshift({
      url: `https://via.placeholder.com/512x512?text=${encodeURIComponent(prompt.value.slice(0, 20))}`,
      prompt: prompt.value
    })
    
    prompt.value = ''
  } catch (error) {
    console.error('生成图像失败:', error)
    alert('生成图像失败，请稍后再试')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped lang="scss">
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.3);
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(156, 163, 175, 0.5);
    }
  }
}
</style>
