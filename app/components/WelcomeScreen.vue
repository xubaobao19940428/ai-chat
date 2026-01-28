<template>
	<div class="flex-1 flex flex-col items-center min-h-full bg-transparent transition-colors overflow-y-auto custom-scrollbar">
		<!-- Main Content Container (Centered for Welcome) -->
		<div id="chat-home-view-container" class="w-full max-w-full sm:max-w-[768px] sm:min-w-[390px] mx-auto mt-[10vh] px-4">
			<!-- Header Title Area -->
			<div class="relative w-full flex flex-col items-center gap-[40px] mb-8">
				<h1 class="text-[var(--text-primary)] text-center font-serif text-[36px] sm:text-[42px] leading-tight tracking-tight">What can I do for you?</h1>
			</div>

			<!-- Interaction Area -->
			<div class="flex flex-col gap-1 w-full max-w-[720px] mx-auto">
				<div class="flex flex-col w-full group">
					<div class="relative bg-transparent">
						<!-- Input Card -->
						<div class="flex flex-col gap-3 rounded-[22px] relative bg-[var(--fill-input-chat)] py-3 w-full z-[2] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] border border-black/5 dark:border-[var(--border-main)] focus-within:border-black/10 focus-within:dark:border-[var(--border-dark)] transition-all duration-300">
							<!-- Text Area -->
							<div class="overflow-auto ps-4 pe-2 bg-transparent pt-[1px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-h-[50px] max-h-[216px]">
								<textarea v-model="inputMessage" placeholder="Assign a task or ask anything" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] leading-[24px] text-[var(--text-primary)] placeholder-[var(--text-disable)] font-medium resize-none custom-scrollbar" rows="1" @input="autoResize" @keydown.enter.exact.prevent="handleSendMessage" ref="textareaRef"></textarea>
							</div>

							<!-- Toolbar -->
							<div class="px-3">
								<div class="flex gap-2 items-center">
									<div class="flex gap-2 items-center flex-shrink-0">
										<!-- Plus Action -->
										<button class="rounded-full border border-[var(--border-main)] inline-flex items-center justify-center clickable cursor-pointer text-xs text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] w-8 h-8 p-0 transition-colors">
											<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M5 12h14"></path>
												<path d="M12 5v14"></path>
											</svg>
										</button>
										<!-- Browser Icon (Inline) -->
										<div class="flex items-center gap-[4px] px-[10px] h-8 cursor-pointer rounded-full border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors">
											<div class="flex items-center gap-[4px]">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-70">
													<circle cx="12" cy="12" r="10"></circle>
													<line x1="2" y1="12" x2="22" y2="12"></line>
													<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
												</svg>
												<span class="text-[12px] font-medium text-[var(--text-secondary)]">Web</span>
											</div>
										</div>
									</div>

									<div class="min-w-0 flex gap-2 ml-auto flex-shrink items-center">
										<div class="flex items-center gap-1.5 h-[32px]">
											<!-- Tools Icon -->
											<div class="flex items-center justify-center cursor-pointer hover:bg-[var(--fill-tsp-gray-main)] size-8 rounded-full transition-colors group/tool">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--icon-primary)] opacity-60 group-hover/tool:opacity-100">
													<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
												</svg>
											</div>
											<!-- Mic Icon -->
											<div class="flex items-center justify-center cursor-pointer hover:bg-[var(--fill-tsp-gray-main)] size-8 rounded-full transition-colors group/mic">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--icon-primary)] opacity-60 group-hover/mic:opacity-100">
													<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
													<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
													<line x1="12" x2="12" y1="19" y2="22"></line>
												</svg>
											</div>
										</div>
										<!-- Send Button -->
										<button @click="handleSendMessage" :disabled="!inputMessage.trim()" class="inline-flex items-center justify-center transition-all bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-full w-8 h-8 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-[var(--shadow-S)]">
											<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
												<path d="m5 12 7-7 7 7"></path>
												<path d="M12 19V5"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Connect Tools Card -->
						<div class="bg-[rgba(55,53,47,0.02)] dark:bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(240,239,237,0.5)] border-x border-b border-[var(--border-light)] rounded-b-[22px] pb-[10px] px-5 pt-[32px] -mt-[22px] transition-all clickable group/connect">
							<div class="flex items-center gap-2 cursor-pointer">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--icon-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60">
									<path d="m7 11 2-2-2-2"></path>
									<path d="M11 13 9 11l2-2"></path>
									<path d="m15 11-2 2 2 2"></path>
									<path d="m19 13-2-2 2-2"></path>
									<path d="M21 12H19"></path>
									<path d="M3 12h2"></path>
								</svg>
								<span class="text-[12px] font-medium text-[var(--text-tertiary)] flex-1 truncate group-hover/connect:text-[var(--text-secondary)] transition-colors">Connect your tools to increase efficiency</span>
								<div class="flex items-center gap-1.5 opacity-60">
									<div class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
									<span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-disable)]">Active</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Suggestions Grid -->
				<div class="w-full mt-10">
					<div class="w-full flex flex-col justify-center items-center gap-4">
						<div class="flex flex-wrap justify-center items-center gap-2">
							<button v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 4)" :key="suggestion.id" @click="applyPrompt(suggestion.prompt)" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-all hover:-translate-y-0.5 shadow-[var(--shadow-XS)]">
								<span class="text-[16px]">{{ suggestion.icon }}</span>
								<span class="text-[14px] text-[var(--text-primary)] font-medium">{{ suggestion.label }}</span>
							</button>
							<button class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 hover:bg-[var(--fill-tsp-white-light)] transition-all font-medium text-[var(--text-tertiary)] text-[14px]">More</button>
						</div>
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

.clickable {
	cursor: pointer;
	user-select: none;
}

textarea {
	&::placeholder {
		color: var(--text-disable);
	}
}
</style>
