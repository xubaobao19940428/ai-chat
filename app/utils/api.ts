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

