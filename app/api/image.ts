import { randomString, generateSign } from '~/utils/sign'

export interface ImageGenerateParams {
  prompt: string
  model: string
  mode?: string
  [key: string]: any
}

export interface GenerateStreamTaskData {
  task_id: string
  pid: number
  provider_id?: number
  original_model?: string
  credits?: number
  usage?: {
    images: number
    credits: number
  }
}

export interface GenerateStreamImageData {
  url: string
}

export interface GenerateStreamDoneData {
  provider_id: number
  original_model: string
  finish_reason: string
}

const processStreamSSE = (
  buffer: string,
  lastEvent: { value: string },
  callbacks: {
    onProgress?: (percent: number, message: string) => void
    onTask?: (data: GenerateStreamTaskData) => void
    onImage?: (data: GenerateStreamImageData) => void
    onDone?: (data: GenerateStreamDoneData) => void
    onError?: (error: Error) => void
  }
): string => {
  const lines = buffer.split('\n')
  const remaining = lines.pop() || ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('event: ')) {
      lastEvent.value = trimmed.substring(7)
    } else if (trimmed.startsWith('data: ')) {
      const dataStr = trimmed.substring(6)
      try {
        const json = JSON.parse(dataStr)
        if (lastEvent.value === 'progress') {
          callbacks.onProgress?.(json.percent ?? 0, json.message ?? '')
        } else if (lastEvent.value === 'task') {
          callbacks.onTask?.(json)
        } else if (lastEvent.value === 'image') {
          callbacks.onImage?.(json)
        } else if (lastEvent.value === 'done') {
          callbacks.onDone?.(json)
        } else if (lastEvent.value === 'error' || json.error) {
          callbacks.onError?.(new Error(json.error?.message || json.message || dataStr))
        }
      } catch {
        // ignore JSON parse errors
      }
    }
  }

  return remaining
}

export const generateImageStream = async (
  params: ImageGenerateParams,
  callbacks: {
    onProgress?: (percent: number, message: string) => void
    onTask?: (data: GenerateStreamTaskData) => void
    onImage?: (data: GenerateStreamImageData) => void
    onDone?: (data: GenerateStreamDoneData) => void
    onError?: (error: Error) => void
  },
  signal?: AbortSignal
): Promise<void> => {
  const runtimeConfig = useRuntimeConfig().public

  const requestBody = {
    ...params,
    mode: params.mode || 'generate',
    stream: true
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = randomString(16)

  const allParams: Record<string, any> = { ...requestBody, timestamp, nonce }

  const apiBase = runtimeConfig.apiBase.replace(/\/$/, '')
  const fullPath = `${apiBase}/v1/images/generate`
  const secretKey = runtimeConfig.appKey
  const sign = generateSign(fullPath, allParams, secretKey)

  const url = `${apiBase}/v1/images/generate?timestamp=${timestamp}&nonce=${nonce}&sign=${sign}`

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
  if (token) headers['Authorization'] = token

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    if (!response.body) return

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    const lastEvent = { value: '' }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        buffer = processStreamSSE(buffer, lastEvent, callbacks)
      }
      if (buffer) processStreamSSE(buffer + '\n', lastEvent, callbacks)
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        try { void reader.cancel() } catch (_) {}
        throw e
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error: any) {
    if (error.name === 'AbortError') return
    callbacks.onError?.(error)
  }
}
