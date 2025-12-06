<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-gray-900 dark:text-white">{{ title }}</h3>
      <router-link to="/explore" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">查看全部</router-link>
    </div>
    <div class="relative group/list">
      <div 
        ref="scrollContainer"
        class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1"
        @scroll="checkScroll"
      >
        <div 
          v-for="bot in bots" 
          :key="bot.id" 
          class="flex flex-col items-center gap-2 cursor-pointer min-w-[80px] group transition-transform hover:-translate-y-1"
          @click="handleBotClick(bot)"
        >
           <div 
            class="w-16 h-16 rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-sm border border-gray-100 dark:border-[#2a2a2a] flex items-center justify-center text-3xl transition-transform overflow-hidden relative"
            :class="bot.type === 'search' ? 'rounded-full' : ''"
           >
              <img v-if="bot.icon.startsWith('http')" :src="bot.icon" class="w-full h-full object-cover" />
              <span v-else>{{ bot.icon }}</span>
           </div>
           
           <div class="flex flex-col items-center">
              <span class="text-xs text-center text-gray-700 dark:text-gray-300 font-medium max-w-[90px] truncate leading-tight">{{ bot.name }}</span>
              <span v-if="bot.description" class="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  {{ bot.description }}
              </span>
           </div>
        </div>

        <!-- Spacer for the end -->
        <div class="min-w-[5px]"></div>
      </div>

      <!-- Right Scroll Button (Only show if overflow) -->
      <div 
        v-if="canScrollRight" 
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-full items-center bg-gradient-to-l from-[#fcfbfb] dark:from-[#000000] via-[#fcfbfb] dark:via-[#000000] to-transparent pl-4 pr-1"
      >
         <button 
          @click="scrollRight"
          class="w-8 h-8 rounded-full bg-white dark:bg-[#1a1a1a] shadow border border-gray-100 dark:border-[#2a2a2a] flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-[#222222] transition-colors"
         >
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
         </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Bot } from '@/data/bots'
import { useConversationStore } from '@/store/conversation'

const router = useRouter()
const conversationStore = useConversationStore()

interface Props {
  title: string
  bots: Bot[]
}

const props = defineProps<Props>()
const scrollContainer = ref<HTMLElement | null>(null)
const canScrollRight = ref(false)

const handleBotClick = (bot: Bot) => {
    if (bot.mode === 'image') {
        router.push({ name: 'ImageGeneration' })
    } else if (bot.type === 'search') { 
        router.push({ name: 'AISearchEngine' }) 
    } else {
        // Chat
        const conversation = conversationStore.createConversation(bot.id)
        router.push({ name: 'ChatView', params: { id: conversation.id } })
    }
}

const checkOverflow = () => {
  if (scrollContainer.value) {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
    // Use a small tolerance (1px)
    canScrollRight.value = scrollWidth > clientWidth && Math.ceil(scrollLeft + clientWidth) < scrollWidth
  }
}

const checkScroll = () => {
  checkOverflow()
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 200,
      behavior: 'smooth'
    })
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  checkOverflow()
  
  if (scrollContainer.value) {
    resizeObserver = new ResizeObserver(() => checkOverflow())
    resizeObserver.observe(scrollContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
