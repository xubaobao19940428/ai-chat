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
                <div class="flex h-full flex-col overflow-y-auto bg-white dark:bg-[#111111] shadow-xl border-r border-gray-200 dark:border-[#1a1a1a] transition-colors">
                  <!-- 顶部：标题和关闭按钮 -->
                  <div class="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div class="flex items-center justify-between mb-4">
                      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Chatbot App</h1>
                      <button
                        @click="uiStore.closeMobileMenu"
                        class="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button
                      @click="handleNewChat"
                      class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-[#1a1a1a] dark:hover:bg-[#222222] text-white rounded-lg transition-colors font-medium text-sm"
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
                      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-3 px-2">My Tools</div>
                      <div class="space-y-1">
                        <NuxtLink
                          to="/chat"
                          :class="[
                            'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm',
                            $route.path.startsWith('/chat') ? 'bg-indigo-50 dark:bg-[#1a1a1a] text-indigo-600 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <span class="text-xl">🤖</span>
                          <span>AI Chat</span>
                        </NuxtLink>
                        <NuxtLink
                          to="/image-generation"
                          :class="[
                            'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm',
                            $route.path === '/image-generation' ? 'bg-indigo-50 dark:bg-[#1a1a1a] text-indigo-600 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <span class="text-xl">🎨</span>
                          <span>Image Generator</span>
                        </NuxtLink>
                      </div>
                    </div>

                    <!-- Chats -->
                    <div class="px-4 mb-6">
                      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-3 px-2">Chats</div>
                      <div class="space-y-1">
                         <div v-if="conversationStore.conversations.length === 0" class="px-3 py-2 text-sm text-gray-400 dark:text-gray-500 italic">
                          No Chat History
                        </div>
                        <div
                          v-for="conversation in conversationStore.conversations"
                          :key="conversation.id"
                          :class="[
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm group',
                            conversationStore.currentConversationId === conversation.id
                              ? 'bg-indigo-50 dark:bg-[#222222] text-indigo-600 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white'
                          ]"
                          @click="handleSelectConversation(conversation.id)"
                        >
                          <svg class="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <span class="flex-1 truncate">{{ conversation.title }}</span>
                          <button
                            @click.stop="confirmDelete(conversation.id)"
                            class="p-1 hover:bg-gray-200 dark:hover:bg-[#333333] rounded transition-all text-gray-400 hover:text-red-500"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 底部：用户信息和主题调整 -->
                  <div class="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                    <!-- Theme Toggle -->
                    <button @click="toggleTheme" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222222] transition-all">
                        <div class="flex items-center gap-3">
                            <svg v-if="uiStore.currentTheme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            <span class="font-medium">Appearance</span>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ uiStore.themeMode }}</span>
                    </button>

                    <div v-if="userStore.token" class="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-transparent dark:border-gray-800">
                      <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md shadow-indigo-200 dark:shadow-none">
                        {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ userStore.userInfo?.nickname || 'User' }}</div>
                        <div class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ userStore.userInfo?.email }}</div>
                      </div>
                      <button @click="userStore.logout()" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                      </button>
                    </div>

                    <div v-else class="space-y-2">
                         <button @click="uiStore.openLoginModal()" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all">Log in</button>
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
import ConfirmDialog from './ConfirmDialog.vue'

const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()
const userStore = useUserStore()

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

const toggleTheme = () => {
    if (uiStore.themeMode === 'system') {
        uiStore.setThemeMode('light')
    } else if (uiStore.themeMode === 'light') {
        uiStore.setThemeMode('dark')
    } else {
        uiStore.setThemeMode('system')
    }
}
</script>
