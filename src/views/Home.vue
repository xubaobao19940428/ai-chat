<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
        <div class="max-w-4xl w-full text-center">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                AI 聚合聊天
            </h1>
            <p class="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 px-4">
                与多个 AI 模型进行智能对话 - GPT-4、Claude、Gemini 等
            </p>
    
            <!-- AI 模型卡片 -->
            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 px-2">
                <div v-for="model in featuredModels" :key="model.id" class="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div class="text-3xl sm:text-4xl mb-2">{{ model.icon }}</div>
                    <div class="font-semibold text-gray-900 text-sm sm:text-base">{{ model.name }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ model.provider }}</div>
                </div>
            </div>
    
            <button @click="handleStartChat" class="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-base sm:text-lg shadow-lg hover:shadow-xl">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            开始聊天
          </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '@/store/conversation'
import { AI_MODELS } from '@/config/models'

const router = useRouter()
const conversationStore = useConversationStore()

const featuredModels = AI_MODELS.slice(0, 4)

const handleStartChat = () => {
    if (conversationStore.conversations.length > 0) {
        const firstConversation = conversationStore.conversations[0]
        if (firstConversation) {
            router.push(`/chat/${firstConversation.id}`)
            return
        }
    }
    const conversation = conversationStore.createConversation()
    router.push(`/chat/${conversation.id}`)
}

onMounted(() => {
    // 如果已经有会话，直接跳转
    if (conversationStore.conversations.length > 0) {
        const firstConversation = conversationStore.conversations[0]
        if (firstConversation) {
            router.push(`/chat/${firstConversation.id}`)
        }
    }
})
</script>

<style scoped lang="scss">

</style>

