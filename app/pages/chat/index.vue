<template>
    <div class="flex-1 flex flex-col overflow-hidden bg-[#fcfbfb] dark:bg-[#000000] transition-colors">
        <!-- 欢迎界面 -->
        <div class="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 sm:pb-6">
            <WelcomeScreen mode="chat" :is-loading="chatStore.isLoading" @send-message="handleWelcomeSendMessage" />
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()

const handleWelcomeSendMessage = async (content: string, model: string) => {
    // 创建新会话
    const conversation = conversationStore.createConversation(model)
    // 添加用户消息
    conversationStore.addMessage(conversation.id, {
        role: 'user',
        content: content,
    })

    // 跳转到会话页面
    await router.push(`/chat/${conversation.id}`)

    // 触发发送逻辑 (由 [id].vue 处理，或在此处处理)
    // 这里我们在此处只负责跳转，实际的数据发送逻辑应由 [id].vue 的 onMounted 或 watch 处理，
    // 或者我们可以直接调用 store action 来发送，但这通常涉及到 UI 状态 (isLoading 等)。
    // 更好的做法是：在 createConversation 后，跳转过去。
    // 但是这里需要传递 "刚刚发送的消息触发了 API 调用" 的意图。
    // 简单做法：在此处调用 API，store 会更新状态，跳转后 [id].vue 会渲染 store 中的消息。
    // 唯一的问题是 isLoading 状态的同步。

    // 为了简单起见，我们在此处调用发送逻辑，与 ChatView.vue 保持一致
    chatStore.setLoading(true, conversation.id)
    try {
        const messages = conversation.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
        }))

        // 我们需要引入 api
        // 注意：这里需要 import sendChatMessage
        const { sendChatMessage } = await import('~/utils/api') // Dynamic import to avoid top-level if needed, or static

        const response = await sendChatMessage(messages, conversation.model)

        conversationStore.addMessage(conversation.id, {
            role: 'assistant',
            content: response.message || '抱歉，我无法理解您的问题。',
        })
    } catch (error) {
        console.error('发送消息失败:', error)
        conversationStore.addMessage(conversation.id, {
            role: 'assistant',
            content: '抱歉，发生了错误，请稍后再试。',
        })
    } finally {
        chatStore.setLoading(false)
    }
}

onMounted(() => {
    // 如果有历史会话，跳转到第一个 (类似于 Home.vue 的逻辑)
    // 但是，如果用户显式访问 /chat (比如点击 "New Chat" -> /chat)，则不应该跳转。
    // 我们需要区分 "进入应用默认跳转" 和 "点击新建会话"。
    // "New Chat" 按钮通常做 router.push('/chat')。
    // 如果我们在这里 redirect，那 "New Chat" 就无法工作了（会跳回旧会话）。
    // 所以，ChatView.vue 的逻辑是：
    // if (conversationId) ...
    // else if (conversations.length > 0) ...
    // 这意味着在 Legacy 中，访问 /chat 会自动跳到最近的会话，除非... 实际上 Legacy 的 New Chat 是怎么做的？
    // Sidebar.vue: handleNewChat -> conversationStore.createConversation() -> router.push('/chat/:id').
    // 所以 New Chat 是创建 ID 此时跳转。
    // 只有访问 Home (/) 会跳转。
    // 所以 /chat 应该是 "New Chat" / "Empty State"。
    // 所以这里不需要自动跳转到第一个会话。
    // 除非是根路径跳转过来的。
    // 让我们保持简单：/chat 显示 WelcomeScreen。
})
</script>
