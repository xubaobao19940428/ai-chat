<template>
    <div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-hidden relative transition-colors">
        <!-- Top Header Bar -->
        <header
            class="flex-shrink-0 flex items-center justify-between px-5 h-[52px] border-b border-[var(--border-light)] bg-[var(--bg-main)]/80 backdrop-blur-md z-20">
            <div class="flex items-center gap-2">
                <button @click="router.back()"
                    class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
                    <ArrowLeft :size="18" />
                </button>
            </div>
            <div class="flex items-center gap-2">
                <button @click="handleShare"
                    class="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
                    <Share2 :size="16" />
                </button>
                <button @click="handleStartChat"
                    class="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--text-primary)] text-[var(--bg-main)] dark:bg-[var(--text-white)] dark:text-[var(--bg-main)] rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                    <MessageSquare :size="14" />
                    建聊天
                </button>
            </div>
        </header>

        <!-- Loading -->
        <div v-if="isLoadingCharacter" class="flex-1 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-primary)]"></div>
        </div>

        <!-- Error -->
        <div v-else-if="!character" class="flex-1 flex flex-col items-center justify-center gap-4">
            <div class="text-[var(--text-tertiary)] text-base">未找到该角色</div>
            <button @click="router.back()"
                class="px-5 py-2 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-lg text-sm font-semibold">
                返回
            </button>
        </div>

        <!-- Content -->
        <div v-else class="flex-1 overflow-hidden flex flex-col md:flex-row">
            <!-- Sidebar: Character Info (Left) -->
            <aside
                class="w-full md:w-[320px] lg:w-[360px] md:h-full border-r border-[var(--border-light)] bg-[var(--bg-main)] flex-shrink-0 flex flex-col overflow-y-auto custom-scrollbar">
                <!-- Profile Header -->
                <div class="px-5 pt-8 pb-4">
                    <div class="flex flex-col items-center text-center gap-4 mb-6">
                        <!-- Avatar -->
                        <div
                            class="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-2xl overflow-hidden bg-[var(--bg-main)] flex-shrink-0 border border-[var(--border-light)] shadow-md">
                            <img v-if="character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-4xl">🤖</div>
                        </div>
                        <!-- Name & Provider -->
                        <div class="min-w-0">
                            <h1 class="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight mb-2">{{
                                character.name }}</h1>
                            <div
                                class="flex items-center justify-center gap-2 text-[var(--text-tertiary)] text-[11px] font-bold uppercase tracking-wider">
                                <span>{{ character.related_data?.provider || 'AI' }}</span>
                                <span class="size-1 rounded-full bg-[var(--text-disable)]"></span>
                                <span class="flex items-center gap-1.5">
                                    <Cpu :size="10" />
                                    {{ character.model_id || 'GPT-4o mini' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col gap-2.5 mb-8">
                        <button @click="handleStartChat"
                            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-main)] dark:bg-white dark:text-black text-sm font-bold hover:opacity-90 transition-all shadow-md">
                            <MessagesSquare :size="16" />
                            开始聊天
                        </button>
                        <button
                            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm font-bold hover:bg-[var(--border-light)] transition-all border border-[var(--border-light)]">
                            <UserPlus :size="16" />
                            作为助手
                        </button>
                    </div>

                    <!-- Tabs -->
                    <div
                        class="flex items-center gap-1 border-b border-[var(--border-light)] mb-4 sticky top-0 bg-[var(--bg-main)] z-10">
                        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                            class="relative flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold tracking-[0.05em] transition-colors"
                            :class="activeTab === tab.key
                                ? 'text-[var(--text-primary)]'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'">
                            <component :is="tab.icon" :size="14" />
                            <span>{{ tab.label }}</span>
                            <div v-if="activeTab === tab.key"
                                class="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--text-primary)] rounded-full">
                            </div>
                        </button>
                    </div>

                    <!-- Tab Content Sub-sections -->
                    <div class="min-h-[100px]">
                        <!-- 信息 Tab -->
                        <div v-if="activeTab === 'info'"
                            class="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <p class="text-[var(--text-secondary)] text-[13px] leading-relaxed font-medium"
                                    :class="{ 'line-clamp-6': !descExpanded }">
                                    {{ character.description || '暂无描述' }}
                                </p>
                                <button v-if="character.description && character.description.length > 200"
                                    @click="descExpanded = !descExpanded"
                                    class="text-[var(--text-blue)] text-xs mt-2 font-bold hover:underline">
                                    {{ descExpanded ? '收起' : '查看更多' }}
                                </button>
                            </div>
                        </div>

                        <!-- API Tab -->
                        <div v-if="activeTab === 'api'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div
                                class="p-3.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] font-mono text-[11px] text-[var(--text-secondary)] space-y-3">
                                <div>
                                    <div class="text-[var(--text-tertiary)] font-bold mb-1">ID</div>
                                    <div class="break-all">{{ character.id }}</div>
                                </div>
                                <div>
                                    <div class="text-[var(--text-tertiary)] font-bold mb-1">ENDPOINT</div>
                                    <div class="text-[var(--text-blue)]">POST /v1/chat</div>
                                </div>
                            </div>
                        </div>

                        <!-- Welcome Tab -->
                        <div v-if="activeTab === 'welcome'"
                            class="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div v-if="character.welcome"
                                class="p-4 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] text-[13px] leading-relaxed italic border border-[var(--border-light)]">
                                "{{ character.welcome }}"
                            </div>
                            <div v-else class="text-[var(--text-disable)] text-xs py-10 text-center">暂无欢迎语</div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main: Chat Section (Right) -->
            <main class="flex-1 flex flex-col h-full bg-[var(--bg-main)] relative overflow-hidden">
                <!-- Chat History -->
                <div class="flex-1 overflow-y-auto custom-scrollbar px-5 pb-32 pt-6" ref="scrollContainer">
                    <div class="max-w-[760px] mx-auto w-full">
                        <!-- Date Separator -->
                        <div class="flex items-center justify-center mb-8 relative">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-[var(--border-light)] opacity-30"></div>
                            </div>
                            <span
                                class="relative text-[10px] text-[var(--text-disable)] bg-[var(--bg-main)] px-3 font-bold tracking-[0.2em] uppercase">
                                {{ todayStr }}
                            </span>
                        </div>

                        <!-- Messages -->
                        <div class="space-y-8">
                            <div v-for="message in messages" :key="message.id" class="flex gap-4 group"
                                :class="message.role === 'user' ? 'flex-row-reverse' : ''">
                                <!-- Avatar -->
                                <div class="flex-shrink-0 mt-0.5">
                                    <div class="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden transition-all shadow-sm"
                                        :class="message.role === 'user' ? 'bg-[var(--text-primary)]' : 'bg-[var(--bg-main)] border border-[var(--border-light)]'">
                                        <img v-if="message.role === 'assistant' && character.avatar"
                                            :src="character.avatar" class="w-5 h-5 object-contain" />
                                        <UserIcon v-else-if="message.role === 'user'" :size="13"
                                            class="text-[var(--bg-main)] dark:text-[var(--text-primary)]" />
                                        <span v-else class="text-[10px]">🤖</span>
                                    </div>
                                </div>
                                <!-- Content -->
                                <div class="flex flex-col max-w-[85%] sm:max-w-[80%]"
                                    :class="message.role === 'user' ? 'items-end' : 'items-start'">
                                    <!-- User bubble -->
                                    <div v-if="message.role === 'user'"
                                        class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-4 py-2.5 rounded-[20px] text-[14px] font-medium leading-relaxed tracking-tight shadow-sm border border-[var(--border-light)]">
                                        <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
                                    </div>
                                    <!-- Assistant content -->
                                    <div v-else
                                        class="text-[var(--text-primary)] px-1 py-1 text-[14px] leading-relaxed tracking-tight break-words">
                                        <div v-if="!message.content && isStreaming" class="flex space-x-1 py-2">
                                            <div class="w-1.5 h-1.5 bg-[var(--text-disable)] rounded-full animate-bounce"
                                                style="animation-delay: 0s"></div>
                                            <div class="w-1.5 h-1.5 bg-[var(--text-disable)] rounded-full animate-bounce"
                                                style="animation-delay: 0.15s"></div>
                                            <div class="w-1.5 h-1.5 bg-[var(--text-disable)] rounded-full animate-bounce"
                                                style="animation-delay: 0.3s"></div>
                                        </div>
                                        <div v-else class="prose dark:prose-invert prose-neutral max-w-none break-words"
                                            v-html="renderMarkdown(message.content)"></div>
                                    </div>
                                    <!-- Meta -->
                                    <div
                                        class="mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[10px] text-[var(--text-disable)] font-bold uppercase tracking-tight">
                                        <span>{{ message.role === 'user' ? 'YOU' : (character.name || 'AI') }}</span>
                                        <span>· {{ formatTime(message.id) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Floating Input -->
                <div class="absolute bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
                    <div class="max-w-[760px] mx-auto pointer-events-auto">
                        <div
                            class="bg-[var(--bg-main)]/95 backdrop-blur-md rounded-[24px] shadow-2xl border border-[var(--border-light)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--text-disable)]/20 p-1.5">
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2">
                                    <textarea v-model="inputMessage" placeholder="与角色开始对话..."
                                        class="flex-1 bg-transparent border-none outline-none text-[14px] font-medium leading-relaxed px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none"
                                        rows="1" @keydown.enter.prevent="sendMessage" @input="autoResize"
                                        ref="inputArea"></textarea>
                                </div>
                                <div class="flex items-center justify-between px-2 pb-1">
                                    <div class="flex items-center gap-1">
                                        <button
                                            class="p-2 text-[var(--text-disable)] hover:text-[var(--text-primary)] rounded-full transition-colors">
                                            <Plus :size="18" />
                                        </button>
                                        <button
                                            class="p-2 text-[var(--text-disable)] hover:text-[var(--text-primary)] rounded-full transition-colors">
                                            <Globe :size="16" />
                                        </button>
                                    </div>
                                    <button @click="sendMessage" :disabled="!inputMessage.trim() || isStreaming"
                                        class="flex items-center justify-center w-7 h-7 bg-[var(--text-primary)] text-[var(--bg-main)] dark:bg-white dark:text-black rounded-full shadow-lg transition-transform active:scale-90 disabled:opacity-20">
                                        <ArrowUp v-if="!isStreaming" :size="14" :stroke-width="3" />
                                        <div v-else
                                            class="w-3.5 h-3.5 border-2 border-[var(--bg-main)]/30 border-t-[var(--bg-main)] rounded-full animate-spin">
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, markRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    ArrowLeft, ArrowUp, MessageSquare, MessagesSquare, Share2, Hash, Plus, Globe, Settings,
    User as UserIcon, UserPlus, Info, Code, Sparkles, Cpu,
    ThumbsUp, MessageCircle
} from 'lucide-vue-next'
import { getCharacterDetail, type Character } from '~/api/character'
import { fetchChatStream } from '~/utils/api'
import { renderMarkdown } from '~/utils/markdown'
import { useConversationStore } from '~/stores/conversation'
import { useUserStore } from '~/stores/user'

definePageMeta({ hideTopBar: true })

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const userStore = useUserStore()

// State
const character = ref<Character | null>(null)
const isLoadingCharacter = ref(true)
const inputMessage = ref('')
const isStreaming = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const inputArea = ref<HTMLTextAreaElement | null>(null)
const conversationId = ref<number | string | null>(null)
const activeTab = ref('info')
const descExpanded = ref(false)

const tabs = [
    { key: 'info', label: 'INFO', icon: markRaw(Info) },
    { key: 'welcome', label: 'WELCOME', icon: markRaw(ThumbsUp) },
    { key: 'api', label: 'API', icon: markRaw(Code) },
]

interface ChatMsg {
    id: string
    role: 'user' | 'assistant'
    content: string
}

const messages = ref<ChatMsg[]>([])
let messageCounter = 0
const genId = () => `msg_${++messageCounter}_${Date.now()}`

const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const formatTime = (id: string) => {
    const ts = parseInt(id.split('_')[2] || '0')
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const autoResize = () => {
    if (inputArea.value) {
        inputArea.value.style.height = 'auto'
        inputArea.value.style.height = inputArea.value.scrollHeight + 'px'
    }
}

const loadExistingMessages = async (convId: string | number) => {
    isLoadingCharacter.value = true
    try {
        await conversationStore.fetchMessages(convId)
        const conv = conversationStore.conversations.find(c => String(c.id) === String(convId))
        if (conv && conv.messages) {
            messages.value = conv.messages.map(m => ({
                id: String(m.id || genId()),
                role: m.role as 'user' | 'assistant',
                content: m.content
            }))
            conversationId.value = convId
        }
    } catch (e) {
        console.error('Failed to load existing messages:', e)
    } finally {
        isLoadingCharacter.value = false
    }
}

// Watch for conversation ID changes in URL
watch(() => route.query.conv, (newConvId) => {
    if (newConvId) {
        loadExistingMessages(String(newConvId))
    } else {
        // If conv cleared, reset to welcome message only
        messages.value = []
        conversationId.value = null
        if (character.value?.welcome) {
            messages.value.push({ id: genId(), role: 'assistant', content: character.value.welcome })
        }
    }
})

// Load character
onMounted(async () => {
    const id = Number(route.params.id)
    if (!id) { isLoadingCharacter.value = false; return }
    try {
        const res: any = await getCharacterDetail(id)
        character.value = res.data

        // Check if we should load an existing conversation
        if (route.query.conv) {
            await loadExistingMessages(String(route.query.conv))
        } else if (character.value?.welcome) {
            messages.value.push({ id: genId(), role: 'assistant', content: character.value.welcome })
        }
    } catch (error) {
        console.error('Failed to load character:', error)
    } finally {
        isLoadingCharacter.value = false
    }
})

const scrollToBottom = () => {
    nextTick(() => {
        if (scrollContainer.value) scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    })
}

const ensureConversation = async () => {
    if (conversationId.value) return conversationId.value
    if (!character.value) return null
    const id = await conversationStore.createConversation({ character_id: character.value.id })
    conversationId.value = id
    // Update URL to make it persistent
    router.replace({ query: { ...route.query, conv: id } })
    return id
}

const sendMessage = async () => {
    if (!inputMessage.value.trim() || isStreaming.value || !character.value) return
    const userMsg = inputMessage.value.trim()
    inputMessage.value = ''
    if (inputArea.value) inputArea.value.style.height = 'auto'

    messages.value.push({ id: genId(), role: 'user', content: userMsg })
    const assistantId = genId()
    messages.value.push({ id: assistantId, role: 'assistant', content: '' })
    scrollToBottom()
    isStreaming.value = true
    try {
        const convId = await ensureConversation()
        await fetchChatStream({
            message: userMsg,
            model: undefined,
            options: { context: { conversation_id: convId, character_id: character.value.id, max_history: 20 } },
            onMessage: (content) => {
                const msg = messages.value.find((m) => m.id === assistantId)
                if (msg) msg.content += content
                scrollToBottom()
            },
            onError: (error) => {
                console.error('Chat error:', error)
                const msg = messages.value.find((m) => m.id === assistantId)
                if (msg) msg.content = 'Sorry, an error occurred. Please try again.'
            },
            onFinish: () => { isStreaming.value = false },
        })
    } catch (error) {
        console.error('Send message error:', error)
        isStreaming.value = false
    }
}

const handleStartChat = async () => {
    if (!character.value) return
    const id = await conversationStore.createConversation({ character_id: character.value.id })
    router.push(`/character/${character.value.id}?conv=${id}`)
}

const handleShare = () => {
    if (navigator.share) {
        navigator.share({ title: character.value?.name, url: window.location.href })
    } else {
        navigator.clipboard.writeText(window.location.href)
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--text-disable);
    border-radius: 10px;
}

.prose {
    color: var(--text-primary);
    line-height: 1.65;
    font-size: 15px;
}

:deep(.prose) {
    @apply dark:text-[var(--text-primary)] leading-relaxed;
}
</style>
