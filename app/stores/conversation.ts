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

      // 合并逻辑：如果后端返回了列表，以后端为准，但保留已有消息
      // 如果后端返回空，则保留本地已有列表（防止后端异常导致列表清空）
      if (list.length > 0) {
        console.log('[Store] Fetched conversations from API:', list.length)
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
        console.log('[Store] Updated local store, now persistenting to IndexedDB...')
        saveLocalConversations(newConversations)
      } else if (conversations.value.length > 0) {
        console.log('[Store] Server returned no conversations, keeping current cache')
      }
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
    // 1. 先尝试从本地加载，提供即时反馈
    const localMsgs = await getLocalMessages(conversationId)
    const targetConv = conversations.value.find(c => c.id == conversationId)
    
    // 如果 store 中还没消息，先用本地的占位
    if (localMsgs && localMsgs.length > 0 && targetConv && targetConv.messages.length === 0) {
      console.log('Using local messages for initial render:', conversationId)
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

        // 合并策略：以后端返回为基础，补充本地存在但后端尚未同步的消息
        // 启发式匹配：如果内容和时间接近，视为同一条消息
        const mergedMessages = [...remoteMessages]
        
        if (localMsgs && localMsgs.length > 0) {
          localMsgs.forEach(l => {
            const isSynced = remoteMessages.some((r: Message) => 
              (r.id === l.id) || 
              (r.content === l.content && Math.abs(r.timestamp - l.timestamp) < 10000)
            )
            if (!isSynced) {
              console.log('[Store] Found local message not in server response, preserving:', l.content.substring(0, 20))
              mergedMessages.push(l)
            }
          })
        }

        // 按时间排序
        mergedMessages.sort((a, b) => a.timestamp - b.timestamp)
        
        conversation.messages = mergedMessages
        saveLocalMessages(conversationId, mergedMessages)
        console.log(`[Store] Messages reconciled. Total: ${mergedMessages.length} (Remote: ${remoteMessages.length})`)
      }
    } catch (error) {
      console.error('Fetch messages failed:', error)
      // 出错时，我们已经有了 localMsgs（如果存在的话），所以不需要额外处理
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
    // Cleanup local storage
    deleteLocalMessages(id)
  }

  // 切换会话
  const switchConversation = async (id: number | string) => {
    console.log('[Store] switchConversation called for id:', id)
    currentConversationId.value = id

    // 1. 获取详情（优先从本地或接口同步最新元数据）
    const conversation = await fetchConversationDetail(id)
    
    if (conversation) {
      console.log('[Store] Target conversation for group sync:', conversation.id, 'groupId:', conversation.groupId)
      // 2. 确认分组：如果当前选中的分组不是会话所在的分组，自动切换并刷新列表
      if (conversation.groupId !== selectedGroupId.value) {
        console.log('[Store] Group mismatch. Auto-syncing selectedGroupId to:', conversation.groupId)
        // 注意：这里不要递归调用 switchConversation，只同步分组
        selectedGroupId.value = conversation.groupId
        await fetchConversations()
      }
    }

    // 3. 异步触发消息同步（合并逻辑在 fetchMessages 内部）
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
        // Sync to local storage for persistent流式渲染
        saveLocalMessages(conversationId, conversation.messages)
      }
    }
  }

  // Initial load from local storage
  const initFromLocalStorage = async () => {
    console.log('[Store] initFromLocalStorage started')
    const cachedList = await getLocalConversations()
    console.log('[Store] Cached list from storage:', cachedList ? cachedList.length : 'none')
    if (cachedList && cachedList.length > 0) {
      if (conversations.value.length === 0) {
        console.log('[Store] Initializing store with cached conversations')
        conversations.value = cachedList
      } else {
        console.log('[Store] Store already has data, skipping hydration')
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
    initFromLocalStorage,
  }
})
