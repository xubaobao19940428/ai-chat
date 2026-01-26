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
                      <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 px-2 flex items-center gap-2">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span>我的工具</span>
                      </div>
                      <div class="space-y-1">
                        <NuxtLink
                          to="/chat"
                          :class="[
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group',
                            $route.path === '/chat' ? 'bg-indigo-50 dark:bg-[#1a1a1a] text-indigo-600 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <span class="font-medium">AI 聊天</span>
                        </NuxtLink>
                        <NuxtLink
                          to="/image-generation"
                          :class="[
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group',
                            $route.path === '/image-generation' ? 'bg-purple-50 dark:bg-[#1a1a1a] text-indigo-600 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <div class="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span class="font-medium">图片生成</span>
                        </NuxtLink>
                        <NuxtLink
                          to="/ai-search"
                          :class="[
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group',
                            $route.path === '/ai-search' ? 'bg-blue-50 dark:bg-[#1a1a1a] text-indigo-600 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <span class="font-medium">AI 搜索引擎</span>
                        </NuxtLink>
                        <NuxtLink
                          to="/chat?model=gpt-5"
                          :class="[
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group',
                            $route.fullPath.includes('gpt-5') ? 'bg-gray-50 dark:bg-[#1a1a1a] text-indigo-600 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                          ]"
                          @click="uiStore.closeMobileMenu"
                        >
                          <div class="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-500/10 flex items-center justify-center text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500/20">
                            <span class="text-[10px] font-bold">GPT</span>
                          </div>
                          <span class="font-medium">GPT-5</span>
                        </NuxtLink>
                      </div>
                    </div>

                    <!-- Projects -->
                    <div class="px-4 mb-6">
                      <button 
                        @click="toggleProjects"
                        class="w-full text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 px-2 flex items-center justify-between group"
                      >
                        <div class="flex items-center gap-2">
                           <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span>项目</span>
                        </div>
                        <svg class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': !projectsCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <div v-show="!projectsCollapsed" class="space-y-1">
                        <!-- All Chats -->
                        <button 
                          @click="selectProject(null)"
                          :class="[
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm',
                            conversationStore.selectedGroupId === null ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                          ]"
                        >
                          <div :class="[
                            'w-8 h-8 rounded-lg flex items-center justify-center border shrink-0',
                            conversationStore.selectedGroupId === null ? 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/30' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          ]">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                          </div>
                          <span class="font-medium">所有聊天</span>
                        </button>

                        <button 
                          @click="openCreateProjectModal"
                          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                        >
                          <div class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <span class="font-medium">新项目</span>
                        </button>
                        
                        <div 
                          v-for="project in projectStore.projects" 
                          :key="project.id"
                          @click="selectProject(project.id)"
                          :class="[
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm cursor-pointer',
                            conversationStore.selectedGroupId === project.id ? 'bg-gray-50 dark:bg-[#1a1a1a] shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                          ]"
                        >
                           <div :class="[
                              'w-8 h-8 rounded-lg flex items-center justify-center border shrink-0',
                              project.color === 'green' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20' : 
                              project.color === 'red' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20' :
                              project.color === 'purple' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20' :
                              project.color === 'orange' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20' :
                              project.color === 'cyan' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20' :
                              'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
                           ]">
                             <svg v-if="project.name === '投资'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                             <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <span class="font-medium truncate">{{ project.name }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Chats -->
                    <div class="px-4 mb-6">
                      <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 px-2 flex items-center gap-2">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span>你的聊天</span>
                      </div>
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
                          
                          <!-- Title / Edit Input -->
                          <input
                            v-if="editingId === conversation.id"
                            v-model="editingTitle"
                            @blur="saveTitle(conversation.id)"
                            @keyup.enter="saveTitle(conversation.id)"
                            @keyup.esc="cancelEditing"
                            @click.stop
                            ref="editInput"
                            class="flex-1 min-w-0 bg-white dark:bg-[#1a1a1a] text-sm border-none focus:ring-1 focus:ring-indigo-500 rounded px-1 -ml-1 outline-none"
                          />
                          <span v-else class="flex-1 truncate">{{ conversation.title }}</span>

                          <!-- Action Buttons -->
                          <div class="flex items-center gap-1">
                            <button
                              v-if="editingId !== conversation.id"
                              @click.stop="startEditing(conversation)"
                              class="p-1 hover:bg-gray-200 dark:hover:bg-[#333333] rounded transition-all text-gray-400 hover:text-indigo-600"
                            >
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
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

  <!-- Project Creation Modal -->
  <ProjectModal 
    :show="showCreateProjectModal" 
    @close="showCreateProjectModal = false"
    @create="handleProjectCreated"
  />

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
import ProjectModal from './ProjectModal.vue'

const router = useRouter()
const conversationStore = useConversationStore()
const uiStore = useUIStore()
const userStore = useUserStore()
const projectStore = useProjectStore()

const showDeleteConfirm = ref(false)
const deleteId = ref<number | string | null>(null)
const projectsCollapsed = ref(false)
const showCreateProjectModal = ref(false)

// Renaming State
const editingId = ref<number | string | null>(null)
const editingTitle = ref('')
const editInput = ref<HTMLInputElement | null>(null)

const startEditing = (conversation: any) => {
    editingId.value = conversation.id
    editingTitle.value = conversation.title
    nextTick(() => {
        // In Vue 3, refs inside v-for are arrays
        const input = Array.isArray(editInput.value) ? editInput.value[0] : editInput.value
        input?.focus()
        input?.select()
    })
}

const cancelEditing = () => {
    editingId.value = null
    editingTitle.value = ''
}

const saveTitle = async (id: number | string) => {
    if (!editingTitle.value.trim() || editingTitle.value === conversationStore.conversations.find(c => c.id === id)?.title) {
        cancelEditing()
        return
    }
    
    await conversationStore.updateTitle(id, editingTitle.value.trim())
    cancelEditing()
}

const toggleProjects = () => {
    projectsCollapsed.value = !projectsCollapsed.value
}

const openCreateProjectModal = () => {
    showCreateProjectModal.value = true
}

const handleProjectCreated = () => {
    projectsCollapsed.value = false
}

const selectProject = (id: number | null) => {
    conversationStore.setSelectedGroupId(id)
}

const handleNewChat = async () => {
  try {
    const id = await conversationStore.createConversation({ 
      character_id: 1,
      group_id: conversationStore.selectedGroupId || 0
    })
    router.push(`/chat/${id}`)
    uiStore.closeMobileMenu()
  } catch (e) {
    console.error('Failed to create chat:', e)
  }
}

const handleSelectConversation = (id: number | string) => {
  conversationStore.switchConversation(id)
  router.push(`/chat/${id}`)
  uiStore.closeMobileMenu()
}

const confirmDelete = (id: number | string) => {
  deleteId.value = id
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (deleteId.value) {
    await conversationStore.deleteConversation(deleteId.value)
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
