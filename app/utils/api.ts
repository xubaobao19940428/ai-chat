import request from './request'

// Auth Types
export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  nickname?: string
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
  message: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Chat API
export const sendChatMessage = (messages: ChatMessage[], model?: string): Promise<ChatResponse> => {
  return request.post('/chat', {
    messages,
    model: model || 'gpt-4',
  }) as Promise<ChatResponse>
}

export const sendChatMessageStream = (messages: ChatMessage[]) => {
  return request.post('/chat/stream', {
    messages,
  }, {
    responseType: 'stream',
  })
}
