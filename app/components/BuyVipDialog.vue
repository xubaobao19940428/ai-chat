<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[9999]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[var(--background-white-main)] border border-[var(--border-main)] p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-[var(--text-primary)] flex justify-between items-center mb-6">
                <span>Upgrade Plan</span>
                <button @click="closeModal" class="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </DialogTitle>

              <!-- Loading State -->
              <div v-if="payStore.isLoading && !products.length" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>

              <div v-else class="flex flex-col gap-6">
                <!-- Product Selection -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="product in products"
                    :key="product.id"
                    @click="selectProduct(product)"
                    :class="[
                      'relative cursor-pointer rounded-xl border-2 p-4 transition-all',
                      selectedProduct?.id === product.id 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' 
                        : 'border-[var(--border-main)] hover:border-blue-400'
                    ]"
                  >
                    <div class="flex justify-between items-start">
                      <div>
                        <h4 class="font-bold text-[var(--text-primary)]">{{ product.title }}</h4>
                        <p class="text-sm text-[var(--text-secondary)] mt-1">{{ product.currency }} {{ product.price }}</p>
                      </div>
                      <div v-if="selectedProduct?.id === product.id" class="text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Channel Selection -->
                <div v-if="selectedProduct" class="space-y-3">
                  <h4 class="text-sm font-medium text-[var(--text-secondary)]">Payment Method</h4>
                  <div class="flex flex-wrap gap-3">
                    <button
                      v-for="channel in payStore.payChannels"
                      :key="channel.id"
                      @click="selectedChannelId = channel.id"
                      :class="[
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2',
                        selectedChannelId === channel.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'border-[var(--border-main)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      ]"
                    >
                      <span class="capitalize">{{ channel.name }}</span>
                    </button>
                  </div>
                </div>

                <!-- Action Button -->
                <button
                  @click="handlePay"
                  :disabled="!isValid || processing"
                  class="w-full mt-2 py-3 px-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex justify-center items-center gap-2"
                >
                  <span v-if="processing" class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
                  <span>{{ processing ? 'Processing...' : 'Pay Now' }}</span>
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
import { ref, computed, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { usePayStore } from '../stores/pay'
import type { Product, OrderStatus } from '../utils/api'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const payStore = usePayStore()
const selectedProduct = ref<Product | null>(null)
const selectedChannelId = ref<number | null>(null)
const processing = ref(false)
const pollingTimer = ref<any>(null)

const products = computed(() => {
  // Sort by price usually makes sense, or use backend order
  return [...payStore.products.subscriptions].sort((a, b) => a.price - b.price)
})

const isValid = computed(() => selectedProduct.value && selectedChannelId.value)

const closeModal = () => {
  stopPolling()
  emit('close')
}

const selectProduct = async (product: Product) => {
  selectedProduct.value = product
  selectedChannelId.value = null // Reset channel
  await payStore.fetchChannels(product.id)
  // Auto-select first channel if available
  if (payStore.payChannels.length > 0) {
    selectedChannelId.value = payStore.payChannels[0].id
  }
}

const handlePay = async () => {
  if (!selectedProduct.value || !selectedChannelId.value) return
  
  processing.value = true
  try {
    const { pay_link, trade_sn } = await payStore.createPayOrder(selectedProduct.value.id, selectedChannelId.value)
    
    // Open payment link in new tab
    window.open(pay_link, '_blank')
    
    // Start polling for status
    startPolling(trade_sn)
    
  } catch (e) {
    alert('Failed to create order. Please try again.')
    processing.value = false
  }
}

const startPolling = (tradeSn: string) => {
  if (pollingTimer.value) clearInterval(pollingTimer.value)
  
  pollingTimer.value = setInterval(async () => {
    const status = await payStore.checkOrderStatus(tradeSn)
    if (status && status.status === 1) { // 1 = Paid
      stopPolling()
      processing.value = false
      alert('Payment Successful!')
      emit('success')
      closeModal()
    }
  }, 2000) // Poll every 2s
  
  // Auto-stop after 5 minutes
  setTimeout(() => {
    if (processing.value) {
      stopPolling()
      processing.value = false
    }
  }, 300000)
}

const stopPolling = () => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}

watch(() => props.isOpen, (val) => {
  if (val) {
    payStore.fetchProducts()
  } else {
    selectedProduct.value = null
    selectedChannelId.value = null
    processing.value = false
    stopPolling()
  }
})
</script>
