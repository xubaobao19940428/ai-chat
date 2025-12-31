export interface AIModel {
  id: string
  name: string
  description: string
  provider: string
  icon: string
  color: string
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    description: 'GPT-4o mini, developed by OpenAI, stands as one of the most advanced AI models available, offering exceptional performance and capabilities.',
    provider: 'OpenAI',
    icon: '🤖',
    color: 'bg-green-500',
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    description: 'OpenAI\'s GPT-5 sets a new standard in artificial intelligence, providing cutting-edge language understanding and generation capabilities.',
    provider: 'OpenAI',
    icon: '🤖',
    color: 'bg-green-600',
  },
  {
    id: 'gpt-5.1',
    name: 'GPT-5.1',
    description: 'GPT-5.1 delivers OpenAI\'s most advanced capabilities, featuring improved reasoning, creativity, and problem-solving skills.',
    provider: 'OpenAI',
    icon: '🤖',
    color: 'bg-green-600',
  },
  {
    id: 'gemini-3-pro',
    name: 'Gemini 3 Pro',
    description: 'Gemini 3 Pro is Google\'s newest flagship model, designed to provide state-of-the-art performance across a wide range of tasks.',
    provider: 'Google',
    icon: '💎',
    color: 'bg-blue-500',
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most powerful model, offering exceptional reasoning capabilities and safety features.',
    provider: 'Anthropic',
    icon: '🧠',
    color: 'bg-purple-500',
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
