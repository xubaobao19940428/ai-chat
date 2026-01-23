import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDiscovery, type DiscoveryGroup } from '~/utils/api'

export const useDiscoveryStore = defineStore('discovery', () => {
  const groups = ref<DiscoveryGroup[]>([])
  const isLoading = ref(false)

  const fetchDiscovery = async (placement = 'provider') => {
    isLoading.value = true
    try {
      const res: any = await getDiscovery({ placement, item_limit: 10 })
      groups.value = res.data.list || []
    } catch (error) {
      console.error('Fetch discovery failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    groups,
    isLoading,
    fetchDiscovery
  }
})
