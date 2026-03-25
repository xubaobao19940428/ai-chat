import request from '../utils/request'

export type FavoriteType = 'model' | 'prompt_image' | 'prompt_video' | 'character'

export interface FavoriteToggleParams {
  type: FavoriteType
  target_id: number
}

export interface FavoriteIdsParams {
  type: FavoriteType
}

/** Add a favorite */
export function addFavorite(params: FavoriteToggleParams) {
  return request.post('/v1/favorites', params)
}

/** Remove a favorite */
export function removeFavorite(params: FavoriteToggleParams) {
  return request.post('/v1/favorites/remove', params)
}

/** Get all favorited IDs for a given type */
export function getFavoriteIds(params: FavoriteIdsParams) {
  return request.get('/v1/favorites/ids', { params })
}

/** Get favorited prompt gallery list with full details */
export function getFavoritePrompts(params: { type: 'prompt_image' | 'prompt_video'; page?: number; page_size?: number }) {
  return request.get('/v1/prompt-gallery/favorites', { params })
}
