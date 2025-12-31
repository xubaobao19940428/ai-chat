export interface Bot {
  id: string
  name: string
  description?: string
  detailedDescription?: string
  icon: string // URL or emoji
  type: 'official' | 'script' | 'search'
  provider?: string
  mode?: 'chat' | 'image' | 'search' // Default to 'chat'
}

export const OFFICIAL_BOTS: Bot[] = [
  {
    id: 'assistant',
    name: 'Assistant',
    icon: '🤖', 
    type: 'official',
    detailedDescription: '通用型智能助手。可以写作、编程、获取实时信息、创建图像等。查询会根据任务类型和订阅状态自动分配。',
    mode: 'chat'
  },
  {
    id: 'script-bot-creator',
    name: 'Script-Bot-Creator',
    icon: '👨‍💻',
    type: 'official',
    detailedDescription: '专门用于构建在Poe上组合不同机器人的工作流程。限时提供尝鲜优惠价格。由 Claude Code 提供技术支持。',
    mode: 'chat'
  },
  {
    id: 'app-creator',
    name: 'App-Creator',
    icon: '📱',
    type: 'official',
    detailedDescription: '专门构建以应用程序形式在 Poe 上发布的交互式网络应用程序。限时提供尝鲜优惠价格。由 Claude Code 提供技术支持。',
    mode: 'chat'
  },
  {
    id: 'gemini-3-pro',
    name: 'Gemini-3-Pro',
    icon: '💎',
    type: 'official',
    detailedDescription: 'Gemini 3 Pro is a state-of-the-art model for math, coding, computer use, and long-horizon agent tasks, delivering top benchmark results.',
    mode: 'chat'
  },
  {
    id: 'claude-opus-4.5',
    name: 'Claude-Opus-4.5',
    icon: '🧠',
    type: 'official',
    detailedDescription: '来自 Anthropic 的 Claude Opus 4.5，支持可定制的思考预算 (最高64k令牌) 和200k上下文窗口。',
    mode: 'chat'
  },
  {
    id: 'gpt-5.1-instant',
    name: 'GPT-5.1-Instant',
    icon: '⚡',
    type: 'official',
    detailedDescription: 'OpenAI 的旗舰模型，专为对话智能而优化。它在自然对话、上下文记忆和灵活语气方面表现出色。',
    mode: 'chat'
  },
  {
    id: 'gpt-5.1',
     name: 'GPT-5.1',
     icon: '🚀',
     type: 'official',
     mode: 'chat'
  },
]

export const SCRIPT_BOTS: Bot[] = [
  {
    id: 'chat-with-data-ai',
    name: 'Chat-With-Data-AI',
    icon: '📊',
    type: 'script',
    description: '362',
    detailedDescription: 'Upload data files and chat with them using AI analysis.',
    mode: 'chat'
  },
  {
    id: 'podify',
    name: 'Podify',
    icon: '🎙️',
    type: 'script',
    description: '1388',
    detailedDescription: 'Turn text into engaging podcasts.',
    mode: 'chat'
  },
  {
    id: 'ai-quartet',
    name: 'AIQuartet',
    icon: '🎹',
    type: 'script',
    description: '442',
    mode: 'chat'
  },
  {
    id: 'kids-video-gen-sora',
    name: 'KidsVideoGen-Sora',
    icon: '🎥',
    type: 'script',
    description: '7.8k',
    mode: 'image'
  },
  {
    id: 'quizly',
    name: 'Quizly',
    icon: '❓',
    type: 'script',
    description: '895',
    mode: 'chat'
  },
  {
    id: 'pet-calendar',
    name: 'PetCalendar',
    icon: '📅',
    type: 'script',
    description: '616',
    mode: 'image'
  }
]

export const SEARCH_BOTS: Bot[] = [
   {
    id: 'steve-jobs',
    name: 'Steve jobs',
    icon: '🍏',
    type: 'search',
    detailedDescription: 'Simulates a conversation with Steve Jobs.',
    mode: 'chat'
   }
]

export const ALL_BOTS = [...OFFICIAL_BOTS, ...SCRIPT_BOTS, ...SEARCH_BOTS]
