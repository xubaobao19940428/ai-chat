<template>
  <div class="w-full">
    <h3 class="text-[14px] font-medium text-[var(--text-primary)] mb-3">Sample prompts</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <button 
        v-for="(prompt, index) in prompts" 
        :key="index"
        @click="$emit('select', prompt.text)"
        class="flex flex-col items-start text-left p-3 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] transition-colors h-full group relative"
      >
        <p class="text-[13px] leading-[20px] text-[var(--text-primary)] line-clamp-3 mb-6">{{ prompt.text }}</p>
        <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
defineProps<{
  prompts: Array<{ text: string }>
}>()

defineEmits(['select'])
</script>
