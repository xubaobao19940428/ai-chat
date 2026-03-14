import request from '../utils/request'

// Legacy presigned URL upload (used by avatar upload in user.ts)
export interface GetUploadUrlParams {
  file_name: string
  content_type: string
}

export const getUploadUrl = (data: GetUploadUrlParams) => {
  return request.post('/v1/get-upload-url', data)
}

/**
 * Upload a file via POST /v1/files (multipart/form-data)
 * @param file The file to upload
 * @returns Object containing the storage key and public URL
 */
export const uploadFile = async (file: File): Promise<{ key: string, url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('file_name', file.name)
  formData.append('mime_type', file.type)
  formData.append('file_size', String(file.size))
  formData.append('purpose', 'generation')

  const res = await request.post('/v1/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }) as any

  if (res.code !== 0 || !res.data) {
    throw new Error(res.message || 'Upload failed')
  }

  return { key: res.data.file_key, url: res.data.file_url }
}
