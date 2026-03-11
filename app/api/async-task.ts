import request from '../utils/request'

// Async Task Types
export interface CreateAsyncTaskParams {
  capability: string
  model: string
  [key: string]: any
}

export interface AsyncTask {
  task_id: string
  pid: string
  status: number
  progress?: number
  output?: any
  created_at: number
}

// Async Task API
export const createAsyncTask = (data: CreateAsyncTaskParams) => {
  return request.post('/v1/async-task/create', data)
}

export const queryAsyncTask = (params: { pid: string }) => {
  return request.get('/v1/async-task/query', { params })
}

export const cancelAsyncTask = (pid: string) => {
  return request.post('/v1/async-task/cancel', { pid })
}

// ---- New Task Record Types (from /v1/async-task-record/*) ----

export interface TaskRecordFile {
  id: number
  file_name: string
  file_url: string
  file_type: string
  source_index: number
  created_at: number
}

export interface AsyncTaskRecord {
  id: number
  provider_task_id: string
  provider_id: number
  character_id: number
  model_id: number
  capability: string
  user_id: number
  status: number       // 0=processing, 1=success, -1=failed
  progress: number
  task_params_json: string   // JSON string, e.g. {"prompt":"...","model":"..."}
  task_output_json: string   // JSON string, array e.g. [{"type":"image","url":"..."}]
  thumbnail: string
  localized: number
  like_count: number
  error: string | null
  started_at: number
  completed_at: number
  created_at: number
  updated_at: number
  files?: TaskRecordFile[]   // only present in detail response
}

export interface AsyncTaskRecordListParams {
  capability?: string   // e.g. 'image', 'video', 'image_generation', 'video_generation'
  status?: number
  page?: number
  page_size?: number
}

// Task Record API
export const getAsyncTaskOutputs = (params: AsyncTaskRecordListParams = {}) => {
  return request.get('/v1/async-task-record/list', { params })
}

export const getAsyncTaskOutputDetail = (id: number) => {
  return request.get('/v1/async-task-record/detail', { params: { id } })
}

export const deleteAsyncTaskRecord = (id: number) => {
  return request.post('/v1/async-task-record/delete', { id })
}

export const likeAsyncTaskRecord = (id: number, action: 'like' | 'unlike') => {
  return request.post('/v1/async-task-record/like', { id, action })
}

// ---- Helper: parse task record fields ----

export const getRecordPrompt = (record: AsyncTaskRecord): string => {
  try {
    const params = JSON.parse(record.task_params_json || '{}')
    return params.prompt || ''
  } catch {
    return ''
  }
}

export const getRecordOutputs = (record: AsyncTaskRecord): Array<{ type: string; url: string }> => {
  try {
    return JSON.parse(record.task_output_json || '[]')
  } catch {
    return []
  }
}

export const getRecordPrimaryUrl = (record: AsyncTaskRecord): string => {
  const outputs = getRecordOutputs(record)
  return outputs[0]?.url || record.thumbnail || ''
}

export const getRecordModel = (record: AsyncTaskRecord): string => {
  try {
    const params = JSON.parse(record.task_params_json || '{}')
    return params.model || ''
  } catch {
    return ''
  }
}

// Keep old interface name as alias for backwards compat
export type AsyncTaskOutput = AsyncTaskRecord
