import { ref, onMounted } from 'vue'
import { addFavorite, removeFavorite, getFavoriteIds, getFavoritePrompts, type FavoriteType } from '~/utils/api'

/**
 * Manages favorites for a given type via backend API.
 * Falls back to optimistic UI updates — toggles immediately, reverts on error.
 */
export function useFavorite(type: FavoriteType) {
  const favoriteIds = ref<Set<number>>(new Set())
  const isLoaded = ref(false)

  // Favorite list with full details (for prompt_image / prompt_video)
  const favoriteItems = ref<any[]>([])
  const isFavoritesLoading = ref(false)
  const favoritesPage = ref(1)
  const hasMoreFavorites = ref(true)

  const fetchFavorites = async () => {
    try {
      const res: any = await getFavoriteIds({ type })
      const ids: number[] = res.data?.ids || []
      favoriteIds.value = new Set(ids)
    } catch (e) {
      console.error(`Failed to fetch ${type} favorites:`, e)
    } finally {
      isLoaded.value = true
    }
  }

  const isFavorited = (id: number) => favoriteIds.value.has(id)

  const toggleFavorite = async (id: number) => {
    const wasFavorited = favoriteIds.value.has(id)

    // Optimistic update
    if (wasFavorited) {
      favoriteIds.value.delete(id)
      // Remove from list
      favoriteItems.value = favoriteItems.value.filter((item) => item.id !== id)
    } else {
      favoriteIds.value.add(id)
    }
    favoriteIds.value = new Set(favoriteIds.value)

    try {
      if (wasFavorited) {
        await removeFavorite({ type, target_id: id })
      } else {
        await addFavorite({ type, target_id: id })
      }
    } catch (e) {
      console.error(`Failed to toggle ${type} favorite:`, e)
      // Revert on error
      if (wasFavorited) {
        favoriteIds.value.add(id)
      } else {
        favoriteIds.value.delete(id)
        favoriteItems.value = favoriteItems.value.filter((item) => item.id !== id)
      }
      favoriteIds.value = new Set(favoriteIds.value)
    }
  }

  /** Fetch favorited prompt list with full details (paginated) */
  const fetchFavoriteList = async (reset = false) => {
    if (type !== 'prompt_image' && type !== 'prompt_video') return
    if (isFavoritesLoading.value) return
    if (!reset && !hasMoreFavorites.value) return

    if (reset) {
      favoritesPage.value = 1
      favoriteItems.value = []
      hasMoreFavorites.value = true
    }

    isFavoritesLoading.value = true
    try {
      const res: any = await getFavoritePrompts({
        type,
        page: favoritesPage.value,
        page_size: 20,
      })
      const list: any[] = res.data?.list || []
      if (list.length < 20) {
        hasMoreFavorites.value = false
      }
      favoriteItems.value = reset ? list : [...favoriteItems.value, ...list]
      favoritesPage.value++
    } catch (e) {
      console.error(`Failed to fetch ${type} favorite list:`, e)
    } finally {
      isFavoritesLoading.value = false
    }
  }

  onMounted(() => {
    fetchFavorites()
  })

  return {
    favoriteIds,
    isFavorited,
    toggleFavorite,
    isLoaded,
    favoriteItems,
    isFavoritesLoading,
    hasMoreFavorites,
    fetchFavoriteList,
  }
}
