<template>
  <div class="w-full">
    <h3 v-if="title" class="text-[14px] font-medium text-[var(--text-primary)] mb-4">{{ title }}</h3>
    <div :class="layout === 'list' ? 'flex flex-col gap-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'">
      <button
        v-for="(prompt, index) in prompts"
        :key="index"
        @click="$emit('select', prompt.text)"
        :class="[
          'flex items-center text-left transition-all duration-200 group relative',
          layout === 'list'
            ? 'w-full p-4 px-5 rounded-[16px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-main)] hover:border-[var(--border-dark)] justify-between active:scale-[0.98]'
            : 'flex-col items-start p-4 pb-12 rounded-[16px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-main)] hover:border-[var(--border-dark)] min-h-[120px] active:scale-[0.98]'
        ]"
      >
        <div :class="['flex min-w-0 flex-1', layout === 'list' ? 'items-center gap-3' : 'flex-col gap-2']">
          <component
            :is="prompt.icon"
            v-if="prompt.icon"
            :class="[
              'flex-shrink-0 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors',
              layout === 'list' ? 'w-[18px] h-[18px]' : 'w-5 h-5'
            ]"
          />
          <p :class="[
            'text-[var(--text-primary)] font-normal',
            layout === 'list' ? 'text-[14px] leading-[20px] line-clamp-1' : 'text-[14px] leading-[21px] line-clamp-3'
          ]">{{ prompt.text }}</p>
        </div>
        <div :class="layout === 'list' ? 'flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity' : 'absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'">
            <ArrowUpRight :size="14" class="text-[var(--text-tertiary)]" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import type { DefineComponent } from 'vue'

defineProps<{
  prompts: Array<{ text: string, icon?: any }>,
  title?: string,
  layout?: 'grid' | 'list'
}>()

defineEmits(['select'])
</script>
