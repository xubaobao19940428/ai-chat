import { defineStore } from 'pinia'
import { getAsyncTaskOutputs, getFiles, deleteAsyncTaskRecord, deleteFile, getRecordPrimaryUrl, getRecordPrompt, getRecordModel, type AsyncTaskRecord, type UserFile } from '@/utils/api'

export type AssetSource = 'ai' | 'local'
export type AssetType = 'image' | 'video' | 'audio' | 'document' | '3d' | 'other'

export interface UnifiedAsset {
  id: string | number
  source_id: number | string
  name: string
  url: string
  thumbnail?: string
  type: AssetType
  source: AssetSource
  created_at: number
  mime_type?: string
  size?: number
  metadata?: {
    prompt?: string
    model?: string
    duration?: number
    resolution?: string
  }
}

export const useAssetStore = defineStore('assets', {
  state: () => ({
    items: [] as UnifiedAsset[],
    isLoading: false,
    filters: {
      source: 'all' as AssetSource | 'all',
      type: 'all' as AssetType | 'all',
      search: '',
    },
    page: 1,
    pageSize: 50,
    hasMore: true,
    selectedIds: new Set<string | number>(),
  }),

  getters: {
    filteredItems(state) {
      return state.items.filter(item => {
        const matchesSource = state.filters.source === 'all' || item.source === state.filters.source
        const matchesType = state.filters.type === 'all' || item.type === state.filters.type
        const matchesSearch = !state.filters.search || 
          item.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          (item.metadata?.prompt && item.metadata.prompt.toLowerCase().includes(state.filters.search.toLowerCase()))
        return matchesSource && matchesType && matchesSearch
      })
    },
    isSelected: (state) => (id: string | number) => state.selectedIds.has(id),
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
        // Fetch from both sources in parallel
        const [aiRes, localRes]: [any, any] = await Promise.all([
          getAsyncTaskOutputs({ page: this.page, page_size: this.pageSize }),
          getFiles({ page: this.page, page_size: this.pageSize })
        ])

        const aiAssets: UnifiedAsset[] = (aiRes.data?.list || []).map((record: AsyncTaskRecord) => ({
          id: `ai-${record.id}`,
          source_id: record.id,
          name: getRecordPrompt(record) || 'AI Generation',
          url: getRecordPrimaryUrl(record),
          thumbnail: record.thumbnail || getRecordPrimaryUrl(record),
          type: record.capability.includes('video') ? 'video' : 'image',
          source: 'ai',
          created_at: record.created_at,
          metadata: {
            prompt: getRecordPrompt(record),
            model: getRecordModel(record),
          }
        }))

        const localAssets: UnifiedAsset[] = (localRes.data?.list || []).map((file: UserFile) => ({
          id: `local-${file.id}`,
          source_id: file.id,
          name: file.file_name,
          url: file.file_url,
          thumbnail: file.file_type === 'image' || file.file_type === 'video' ? file.file_url : undefined,
          type: file.file_type as AssetType,
          source: 'local',
          created_at: file.created_at,
          mime_type: file.mime_type,
          size: file.file_size,
        }))

        // Merge and sort by date descending
        const newItems = [...aiAssets, ...localAssets].sort((a, b) => b.created_at - a.created_at)
        
        if (reset) {
          this.items = newItems
        } else {
          this.items = [...this.items, ...newItems]
        }

        this.hasMore = aiAssets.length > 0 || localAssets.length > 0
        this.page++
      } catch (error) {
        console.error('Failed to fetch assets:', error)
      } finally {
        this.isLoading = false
      }
    },

    toggleSelection(id: string | number) {
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
      const aiIds = ids.filter(id => String(id).startsWith('ai-')).map(id => Number(String(id).replace('ai-', '')))
      const localIds = ids.filter(id => String(id).startsWith('local-')).map(id => Number(String(id).replace('local-', '')))

      try {
        await Promise.all([
          ...aiIds.map(id => deleteAsyncTaskRecord(id)),
          ...localIds.map(id => deleteFile(id))
        ])
        
        this.items = this.items.filter(item => !this.selectedIds.has(item.id))
        this.selectedIds.clear()
      } catch (error) {
        console.error('Failed to delete assets:', error)
      }
    }
  }
})
