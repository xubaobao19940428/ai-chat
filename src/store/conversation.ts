import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message } from './chat'

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: number
  updatedAt: number
}

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<string | null>(null)

  // 当前会话
  const currentConversation = computed(() => {
    if (!currentConversationId.value) return null
    return conversations.value.find(c => c.id === currentConversationId.value) || null
  })

  // 创建新会话
  const createConversation = (model: string = 'gpt-4o-mini') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const conversation: Conversation = {
      id,
      title: '新对话',
      messages: [],
      model,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    conversations.value.unshift(conversation)
    currentConversationId.value = id
    return conversation
  }

  // 删除会话
  const deleteConversation = (id: string) => {
    const index = conversations.value.findIndex(c => c.id === id)
    if (index > -1) {
      conversations.value.splice(index, 1)
      if (currentConversationId.value === id) {
        currentConversationId.value = conversations.value[0]?.id || null
      }
    }
  }

  // 切换会话
  const switchConversation = (id: string) => {
    const conversation = conversations.value.find(c => c.id === id)
    if (conversation) {
      currentConversationId.value = id
    }
  }

  // 更新会话标题
  const updateTitle = (id: string, title: string) => {
    const conversation = conversations.value.find(c => c.id === id)
    if (conversation) {
      conversation.title = title
      conversation.updatedAt = Date.now()
    }
  }

  // 添加消息到会话
  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      }
      conversation.messages.push(newMessage)
      conversation.updatedAt = Date.now()
      
      // 如果第一条用户消息，自动生成标题
      if (conversation.messages.length === 1 && message.role === 'user') {
        conversation.title = message.content.slice(0, 30) || '新对话'
      }
    }
  }

  // 清除会话消息
  const clearMessages = (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      conversation.messages = []
      conversation.updatedAt = Date.now()
    }
  }

  // 切换模型
  const switchModel = (conversationId: string, model: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      conversation.model = model
      conversation.updatedAt = Date.now()
    }
  }

  return {
    conversations,
    currentConversationId,
    currentConversation,
    createConversation,
    deleteConversation,
    switchConversation,
    updateTitle,
    addMessage,
    clearMessages,
    switchModel,
  }
})

