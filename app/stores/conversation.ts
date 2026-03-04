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
import { 
  saveLocalMessages, 
  getLocalMessages, 
  saveLocalConversations, 
  getLocalConversations,
  deleteLocalMessages
} from '~/utils/storage'

// Debounced save for streaming — avoids IndexedDB storm
let _saveTimer: ReturnType<typeof setTimeout> | null = null
const debouncedSaveMessages = (conversationId: number | string, messages: Message[]) => {
  if (_saveTimer) clearTimeout(_saveTimer)
  _saveTimer = setTimeout(() => {
    saveLocalMessages(conversationId, messages)
    _saveTimer = null
  }, 500)
}

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

      if (list.length > 0) {
        const newConversations = list.map((item: any) => {
          const existing = conversations.value.find(c => c.id == item.id)
          return {
            id: String(item.id),
            title: item.title,
            messages: existing?.messages || [],
            model: item.model || '',
            params: item.meta?.params || item.params || {},
            groupId: item.group_id,
            characterId: item.character_id,
            updatedAt: item.updated_at * 1000
          }
        })
        conversations.value = newConversations
        saveLocalConversations(newConversations)
      }
    } catch (error) {
      console.error('Fetch conversations failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 切换分组过滤
  const setSelectedGroupId = async (id: number | null) => {
    selectedGroupId.value = id
    await fetchConversations()
  }

  // 获取消息列表并同步到 store
  const fetchMessages = async (conversationId: number | string) => {
    // 1. 先尝试从本地加载，提供即时反馈
    const localMsgs = await getLocalMessages(conversationId)
    const targetConv = conversations.value.find(c => c.id == conversationId)
    
    if (localMsgs && localMsgs.length > 0 && targetConv && targetConv.messages.length === 0) {
      targetConv.messages = localMsgs
    }

    isLoading.value = true
    try {
      const res: any = await getConversationMessages(Number(conversationId))
      const conversation = conversations.value.find(c => c.id == conversationId)
      
      if (conversation) {
        const rawMessages = Array.isArray(res.data) ? res.data : (res.data?.list || [])
        const remoteMessages = rawMessages.map((m: any) => ({
          id: String(m.id),
          role: m.role,
          content: m.content,
          timestamp: m.created_at * 1000
        }))

        // 合并策略：以后端返回为基础，补充本地尚未同步的消息
        const mergedMessages = [...remoteMessages]
        
        if (localMsgs && localMsgs.length > 0) {
          localMsgs.forEach(l => {
            const isSynced = remoteMessages.some((r: Message) => 
              (r.id === l.id) || 
              (r.content === l.content && Math.abs(r.timestamp - l.timestamp) < 10000)
            )
            if (!isSynced) {
              mergedMessages.push(l)
            }
          })
        }

        mergedMessages.sort((a, b) => a.timestamp - b.timestamp)
        conversation.messages = mergedMessages
        saveLocalMessages(conversationId, mergedMessages)
      }
    } catch (error) {
      console.error('Fetch messages failed:', error)
    } finally {
      isLoading.value = false
    }
  }


  // 创建新会话 — 乐观更新，不再阻塞等 fetchConversations
  const createConversation = async (params: { character_id: number, group_id?: number, model?: string, model_id?: number }) => {
    try {
      const res: any = await apiCreateConversation({
        character_id: params.character_id,
        group_id: params.group_id || 0,
        model_id: params.model_id || 1
      })
      
      const newId = res.data.conversation_id

      // Optimistic: insert the new conversation locally
      const newConv: Conversation = {
        id: String(newId),
        title: 'New conversation',
        messages: [],
        model: params.model || '',
        params: {},
        groupId: params.group_id || 0,
        characterId: params.character_id,
        updatedAt: Date.now(),
      }
      conversations.value.unshift(newConv)
      currentConversationId.value = newId

      // Background sync — don't block the caller
      fetchConversations().catch(() => {})

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
    // Cleanup local storage
    deleteLocalMessages(id)
  }

  // 切换会话
  const switchConversation = async (id: number | string) => {
    currentConversationId.value = id

    const conversation = await fetchConversationDetail(id)
    
    if (conversation) {
      if (conversation.groupId !== selectedGroupId.value) {
        selectedGroupId.value = conversation.groupId
        await fetchConversations()
      }
    }

    fetchMessages(id)
    return conversation
  }

  // 更新会话标题
  const updateTitle = async (id: number | string, title: string) => {
    try {
      await apiUpdateConversation({ id: Number(id), title })
      const conversation = conversations.value.find(c => c.id == id)
      if (conversation) {
        conversation.title = title
        conversation.updatedAt = Date.now()
        // Sync list to local storage
        saveLocalConversations(conversations.value)
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
      // Sync to local storage
      saveLocalMessages(conversationId, conversation.messages)
    }
  }

  // 仅更新消息内容（极速模式，不更新 updatedAt，不触发本地保存）
  // 用于流式渲染的节流过程中过程
  const updateLastMessageContent = (conversationId: number | string, content: string, append = true) => {
    const conversation = conversations.value.find(c => c.id == conversationId)
    if (conversation && conversation.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        if (append) {
          lastMessage.content += content
        } else {
          lastMessage.content = content
        }
      }
    }
  }

  // 更新最后一条消息内容（用于流式渲染，更新 updatedAt 并触发防抖保存）
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
        // Debounced save — avoid writing to IndexedDB on every stream chunk
        debouncedSaveMessages(conversationId, conversation.messages)
      }
    }
  }

  // Initial load from local storage
  const initFromLocalStorage = async () => {
    const cachedList = await getLocalConversations()
    if (cachedList && cachedList.length > 0 && conversations.value.length === 0) {
      conversations.value = cachedList
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
    updateLastMessageContent,
    updateModelParams,
    initFromLocalStorage,
  }
})
