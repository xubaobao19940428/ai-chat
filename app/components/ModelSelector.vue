<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2.5 px-3 py-2 bg-gray-100 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-xl transition-all text-[11px] font-bold cursor-pointer border border-gray-200 dark:border-white/10 active:scale-95 shadow-sm"
    >
      <ClientOnly>
        <span class="truncate max-w-[100px] sm:max-w-[120px]">{{ modelStore.selectedModel?.display_name || 'Select Model' }}</span>
      </ClientOnly>
      <svg
        class="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 sm:translate-y-2 scale-95 opacity-0"
      enter-to-class="transform translate-y-0 scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform translate-y-4 sm:translate-y-2 scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-x-4 bottom-32 sm:absolute sm:inset-auto sm:bottom-full sm:right-0 sm:mb-4 w-auto sm:w-80 origin-bottom sm:origin-bottom-right rounded-2xl glass-effect shadow-2xl premium-shadow ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-[100] overflow-hidden p-1.5"
      >
        <div v-if="modelStore.isLoading" class="p-6 text-center">
            <div class="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <div v-else class="space-y-1 max-h-[350px] overflow-y-auto no-scrollbar">
            <div class="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Available Models</div>
            <button
              v-for="model in modelStore.models"
              :key="model.model"
              @click="selectModel(`${model.provider}:${model.model}`)"
              class="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left hover:bg-white dark:hover:bg-white/5 group relative"
              :class="{ 'bg-white/80 dark:bg-white/10 shadow-sm': modelStore.selectedModelId === `${model.provider}:${model.model}` }"
            >
            <!-- Provider Icon -->
            <div class="flex-shrink-0">
              <div class="w-9 h-9 rounded-xl bg-white dark:bg-black/40 border border-gray-100 dark:border-white/5 flex items-center justify-center text-lg group-hover:scale-110 transition-transform premium-shadow">
                {{ getModelIcon(model) }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-[13px] font-bold text-gray-900 dark:text-white leading-none">{{ model.display_name }}</span>
                <div v-if="modelStore.selectedModelId === `${model.provider}:${model.model}`" class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
              </div>
              <p class="text-[10px] leading-tight text-gray-400 dark:text-gray-500 line-clamp-1">
                {{ model.provider }} · {{ model.context_length / 1000 }}k ctx
              </p>
            </div>

            <!-- Checkmark for active -->
            <div v-if="modelStore.selectedModelId === `${model.provider}:${model.model}`" class="flex-shrink-0">
                <div class="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
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
