<template>
    <TransitionRoot appear :show="uiStore.showSearchModal" as="template">
        <Dialog as="div" @close="uiStore.closeSearchModal" class="relative z-50">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-start justify-center p-4 text-center pt-[120px]">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-[640px] transform overflow-hidden rounded-[16px] bg-[var(--background-white-main)] border border-[var(--border-main)] text-left align-middle shadow-[var(--shadow-XL)] transition-all flex flex-col">

                            <!-- Search Header -->
                            <div class="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-light)]">
                                <Search :size="20" class="text-[var(--text-tertiary)]" />
                                <input type="text" v-model="searchQuery" placeholder="Search tasks..."
                                    class="flex-1 bg-transparent border-none outline-none text-[15px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                                    autofocus />
                                <button @click="uiStore.closeSearchModal"
                                    class="p-1 rounded-md hover:bg-[var(--fill-tsp-gray-main)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                                    <X :size="20" />
                                </button>
                            </div>

                            <!-- Content -->
                            <div class="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">

                                <!-- New Task Shortcut -->
                                <button @click="handleNewTask"
                                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] transition-colors mb-4 group text-left">
                                    <div
                                        class="w-8 h-8 rounded-[8px] bg-[#1a1a1a] flex items-center justify-center text-white">
                                        <Plus :size="20" />
                                    </div>
                                    <span class="text-[14px] font-medium text-[var(--text-primary)]">New task</span>
                                </button>

                                <!-- No Results -->
                                <div v-if="Object.keys(groupedResults).length === 0" class="py-12 text-center">
                                    <p class="text-[14px] text-[var(--text-tertiary)]">No conversations found</p>
                                </div>

                                <!-- History Lists -->
                                <div v-else class="space-y-4 px-1 pb-2">
                                    <div v-for="(items, category) in groupedResults" :key="category">
                                        <div
                                            class="text-[12px] font-medium text-[var(--text-tertiary)] mb-2 px-2 capitalize">
                                            {{ category }}</div>
                                        <div class="space-y-0.5">
                                            <button v-for="item in items" :key="item.id"
                                                @click="handleConversationClick(item.id)"
                                                class="w-full flex items-start gap-3 px-3 py-2 rounded-[12px] hover:bg-[var(--fill-tsp-gray-main)] text-left group">
                                                <div
                                                    class="mt-1 w-5 h-5 flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">
                                                    <div
                                                        class="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                                        <span class="text-[10px] text-white font-bold">{{ (item.title &&
                                                            item.title.length > 0) ? item.title[0].toUpperCase() : 'M'
                                                            }}</span>
                                                    </div>
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div class="flex items-center justify-between">
                                                        <span
                                                            class="text-[14px] text-[var(--text-primary)] font-medium truncate">{{
                                                            item.title || 'Empty Chat' }}</span>
                                                        <span class="text-[12px] text-[var(--text-tertiary)]">{{
                                                            formatTime(item.updatedAt) }}</span>
                                                    </div>
                                                    <p v-if="item.lastMessage"
                                                        class="text-[13px] text-[var(--text-tertiary)] truncate">{{
                                                        item.lastMessage }}</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useUIStore } from '../stores/ui'
import { useConversationStore } from '../stores/conversation'
import { Search, X, Plus } from 'lucide-vue-next'

const uiStore = useUIStore()
const conversationStore = useConversationStore()
const searchQuery = ref('')

const groupedResults = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    const filtered = conversationStore.conversations.filter(c =>
        (c.title || '').toLowerCase().includes(query)
    ).sort((a, b) => b.updatedAt - a.updatedAt)

    const groups: Record<string, any[]> = {}
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterday = today - 86400000
    const last7Days = today - 86400000 * 7

    filtered.forEach(c => {
        let category = 'Older'
        if (c.updatedAt >= today) category = 'Today'
        else if (c.updatedAt >= yesterday) category = 'Yesterday'
        else if (c.updatedAt >= last7Days) category = 'Last 7 days'

        const group = groups[category] || []
        group.push(c)
        groups[category] = group
    })

    return groups
})

const formatTime = (timestamp: number) => {
    const d = new Date(timestamp)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()

    if (isToday) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    } else {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
        if (diff < 7) return days[d.getDay()]
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
}

const handleConversationClick = (id: number | string) => {
    conversationStore.switchConversation(id)
    uiStore.closeSearchModal()
}

const handleNewTask = async () => {
    const id = await conversationStore.createConversation({ character_id: 0 })
    uiStore.closeSearchModal()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: var(--border-main);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
</style>
