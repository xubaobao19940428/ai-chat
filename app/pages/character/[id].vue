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
        <div v-else class="flex-1 overflow-y-auto custom-scrollbar pt-4" ref="scrollContainer">
            <div class="max-w-[840px] mx-auto w-full">

                <!-- Profile Header -->
                <div class="px-6 pt-6 pb-4">
                    <div class="flex items-start gap-4 mb-4">
                        <!-- Avatar -->
                        <div
                            class="w-[64px] h-[64px] rounded-full overflow-hidden bg-[var(--bg-main)] flex-shrink-0 border border-[var(--border-light)] shadow-sm">
                            <img v-if="character.avatar" :src="character.avatar" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-3xl">🤖</div>
                        </div>
                        <!-- Name & Provider -->
                        <div class="flex-1 min-w-0 pt-1">
                            <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight mb-1.5">{{
                                character.name }}</h1>
                            <div class="text-[var(--text-tertiary)] text-xs font-medium">
                                提供方 <span class="mx-0.5 text-[var(--text-disable)]">·</span>
                                <span class="text-[var(--text-secondary)]">{{ character.related_data?.provider || 'AI'
                                    }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="flex items-center gap-1 border-b border-[var(--border-light)] mb-2">
                        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                            class="relative flex flex-col items-center gap-1 px-4 py-3 text-xs transition-colors"
                            :class="activeTab === tab.key
                                ? 'text-[var(--text-primary)] font-semibold'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'">
                            <component :is="tab.icon" :size="16" />
                            <span>{{ tab.label }}</span>
                            <div v-if="activeTab === tab.key"
                                class="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--text-primary)] rounded-full translate-y-[1px]">
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div class="px-6 min-h-[120px]">
                    <!-- 信息 Tab -->
                    <div v-if="activeTab === 'info'" class="py-4 space-y-4">
                        <!-- Description -->
                        <div>
                            <p class="text-[var(--text-secondary)] text-[15px] leading-[1.75] font-medium tracking-tight"
                                :class="{ 'line-clamp-4': !descExpanded }">
                                {{ character.description || '暂无描述' }}
                            </p>
                            <button v-if="character.description && character.description.length > 150"
                                @click="descExpanded = !descExpanded"
                                class="text-[var(--text-blue)] text-xs mt-2 font-semibold hover:underline">
                                {{ descExpanded ? '收起' : '展开全文' }}
                            </button>
                        </div>

                        <!-- Model Info -->
                        <div class="flex items-center text-[11px] text-[var(--text-disable)] gap-1.5 py-1">
                            <Cpu :size="12" />
                            <span>基于 {{ character.model_id || 'GPT-4o mini' }} 深度定制 · 智能对话能力支持</span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-3 pt-2">
                            <button @click="handleStartChat"
                                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm font-semibold hover:opacity-80 transition-all border border-[var(--border-light)] shadow-sm">
                                <MessagesSquare :size="16" />
                                全屏聊天
                            </button>
                            <button
                                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-main)] text-[var(--text-primary)] text-sm font-semibold hover:bg-[var(--bg-hover)] transition-all border border-[var(--border-light)] shadow-sm">
                                <UserPlus :size="16" />
                                作为助手
                            </button>
                        </div>
                    </div>

                    <!-- API Tab -->
                    <div v-if="activeTab === 'api'" class="py-4">
                        <div
                            class="p-4 rounded-xl bg-[var(--background-gray-main)] text-[13px] font-mono text-[var(--text-secondary)] overflow-x-auto leading-relaxed border border-[var(--border-light)] shadow-inner">
                            <div
                                class="text-[var(--text-tertiary)] text-[11px] mb-2 font-sans font-bold uppercase tracking-wider">
                                Character ID</div>
                            <div>{{ character.id }}</div>
                            <div
                                class="text-[var(--text-tertiary)] text-[11px] mt-4 mb-2 font-sans font-bold uppercase tracking-wider">
                                Endpoint Sample</div>
                            <div class="text-[var(--text-blue)]">POST /v1/chat/completions</div>
                            <div class="text-[var(--text-disable)]">"context": { "character_id": {{ character.id }} }
                            </div>
                        </div>
                    </div>

                    <!-- Welcome Tab -->
                    <div v-if="activeTab === 'welcome'" class="py-4">
                        <div v-if="character.welcome"
                            class="p-5 rounded-2xl bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] text-[15px] leading-[1.7] font-medium border border-[var(--border-light)] shadow-sm">
                            <div
                                class="text-[var(--text-tertiary)] text-[11px] mb-3 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles :size="12" /> FIRST MESSAGE
                            </div>
                            {{ character.welcome }}
                        </div>
                        <div v-else class="text-[var(--text-disable)] text-sm py-12 text-center font-medium italic">
                            暂无欢迎语</div>
                    </div>
                </div>

                <!-- Chat Section -->
                <div class="mt-8 border-t border-[var(--border-light)] mx-6"></div>
                <div class="px-6 pt-8">
                    <!-- Date Separator -->
                    <div class="flex items-center justify-center mb-10 relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-[var(--border-light)]/50"></div>
                        </div>
                        <span
                            class="relative text-[11px] text-[var(--text-disable)] bg-[var(--bg-main)] px-4 font-bold tracking-widest uppercase">{{
                                todayStr }}</span>
                    </div>

                    <!-- Messages -->
                    <div class="space-y-10 pb-48">
                        <div v-for="message in messages" :key="message.id" class="flex gap-4 group"
                            :class="message.role === 'user' ? 'flex-row-reverse' : ''">
                            <!-- Avatar -->
                            <div class="flex-shrink-0 mt-1">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-all shadow-sm"
                                    :class="message.role === 'user'
                                        ? 'bg-[var(--text-primary)]'
                                        : 'bg-[var(--bg-main)] border border-[var(--border-light)]'">
                                    <img v-if="message.role === 'assistant' && character.avatar" :src="character.avatar"
                                        class="w-5 h-5 object-contain" />
                                    <UserIcon v-else-if="message.role === 'user'" :size="15"
                                        class="text-[var(--bg-main)] dark:text-[var(--text-primary)]" />
                                    <span v-else class="text-xs">🤖</span>
                                </div>
                            </div>
                            <!-- Content -->
                            <div class="flex flex-col max-w-[85%] sm:max-w-[80%]"
                                :class="message.role === 'user' ? 'items-end' : 'items-start'">
                                <!-- User bubble -->
                                <div v-if="message.role === 'user'"
                                    class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-5 py-3 rounded-[24px] text-[15px] font-medium leading-[1.65] tracking-tight shadow-sm border border-[var(--border-light)]">
                                    <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
                                </div>
                                <!-- Assistant content -->
                                <div v-else
                                    class="text-[var(--text-primary)] px-1 py-1 text-[15px] leading-[1.65] tracking-tight break-words font-normal">
                                    <div v-if="!message.content && isStreaming" class="flex space-x-1.5 py-2">
                                        <div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce"
                                            style="animation-delay: 0s"></div>
                                        <div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce"
                                            style="animation-delay: 0.15s"></div>
                                        <div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce"
                                            style="animation-delay: 0.3s"></div>
                                    </div>
                                    <div v-else class="prose dark:prose-invert prose-neutral max-w-none break-words"
                                        v-html="renderMarkdown(message.content)"></div>
                                </div>
                                <!-- Meta Info (Hover like chat page) -->
                                <div
                                    class="mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[11px] text-[var(--text-disable)] font-bold uppercase tracking-tight">
                                    <span>{{ message.role === 'user' ? 'YOU' : (character.name || 'AI') }}</span>
                                    <span>· {{ formatTime(message.id) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Floating Input Pill (Align with chat page) -->
        <div v-if="character" class="absolute bottom-8 left-0 right-0 z-50 pointer-events-none px-4">
            <div class="max-w-[840px] mx-auto pointer-events-auto">
                <div
                    class="bg-[var(--bg-main)] rounded-[26px] shadow-[var(--shadow-pill)] border border-[var(--border-light)] transition-all duration-300 focus-within:shadow-lg focus-within:border-[var(--text-disable)] p-2">
                    <div class="flex flex-col">
                        <!-- Input row -->
                        <div class="flex items-center gap-2">
                            <textarea v-model="inputMessage" placeholder="Ask me anything..."
                                class="flex-1 bg-transparent border-none outline-none text-[15px] font-medium leading-relaxed px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none"
                                rows="1" @keydown.enter.prevent="sendMessage" @input="autoResize"
                                ref="inputArea"></textarea>
                        </div>
                        <!-- Bottom tools row -->
                        <div class="flex items-center justify-between px-2 pb-1">
                            <div class="flex items-center gap-1">
                                <button
                                    class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
                                    <Plus :size="20" />
                                </button>
                                <button
                                    class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
                                    <Globe :size="18" />
                                </button>
                                <button
                                    class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors">
                                    <Settings :size="18" />
                                </button>
                            </div>
                            <button @click="sendMessage" :disabled="!inputMessage.trim() || isStreaming"
                                class="flex items-center justify-center w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-main)] dark:bg-white dark:text-black rounded-full transition-transform active:scale-90 disabled:opacity-20 flex-shrink-0">
                                <ArrowUp v-if="!isStreaming" :size="16" :stroke-width="2.5" />
                                <div v-else
                                    class="w-4 h-4 border-2 border-[var(--bg-main)]/30 border-t-[var(--bg-main)] rounded-full animate-spin">
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
