import request from '@/utils/request'
import type { AIModel } from './models'

/**
 * Get available video generation models
 */
export const getVideoModels = () => {
  return request.get('/v1/models', { params: { capability: 'video_generation' } })
}

/**
 * Video task output interface
 */
export interface VideoTaskOutput {
  id: number
  type: string
  cover_url: string
  url: string
  task_id: string
  status: number
  created_at: number
  prompt?: string
  meta?: any
  duration?: number
}

// Re-export AIModel for convenience
export type { AIModel }
