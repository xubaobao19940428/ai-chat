<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-[14px] font-medium text-[var(--text-primary)]">{{ title }}</h3>
        
        <div class="flex items-center gap-4" v-if="links && links.length">
            <button v-for="(link, i) in links" :key="i" class="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <component :is="link.icon" v-if="link.icon" class="w-4 h-4" />
                <span>{{ link.text }}</span>
            </button>
        </div>
    </div>
    
    <div class="flex flex-wrap gap-2">
      <button 
        v-for="(chip, index) in chips" 
        :key="index"
        @click="$emit('select', chip.text)"
        class="h-9 px-4 rounded-[10px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] transition-colors flex items-center justify-center gap-2 text-[13px] text-[var(--text-primary)]"
      >
        <component :is="chip.icon" v-if="chip.icon" class="w-4 h-4 text-[var(--text-secondary)]" />
        <span>{{ chip.text }}</span>
      </button>
      
      <button class="h-9 w-9 rounded-full border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] transition-colors flex items-center justify-center text-[var(--text-secondary)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'

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

defineEmits(['select'])
</script>
