import request from '@/utils/request'
import type { AIModel } from './models'

/**
 * Get available video generation models
 */
export const getVideoModels = () => {
  return request.get('/v1/models', { params: { capability: 'video_generation' } })
}

// Re-export AIModel for convenience
export type { AIModel }
