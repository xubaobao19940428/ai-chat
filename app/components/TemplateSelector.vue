<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-[14px] font-medium text-[var(--text-primary)]">Choose a template</h3>
        <button class="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            {{ templates.length }} - {{ templates.length + 4 }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
    </div>
    
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <!-- Import Template Button -->
        <button class="flex flex-col items-center justify-center h-[120px] rounded-[12px] border border-dashed border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] transition-colors gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
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
        class="relative h-[120px] rounded-[12px] overflow-hidden group border border-[var(--border-light)]"
        @click="$emit('select', template)"
      >
        <img :src="template.image" :alt="template.name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end">
            <span class="text-white text-[13px] font-medium leading-tight">{{ template.name }}</span>
            <p v-if="template.description" class="text-white/80 text-[11px] leading-tight mt-0.5 line-clamp-1">{{ template.description }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Template {
    id: string
    name: string
    description?: string
    image: string
}

defineProps<{
  templates: Array<Template>
}>()

defineEmits(['select'])
</script>
