import request from '../utils/request'

// Discovery Types
export interface DiscoveryItem {
  id: number
  group_id: number
  type: 'character' | 'model' | 'url'
  related_id: number
  title: string
  subtitle: string
  cover: string
  action_url: string
  params: Record<string, any>
  related_data: any
}

export interface DiscoveryGroup {
  id: number
  title: string
  layout: 'row' | 'grid' | 'list' | 'banner'
  has_more: boolean
  items: DiscoveryItem[]
}

// Discovery API
export const getDiscovery = (params: { placement?: string, country_code?: string, page?: number, page_size?: number, item_limit?: number } = {}) => {
  return request.get('/v1/discovery', { params })
}
