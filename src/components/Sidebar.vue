<template>
  <!-- 桌面端侧边栏 -->
  <aside
    :class="[
      'hidden lg:flex flex-col h-full bg-[#171717] text-gray-300 border-r border-gray-800 transition-all duration-300',
      uiStore.sidebarCollapsed ? 'w-20' : 'w-[260px]'
    ]"
  >
    <!-- 顶部：标题和新建按钮 -->
    <div class="p-3">
      <div class="flex items-center justify-between mb-4 px-2">
        <div v-show="!uiStore.sidebarCollapsed" class="flex items-center gap-2">
           <span class="font-semibold text-white text-lg tracking-tight">Chatbot App</span>
        </div>
        <button
          @click="uiStore.toggleSidebar"
          class="p-2 hover:bg-[#2f2f2f] rounded-md transition-colors text-gray-400 hover:text-white"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <button
        @click="handleNewChat"
        :class="[
          'w-full flex items-center gap-3 px-3 py-3 bg-[#2f2f2f] hover:bg-[#424242] text-white rounded-lg transition-colors text-sm mb-4',
          uiStore.sidebarCollapsed ? 'justify-center' : ''
        ]"
        :title="uiStore.sidebarCollapsed ? 'New Chat' : ''"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span v-show="!uiStore.sidebarCollapsed">New Chat</span>
      </button>

      <!-- My Tools Section -->
      <div class="mb-2">
        <div v-show="!uiStore.sidebarCollapsed" class="px-2 text-xs font-medium text-gray-500 mb-2">My Tools</div>
        <div class="space-y-0.5">
           <router-link
            to="/chat"
            :class="[
              'flex items-center gap-3 rounded-lg transition-colors text-sm',
              uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2',
              $route.path.startsWith('/chat') ? 'bg-[#2f2f2f] text-white' : 'text-gray-300 hover:bg-[#2f2f2f] hover:text-white'
            ]"
          >
            <span class="text-xl">🤖</span>
            <span v-show="!uiStore.sidebarCollapsed">AI Chat</span>
          </router-link>
          <router-link
            to="/image-generation"
            :class="[
              'flex items-center gap-3 rounded-lg transition-colors text-sm',
              uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2',
              $route.path === '/image-generation' ? 'bg-[#2f2f2f] text-white' : 'text-gray-300 hover:bg-[#2f2f2f] hover:text-white'
            ]"
          >
            <span class="text-xl">🎨</span>
            <span v-show="!uiStore.sidebarCollapsed">Image Generator</span>
          </router-link>
        </div>
      </div>

      <!-- Chats Section -->
      <div class="mt-4">
        <div v-show="!uiStore.sidebarCollapsed" class="px-2 text-xs font-medium text-gray-500 mb-2">Chats</div>
        <div class="space-y-0.5">
           <div v-if="conversationStore.conversations.length === 0 && !uiStore.sidebarCollapsed" class="px-3 py-2 text-sm text-gray-500">
            No Chat History
          </div>
          <div
            v-for="conversation in conversationStore.conversations"
            :key="conversation.id"
            :class="[
              'flex items-center rounded-lg cursor-pointer transition-colors text-sm group',
              uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2 gap-3',
              conversationStore.currentConversationId === conversation.id
                ? 'bg-[#2f2f2f] text-white'
                : 'text-gray-300 hover:bg-[#2f2f2f] hover:text-white'
            ]"
            @click="handleSelectConversation(conversation.id)"
          >
            <svg class="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span v-show="!uiStore.sidebarCollapsed" class="flex-1 truncate">{{ conversation.title }}</span>
             <button
              v-show="!uiStore.sidebarCollapsed"
              @click.stop="handleDeleteConversation(conversation.id)"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#424242] rounded transition-all text-gray-400 hover:text-white"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Links -->
    <div class="mt-auto p-3 border-t border-gray-800 space-y-1">
      <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#2f2f2f] hover:text-white rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span v-show="!uiStore.sidebarCollapsed">Help & FAQ</span>
      </a>
      <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#2f2f2f] hover:text-white rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        <span v-show="!uiStore.sidebarCollapsed">Explore Tools</span>
      </a>
      <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm text-yellow-500 hover:bg-[#2f2f2f] rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        <span v-show="!uiStore.sidebarCollapsed">Go Pro</span>
      </a>
       
       <div class="pt-2 mt-2 border-t border-gray-800 flex flex-col gap-1">
          <button class="flex items-center gap-3 px-3 py-2 text-sm text-blue-400 hover:bg-[#2f2f2f] rounded-lg transition-colors text-left w-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            <span v-show="!uiStore.sidebarCollapsed">Login</span>
          </button>
           <button class="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#2f2f2f] hover:text-white rounded-lg transition-colors text-left w-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            <span v-show="!uiStore.sidebarCollapsed">Sign up</span>
          </button>
       </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useConversationStore } from '@/store/conversation'
import { useUIStore } from '@/store/ui'

const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()

const handleNewChat = () => {
  const conversation = conversationStore.createConversation()
  router.push(`/chat/${conversation.id}`)
  uiStore.closeMobileMenu()
}

const handleSelectConversation = (id: string) => {
  conversationStore.switchConversation(id)
  router.push(`/chat/${id}`)
  uiStore.closeMobileMenu()
}

const handleDeleteConversation = (id: string) => {
  if (confirm('确定要删除这个对话吗？')) {
    conversationStore.deleteConversation(id)
    if (conversationStore.conversations.length > 0) {
      const firstConversation = conversationStore.conversations[0]
      if (firstConversation) {
        router.push(`/chat/${firstConversation.id}`)
      } else {
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }
}
</script>

<style scoped lang="scss">
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.3);
    border-radius: 3px;
    
    &:hover {
      background-color: rgba(156, 163, 175, 0.5);
    }
  }
}
</style>
