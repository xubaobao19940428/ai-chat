import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    getProducts,
    getPayChannels,
    createOrder,
    queryOrder,
    type Product,
    type PayChannel,
    type OrderStatus
} from '~/utils/api'

export const usePayStore = defineStore('pay', () => {
    const products = ref<{ subscriptions: Product[], coins: Product[] }>({ subscriptions: [], coins: [] })
    const payChannels = ref<PayChannel[]>([])
    const isLoading = ref(false)

    const fetchProducts = async () => {
        isLoading.value = true
        try {
            const res: any = await getProducts()
            products.value = res.data || { subscriptions: [], coins: [] }
        } catch (error) {
            console.error('Fetch products failed:', error)
        } finally {
            isLoading.value = false
        }
    }

    const fetchChannels = async (pid: number) => {
        isLoading.value = true
        try {
            const res: any = await getPayChannels({ pid })
            payChannels.value = res.data.items || []
        } catch (error) {
            console.error('Fetch pay channels failed:', error)
        } finally {
            isLoading.value = false
        }
    }

    const createPayOrder = async (pid: number, channelId: number) => {
        isLoading.value = true
        try {
            const res: any = await createOrder({ pid, channel_id: channelId })
            return res.data // { pay_link, trade_sn }
        } catch (error) {
            console.error('Create order failed:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const checkOrderStatus = async (tradeSn: string) => {
        try {
            const res: any = await queryOrder({ trade_sn: tradeSn })
            return res.data?.[0] as OrderStatus
        } catch (error) {
            console.error('Check order status failed:', error)
            return null
        }
    }

    return {
        products,
        payChannels,
        isLoading,
        fetchProducts,
        fetchChannels,
        createPayOrder,
        checkOrderStatus
    }
})
