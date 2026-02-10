import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDiscovery, type DiscoveryGroup, type DiscoveryItem } from '~/utils/api'

export const useDiscoveryStore = defineStore('discovery', () => {
  const groups = ref<DiscoveryGroup[]>([])
  const allItems = ref<DiscoveryItem[]>([])
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const currentPage = ref(1)
  const hasMore = ref(true)
  const pageSize = 20

  const fetchDiscovery = async (placement = 'provider') => {
    isLoading.value = true
    currentPage.value = 1
    hasMore.value = true
    allItems.value = []
    try {
      const res: any = await getDiscovery({ placement, page: 1, page_size: pageSize })
      const list: DiscoveryGroup[] = res.data.list || []
      groups.value = list
      allItems.value = list.flatMap((g) => g.items)
      hasMore.value = list.some((g) => g.has_more) || allItems.value.length >= pageSize
    } catch (error) {
      console.error('Fetch discovery failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMore = async (placement = 'tag') => {
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true
    try {
      const nextPage = currentPage.value + 1
      const res: any = await getDiscovery({ placement, page: nextPage, page_size: pageSize })
      const list: DiscoveryGroup[] = res.data.list || []
      const newItems = list.flatMap((g) => g.items)
      if (newItems.length === 0) {
        hasMore.value = false
      } else {
        allItems.value = [...allItems.value, ...newItems]
        currentPage.value = nextPage
        hasMore.value = list.some((g) => g.has_more) || newItems.length >= pageSize
      }
    } catch (error) {
      console.error('Fetch more discovery failed:', error)
    } finally {
      isLoadingMore.value = false
    }
  }

  const reset = () => {
    groups.value = []
    allItems.value = []
    currentPage.value = 1
    hasMore.value = true
    isLoading.value = false
    isLoadingMore.value = false
  }

  return {
    groups,
    allItems,
    isLoading,
    isLoadingMore,
    hasMore,
    currentPage,
    fetchDiscovery,
    fetchMore,
    reset
  }
})
