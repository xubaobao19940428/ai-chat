<template>
  <TransitionRoot appear :show="uiStore.showRenameModal" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[20px] bg-[var(--background-white-main)] p-6 text-left align-middle shadow-[var(--shadow-XL)] border border-[var(--border-main)] transition-all relative">
              <div class="flex items-center justify-between mb-2">
                <DialogTitle as="h3" class="text-[18px] font-semibold leading-6 text-[var(--text-primary)]">
                  Edit title
                </DialogTitle>
                <button @click="handleClose" class="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div class="mt-2">
                <p class="text-sm text-[var(--text-secondary)] mb-4">
                  Please enter a new title
                </p>
                <div class="relative group">
                  <input
                    type="text"
                    v-model="newTitle"
                    @keyup.enter="handleConfirm"
                    v-focus
                    class="w-full bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] rounded-xl py-3 px-4 outline-none focus:border-[var(--brand-main)] transition-all text-[var(--text-primary)] pr-10"
                    placeholder="Enter title..."
                  />
                  <button 
                    v-if="newTitle" 
                    @click="newTitle = ''" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full bg-[var(--text-tertiary)] text-white opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  class="flex-1 lg:flex-none inline-flex justify-center items-center px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] border border-[var(--border-main)] rounded-xl hover:bg-[var(--fill-tsp-gray-main)] transition-all"
                  @click="handleClose"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  :disabled="!newTitle.trim() || isLoading"
                  class="flex-1 lg:flex-none inline-flex justify-center items-center px-6 py-2.5 text-sm font-semibold text-white bg-black dark:bg-white dark:text-black rounded-xl hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleConfirm"
                >
                  <template v-if="isLoading">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </template>
                  Confirm
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useUIStore } from '../stores/ui'
import { useConversationStore } from '../stores/conversation'

const uiStore = useUIStore()
const conversationStore = useConversationStore()

const newTitle = ref('')
const isLoading = ref(false)

const vFocus = {
  mounted: (el: HTMLElement) => {
    el.focus()
    if (el instanceof HTMLInputElement) {
      el.select()
    }
  }
}

watch(
  () => uiStore.showRenameModal,
  (show) => {
    if (show && uiStore.renameConversation) {
      newTitle.value = uiStore.renameConversation.title || ''
    }
  }
)

const handleClose = () => {
  uiStore.closeRenameModal()
}

const handleConfirm = async () => {
  if (!newTitle.value.trim() || !uiStore.renameConversation) return
  
  isLoading.value = true
  try {
    await conversationStore.updateTitle(uiStore.renameConversation.id, newTitle.value.trim())
    handleClose()
  } catch (e) {
    console.error('Failed to rename:', e)
  } finally {
    isLoading.value = false
  }
}
</script>
