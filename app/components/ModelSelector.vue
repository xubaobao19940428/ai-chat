<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 rounded-lg transition-all text-xs font-medium cursor-pointer ring-1 ring-inset ring-transparent focus:ring-indigo-500/50"
    >
      <span class="truncate max-w-[150px]">{{ modelStore.selectedModel?.display_name || '选择模型' }}</span>
      <svg
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-full right-0 mb-2 w-72 origin-bottom-right rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-2xl shadow-indigo-500/10 ring-1 ring-gray-200 dark:ring-gray-800 focus:outline-none z-50 overflow-hidden"
      >
        <div v-if="modelStore.isLoading" class="p-4 text-center text-xs text-gray-500">
          加载中...
        </div>
        <div v-else class="p-1.5 space-y-1 max-h-[400px] overflow-y-auto">
          <button
            v-for="model in modelStore.models"
            :key="model.model"
            @click="selectModel(model.model)"
            class="w-full flex items-start gap-4 p-3 rounded-xl transition-all text-left hover:bg-gray-50 dark:hover:bg-[#222222] group relative"
            :class="{ 'bg-gray-50 dark:bg-[#222222]': modelStore.selectedModelId === model.model }"
          >
            <!-- Badge overlay for active -->
            <div v-if="modelStore.selectedModelId === model.model" class="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full"></div>

            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <div class="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {{ getModelIcon(model) }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ model.display_name }}</span>
                <span
                  v-if="model.is_default"
                  class="px-1.5 py-0.5 text-[10px] font-bold bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-md border border-green-100 dark:border-green-500/20 uppercase tracking-wider"
                >
                  Match
                </span>
              </div>
              <p class="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                {{ model.description || model.provider }}
              </p>
            </div>

            <!-- Checkmark for active -->
            <div v-if="modelStore.selectedModelId === model.model" class="flex-shrink-0 self-center">
                <svg class="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const modelStore = useModelStore()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const getModelIcon = (model: any) => {
  const provider = model.provider.toLowerCase()
  if (provider.includes('openai')) return '🤖'
  if (provider.includes('google')) return '💎'
  if (provider.includes('anthropic')) return '🧠'
  if (provider.includes('deepseek')) return '🐋'
  return '🌟'
}

const selectModel = (id: string) => {
  modelStore.selectModel(id)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
