<template>
	<div class="flex-1 flex flex-col items-center justify-center min-h-full bg-transparent transition-colors overflow-y-auto custom-scrollbar pb-[20vh]">
		<!-- Main Content Container -->
		<div class="w-full max-w-[720px] px-6">
			<!-- Header Title Area (Minimalist or Hidden like Manus) -->
			<div class="flex flex-col items-center gap-6 mb-10 opacity-0 animate-fade-in-up" style="animation-delay: 0.1s; animation-fill-mode: forwards;">
                <!-- Optional: Manus Logo or Welcome Text if desired, currently sticking to minimal pill focus -->
				<h1 class="text-[var(--text-primary)] text-center font-semibold text-[32px] tracking-tight">How can I help you today?</h1>
			</div>

			<!-- Interaction Area -->
			<div class="flex flex-col gap-4 w-full opacity-0 animate-fade-in-up" style="animation-delay: 0.2s; animation-fill-mode: forwards;">
				<div class="relative group">
					<!-- Input Pill -->
					<div class="flex flex-col rounded-[32px] bg-[var(--bg-main)] shadow-[var(--shadow-pill)] border border-[var(--border-light)] transition-all duration-300 focus-within:shadow-[var(--shadow-card)] focus-within:border-[var(--text-disable)] relative overflow-hidden">
						<!-- Text Area -->
						<div class="w-full px-6 pt-5 pb-2">
							<textarea 
                                v-model="inputMessage" 
                                placeholder="Ask anything..." 
                                class="w-full bg-transparent border-none focus:ring-0 p-0 text-[18px] leading-[28px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] font-medium resize-none custom-scrollbar" 
                                rows="1" 
                                @input="autoResize" 
                                @keydown.enter.exact.prevent="handleSendMessage" 
                                ref="textareaRef"
                            ></textarea>
						</div>

						<!-- Toolbar -->
						<div class="px-4 pb-3 pt-1 flex items-center justify-between">
							<div class="flex items-center gap-2">
                                <!-- Attach -->
								<button class="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M5 12h14"></path>
										<path d="M12 5v14"></path>
									</svg>
								</button>
                                <!-- Web Search -->
                                <button class="flex items-center gap-2 px-3 py-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                    <span class="text-xs font-medium">Search</span>
                                </button>
							</div>

							<div class="flex items-center gap-2">
                                <!-- Send Button -->
								<button 
                                    @click="handleSendMessage" 
                                    :disabled="!inputMessage.trim()" 
                                    class="flex items-center justify-center w-10 h-10 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full shadow-md hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all"
                                >
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
										<path d="m5 12 7-7 7 7"></path>
										<path d="M12 19V5"></path>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Suggestions -->
				<div class="w-full mt-8 opacity-0 animate-fade-in-up" style="animation-delay: 0.3s; animation-fill-mode: forwards;">
					<div class="flex flex-wrap justify-center gap-3">
						<button v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 4)" :key="suggestion.id" @click="applyPrompt(suggestion.prompt)" class="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] rounded-full border border-[var(--border-light)] transition-all shadow-sm hover:translate-y-[-2px]">
							<span class="text-base">{{ suggestion.icon }}</span>
							<span class="text-sm text-[var(--text-secondary)] font-medium">{{ suggestion.label }}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversation'
import { PROMPT_SUGGESTIONS } from '../utils/prompts'

const router = useRouter()
const conversationStore = useConversationStore()
const inputMessage = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const handleSendMessage = async () => {
	if (!inputMessage.value.trim()) return
	try {
		const id = await conversationStore.createConversation({
			character_id: 1,
			group_id: 0,
		})
		await conversationStore.addMessage(id, {
			role: 'user',
			content: inputMessage.value,
		})
		router.push(`/chat/${id}`)
	} catch (e) {
		console.error('Failed to start chat:', e)
	}
}

const applyPrompt = (prompt: string) => {
	inputMessage.value = prompt
	nextTick(() => {
		autoResize()
		textareaRef.value?.focus()
	})
}

const autoResize = () => {
	if (textareaRef.value) {
		textareaRef.value.style.height = 'auto'
		textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
	}
}
</script>

<style scoped lang="scss">
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
}

.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: rgba(156, 163, 175, 0.1) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.1);
		border-radius: 10px;
	}
}
</style>
