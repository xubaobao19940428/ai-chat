import request from './request'

// Auth Types
export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  avatar: string
}

// Auth API
export const login = (data: LoginParams) => {
  return request.post('/v1/sso/login/email', data)
}

export const register = (data: RegisterParams) => {
  return request.post('/v1/sso/register', data)
}

export const getUserProfile = () => {
  return request.get('/v1/sso/profile')
}

export const logout = () => {
  return request.post('/v1/sso/logout')
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: ChatMessage
    finish_reason: string
  }[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Chat API
export const sendChatMessage = (messages: ChatMessage[], model?: string, stream: boolean = false): Promise<any> => {
  return request.post('/v1/chat/completions', {
    messages,
    model: model || 'gpt-4o-mini',
    stream
  })
}

// Fetch-based streaming for browser SSE
export const fetchChatStream = async (params: {
  messages: ChatMessage[],
  model?: string,
  onMessage: (content: string) => void,
  onError: (error: any) => void,
  onFinish: () => void
}) => {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.public.apiBase
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${apiBase}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'x-app-id': runtimeConfig.public.appId,
        'x-app-key': runtimeConfig.public.appKey,
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        messages: params.messages,
        model: params.model || 'gpt-4o-mini',
        stream: true
      }),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    if (reader) {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                const trimmedLine = line.trim()
                if (!trimmedLine || trimmedLine === 'data: [DONE]') continue
                
                if (trimmedLine.startsWith('data: ')) {
                    try {
                        const json = JSON.parse(trimmedLine.substring(6))
                        const content = json.choices?.[0]?.delta?.content || ''
                        if (content) {
                            params.onMessage(content)
                        }
                    } catch (e) {
                        console.error('Error parsing stream line:', trimmedLine, e)
                    }
                }
            }
        }
    }
    params.onFinish()
  } catch (error) {
    params.onError(error)
  }
}

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

// Model Types
export interface AIModel {
  provider: string
  model: string
  display_name: string
  description: string
  capabilities: string[]
  context_length: number
  max_output_tokens: number
  is_default: boolean
  execution_mode: string
}

// Model API
export const getModels = (params: { provider?: string, capability?: string } = {}) => {
  return request.get('/v1/models', { params })
}

// Discovery Types
export interface DiscoveryItem {
  id: number
  group_id: number
  type: 'character' | 'model' | 'url'
  related_id: number
  title: string
  subtitle: string
  cover: string
  action_url: string
  params: Record<string, any>
  related_data: any
}

export interface DiscoveryGroup {
  id: number
  title: string
  layout: 'row' | 'grid' | 'list' | 'banner'
  has_more: boolean
  items: DiscoveryItem[]
}

// Discovery API
export const getDiscovery = (params: { placement?: string, country_code?: string, page?: number, page_size?: number, item_limit?: number } = {}) => {
  return request.get('/v1/discovery', { params })
}

// Project/Group Types
export interface ProjectGroup {
  id: number
  name: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
}

export interface CreateProjectParams {
  name: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
}

// Project/Group API
export const getProjectGroups = () => {
  return request.get('/v1/conversations/groups')
}

export const createProjectGroup = (data: CreateProjectParams) => {
  return request.post('/v1/conversations/groups/create', data)
}

export const updateProjectGroup = (data: Partial<ProjectGroup> & { id: number }) => {
  return request.post('/v1/conversations/groups/update', data)
}

export const deleteProjectGroup = (id: number) => {
  return request.post('/v1/conversations/groups/delete', { id })
}
