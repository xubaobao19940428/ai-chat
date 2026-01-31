<template>
  <div class="w-full">
    <h3 v-if="title" class="text-[14px] font-medium text-[var(--text-primary)] mb-3">{{ title }}</h3>
    <div :class="layout === 'list' ? 'flex flex-col gap-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'">
      <button 
        v-for="(prompt, index) in prompts" 
        :key="index"
        @click="$emit('select', prompt.text)"
        :class="[
          'flex items-center text-left transition-colors group relative',
          layout === 'list' 
            ? 'w-full p-[14px] px-[16px] rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] justify-between' 
            : 'flex-col items-start p-3 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] h-full'
        ]"
      >
        <div class="flex items-center gap-3 min-w-0">
          <component :is="prompt.icon" v-if="prompt.icon" class="w-4 h-4 text-[var(--text-tertiary)]" />
          <p :class="[
            'text-[13px] text-[var(--text-primary)]',
            layout === 'list' ? 'leading-none truncate' : 'leading-[20px] line-clamp-3 mb-6'
          ]">{{ prompt.text }}</p>
        </div>
        <div :class="layout === 'list' ? 'flex-shrink-0' : 'absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--text-tertiary)]">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DefineComponent } from 'vue'

defineProps<{
  prompts: Array<{ text: string, icon?: any }>,
  title?: string,
  layout?: 'grid' | 'list'
}>()

defineEmits(['select'])
</script>
