import request from '../utils/request'

// Conversation Types
export interface CreateConversationParams {
  character_id: number
  title?: string
  model_id?: number
  group_id?: number
  meta?: any
  capability?: string
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

export const generateConversationTitle = async (
  id: number | string,
  messages: { role: string; content: string }[],
  onTitle: (chunk: string) => void,
  onDone: () => void,
): Promise<void> => {
  const { randomString, generateSign } = await import('../utils/sign')
  const runtimeConfig = useRuntimeConfig().public

  const requestBody = { id: Number(id), messages }
  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = randomString(16)
  const allParams: Record<string, any> = { ...requestBody, timestamp, nonce }

  const productionDomain = 'https://ai-test.iappdaily.com'
  const fullPath = `${productionDomain}/v1/ai-assistant/generate-title`
  const secretKey = runtimeConfig.appKey || '49f68a5c8493ec2c0bf489821c21fc3b'
  const sign = generateSign(fullPath, allParams, secretKey)

  const apiBase = runtimeConfig.apiBase || '/api'
  const url = `${apiBase}/v1/ai-assistant/generate-title?timestamp=${timestamp}&nonce=${nonce}&sign=${sign}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-app-domain': 'ai-test.iappdaily.com',
    'x-app-id': runtimeConfig.appId || '1',
  }
  const token = localStorage.getItem('token')
  if (token) headers['Authorization'] = token

  try {
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(requestBody) })
    if (!response.ok || !response.body) return

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let lastEvent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('event: ')) {
          lastEvent = trimmed.substring(7)
        } else if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.substring(6))
            if (lastEvent === 'message' && json.content) onTitle(json.content)
            else if (lastEvent === 'done') onDone()
          } catch {}
        }
      }
    }
    reader.releaseLock()
  } catch {}
}

export const generateFollowUpQuestions = async (
  messages: { role: string; content: string }[],
  onDone: (questions: string[]) => void,
): Promise<void> => {
  const { randomString, generateSign } = await import('../utils/sign')
  const runtimeConfig = useRuntimeConfig().public

  const requestBody = { messages }
  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = randomString(16)
  const allParams: Record<string, any> = { ...requestBody, timestamp, nonce }

  const productionDomain = 'https://ai-test.iappdaily.com'
  const fullPath = `${productionDomain}/v1/ai-assistant/generate-follow-up-questions`
  const secretKey = runtimeConfig.appKey || '49f68a5c8493ec2c0bf489821c21fc3b'
  const sign = generateSign(fullPath, allParams, secretKey)

  const apiBase = runtimeConfig.apiBase || '/api'
  const url = `${apiBase}/v1/ai-assistant/generate-follow-up-questions?timestamp=${timestamp}&nonce=${nonce}&sign=${sign}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-app-domain': 'ai-test.iappdaily.com',
    'x-app-id': runtimeConfig.appId || '1',
  }
  const token = localStorage.getItem('token')
  if (token) headers['Authorization'] = token

  try {
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(requestBody) })
    if (!response.ok || !response.body) return

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let lastEvent = ''
    let accumulated = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('event: ')) {
          lastEvent = trimmed.substring(7)
        } else if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.substring(6))
            if (lastEvent === 'message' && json.content) {
              accumulated += json.content
            } else if (lastEvent === 'done') {
              const questions = accumulated
                .split('\n')
                .map((q) => q.replace(/^\d+\.\s*/, '').trim())
                .filter((q) => q.length > 0)
              onDone(questions)
            }
          } catch {}
        }
      }
    }
    reader.releaseLock()
  } catch {}
}
