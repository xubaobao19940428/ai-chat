import request from './request'

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

// 发送聊天消息
export const sendChatMessage = (messages: ChatMessage[], model?: string): Promise<ChatResponse> => {
  return request.post('/chat', {
    messages,
    model: model || 'gpt-4',
  }) as Promise<ChatResponse>
}

// 流式聊天（如果需要）
export const sendChatMessageStream = (messages: ChatMessage[]) => {
  return request.post('/chat/stream', {
    messages,
  }, {
    responseType: 'stream',
  })
}

