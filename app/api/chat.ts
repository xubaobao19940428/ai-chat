import { randomString, generateSign } from '~/utils/sign'

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'derivative'
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

export interface ChatContext {
  max_history?: number
  user_id?: number
  app_id?: number
  check_balance?: boolean
  estimated_credits?: number
  auto_billing?: boolean
  conversation_id?: number | string
  character_id?: number
}

// Chat API Options
export interface ChatModelOptions {
  temperature?: number
  top_p?: number
  top_k?: number
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  enable_web_search?: boolean
  web_search_depth?: number
  web_search_query?: string
  stream?: boolean
  processor?: string
  context?: ChatContext
  onMessage?: (content: string) => void
  onError?: (error: any) => void
  onFinish?: () => void
  [key: string]: any // Support dynamic fields from model_input
}

const DEFAULT_CHAT_OPTIONS: ChatModelOptions = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 0,
  max_tokens: 2048,
  presence_penalty: 0,
  frequency_penalty: 0,
  enable_web_search: false,
  web_search_depth: 3
}

interface StreamState {
  lastEvent: string;
}

const processStreamLine = (line: string, options: ChatModelOptions, state: StreamState): boolean => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return false;

  if (trimmedLine.startsWith('event: ')) {
    state.lastEvent = trimmedLine.substring(7);
    return false;
  }

  if (trimmedLine === 'data: [DONE]') {
    return true; // Signal completion
  }

  if (trimmedLine.startsWith('data: ')) {
    const dataStr = trimmedLine.substring(6);
    try {
      const json = JSON.parse(dataStr);

      // Handle error event or error in data
      if (state.lastEvent === 'error' || json.error) {
        const errorMsg = json.error?.message || json.message || dataStr;
        options.onError?.(new Error(errorMsg));
        return false;
      }

      const content = json.content ?? json.choices?.[0]?.delta?.content ?? '';
      if (content) {
        options.onMessage?.(content);
      }
    } catch (e) {
      if (state.lastEvent === 'error') {
        options.onError?.(new Error(dataStr));
      }
    }
  }
  return false;
}

/**
 * Send a chat message with optional streaming support.
 * Accepts an AbortSignal for cancellation.
 */
export const sendChatMessage = async (
  message: string,
  messages: ChatMessage[] = [],
  model?: string,
  options: ChatModelOptions = {},
  signal?: AbortSignal
): Promise<any> => {
  const isStream = options.stream ?? false
  const runtimeConfig = useRuntimeConfig().public

  const body = {
    ...DEFAULT_CHAT_OPTIONS,
    ...options,
    model: model || 'openai:gpt-4o-mini',
    message,
    messages,
    processor: options.processor || 'chat',
    stream: isStream
  }

  // Clean up callbacks from body
  const { onMessage, onError, onFinish, ...requestBody } = body as any

  // Prepare Signature
  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = randomString(16)

  const allParams: Record<string, any> = {
    ...requestBody,
    timestamp,
    nonce
  }

  const apiBase = (runtimeConfig.apiBase).replace(/\/$/, '')
  const fullPath = `${apiBase}/v1/chat/completions`

  const secretKey = runtimeConfig.appKey
  const sign = generateSign(fullPath, allParams, secretKey)

  const url = `${apiBase}/v1/chat/completions?timestamp=${timestamp}&nonce=${nonce}&sign=${sign}`

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-app-id': runtimeConfig.appId
    }
    try {
      const hostname = new URL(apiBase).hostname
      if (!hostname.includes('mixu.ai')) {
        headers['x-app-domain'] = hostname
      }
    } catch {}

    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal, // AbortController support
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    if (isStream && response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      const state: StreamState = { lastEvent: '' }
      let hadError = false

      // Wrap onError to track whether an error occurred
      const wrappedOptions: ChatModelOptions = {
        ...options,
        onError: (err: any) => {
          hadError = true
          options.onError?.(err)
        }
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            if (buffer) {
              processStreamLine(buffer, wrappedOptions, state)
            }
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          let shouldBreak = false
          for (const line of lines) {
            if (processStreamLine(line, wrappedOptions, state)) {
              shouldBreak = true
              break
            }
          }
          if (shouldBreak) {
            void reader.cancel()
            break
          }
        }
      } catch (e: any) {
        // Don't report abort as error
        if (e.name !== 'AbortError') {
          hadError = true
          try { void reader.cancel() } catch (_) {}
          throw e
        }
      } finally {
        reader.releaseLock()
      }

      if (!hadError) {
        options.onFinish?.()
      }
      return
    } else {
      const data = await response.json()
      return data
    }

  } catch (error: any) {
    // Suppress AbortError — it's expected when user cancels
    if (error.name === 'AbortError') {
      return
    }
    if (isStream && options.onError) {
      options.onError(error)
    }
    throw error
  }
}

/**
 * Fetch-based streaming wrapper (kept for compatibility)
 */
export const fetchChatStream = async (params: {
  message: string,
  messages?: ChatMessage[],
  model?: string,
  options?: ChatModelOptions,
  onMessage: (content: string) => void,
  onError: (error: any) => void,
  onFinish: () => void,
  signal?: AbortSignal
}) => {
  return sendChatMessage(params.message, params.messages || [], params.model, {
    ...params.options,
    stream: true,
    onMessage: params.onMessage,
    onError: params.onError,
    onFinish: params.onFinish
  }, params.signal)
}
