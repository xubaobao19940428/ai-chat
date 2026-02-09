import request from '../utils/request'

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
  return request.post('/v1/helper/upload-url', data)
}

/**
 * Upload a file to object storage using a presigned URL
 * @param file The file to upload
 * @returns Object containing the storage key and public URL
 */
export const uploadFile = async (file: File): Promise<{ key: string, url: string }> => {
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

    return { key, url: url.split('?')[0] } // Return key and clean URL
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}
