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
        <div class="fixed inset-0 bg-black/80 transition-opacity" />
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
                <div class="flex h-full flex-col overflow-y-auto bg-[#f8f7f6] dark:bg-[#111111] shadow-xl border-r border-gray-200 dark:border-[#1a1a1a] transition-colors">
                  <!-- 顶部：标题和关闭按钮 -->
                  <div class="p-4 border-b border-gray-800">
                    <div class="flex items-center justify-between mb-4">
                      <h1 class="text-lg font-semibold text-white">Chatbot App</h1>
                      <button
                        @click="uiStore.closeMobileMenu"
                        class="p-1.5 hover:bg-[#2f2f2f] rounded-lg transition-colors text-gray-400 hover:text-white"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button
                      @click="handleNewChat"
                      class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2f2f2f] text-white hover:bg-[#424242] rounded-lg transition-colors font-medium text-sm"
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
                            'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm',
                            $route.path.startsWith('/chat') ? 'bg-[#2f2f2f] text-white' : 'text-gray-300 hover:bg-[#2f2f2f] hover:text-white'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <span class="text-xl">🤖</span>
                          <span>AI Chat</span>
                        </router-link>
                        <router-link
                          to="/image-generation"
                          :class="[
                            'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm',
                            $route.path === '/image-generation' ? 'bg-[#2f2f2f] text-white' : 'text-gray-300 hover:bg-[#2f2f2f] hover:text-white'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <span class="text-xl">🎨</span>
                          <span>Image Generator</span>
                        </router-link>
                      </div>
                    </div>

                    <!-- Chats -->
                    <div class="px-4 mb-6">
                      <div class="text-xs font-semibold text-gray-500 uppercase mb-3">Chats</div>
                      <div class="space-y-1">
                         <div v-if="conversationStore.conversations.length === 0" class="px-3 py-2 text-sm text-gray-500">
                          No Chat History
                        </div>
                        <div
                          v-for="conversation in conversationStore.conversations"
                          :key="conversation.id"
                          :class="[
                            'flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors text-sm group',
                            conversationStore.currentConversationId === conversation.id
                              ? 'bg-[#2f2f2f] text-white'
                              : 'text-gray-300 hover:bg-[#2f2f2f] hover:text-white'
                          ]"
                          @click="handleSelectConversation(conversation.id)"
                        >
                          <svg class="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <span class="flex-1 truncate">{{ conversation.title }}</span>
                          <button
                            @click.stop="confirmDelete(conversation.id)"
                            class="p-1 hover:bg-[#424242] rounded transition-all text-gray-400 hover:text-white"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 底部：用户信息 -->
                  <div class="p-4 border-t border-gray-800">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        钱
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-white truncate">钱诚</div>
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

  <ConfirmDialog
    :show="showDeleteConfirm"
    title="Delete Chat"
    message="Are you sure you want to delete this conversation? This action cannot be undone."
    @confirm="handleDelete"
    @cancel="showDeleteConfirm = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '@/store/conversation'
import { useUIStore } from '@/store/ui'
import ConfirmDialog from './ConfirmDialog.vue'

const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()

const showDeleteConfirm = ref(false)
const deleteId = ref<string | null>(null)

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

const confirmDelete = (id: string) => {
  deleteId.value = id
  showDeleteConfirm.value = true
}

const handleDelete = () => {
  if (deleteId.value) {
    conversationStore.deleteConversation(deleteId.value)
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
    showDeleteConfirm.value = false
    deleteId.value = null
  }
}
</script>

