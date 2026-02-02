<template>
  <div class="w-full relative group/chips">
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-[14px] font-medium text-[var(--text-primary)]">{{ title }}</h3>
        
        <div class="flex items-center gap-4" v-if="links && links.length">
            <button v-for="(link, i) in links" :key="i" @click="$emit('link-click', link.text)" class="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <component :is="link.icon" v-if="link.icon" class="w-4 h-4" />
                <span>{{ link.text }}</span>
            </button>
        </div>
    </div>
    
    <div class="relative overflow-hidden">
        <!-- Left Arrow -->
        <div 
            v-if="canScrollLeft"
            class="absolute left-0 top-0 bottom-2 w-12 z-10 flex items-center bg-gradient-to-r from-[var(--background-gray-main)] to-transparent pointer-events-none"
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
            class="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 scroll-smooth"
        >
            <button 
                v-for="(chip, index) in chips" 
                :key="index"
                @click="$emit('select', chip.text)"
                class="h-9 px-4 rounded-[10px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] transition-colors flex items-center justify-center gap-2 text-[13px] text-[var(--text-primary)] shrink-0 whitespace-nowrap"
            >
                <component :is="chip.icon" v-if="chip.icon" class="w-4 h-4 text-[var(--text-secondary)]" />
                <span>{{ chip.text }}</span>
            </button>
        </div>

        <!-- Right Arrow -->
        <div 
            v-if="canScrollRight"
            class="absolute right-0 top-0 bottom-2 w-12 z-10 flex items-center justify-end bg-gradient-to-l from-[var(--background-gray-main)] to-transparent pointer-events-none"
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
import { ref, onMounted, type Component } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface Chip {
    text: string
    icon?: Component
}

interface Link {
    text: string
    icon?: Component
}

defineProps<{
  title: string
  chips: Array<Chip>
  links?: Array<Link>
}>()

defineEmits(['select', 'link-click'])

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
    const scrollAmount = 200
    scrollContainer.value.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
    })
}

onMounted(() => {
    handleScroll()
    // Small delay for content to render
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
