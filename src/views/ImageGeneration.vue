<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-white">
    <!-- 右上角 Go Pro 按钮（桌面端） -->
    <div class="hidden lg:flex justify-end p-4">
      <button class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span>Go Pro</span>
      </button>
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 sm:pb-6">
      <div class="max-w-6xl mx-auto">
        <!-- 标题和副标题 -->
        <div class="text-center mb-6 sm:mb-8">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">AI Art & Image Generator</h1>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600">What would you like to create today?</p>
        </div>

        <!-- 示例图片网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-4xl mx-auto">
          <div
            v-for="(example, index) in exampleImages"
            :key="index"
            class="group relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all bg-gradient-to-br"
            :class="example.bgGradient"
            @click="useExample(example.prompt)"
          >
            <div class="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
              <div class="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4">{{ example.emoji }}</div>
              <div class="text-sm sm:text-base text-white font-semibold mb-1 sm:mb-2">{{ example.title }}</div>
              <div class="text-xs text-white/80 line-clamp-2 px-2">{{ example.description }}</div>
            </div>
            <!-- 悬停遮罩 -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-white text-sm font-medium px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">Click to use</span>
            </div>
          </div>
        </div>

        <!-- 生成历史（如果有） -->
        <div v-if="generatedImages.length > 0" class="mb-6 sm:mb-8">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Your Creations</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            <div
              v-for="(image, index) in generatedImages"
              :key="index"
              class="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img :src="image.url" :alt="image.prompt" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div class="border-t border-gray-200 bg-white p-3 sm:p-4">
      <div class="max-w-4xl mx-auto">
        <div class="relative">
          <input
            v-model="prompt"
            type="text"
            placeholder="Type and describe your image idea here to generate."
            class="w-full pl-10 sm:pl-12 pr-20 sm:pr-28 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 text-sm bg-white"
            @keydown.enter="generateImage"
          />
          <!-- 左侧设置图标 -->
          <button class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <!-- 右侧按钮组 -->
          <div class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
            <!-- 生成按钮 -->
            <button
              @click="generateImage"
              :disabled="!prompt.trim() || isGenerating"
              class="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-medium"
            >
              <span class="hidden sm:inline">{{ isGenerating ? 'Generating...' : 'Generate' }}</span>
              <span class="sm:hidden">{{ isGenerating ? '...' : 'Go' }}</span>
            </button>
            <!-- 麦克风图标 -->
            <button
              @click="toggleVoiceInput"
              class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const prompt = ref('')
const isGenerating = ref(false)
const generatedImages = ref<Array<{ url: string; prompt: string }>>([])
const isVoiceInput = ref(false)

const exampleImages = [
  {
    emoji: '🌃',
    title: 'Starry Night Style',
    description: 'Van Gogh inspired art',
    bgGradient: 'from-indigo-900 via-purple-900 to-pink-900',
    prompt: 'A woman in a golden gown standing in water, reaching towards a swirling vibrant night sky with a large moon and stars, in the style of Van Gogh\'s Starry Night'
  },
  {
    emoji: '🦊',
    title: 'Cute Fox Character',
    description: 'Anthropomorphic character',
    bgGradient: 'from-amber-400 via-orange-500 to-red-500',
    prompt: 'A cute anthropomorphic red fox character with large eyes, sitting in a sunlit field of green and yellow'
  },
  {
    emoji: '🎮',
    title: 'Mario Style',
    description: 'Gaming character art',
    bgGradient: 'from-red-500 via-yellow-500 to-green-500',
    prompt: 'Mario from Nintendo in his classic red cap and blue overalls, standing in a fantastical colorful landscape with whimsical mushroom structures'
  },
  {
    emoji: '🥽',
    title: 'VR Headset',
    description: 'Futuristic technology',
    bgGradient: 'from-slate-800 via-gray-900 to-blue-900',
    prompt: 'A person wearing a futuristic black VR headset with glowing blue lights, dark hair in braids, black textured jacket, blurred dark cityscape background with neon lights'
  }
]

const useExample = (examplePrompt: string) => {
  prompt.value = examplePrompt
}

const generateImage = async () => {
  if (!prompt.value.trim() || isGenerating.value) return

  isGenerating.value = true

  try {
    // TODO: 调用图像生成API
    // const response = await generateImageAPI(prompt.value)
    
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

const toggleVoiceInput = () => {
  isVoiceInput.value = !isVoiceInput.value
  // TODO: 实现语音输入功能
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

