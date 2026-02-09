import request from '../utils/request'

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
