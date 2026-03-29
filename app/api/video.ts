import type { GenerateStreamDoneData, GenerateStreamTaskData, GenerateStreamImageData } from './image'

/**
 * Get available video generation models
 */
export const getVideoModels = () => {
  return request.get('/v1/models', { params: { capability: 'video_generation' } })
}

export const generateVideoStream = async (
  params: { prompt: string; model: string; mode?: string; [key: string]: any },
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
  const fullPath = `${apiBase}/v1/videos/generate`
  const secretKey = runtimeConfig.appKey
  const sign = generateSign(fullPath, allParams, secretKey)

  const url = `${apiBase}/v1/videos/generate?timestamp=${timestamp}&nonce=${nonce}&sign=${sign}`

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
    let lastEvent = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          if (trimmed.startsWith('event: ')) {
            lastEvent = trimmed.substring(7)
          } else if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.substring(6)
            try {
              const json = JSON.parse(dataStr)
              if (lastEvent === 'progress') {
                callbacks.onProgress?.(json.percent ?? 0, json.message ?? '')
              } else if (lastEvent === 'task') {
                callbacks.onTask?.(json)
              } else if (lastEvent === 'image') {
                callbacks.onImage?.(json)
              } else if (lastEvent === 'done') {
                callbacks.onDone?.(json)
              } else if (lastEvent === 'error' || json.error) {
                callbacks.onError?.(new Error(json.error?.message || json.message || dataStr))
              }
            } catch { /* ignore */ }
          }
        }
      }
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

// Re-export AIModel for convenience
export type { AIModel }
