import request from '../utils/request'

// Comment Types
export type CommentTargetType = 'post' | 'character' | 'project' | string

export interface Comment {
  id: number
  target_type: CommentTargetType
  target_id: number
  content: string
  parent_id: number | null
  user_id: number
  like_count: number
  is_liked: boolean
  created_at: string
  updated_at: string
  user?: {
    id: number
    nickname: string
    avatar: string
  }
  replies?: Comment[]
}

export interface CommentListParams {
  target_type: CommentTargetType
  target_id: number
  sort?: 'latest' | 'hot'
  page?: number
  page_size?: number
}

export interface CommentListResponse {
  list: Comment[]
  total: number
  page: number
  page_size: number
}

export interface CreateCommentParams {
  target_type: CommentTargetType
  target_id: number
  content: string
  parent_id?: number | null
}

// Comment API
export const getComments = (params: CommentListParams) => {
  return request.get<CommentListResponse>('/v1/comments', { params })
}

export const createComment = (data: CreateCommentParams) => {
  return request.post<Comment>('/v1/comments', data)
}

export const deleteComment = (id: number) => {
  return request.post('/v1/comments/delete', { id })
}

export const likeComment = (id: number) => {
  return request.post('/v1/comments/like', { id })
}

export const unlikeComment = (id: number) => {
  return request.post('/v1/comments/unlike', { id })
}
