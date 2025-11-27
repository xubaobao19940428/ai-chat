<template>
  <!-- 桌面端侧边栏 -->
  <aside
    :class="[
      'hidden lg:flex flex-col h-full bg-white text-gray-700 border-r border-gray-200 transition-all duration-300',
      uiStore.sidebarCollapsed ? 'w-20' : 'w-[280px]'
    ]"
  >
    <!-- 顶部：标题和新建按钮 -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center gap-3 mb-4">
        <button
          @click="uiStore.toggleSidebar"
          class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <svg
            :class="['w-5 h-5 text-gray-600 transition-transform', uiStore.sidebarCollapsed && 'rotate-180']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 v-show="!uiStore.sidebarCollapsed" class="text-lg font-semibold text-gray-900 whitespace-nowrap">
          Chatbot App
        </h1>
        <h1 v-show="uiStore.sidebarCollapsed" class="text-lg font-semibold text-gray-900">C</h1>
      </div>
      <button
        @click="handleNewChat"
        :class="[
          'w-full flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-medium text-sm',
          uiStore.sidebarCollapsed ? 'justify-center' : ''
        ]"
        :title="uiStore.sidebarCollapsed ? 'New Chat' : ''"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span v-show="!uiStore.sidebarCollapsed">New Chat</span>
      </button>
    </div>

    <!-- 菜单列表 -->
    <div class="flex-1 overflow-y-auto py-4">
      <!-- My Tools -->
      <div :class="['mb-6', uiStore.sidebarCollapsed ? 'px-2' : 'px-4']">
        <div v-show="!uiStore.sidebarCollapsed" class="text-xs font-semibold text-gray-500 uppercase mb-3">
          My Tools
        </div>
        <div class="space-y-1">
          <router-link
            to="/chat"
            :class="[
              'flex items-center gap-3 rounded-lg transition-colors text-sm',
              uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2',
              $route.path.startsWith('/chat') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
            ]"
            :title="uiStore.sidebarCollapsed ? 'AI Chat' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span v-show="!uiStore.sidebarCollapsed">AI Chat</span>
          </router-link>
          <router-link
            to="/image-generation"
            :class="[
              'flex items-center gap-3 rounded-lg transition-colors text-sm',
              uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2',
              $route.path === '/image-generation' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
            ]"
            :title="uiStore.sidebarCollapsed ? 'Image Generation' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span v-show="!uiStore.sidebarCollapsed">Image Generation</span>
          </router-link>
          <router-link
            to="/ai-search"
            :class="[
              'flex items-center gap-3 rounded-lg transition-colors text-sm',
              uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2',
              $route.path === '/ai-search' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
            ]"
            :title="uiStore.sidebarCollapsed ? 'AI Search Engine' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span v-show="!uiStore.sidebarCollapsed">AI Search Engine</span>
          </router-link>
        </div>
      </div>

      <!-- Chats -->
      <div :class="['mb-6', uiStore.sidebarCollapsed ? 'px-2' : 'px-4']">
        <div v-show="!uiStore.sidebarCollapsed" class="text-xs font-semibold text-gray-500 uppercase mb-3">
          Chats
        </div>
        <div class="space-y-1">
          <div
            v-for="conversation in conversationStore.conversations"
            :key="conversation.id"
            :class="[
              'flex items-center rounded-lg cursor-pointer transition-colors text-sm',
              uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2 gap-3',
              conversationStore.currentConversationId === conversation.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'hover:bg-gray-100'
            ]"
            :title="uiStore.sidebarCollapsed ? conversation.title : ''"
            @click="handleSelectConversation(conversation.id)"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span v-show="!uiStore.sidebarCollapsed" class="flex-1 truncate">{{ conversation.title }}</span>
            <button
              v-show="!uiStore.sidebarCollapsed"
              @click.stop="handleDeleteConversation(conversation.id)"
              class="p-1 hover:bg-gray-200 rounded transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="conversationStore.conversations.length === 0 && !uiStore.sidebarCollapsed" class="px-3 py-2 text-sm text-gray-500">
            暂无对话
          </div>
        </div>
      </div>

      <!-- 其他链接 -->
      <div :class="['space-y-1', uiStore.sidebarCollapsed ? 'px-2' : 'px-4']">
        <a
          href="#"
          :class="[
            'flex items-center rounded-lg hover:bg-gray-100 transition-colors text-sm',
            uiStore.sidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2 gap-3'
          ]"
          :title="uiStore.sidebarCollapsed ? 'Help & FAQ' : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span v-show="!uiStore.sidebarCollapsed">Help & FAQ</span>
        </a>
      </div>
    </div>

    <!-- 底部：用户信息 -->
    <div :class="['p-4 border-t border-gray-200', uiStore.sidebarCollapsed && 'px-2']">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          钱
        </div>
        <div v-show="!uiStore.sidebarCollapsed" class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 truncate">钱诚</div>
          <div class="text-xs text-gray-500 truncate">xubaoer19940428@gmail.com</div>
        </div>
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
