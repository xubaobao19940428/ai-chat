import request from '../utils/request'

// Conversation Types
export interface CreateConversationParams {
  character_id: number
  title?: string
  model_id?: number
  group_id?: number
  meta?: any
}

export interface ConversationListItem {
  id: number
  title: string
  character_id: number
  last_message?: string
  updated_at: number
  group_id: number
}

export interface UpdateConversationParams {
  id: number
  title?: string
  model_id?: number
  meta?: any
  group_id?: number
}

// Conversation API
export const createConversation = (data: CreateConversationParams) => {
  return request.post('/v1/conversations', data)
}

export const getConversations = (params: { character_id?: number, group_id?: number, page?: number, page_size?: number }) => {
  return request.get('/v1/conversations', { params })
}

/**
 * 获取对话详情
 * @param id 对话id
 * @returns 
 */
export const getConversationDetail = (id: number) => {
  return request.get(`/v1/conversations/${id}`)
}

export const updateConversation = (data: UpdateConversationParams) => {
  return request.post('/v1/conversations/update', data)
}

export const deleteConversation = (id: number) => {
  return request.post('/v1/conversations/delete', { id })
}

export const getConversationMessages = (id: number, limit: number = 0) => {
  return request.get(`/v1/conversations/${id}/messages`, { params: { limit } })
}

export const getRecentConversations = (limit: number = 10) => {
  return request.get('/v1/conversations/recent', { params: { limit } })
}
