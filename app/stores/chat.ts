import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export const useChatStore = defineStore('chat', () => {
  const isLoading = ref(false)
  const loadingConversationId = ref<string | null>(null)

  const setLoading = (loading: boolean, conversationId?: string) => {
    isLoading.value = loading
    loadingConversationId.value = loading ? (conversationId || null) : null
  }

  return {
    isLoading,
    loadingConversationId,
    setLoading,
  }
})
