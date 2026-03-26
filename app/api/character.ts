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
  common_questions?: string[]
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

export interface CreateCharacterParams {
  name: string
  prompt: string
  description?: string
  avatar?: string
  access_type?: number // 1=private, 2=public
}

export const createCharacter = (data: CreateCharacterParams) => {
  return request.post('/v1/characters', data)
}

export const getMyCharacters = (params: { page?: number, page_size?: number } = {}) => {
  return request.get('/v1/characters/my', { params })
}
