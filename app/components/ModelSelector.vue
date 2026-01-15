<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 rounded-lg transition-all text-xs font-medium cursor-pointer ring-1 ring-inset ring-transparent focus:ring-indigo-500/50"
    >
      <span class="truncate max-w-[150px]">{{ selectedModel?.name }}</span>
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
        <div class="p-1.5 space-y-1">
          <button
            v-for="model in AI_MODELS"
            :key="model.id"
            @click="selectModel(model.id)"
            class="w-full flex items-start gap-4 p-3 rounded-xl transition-all text-left hover:bg-gray-50 dark:hover:bg-[#222222] group relative"
            :class="{ 'bg-gray-50 dark:bg-[#222222]': modelId === model.id }"
          >
            <!-- Badge overlay for active -->
            <div v-if="modelId === model.id" class="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full"></div>

            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <div class="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {{ model.icon }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ model.name }}</span>
                <span
                  v-if="model.isPro"
                  class="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-wider"
                >
                  Pro
                </span>
              </div>
              <p class="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                {{ model.description }}
              </p>
            </div>

            <!-- Checkmark for active -->
            <div v-if="modelId === model.id" class="flex-shrink-0 self-center">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { AI_MODELS, getModelById } from '~/utils/models'

const props = defineProps<{
  modelId: string
}>()

const emit = defineEmits<{
  (e: 'update:modelId', val: string): void
  (e: 'change', val: string): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const selectedModel = computed(() => getModelById(props.modelId))

const selectModel = (id: string) => {
  emit('update:modelId', id)
  emit('change', id)
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
