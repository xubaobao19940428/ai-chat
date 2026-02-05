<template>
  <TransitionRoot appear :show="uiStore.showWebsiteReferenceModal" as="template">
    <Dialog as="div" @close="uiStore.closeWebsiteReferenceModal" class="relative z-50">
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
            <DialogPanel class="w-full max-w-[480px] transform overflow-hidden rounded-[24px] bg-[var(--background-white-main)] p-8 text-center align-middle shadow-[0px_20px_50px_rgba(0,0,0,0.1)] border border-[var(--border-main)] transition-all relative">
              <!-- Close Button -->
              <button 
                @click="uiStore.closeWebsiteReferenceModal" 
                class="absolute top-5 right-5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-full hover:bg-[var(--fill-tsp-gray-main)]"
              >
                <X :size="20" />
              </button>

              <!-- Header Icon -->
              <div class="flex justify-center mb-6">
                <div class="w-16 h-16 rounded-[16px] border border-[var(--border-main)] bg-[var(--background-gray-main)] flex items-center justify-center">
                  <div class="relative w-8 h-8">
                    <!-- Simple document icon -->
                    <svg viewBox="0 0 24 24" fill="none" class="w-full h-full text-[var(--text-secondary)]" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <!-- Quote icon overlay -->
                    <div class="absolute -bottom-1 -right-1 bg-[var(--background-gray-main)] rounded-sm p-0.5">
                      <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-[var(--text-primary)]">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21V18" />
                        <path d="M3 21L3 18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21C10 22.1046 9.10457 23 8 23H5C3.89543 23 3 22.1046 3 21Z" />
                        <path d="M4.5 9.5C4.5 6.46243 6.96243 4 10 4M4.5 9.5C4.5 12.5376 6.96243 15 10 15M4.5 9.5H7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                         <!-- Custom quote marks -->
                        <path d="M8 10h3l-1.5 3H8V10zm6 0h3l-1.5 3H14v-3z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Title & Description -->
              <h3 class="text-[20px] font-bold text-[var(--text-primary)] mb-2">
                Add website reference
              </h3>
              <p class="text-[14px] text-[var(--text-secondary)] leading-[22px] mb-8 max-w-[340px] mx-auto">
                Enter any URL and we'll recreate its design for you. Perfect for inspiration or getting started quickly.
              </p>

              <!-- URL Input -->
              <div class="mb-4">
                <input
                  type="text"
                  v-model="websiteUrl"
                  class="w-full bg-[var(--background-gray-main)] border border-[var(--border-main)] rounded-[14px] py-[14px] px-4 outline-none focus:border-[var(--brand-main)] transition-all text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                  placeholder="https://www.example.com"
                  @keyup.enter="handleAdd"
                />
              </div>

              <!-- Add Button -->
              <button
                @click="handleAdd"
                :disabled="!isValidUrl || isLoading"
                class="w-full bg-[#8a8a8a] text-white font-semibold py-[14px] rounded-[14px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-8"
              >
                Add
              </button>

              <!-- Footer Info -->
              <div class="bg-[var(--background-gray-main)] rounded-[16px] p-4 text-left border border-[var(--border-main)] flex gap-3">
                <Info :size="20" class="text-[var(--text-tertiary)] flex-shrink-0 mt-0.5" />
                <p class="text-[12px] text-[var(--text-secondary)] leading-[18px]">
                  Referenced content is for personal use and inspiration only. Ensure you have the right to use any designs or content you recreate.
                </p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useUIStore } from '../stores/ui'
import { X, Info } from 'lucide-vue-next'

const uiStore = useUIStore()
const websiteUrl = ref('')
const isLoading = ref(false)

const isValidUrl = computed(() => {
  const url = websiteUrl.value.trim()
  if (!url) return false
  try {
    // Simple URL validation
    return url.includes('.') && url.length > 5
  } catch (e) {
    return false
  }
})

const handleAdd = () => {
  if (!isValidUrl.value || isLoading.value) return
  
  // Here we would typically send this to the chat or handle the logic
  console.log('Adding website reference:', websiteUrl.value)
  
  // For now, just close the modal
  uiStore.closeWebsiteReferenceModal()
  websiteUrl.value = ''
}
</script>
