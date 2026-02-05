<template>
  <div class="w-full bg-[var(--fill-tsp-white-light)] rounded-[20px] p-6 mt-8 border border-[var(--border-light)] relative overflow-hidden">
    <div class="flex items-center gap-2 mb-4">
        <h3 class="text-[14px] font-medium text-[var(--text-primary)]">Powerful built-in Integrations</h3>
        <ChevronRight :size="16" class="text-[var(--text-tertiary)]" />
    </div>
    
    <div class="flex flex-wrap gap-2 relative z-10 max-w-[70%]">
        <div v-for="tag in tags" :key="tag" class="px-3 py-1.5 rounded-[8px] bg-white dark:bg-black/20 border border-[var(--border-main)] text-[13px] text-[var(--text-secondary)] shadow-sm">
            {{ tag }}
        </div>
    </div>
    
    <!-- Illustrations (Mockup) -->
    <div class="absolute right-0 bottom-0 pointer-events-none">
        <!-- Abstract UI representation -->
         <img src="/webPageHomePower.png" alt="Integrations" class="h-[120px] w-auto opacity-90 object-contain translate-y-2 translate-x-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

const tags = [
    'LLM', 'Stripe integration', 'Database', 'Image generation', 
    'Maps', 'Notification', 'File storage', 'Data API', 'Voice-to-Text'
]
</script>
