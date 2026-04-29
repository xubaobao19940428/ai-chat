<template>
	<div class="flex h-full min-h-full flex-col overflow-hidden bg-[var(--background-gray-main)] transition-colors">
		<!-- 欢迎界面 -->
		<div class="flex-1 min-h-0 overflow-hidden">
			<WelcomeScreen mode="chat" :is-loading="chatStore.isLoading" @send-message="handleWelcomeSendMessage" />
		</div>
		<AppFooter />
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useConversationStore } from '../../stores/conversation'
import { useChatStore } from '../../stores/chat'
import { useModelStore } from '../../stores/models'
import { encodeId } from '../../utils/sqids'

const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const modelStore = useModelStore()

const handleWelcomeSendMessage = async (content: string, model: string, options?: any, capability?: string) => {
	console.log(content, model, options, capability)
	// 0. Set loading state immediately for instant feedback
	chatStore.setLoading(true)

	// 1. Create new conversation
	const conversationId = await conversationStore.createConversation({
		model: model,
		model_id: modelStore.selectedModel?.id,
		group_id: conversationStore.selectedGroupId || 0,
		params: options,
		capability: capability || 'chat',
	})

	// 2. Add user message to store for immediate visibility on next page
	conversationStore.addMessage(conversationId, {
		role: 'user',
		content: content,
	})

	// 3. Set pending message so [id].vue knows to trigger sendMessage on mount
	chatStore.setPendingMessage(content)

	// 4. Navigate to the new conversation page
	router.push(`/chat/${encodeId(conversationId)}`)
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
