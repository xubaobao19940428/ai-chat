import request from './request'
import { md5 } from 'js-md5'

// Auth Types
export interface LoginParams {
  email: string
  code?: string
  password?: string
}

export interface RegisterParams {
  email: string
  code: string
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

export const sendLoginCode = (email: string) => {
  return request.post('/v1/sso/send-email', { email, type: 'activation' })
}

export const sendRegisterCode = (email: string) => {
  return request.post('/v1/sso/send-email', { email, type: 'register' })
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

// Chat API (sendChatMessage updated to use Axios for reliable signing)

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

const processStreamLine = (line: string, options: ChatModelOptions) => {
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine === 'data: [DONE]') return;
  
  if (trimmedLine.startsWith('data: ')) {
    try {
      const json = JSON.parse(trimmedLine.substring(6));
      const content = json.content ?? json.choices?.[0]?.delta?.content ?? '';
      if (content) {
        options.onMessage?.(content);
      }
    } catch (e) {
      console.error('Error parsing stream line:', trimmedLine, e);
    }
  }
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
  const productionDomain = 'http://ai-test.iappdaily.com';
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

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    if (isStream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Process any remaining buffer content
          if (buffer) {
            processStreamLine(buffer, options);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          processStreamLine(line, options);
        }
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
    } else {
        throw error;
    }
  }
}

// Fetch-based streaming wrapper (kept for compatibility)
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

// Model Types
export interface ModelInputField {
  key: string
  type: 'number' | 'string' | 'boolean' | 'select'
  label?: string
  description?: string
  default?: any
  min?: number
  max?: number
  step?: number
  options?: { label: string, value: any }[]
}

export interface ModelInput {
  fields: Record<string, ModelInputField>
}

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
  model_input?: ModelInput
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
