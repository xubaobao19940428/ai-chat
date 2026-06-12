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
            <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-[var(--background-white-main)] border border-[var(--border-main)] p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-[var(--text-primary)] flex justify-between items-center mb-6">
                <span>{{ $t('payment.upgrade_plan') }}</span>
                <button @click="closeModal" class="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                  <X :size="24" />
                </button>
              </DialogTitle>

              <!-- Loading State -->
              <div v-if="payStore.isLoading && !products.length" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>

              <div v-else class="flex flex-col gap-6">
                <!-- Product Selection -->
                <div v-if="products.length" class="space-y-5">
                  <div class="inline-flex rounded-lg border border-[var(--border-main)] bg-[var(--background-white-main)] p-1">
                    <button
                      v-for="tab in availableTabs"
                      :key="tab.key"
                      @click="activeTab = tab.key"
                      :class="[
                        'min-w-24 rounded-md px-4 py-2 text-sm font-medium transition-all',
                        activeTab === tab.key
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      ]"
                    >
                      {{ tab.label }}
                    </button>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div
                      v-for="product in activeProducts"
                      :key="product.id"
                      @click="selectProduct(product)"
                      :class="[
                        'relative cursor-pointer rounded-xl border-2 p-3 transition-all',
                        selectedProduct?.id === product.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                          : 'border-[var(--border-main)] hover:border-blue-400'
                      ]"
                    >
                      <div class="flex justify-between items-start gap-4">
                        <div class="min-w-0">
                          <h4 class="truncate font-bold text-[var(--text-primary)]">{{ product.title }}</h4>
                          <p class="text-sm text-[var(--text-secondary)] mt-1">{{ productSummary(product) }}</p>
                        </div>
                        <div v-if="selectedProduct?.id === product.id" class="text-blue-600 shrink-0">
                          <CheckCircle :size="20" />
                        </div>
                      </div>
                      <div class="mt-3 flex items-end justify-between gap-2">
                        <div class="text-xl font-bold text-[var(--text-primary)]">{{ formatPrice(product) }}</div>
                        <div v-if="Number(product.discount) > 0" class="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                          -{{ Number(product.discount).toFixed(0) }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="py-10 text-center text-sm text-[var(--text-tertiary)]">
                  No products available
                </div>

                <!-- Channel Selection -->
                <div v-if="selectedProduct" class="space-y-3">
                  <h4 class="text-sm font-medium text-[var(--text-secondary)]">{{ $t('payment.payment_method') }}</h4>
                  <div v-if="channelsLoading" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div
                      v-for="index in 2"
                      :key="index"
                      class="h-20 animate-pulse rounded-xl border border-[var(--border-main)] bg-[var(--bg-hover)]"
                    ></div>
                  </div>
                  <div v-else-if="availableChannels.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      v-for="channel in availableChannels"
                      :key="channel.id"
                      type="button"
                      @click="selectChannel(channel)"
                      :disabled="processing"
                      :class="[
                        'min-h-24 rounded-xl border p-4 text-left transition-all',
                        selectedChannelId === channel.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'border-[var(--border-main)] text-[var(--text-primary)] hover:border-blue-400 hover:bg-[var(--bg-hover)]',
                        processing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                      ]"
                    >
                      <span class="flex items-start gap-3">
                        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-main)] bg-[var(--background-white-main)] shadow-sm">
                          <CreditCard :size="22" class="text-[var(--text-secondary)]" />
                        </span>
                        <span class="min-w-0 flex-1">
                          <span class="flex items-start justify-between gap-3">
                            <span class="min-w-0">
                              <span class="block truncate text-base font-semibold text-[var(--text-primary)]">
                                {{ channelTitle(channel) }}
                              </span>
                              <span v-if="channelSubtitle(channel)" class="mt-1 block truncate text-xs text-[var(--text-tertiary)]">
                                {{ channelSubtitle(channel) }}
                              </span>
                            </span>
                            <CheckCircle v-if="selectedChannelId === channel.id" :size="18" class="mt-0.5 shrink-0 text-blue-600" />
                          </span>
                          <span class="mt-3 flex items-end justify-between gap-3">
                            <span class="flex min-w-0 flex-wrap items-center gap-2">
                              <span
                                v-if="channel.is_safe"
                                class="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                              >
                                Secure
                              </span>
                              <span
                                v-if="channelDiscountText(channel)"
                                class="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-300"
                              >
                                {{ channelDiscountText(channel) }}
                              </span>
                            </span>
                            <span v-if="formatChannelPrice(channel)" class="shrink-0 text-sm font-bold text-[var(--text-primary)]">
                              {{ formatChannelPrice(channel) }}
                            </span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                  <div v-else class="rounded-xl border border-[var(--border-main)] px-4 py-3 text-sm text-[var(--text-tertiary)]">
                    No payment channel available
                  </div>
                </div>

                <!-- Policy Confirmation -->
                <label
                  v-if="selectedProduct"
                  for="payment-policy-confirm"
                  :class="[
                    'flex items-start gap-3 rounded-xl border p-3 text-xs leading-5 transition-colors',
                    policyAccepted
                      ? 'border-[var(--border-main)] bg-[var(--background-white-main)] text-[var(--text-secondary)]'
                      : 'border-[var(--border-main)] bg-[var(--bg-hover)] text-[var(--text-tertiary)]',
                    processing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  ]"
                >
                  <input
                    id="payment-policy-confirm"
                    v-model="policyAccepted"
                    type="checkbox"
                    :disabled="processing"
                    class="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border-main)] text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    {{ policyConfirmPrefix }}
                    <NuxtLink
                      to="/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-semibold text-[var(--text-primary)] underline underline-offset-2 hover:text-blue-600"
                      @click.stop
                    >
                      {{ policyTermsLabel }}
                    </NuxtLink>
                    {{ policyConfirmMiddle }}
                    <NuxtLink
                      to="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-semibold text-[var(--text-primary)] underline underline-offset-2 hover:text-blue-600"
                      @click.stop
                    >
                      {{ policyPrivacyLabel }}
                    </NuxtLink>
                    {{ policyConfirmRefundMiddle }}
                    <NuxtLink
                      to="/refund-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-semibold text-[var(--text-primary)] underline underline-offset-2 hover:text-blue-600"
                      @click.stop
                    >
                      {{ policyRefundLabel }}
                    </NuxtLink>
                    {{ policyConfirmSuffix }}
                  </span>
                </label>

                <!-- Action Button -->
                <button
                  @click="handlePay"
                  :disabled="!isValid || processing"
                  :class="[
                    'w-full mt-2 py-3 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2',
                    isValid && !processing
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)] cursor-not-allowed'
                  ]"
                >
                  <span v-if="processing" class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
                  <span>{{ processing ? $t('payment.processing') : $t('payment.pay_now') }}</span>
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
import { X, CheckCircle, CreditCard } from 'lucide-vue-next'
import type { PayChannel, Product } from '../utils/api'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const payStore = usePayStore()
const selectedProduct = ref<Product | null>(null)
const selectedChannelId = ref<number | null>(null)
const availableChannels = ref<PayChannel[]>([])
const channelsLoading = ref(false)
const processing = ref(false)
const policyAccepted = ref(false)
const pollingTimer = ref<any>(null)
const activeTab = ref<'subscriptions' | 'coins'>('subscriptions')
let channelRequestId = 0
const { t, te } = useI18n()

const subscriptionProducts = computed(() => payStore.products.subscriptions)
const coinProducts = computed(() => payStore.products.coins)
const products = computed(() => [...subscriptionProducts.value, ...coinProducts.value])
const availableTabs = computed(() => [
  ...(subscriptionProducts.value.length ? [{ key: 'subscriptions' as const, label: 'VIP' }] : []),
  ...(coinProducts.value.length ? [{ key: 'coins' as const, label: 'Stars' }] : [])
])
const activeProducts = computed(() => (
  activeTab.value === 'subscriptions' ? subscriptionProducts.value : coinProducts.value
))

const paymentText = (key: string, fallback: string) => te(key) ? t(key) : fallback
const policyConfirmPrefix = computed(() => paymentText('payment.policy_confirm_prefix', 'I have read and agree to the'))
const policyTermsLabel = computed(() => paymentText('payment.terms_of_service', 'Terms of Service'))
const policyConfirmMiddle = computed(() => paymentText('payment.policy_confirm_middle', ' and '))
const policyPrivacyLabel = computed(() => paymentText('payment.privacy_policy', 'Privacy Policy'))
const policyConfirmRefundMiddle = computed(() => paymentText('payment.policy_confirm_refund_middle', ', and '))
const policyRefundLabel = computed(() => paymentText('payment.refund_policy', 'Refund Policy'))
const policyConfirmSuffix = computed(() => paymentText('payment.policy_confirm_suffix', ', including the subscription, cancellation, and restricted-region policies.'))

const isValid = computed(() => Boolean(selectedProduct.value && selectedChannelId.value && policyAccepted.value && !channelsLoading.value))

const formatPrice = (product: Product) => {
  const currency = product.local_currency || product.currency || 'USD'
  const amount = product.local_price > 0 ? product.local_price : Number(product.price)

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
    }).format(amount)
  } catch (_) {
    return `${currency} ${amount}`
  }
}

const productSummary = (product: Product) => {
  const parts: string[] = []
  const totalCoins = Number(product.coins || 0) + Number(product.reward_coins || 0)
  const totalVipDays = Number(product.vip_days || 0) + Number(product.reward_vip_days || 0)

  if (totalCoins > 0) parts.push(`${totalCoins} Stars`)
  if (totalVipDays > 0) parts.push(`${totalVipDays} days VIP`)

  return parts.join(' · ') || product.product_id
}

const channelTitle = (channel: PayChannel) => {
  return channel.description || channel.name || channel.channel
}

const channelSubtitle = (channel: PayChannel) => {
  const parts = [
    channel.name && channel.name !== channelTitle(channel) ? channel.name : '',
    channel.currency
  ].filter(Boolean)

  return parts.join(' · ')
}

const formatChannelPrice = (channel: PayChannel) => {
  const amount = Number(channel.currency_price || channel.price)
  if (!amount || Number.isNaN(amount)) return ''

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: channel.currency || 'USD',
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
    }).format(amount)
  } catch (_) {
    return `${channel.currency || ''} ${amount}`.trim()
  }
}

const channelDiscountText = (channel: PayChannel) => {
  const discount = Number(channel.discount || 0)
  if (discount > 0 && discount < 100) {
    return `-${100 - discount}%`
  }

  return ''
}

const closeModal = () => {
  stopPolling()
  emit('close')
}

const selectChannel = (channel: PayChannel) => {
  selectedChannelId.value = channel.id
}

const selectProduct = async (product: Product) => {
  const requestId = ++channelRequestId
  selectedProduct.value = product
  selectedChannelId.value = null
  availableChannels.value = []
  channelsLoading.value = true

  const channels = await payStore.fetchChannels(product.id) as any
  if (requestId !== channelRequestId || selectedProduct.value?.id !== product.id) return

  availableChannels.value = channels
  if (channels.length === 1) {
    selectedChannelId.value = channels[0].id
  }
  channelsLoading.value = false
}

const handlePay = async () => {
  if (!selectedProduct.value || !selectedChannelId.value || !policyAccepted.value) return
  
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

const selectDefaultProduct = async () => {
  const defaultProduct = products.value.find(product => Boolean(product.is_selected)) || products.value[0]
  if (defaultProduct) {
    activeTab.value = defaultProduct.type === 'INAPP' ? 'coins' : 'subscriptions'
    await selectProduct(defaultProduct)
  }
}

watch(activeTab, async () => {
  const currentProductVisible = selectedProduct.value && activeProducts.value.some(product => product.id === selectedProduct.value?.id)
  if (!currentProductVisible && activeProducts.value[0]) {
    await selectProduct(activeProducts.value[0])
  }
})

watch(() => props.isOpen, (val) => {
  if (val) {
    policyAccepted.value = false
    payStore.fetchProducts().then(() => {
      if (props.isOpen) selectDefaultProduct()
    })
  } else {
    channelRequestId++
    selectedProduct.value = null
    selectedChannelId.value = null
    availableChannels.value = []
    channelsLoading.value = false
    policyAccepted.value = false
    activeTab.value = 'subscriptions'
    processing.value = false
    stopPolling()
  }
})
</script>
