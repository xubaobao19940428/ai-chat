<template>
  <TransitionRoot :show="uiStore.mobileMenuOpen" as="template">
    <Dialog as="div" class="relative z-50 lg:hidden" @close="uiStore.closeMobileMenu">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-300"
              enter-from="-translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leave-from="translate-x-0"
              leave-to="-translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-[280px]">
                <div class="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <!-- 顶部：标题和关闭按钮 -->
                  <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between mb-4">
                      <h1 class="text-lg font-semibold text-gray-900">Chatbot App</h1>
                      <button
                        @click="uiStore.closeMobileMenu"
                        class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button
                      @click="handleNewChat"
                      class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-medium text-sm"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>New Chat</span>
                    </button>
                  </div>

                  <!-- 菜单列表 -->
                  <div class="flex-1 overflow-y-auto py-4">
                    <!-- My Tools -->
                    <div class="px-4 mb-6">
                      <div class="text-xs font-semibold text-gray-500 uppercase mb-3">My Tools</div>
                      <div class="space-y-1">
                        <router-link
                          to="/chat"
                          :class="[
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            $route.path.startsWith('/chat') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span>AI Chat</span>
                        </router-link>
                        <router-link
                          to="/image-generation"
                          :class="[
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            $route.path === '/image-generation' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Image Generation</span>
                        </router-link>
                        <router-link
                          to="/ai-search"
                          :class="[
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            $route.path === '/ai-search' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>AI Search Engine</span>
                        </router-link>
                      </div>
                    </div>

                    <!-- Chats -->
                    <div class="px-4 mb-6">
                      <div class="text-xs font-semibold text-gray-500 uppercase mb-3">Chats</div>
                      <div class="space-y-1">
                        <div
                          v-for="conversation in conversationStore.conversations"
                          :key="conversation.id"
                          :class="[
                            'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm',
                            conversationStore.currentConversationId === conversation.id
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'hover:bg-gray-100'
                          ]"
                          @click="handleSelectConversation(conversation.id)"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span class="flex-1 truncate">{{ conversation.title }}</span>
                          <button
                            @click.stop="handleDeleteConversation(conversation.id)"
                            class="p-1 hover:bg-gray-200 rounded transition-all"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div v-if="conversationStore.conversations.length === 0" class="px-3 py-2 text-sm text-gray-500">
                          暂无对话
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 底部：用户信息 -->
                  <div class="p-4 border-t border-gray-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        钱
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900 truncate">钱诚</div>
                        <div class="text-xs text-gray-500 truncate">xubaoer19940428@gmail.com</div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
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

