export interface AIModel {
  id: string
  name: string
  description: string
  provider: string
  icon: string
  color: string
  isPro?: boolean
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-5',
    name: 'OpenAI GPT-5',
    description: "OpenAI's Most Advanced Model",
    provider: 'OpenAI',
    icon: '🤖',
    color: 'bg-indigo-500',
    isPro: true,
  },
  {
    id: 'gpt-5.1',
    name: 'OpenAI GPT-5.1',
    description: "OpenAI's advanced unified AI model",
    provider: 'OpenAI',
    icon: '🤖',
    color: 'bg-indigo-500',
    isPro: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o mini',
    description: "OpenAI's Fastest Model",
    provider: 'OpenAI',
    icon: '🤖',
    color: 'bg-green-500',
    isPro: false,
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    description: "OpenAI's Most Accurate Model",
    provider: 'OpenAI',
    icon: '🤖',
    color: 'bg-indigo-500',
    isPro: true,
  },
  {
    id: 'gemini-3-pro',
    name: 'Google Gemini 3 Pro',
    description: "Google's newest flagship model",
    provider: 'Google',
    icon: '💎',
    color: 'bg-blue-500',
    isPro: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Anthropic Claude 3 Opus',
    description: "Anthropic's most powerful reasoning model",
    provider: 'Anthropic',
    icon: '🧠',
    color: 'bg-purple-500',
    isPro: true,
  },
]

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === id)
}

export const getDefaultModel = (): AIModel => {
  const defaultModel = AI_MODELS.find(m => m.id === 'gpt-4o-mini')
  if (defaultModel) {
    return defaultModel
  }
  // AI_MODELS 数组不为空，所以这里总是返回一个模型
  const firstModel = AI_MODELS[0]
  if (firstModel) {
    return firstModel
  }
  // 理论上不会到达这里，但为了类型安全提供一个默认值
  return {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'OpenAI 最强大的模型',
    provider: 'OpenAI',
    icon: '🤖',
    color: 'bg-green-500',
  }
}
