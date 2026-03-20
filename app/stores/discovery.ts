import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDiscovery, getDiscoveryItems, type DiscoveryGroup, type DiscoveryItem } from '~/utils/api'

const createDiscoveryStore = (id: string, placement: string) => {
  return defineStore(id, () => {
    const groups = ref<DiscoveryGroup[]>([])
    const allItems = ref<DiscoveryItem[]>([])
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const currentPage = ref(1)
    const hasMore = ref(true)
    const currentTagId = ref<number | string>(placement)
    const pageSize = 40

    // Cache state: stores results per tagId to avoid redundant fetches
    const cache = ref<Record<number | string, {
      groups: DiscoveryGroup[],
      items: DiscoveryItem[],
      page: number,
      hasMore: boolean
    }>>({})

    const fetchDiscovery = async (tagId: number | string = placement, force = false) => {
        console.log(tagId)
      // Restore from cache if available and not forcing a refresh
      if (!force && cache.value[tagId]) {
        const cached = cache.value[tagId]
        groups.value = cached.groups
        allItems.value = cached.items
        currentPage.value = cached.page
        hasMore.value = cached.hasMore
        currentTagId.value = tagId
        return
      }

      isLoading.value = true
      currentPage.value = 1
      hasMore.value = true
      allItems.value = []
      currentTagId.value = tagId
      try {
        if (typeof tagId === 'string') {
          const res: any = await getDiscovery({ placement, page: 1, page_size: pageSize })
          const list: DiscoveryGroup[] = res.data.list || []
          groups.value = list
          allItems.value = list.flatMap((g) => g.items)
          hasMore.value = list.some((g) => g.has_more) || allItems.value.length >= pageSize
        } else {
          const res: any = await getDiscoveryItems(Number(tagId), { page: 1, page_size: pageSize })
          const list = res.data.list || []
          groups.value = [] // Reset groups when fetching specific items
          allItems.value = list
          hasMore.value = list.length >= pageSize
        }

        // Save to cache
        cache.value[tagId] = {
          groups: groups.value,
          items: allItems.value,
          page: currentPage.value,
          hasMore: hasMore.value
        }
      } catch (error) {
        console.error(`Fetch discovery (${id}) failed:`, error)
      } finally {
        isLoading.value = false
      }
    }

    const fetchMore = async () => {
      if (isLoadingMore.value || !hasMore.value) return
      isLoadingMore.value = true
      const tagId = currentTagId.value
      try {
        const nextPage = currentPage.value + 1
        if (typeof tagId === 'string') {
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
        } else {
          const res: any = await getDiscoveryItems(Number(tagId), { page: nextPage, page_size: pageSize })
          const newItems = res.data.list || []
          if (newItems.length === 0) {
            hasMore.value = false
          } else {
            allItems.value = [...allItems.value, ...newItems]
            currentPage.value = nextPage
            hasMore.value = newItems.length >= pageSize
          }
        }

        // Update cache with new paged data
        if (cache.value[tagId]) {
          cache.value[tagId].items = allItems.value
          cache.value[tagId].groups = groups.value
          cache.value[tagId].page = currentPage.value
          cache.value[tagId].hasMore = hasMore.value
        }
      } catch (error) {
        console.error(`Fetch more discovery (${id}) failed:`, error)
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
      cache.value = {} // Clear cache on reset
    }

    return {
      groups,
      allItems,
      isLoading,
      isLoadingMore,
      hasMore,
      currentPage,
      currentTagId,
      fetchDiscovery,
      fetchMore,
      reset
    }
  })
}

export const useExploreDiscoveryStore = createDiscoveryStore('explore-discovery', 'tag')
export const useImageDiscoveryStore = createDiscoveryStore('image-discovery', 'image_generation')
export const useVideoDiscoveryStore = createDiscoveryStore('video-discovery', 'video_generation')

// Keep default export or alias for compatibility
export const useDiscoveryStore = useExploreDiscoveryStore
