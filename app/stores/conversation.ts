import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message } from './chat'
import { 
  getConversations, 
  createConversation as apiCreateConversation, 
  deleteConversation as apiDeleteConversation,
  updateConversation as apiUpdateConversation,
  getConversationMessages,
  getConversationDetail,
  type ConversationListItem
} from '~/utils/api'

export interface Conversation {
  id: number | string
  title: string
  messages: Message[]
  model?: string
  params?: Record<string, any>
  groupId: number
  characterId?: number
  updatedAt: number
}

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<number | string | null>(null)
  const selectedGroupId = ref<number | null>(null)
  const isLoading = ref(false)

  // 当前会话
  const currentConversation = computed(() => {
    if (!currentConversationId.value) return null
    return conversations.value.find(c => c.id == currentConversationId.value) || null
  })

  // 获取单个会话详情 (用于直接跳转页面时)
  const fetchConversationDetail = async (id: number | string) => {
    isLoading.value = true
    try {
      const res: any = await getConversationDetail(Number(id))
      const item = res.data
      if (item) {
        const conversation: Conversation = {
          id: item.id,
          title: item.title,
          messages: [],
          model: item.model || '',
          params: item.meta?.params || item.params || {},
          groupId: item.group_id,
          characterId: item.character_id,
          updatedAt: item.updated_at * 1000
        }

        console.log('Fetched conversation detail:', conversation)

        // 检查是否已存在
        const existingIndex = conversations.value.findIndex(c => c.id == id)
        if (existingIndex > -1) {
          conversations.value[existingIndex] = { ...conversations.value[existingIndex], ...conversation }
        } else {
          conversations.value.push(conversation)
        }
        return conversation
      }
    } catch (error) {
      console.error('Fetch conversation detail failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 获取会话列表
  const fetchConversations = async (groupId?: number) => {
    isLoading.value = true
    try {
      const gid = groupId !== undefined ? groupId : selectedGroupId.value
      const res: any = await getConversations({ group_id: gid || 0 })
      const list = res.data.list || []

      // 保留已加载的消息，而不是清空
      const newConversations = list.map((item: any) => {
        // 查找已存在的会话
        const existing = conversations.value.find(c => c.id == item.id)
        return {
          id: String(item.id),
          title: item.title,
          messages: existing?.messages || [], // 保留已加载的消息
          model: item.model || '',
          params: item.meta?.params || item.params || {},
          groupId: item.group_id,
          characterId: item.character_id,
          updatedAt: item.updated_at * 1000
        }
      })

      // CRITICAL: Ensure current conversation is preserved if it's not in the list (e.g. pagination or delay)
      // Otherwise the current view will blank out
      if (currentConversationId.value) {
        const currentInNew = newConversations.find((c: Conversation) => c.id == currentConversationId.value)
        if (!currentInNew) {
           const currentInOld = conversations.value.find(c => c.id == currentConversationId.value)
           if (currentInOld) {
              console.log('Preserving current conversation in list even though not in fetch result:', currentInOld.id)
              newConversations.push(currentInOld)
           }
        }
      }

      conversations.value = newConversations
      console.log('Conversations fetched, preserved messages for existing items')
    } catch (error) {
      console.error('Fetch conversations failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 切换分组过滤
  const setSelectedGroupId = async (id: number | null) => {
    console.log('setSelectedGroupId called with:', id)
    console.log('Previous selectedGroupId:', selectedGroupId.value)
    selectedGroupId.value = id
    console.log('Fetching conversations for group:', id)
    await fetchConversations()
    console.log('Conversations loaded, count:', conversations.value.length)
  }

  // 获取消息列表并同步到 store
  const fetchMessages = async (conversationId: number | string) => {
    isLoading.value = true
    try {
      const res: any = await getConversationMessages(Number(conversationId))
      const conversation = conversations.value.find(c => c.id == conversationId)
      if (conversation) {
        // 后端返回的消息格式可能在 data 或 data.list 中
        const rawMessages = Array.isArray(res.data) ? res.data : (res.data?.list || [])
        const messages = rawMessages.map((m: any) => ({
          id: String(m.id),
          role: m.role,
          content: m.content,
          timestamp: m.created_at * 1000
        }))
        conversation.messages = messages
      }
    } catch (error) {
      console.error('Fetch messages failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 创建新会话
  const createConversation = async (params: { character_id: number, group_id?: number, model?: string }) => {
    try {
      const res: any = await apiCreateConversation({
        character_id: params.character_id,
        group_id: params.group_id || 0,
        model_id: 1 // 暂时硬编码模型 ID，后续对接模型列表
      })
      
      const newId = res.data.conversation_id
      await fetchConversations() // 刷新列表获取完整元数据
      currentConversationId.value = newId
      return newId
    } catch (error) {
      console.error('Create conversation failed:', error)
      throw error
    }
  }

  // 删除会话
  const deleteConversation = async (id: number | string) => {
    try {
      await apiDeleteConversation(Number(id))
      const index = conversations.value.findIndex(c => c.id == id)
      if (index > -1) {
        conversations.value.splice(index, 1)
        if (currentConversationId.value == id) {
          currentConversationId.value = conversations.value[0]?.id || null
        }
      }
    } catch (error) {
      console.error('Delete conversation failed:', error)
    }
  }

  // 切换会话
  const switchConversation = async (id: number | string) => {
    console.log('switchConversation called with id:', id)
    currentConversationId.value = id

    // 确保元数据存在
    let conversation = conversations.value.find(c => c.id == id)
    if (!conversation) {
      console.log('Conversation not found in store, fetching details...')
      conversation = await fetchConversationDetail(id)
      console.log('Fetched conversation:', conversation)
    } else {
      console.log('Conversation found in store:', conversation)
    }

    // 只要消息为空就抓取一次，确保持久化
    if (conversation && conversation.messages.length === 0) {
      console.log('Fetching messages for conversation...')
      await fetchMessages(id)
    }
  }

  // 更新会话标题
  const updateTitle = async (id: number | string, title: string) => {
    try {
      await apiUpdateConversation({ id: Number(id), title })
      const conversation = conversations.value.find(c => c.id == id)
      if (conversation) {
        conversation.title = title
        conversation.updatedAt = Date.now()
      }
    } catch (error) {
      console.error('Update title failed:', error)
    }
  }

  // 将会话移至分组
  const moveToProject = async (conversationId: number | string, groupId: number) => {
    try {
      await apiUpdateConversation({ id: Number(conversationId), group_id: groupId })
      const conversation = conversations.value.find(c => c.id == conversationId)
      if (conversation) {
        conversation.groupId = groupId
        await fetchConversations() // 建议刷新以保证顺序
      }
    } catch (error) {
      console.error('Move to project failed:', error)
    }
  }

  // 切换会话模型
  const switchModel = (conversationId: number | string, model: string) => {
    const conversation = conversations.value.find(c => c.id == conversationId)
    if (conversation) {
      conversation.model = model
    }
  }

  // 更新模型参数
  const updateModelParams = (conversationId: number | string, params: Record<string, any>) => {
    const conversation = conversations.value.find(c => c.id == conversationId)
    if (conversation) {
      conversation.params = params
      conversation.updatedAt = Date.now()
    }
  }

  // 添加消息到会话（用于发送消息后的即时反馈）
  const addMessage = (conversationId: number | string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const conversation = conversations.value.find(c => c.id == conversationId)
    if (conversation) {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      }
      conversation.messages.push(newMessage)
      conversation.updatedAt = Date.now()
    }
  }

  // 更新最后一条消息内容（用于流式渲染）
  const updateLastMessage = (conversationId: number | string, content: string, append = true) => {
    const conversation = conversations.value.find(c => c.id == conversationId)
    if (conversation && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        if (append) {
          lastMessage.content += content
        } else {
          lastMessage.content = content
        }
        conversation.updatedAt = Date.now()
      }
    }
  }

  return {
    conversations,
    currentConversationId,
    currentConversation,
    selectedGroupId,
    isLoading,
    fetchConversations,
    setSelectedGroupId,
    fetchConversationDetail,
    fetchMessages,
    createConversation,
    deleteConversation,
    switchConversation,
    updateTitle,
    switchModel,
    moveToProject,
    addMessage,
    updateLastMessage,
    updateModelParams,
  }
})
