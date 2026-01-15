export interface PromptSuggestion {
  id: string
  label: string
  icon: string
  prompt: string
  subPrompts?: string[]
}

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    id: 'help-me-write',
    label: 'Help me write',
    icon: '✍️',
    prompt: 'Help me write ',
    subPrompts: [
      'Help me write an essay about AI',
      'Help me write a professional cover letter',
      'Help me write a follow-up email after an interview',
      'Help me write a creative short story'
    ]
  },
  {
    id: 'learn-about',
    label: 'Learn about',
    icon: '📖',
    prompt: 'Tell me more about ',
    subPrompts: [
      'Learn about quantum computing',
      'Learn about the history of the Renaissance',
      'Learn about how neural networks work',
      'Learn about sustainable energy'
    ]
  },
  {
    id: 'analyze-image',
    label: 'Analyze Image',
    icon: '🔍',
    prompt: 'Can you analyze this image for me? ',
  },
  {
    id: 'summarize-text',
    label: 'Summarize text',
    icon: '📝',
    prompt: 'Summarize this text for me: ',
  },
  {
    id: 'analyze-data',
    label: 'Analyze Data',
    icon: '📊',
    prompt: 'Help me analyze this data: ',
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm',
    icon: '🧠',
    prompt: 'Let\'s brainstorm some ideas for ',
  },
  {
    id: 'improve-writing',
    label: 'Improve Writing',
    icon: '✏️',
    prompt: 'Can you help me improve this writing? ',
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: '🌐',
    prompt: 'Translate the following text to English: ',
  },
  {
    id: 'generate-ideas',
    label: 'Generate Ideas',
    icon: '💡',
    prompt: 'Generate 10 ideas for ',
  }
]
