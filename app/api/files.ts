import request from '../utils/request'

export interface UserFile {
  id: number
  file_name: string
  file_key: string
  file_url: string
  file_type: 'image' | 'video' | 'audio' | 'document' | 'other'
  mime_type: string
  file_size: number
  purpose: string
  source_type: string
  created_at: number
}

export interface GetFilesParams {
  page?: number
  page_size?: number
  file_type?: 'image' | 'video' | 'audio' | 'document' | 'other'
  purpose?: string
  source_type?: string
}

export const getFiles = (params: GetFilesParams = {}) => {
  return request.get('/v1/files', { params })
}

export interface CreateFileParams {
  file_name: string
  file_key: string
  file_url?: string
  file_type?: string
  mime_type?: string
  file_size?: number
  purpose?: string
  meta?: Record<string, any>
}

export const createFile = (data: CreateFileParams) => {
  return request.post('/v1/files', data)
}
