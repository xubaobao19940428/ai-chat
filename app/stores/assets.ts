import { defineStore } from 'pinia'
import { getFiles, deleteFile, type UserFile } from '@/utils/api'

export type AssetType = 'image' | 'video' | 'audio' | 'document' | '3d' | 'other'

export interface UnifiedAsset {
  id: number
  name: string
  url: string
  thumbnail?: string
  type: AssetType
  created_at: number
  mime_type?: string
  size?: number
}

export const useAssetStore = defineStore('assets', {
  state: () => ({
    items: [] as UnifiedAsset[],
    isLoading: false,
    filters: {
      type: 'all' as AssetType | 'all',
      source: 'all' as 'all' | 'ai' | 'local',
      search: '',
    },
    page: 1,
    pageSize: 50,
    hasMore: true,
    selectedIds: new Set<number>(),
  }),

  getters: {
    filteredItems(state) {
      // Type filtering is done server-side. Only search filtering remains client-side.
      if (!state.filters.search) return state.items
      const query = state.filters.search.toLowerCase()
      return state.items.filter(item =>
        item.name.toLowerCase().includes(query)
      )
    },
    isSelected: (state) => (id: number) => state.selectedIds.has(id),
  },

  actions: {
    async fetchAssets(reset = false) {
      if (reset) {
        this.page = 1
        this.items = []
        this.hasMore = true
      }
      if (!this.hasMore) return
      if (!reset && this.isLoading) return

      this.isLoading = true
      try {
        const fileType = this.filters.type !== 'all' && this.filters.type !== '3d'
          ? this.filters.type
          : undefined

        const res: any = await getFiles({
          page: this.page,
          page_size: this.pageSize,
          ...(fileType ? { file_type: fileType } : {}),
          ...(this.filters.source !== 'all' ? { source: this.filters.source } : {}),
        })

        const list: UserFile[] = res.data?.list || []
        const total: number = res.data?.total || 0

        const newItems: UnifiedAsset[] = list.map((file) => ({
          id: file.id,
          name: file.file_name,
          url: file.file_url,
          thumbnail: file.file_type === 'image' || file.file_type === 'video' ? file.file_url : undefined,
          type: file.file_type as AssetType,
          created_at: file.created_at,
          mime_type: file.mime_type,
          size: file.file_size,
        }))

        if (reset) {
          this.items = newItems
        } else {
          this.items = [...this.items, ...newItems]
        }

        this.hasMore = this.items.length < total
        this.page++
      } catch (error) {
        console.error('Failed to fetch assets:', error)
      } finally {
        this.isLoading = false
      }
    },

    toggleSelection(id: number) {
      if (this.selectedIds.has(id)) {
        this.selectedIds.delete(id)
      } else {
        this.selectedIds.add(id)
      }
    },

    clearSelection() {
      this.selectedIds.clear()
    },

    async deleteSelected() {
      const ids = Array.from(this.selectedIds)

      try {
        await Promise.all(ids.map(id => deleteFile(id)))
        this.items = this.items.filter(item => !this.selectedIds.has(item.id))
        this.selectedIds.clear()
      } catch (error) {
        console.error('Failed to delete assets:', error)
      }
    }
  }
})
