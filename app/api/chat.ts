import { md5 } from 'js-md5'

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

// Helper for random string
const randomString = (code: number) => {
  const len = code;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
  const maxLen = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxLen))
  }
  return pwd
}

interface StreamState {
  lastEvent: string;
}

const processStreamLine = (line: string, options: ChatModelOptions, state: StreamState): boolean => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return false;

  if (trimmedLine.startsWith('event: ')) {
    state.lastEvent = trimmedLine.substring(7);
    console.log('Stream event:', state.lastEvent);
    return false;
  }

  if (trimmedLine === 'data: [DONE]') {
    console.log('Stream received [DONE]');
    return true; // Signal completion
  }

  if (trimmedLine.startsWith('data: ')) {
    const dataStr = trimmedLine.substring(6);
    try {
      const json = JSON.parse(dataStr);

      // Handle error event or error in data
      if (state.lastEvent === 'error' || json.error) {
        console.error('Stream Error Data:', json);
        const errorMsg = json.error?.message || json.message || dataStr;
        options.onError?.(new Error(errorMsg));
        return false;
      }

      const content = json.content ?? json.choices?.[0]?.delta?.content ?? '';
      if (content) {
        options.onMessage?.(content);
      }
    } catch (e) {
      console.error('Error parsing stream line:', trimmedLine, e);
      if (state.lastEvent === 'error') {
        options.onError?.(new Error(dataStr));
      }
    }
  } else {
    console.log('Non-data stream line:', trimmedLine);
  }
  return false;
}

export const sendChatMessage = async (message: string, messages: ChatMessage[] = [], model?: string, options: ChatModelOptions = {}): Promise<any> => {
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

  // Debug log to verify request body
  console.log('Chat API Request Body:', JSON.stringify(body, null, 2))
  console.log('Messages count:', messages?.length || 0)

  // Clean up callbacks from body
  const { onMessage, onError, onFinish, ...requestBody } = body as any


  // Prepare Signature Params
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = randomString(16);

  const params: Record<string, any> = {
    ...requestBody,
    timestamp,
    nonce
  };


  // Sort params and EXCLUDE objects/arrays from signature to avoid serialization mismatch
  const sortedParams = Object.keys(params).sort().reduce((acc: any, key: string) => {
    const val = params[key]
    if (val !== undefined && val !== null && typeof val !== 'object') {
      acc[key] = val
    }
    return acc;
  }, {});

  // Construct full path for signing
  const productionDomain = 'https://ai-test.iappdaily.com';
  const signingPath = 'v1/chat/completions';
  const signingUrl = productionDomain.replace(/\/$/, '') + '/' + signingPath;

  // Generate query string
  const queryString = Object.entries(sortedParams)
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
      const encodedValue = encodeURIComponent(String(value)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
      return `${encodedKey}=${encodedValue}`;
    })
    .join('&');

  const encodedFullPath = signingUrl.replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  const secretKey = runtimeConfig.appKey || '49f68a5c8493ec2c0bf489821c21fc3b';

  // Back to original concatenation style
  const sign = md5(encodedFullPath + queryString + secretKey);

  console.log('--- Signature Debug ---');
  console.log('Encoded Full Path:', encodedFullPath);
  console.log('Query String:', queryString);
  console.log('Secret Key (last 4):', secretKey.slice(-4));
  console.log('Generated Sign:', sign);
  console.log('-----------------------');

  // Prepare URL with query params
  const apiBase = runtimeConfig.apiBase || '/api';


  const url = `${apiBase}/v1/chat/completions?timestamp=${timestamp}&nonce=${nonce}&sign=${sign}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-app-domain': 'ai-test.iappdaily.com',
      'x-app-id': runtimeConfig.appId || '1'
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `${token}`;
    }

    console.log('Fetching URL:', url);
    console.log('Request Headers:', JSON.stringify(headers, null, 2));
    console.log('Final Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      // Use signal to avoid abandoned requests if needed
    });

    console.log('Chat API Response Status:', response.status);
    console.log('Chat API Response Content-Type:', response.headers.get('Content-Type'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat API Error Body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    if (isStream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const state: StreamState = { lastEvent: '' };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('Stream reader done');
            // Process any remaining buffer content
            if (buffer) {
              processStreamLine(buffer, options, state);
            }
            break;
          }



          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          const lines = buffer.split('\n');

          buffer = lines.pop() || '';

          let shouldBreak = false;
          for (const line of lines) {
            if (processStreamLine(line, options, state)) {
              shouldBreak = true;
              break;
            }
          }
          if (shouldBreak) {
            console.log('Stream done signal received. Cancelling reader (fire-and-forget).');
            // Fire and forget cancellation to avoid hanging
            void reader.cancel();
            break;
          }
        }
      } catch (e) {
        console.error('Reader loop error:', e);
        try {
          void reader.cancel();
        } catch (err) {
          console.error('Error cancelling reader:', err);
        }
        throw e;
      } finally {
        reader.releaseLock();
      }

      options.onFinish?.();
      return;
    } else {
      const data = await response.json();
      return data;
    }

  } catch (error) {
    if (isStream && options.onError) {
      options.onError(error)
    }
    throw error;
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
  onFinish: () => void
}) => {
  return sendChatMessage(params.message, params.messages || [], params.model, {
    ...params.options,
    stream: true,
    onMessage: params.onMessage,
    onError: params.onError,
    onFinish: params.onFinish
  })
}
