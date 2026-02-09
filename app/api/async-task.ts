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

// Async Task Output Types
export interface AsyncTaskOutput {
  id: number
  type: string
  cover_url: string
  url: string
  task_id: string
  status: number
  created_at: number
  prompt?: string
  meta?: any
}

export interface AsyncTaskOutputListParams {
  model_id?: number
  type?: 'image' | 'video' | 'audio'
  page?: number
  page_size?: number
}

// Async Task Output API
export const getAsyncTaskOutputs = (params: AsyncTaskOutputListParams = {}) => {
  return request.get('/v1/async-task-output/list', { params })
}

export const getAsyncTaskOutputDetail = (id: number) => {
  return request.get('/v1/async-task-output/detail', { params: { id } })
}
