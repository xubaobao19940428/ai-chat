<template>
  <div class="w-full relative group/templates">
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-[14px] font-medium text-[var(--text-primary)]">Choose a template</h3>
        <div class="flex items-center gap-2">
            <button class="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
                8 - 12
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        </div>
    </div>
    
    <div class="relative overflow-hidden">
        <!-- Left Arrow -->
        <div 
            v-if="canScrollLeft"
            class="absolute left-0 top-0 bottom-1 w-12 z-10 flex items-center bg-gradient-to-r from-[var(--background-gray-main)] to-transparent pointer-events-none"
        >
            <button 
                @click="scroll('left')"
                class="w-7 h-7 rounded-full bg-white shadow-sm border border-[var(--border-main)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] pointer-events-auto transition-all"
            >
                <ChevronLeftIcon class="w-4 h-4" />
            </button>
        </div>

        <div 
            ref="scrollContainer"
            @scroll="handleScroll"
            class="flex gap-3 overflow-x-auto scrollbar-none pb-1 scroll-smooth"
        >
            <!-- Import Template Button -->
            <button class="flex flex-col items-center justify-center w-[160px] h-[100px] shrink-0 rounded-[12px] border border-dashed border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] transition-colors gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span class="text-[13px] font-medium">Import template</span>
            </button>

          <button 
            v-for="(template, index) in templates" 
            :key="index"
            class="relative w-[160px] h-[100px] shrink-0 rounded-[12px] overflow-hidden group border border-[var(--border-light)]"
            @click="$emit('select', template)"
          >
            <img :src="template.image" :alt="template.name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end">
                <span class="text-white text-[13px] font-medium leading-tight">{{ template.name }}</span>
            </div>
          </button>
        </div>

        <!-- Right Arrow -->
        <div 
            v-if="canScrollRight"
            class="absolute right-0 top-0 bottom-1 w-12 z-10 flex items-center justify-end bg-gradient-to-l from-[var(--background-gray-main)] to-transparent pointer-events-none"
        >
            <button 
                @click="scroll('right')"
                class="w-7 h-7 rounded-full bg-white shadow-sm border border-[var(--border-main)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] pointer-events-auto transition-all"
            >
                <ChevronRightIcon class="w-4 h-4" />
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

export interface Template {
    id: string
    name: string
    description?: string
    image: string
}

const props = defineProps<{
  templates: Array<Template>
}>()

defineEmits(['select'])

const scrollContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const handleScroll = () => {
    if (!scrollContainer.value) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
    canScrollLeft.value = scrollLeft > 5
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 5
}

const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainer.value) return
    const scrollAmount = 300
    scrollContainer.value.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
    })
}

onMounted(() => {
    handleScroll()
    setTimeout(handleScroll, 100)
})
</script>

<style scoped lang="scss">
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
