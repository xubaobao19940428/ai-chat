import request from '../utils/request'

// Character Types
export interface Character {
  id: number
  name: string
  avatar: string
  description: string
  prompt: string
  welcome: string
  tags: string[]
  model_id: number
  type: number
  access_type: number
  user_id: number
  created_at: number
  updated_at: number
  related_data?: {
    provider?: string
    [key: string]: any
  }
}

// Character API
export const getCharacterDetail = (id: number) => {
  return request.get(`/v1/characters/${id}`)
}

export const getCharacters = (params: { page?: number, page_size?: number, type?: number, tag?: string, access_type?: number } = {}) => {
  return request.get('/v1/characters', { params })
}

export const getPopularCharacters = (limit: number = 10) => {
  return request.get('/v1/characters/popular', { params: { limit } })
}

export const searchCharacters = (keyword: string, params: { page?: number, page_size?: number } = {}) => {
  return request.get('/v1/characters/search', { params: { keyword, ...params } })
}
