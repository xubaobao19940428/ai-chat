import request from '../utils/request'
import { createFile } from './files'

// Helper Types
export interface GetUploadUrlParams {
  file_name: string
  content_type: string
}

export interface GetUploadUrlResponse {
  url: string
  key: string
}

// Helper API
export const getUploadUrl = (data: GetUploadUrlParams) => {
  return request.post('/v1/get-upload-url', data)
}

/**
 * Upload a file to object storage using a presigned URL and record it in the backend
 * @param file The file to upload
 * @param purpose The purpose of the file (avatar, chat, generation, attachment)
 * @returns Object containing the storage key and clean public URL
 */
export const uploadFile = async (file: File, purpose: string = 'general'): Promise<{ key: string, url: string }> => {
  try {
    // 1. Get presigned URL
    const res = await getUploadUrl({
      file_name: file.name,
      content_type: file.type
    }) as any

    if (res.code !== 0 || !res.data?.url) {
      throw new Error(res.message || 'Failed to get upload URL')
    }

    const { url, key } = res.data

    // 2. Perform actual upload via PUT
    const uploadRes = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    })

    if (!uploadRes.ok) {
      throw new Error(`Upload failed with status ${uploadRes.status}`)
    }

    const cleanUrl = url.split('?')[0]

    // 3. Record the file in the backend database
    let backendKey = key
    let backendUrl = cleanUrl

    try {
      const createRes = await createFile({
        file_name: file.name,
        file_key: key,
        file_url: cleanUrl,
        mime_type: file.type,
        file_size: file.size,
        purpose: purpose,
        source_type: 'upload'
      }) as any
      
      if (createRes.code === 0 && createRes.data) {
        backendKey = createRes.data.file_key || key
        backendUrl = createRes.data.file_url || cleanUrl
      }
    } catch (recordError) {
      console.error('Failed to record file in backend:', recordError)
    }

    return { key: backendKey, url: backendUrl }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}