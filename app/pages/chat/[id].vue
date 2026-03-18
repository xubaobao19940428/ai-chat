<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] transition-colors relative overflow-hidden"
		@dragenter.prevent="onDragEnter" @dragover.prevent @dragleave="onDragLeave" @drop.prevent="onDrop">
		<!-- Drag Overlay -->
		<Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0"
			enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100" leave-to-class="opacity-0">
			<div v-if="isDraggingOver && supportsFileUpload"
				class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[var(--bg-main)]/90 backdrop-blur-sm border-2 border-dashed border-[var(--brand-primary)] rounded-none pointer-events-none">
				<div class="w-16 h-16 rounded-2xl bg-[var(--brand-primary)]/10 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
						class="text-[var(--brand-primary)]">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="17 8 12 3 7 8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
				</div>
				<p class="text-[15px] font-semibold text-[var(--brand-primary)]">{{ $t('chat.drag_drop_title') }}</p>
				<p class="text-[13px] text-[var(--text-tertiary)]">{{ $t('chat.drag_drop_subtitle') }}</p>
			</div>
		</Transition>
		<!-- <header
			class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-light)] transition-all">
			<div class="flex items-center gap-3">
				<div v-if="currentCharacter" class="flex items-center gap-2 pr-2 border-r border-[var(--border-light)]">
					<img :src="currentCharacter.icon || currentCharacter.avatar"
						class="w-6 h-6 rounded-full object-cover" />
					<span class="text-[14px] font-bold text-[var(--text-primary)]">{{ currentCharacter.name }}</span>
				</div>
				<Tooltip text="Switch Model">
					<ModelSelector position="top" />
				</Tooltip>
			</div>
			<div class="flex items-center gap-2">
				
			</div>
		</header> -->

		<!-- Main Chat Area -->
		<div class="flex-1 overflow-y-auto px-4 pb-48 pt-6 custom-scrollbar relative z-10" ref="messagesContainer"
			@scroll="onMessagesScroll">
			<div class="max-w-[1100px] mx-auto py-6">
				<!-- Initial Loading State -->
				<div v-if="conversationStore.isLoading && (!currentConversation?.messages || currentConversation.messages.length === 0)"
					class="flex flex-col items-center justify-center py-20 space-y-4">
					<div
						class="w-10 h-10 border-4 border-[var(--border-light)] border-t-[var(--text-primary)] rounded-full animate-spin">
					</div>
					<p class="text-[var(--text-tertiary)] text-sm font-medium animate-pulse">Loading messages...</p>
				</div>

				<!-- Image Generation Mode: Prompt left, Images right -->
				<div v-if="isImageModel" class="space-y-6">
					<div v-for="group in imageGenerationGroups" :key="group.userMsg.id" class="flex gap-4 items-start">
						<!-- Left: Prompt Card -->
						<div class="w-[260px] shrink-0">
							<div
								class="bg-[var(--background-gray-subtle,#f4f4f5)] dark:bg-[var(--background-gray-subtle)] rounded-2xl px-4 py-4 text-[13.5px] text-[var(--text-primary)] leading-relaxed tracking-tight whitespace-pre-wrap break-words flex flex-col gap-3 min-h-[90px]">
								<span>{{ group.userMsg.content }}</span>
								<div class="flex justify-end mt-auto">
									<span class="text-[12px] text-[var(--text-tertiary)] flex items-center gap-1">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
											stroke="currentColor" stroke-width="2" class="opacity-60">
											<rect x="2" y="3" width="20" height="14" rx="2" />
											<path d="M8 21h8M12 17v4" />
										</svg>
										{{ getModelDisplayName(currentConversation?.model, currentConversation?.modelId)
										}}
									</span>
								</div>
							</div>
						</div>

						<!-- Right: Images or Loading -->
						<div class="flex-1 min-w-0 flex flex-col gap-2">
							<!-- Loading state -->
							<div v-if="group.isLoading">
								<div class="grid gap-1"
									:class="Number(currentConversation?.params?.num_outputs || 1) === 4 ? 'grid-cols-2' : Number(currentConversation?.params?.num_outputs || 1) >= 3 ? 'grid-cols-3' : Number(currentConversation?.params?.num_outputs || 1) === 2 ? 'grid-cols-2' : 'grid-cols-1'">
									<div v-for="n in Number(currentConversation?.params?.num_outputs || 1)" :key="n"
										class="rounded-xl bg-[var(--background-gray-subtle,#f4f4f5)] overflow-hidden flex items-center justify-center"
										style="aspect-ratio: 1 / 1">
										<div class="flex flex-col items-center gap-2">
											<div
												class="w-5 h-5 border-2 border-[var(--border-light)] border-t-[var(--text-secondary)] rounded-full animate-spin">
											</div>
											<p class="text-[11px] text-[var(--text-tertiary)]">Generating...</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Images grid -->
							<div v-else-if="group.images.length > 0">
								<div class="grid gap-1"
									:class="group.images.length === 4 ? 'grid-cols-2' : group.images.length === 3 ? 'grid-cols-3' : group.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'">
									<div v-for="(url, idx) in group.images" :key="idx"
										class="relative rounded-xl overflow-hidden group/img bg-[var(--background-gray-subtle,#f4f4f5)]"
										:class="group.images.length === 1 ? 'max-w-[420px]' : ''"
										style="aspect-ratio: 1 / 1">
										<img :src="url" class="w-full h-full object-cover block cursor-zoom-in"
											@click="previewImage = url" />


										<!-- Hover overlay: zoom + download -->
										<div
											class="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-end justify-end p-2 gap-1.5 opacity-0 group-hover/img:opacity-100">
											<button @click.stop="previewImage = url"
												class="flex items-center justify-center w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors">
												<Expand :size="13" />
											</button>
											<a :href="url" :download="`image-${idx + 1}.jpg`" target="_blank"
												@click.stop
												class="flex items-center justify-center w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors">
												<Download :size="13" />
											</a>
										</div>
									</div>
								</div>

								<!-- Action bar — right aligned -->
								<div
									class="flex items-center justify-end gap-0.5 mt-1.5 text-[12px] text-[var(--text-tertiary)]">
									<button @click="regenerateFromGroup(group)" :disabled="chatStore.isLoading"
										class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-40">
										<RefreshCw :size="12" />
										Retry
									</button>
									<button @click="reuseGroupPrompt(group)"
										class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
										<ArrowUp :size="12" />
										Reuse parameters
									</button>
									<button @click="downloadAllImages(group.images)"
										class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
										<Download :size="12" />
										Download all
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Video Generation Mode: Card layout -->
				<div v-else-if="isVideoModel" class="space-y-6">
					<div v-for="group in videoGenerationGroups" :key="group.userMsg.id"
						class="bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl overflow-hidden shadow-sm w-full max-w-[640px] mx-auto">
						<!-- Card Header -->
						<div
							class="flex items-start justify-between px-4 pt-4 pb-3 border-b border-[var(--border-light)]">
							<div class="flex-1 min-w-0 pr-4">
								<p
									class="text-[13.5px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap break-words">
									{{ group.userMsg.content }}</p>
							</div>
							<div class="flex items-center gap-2 shrink-0 text-[12px] text-[var(--text-tertiary)]">
								<img :src="getModelIcon(currentConversation?.model, currentConversation?.modelId)"
									class="w-5 h-5 rounded object-contain" />
								<span class="font-medium">{{ getModelDisplayName(currentConversation?.model,
									currentConversation?.modelId) }}</span>
							</div>
						</div>

						<!-- Card Body: Video or Loading -->
						<div class="bg-black">
							<!-- Loading state -->
							<div v-if="group.isLoading" class="flex flex-col items-center justify-center gap-3 py-14">
								<div class="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin">
								</div>
								<p class="text-[12px] text-white/60">Generating video...</p>
							</div>
							<!-- Video player -->
							<video v-else-if="group.videoUrl" :src="group.videoUrl" controls playsinline
								class="w-full max-h-[480px] object-contain"></video>
							<!-- Error / empty state -->
							<div v-else class="flex items-center justify-center py-16 text-white/40 text-[13px]">
								Video generation failed
							</div>
						</div>

						<!-- Card Footer: Actions -->
						<div v-if="!group.isLoading"
							class="flex items-center gap-0 px-2 py-2 border-t border-[var(--border-light)] overflow-x-auto no-scrollbar">
							<button @click="regenerateFromGroup(group)" :disabled="chatStore.isLoading"
								class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-40 text-[12px] whitespace-nowrap">
								<RefreshCw :size="12" />
								Retry
							</button>
							<button @click="reuseGroupPrompt(group)"
								class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[12px] whitespace-nowrap">
								<ArrowUp :size="12" />
								Reuse parameters
							</button>
							<button v-if="group.videoUrl" @click="copyMessage(group.userMsg.content)"
								class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[12px] whitespace-nowrap">
								<Copy :size="12" />
								Copy prompt
							</button>
							<a v-if="group.videoUrl" :href="group.videoUrl" download="video.mp4" target="_blank"
								class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[12px] whitespace-nowrap">
								<Download :size="12" />
								Download
							</a>
						</div>
					</div>
				</div>

				<!-- Chat Mode: standard message list -->
				<component v-else :is="isMountedInitial ? 'TransitionGroup' : 'div'" name="message-list"
					class="space-y-10">
					<div v-for="message in visibleMessages" :key="message.id" class="flex gap-4 group"
						:class="message.role === 'user' ? 'flex-row-reverse' : ''" @click="handleMessageClick">
						<!-- Avatar -->
						<div class="flex-shrink-0 mt-1">
							<div
								class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-[var(--bg-main)] border border-[var(--border-light)] shadow-sm">
								<img :src="message.role === 'user' ? userStore.userInfo?.avatar || '/logo.png' : getModelIcon(message.model || currentConversation?.model, currentConversation?.modelId)"
									class="w-full h-full object-cover p-0.5" :alt="message.role" />
							</div>
						</div>

						<!-- Message Content -->
						<div class="flex flex-col relative"
							:class="message.role === 'user' ? 'items-end max-w-[85%] sm:max-w-[80%]' : 'items-start w-full min-w-0'">
							<!-- User Message -->
							<div v-if="message.role === 'user'" class="w-full flex justify-end">
								<!-- Edit Mode -->
								<div v-if="editingMessageId === message.id"
									class="w-[500px] max-w-full bg-[var(--bg-chat-bubble-user)] rounded-[24px] border border-[var(--border-light)] p-2 shadow-sm animate-in fade-in duration-200">
									<div ref="editContentRef" contenteditable="true"
										@input="editingContent = ($event.target as HTMLElement).textContent || ''"
										@keydown.enter.exact.prevent="submitEdit" @keydown.escape="cancelEditing"
										class="w-full bg-transparent outline-none text-[15px] font-medium leading-relaxed px-3 py-1 min-h-[32px] max-h-48 overflow-y-auto custom-scrollbar whitespace-pre-wrap break-words">
									</div>
									<div class="flex justify-end gap-2 mt-1">
										<button @click="cancelEditing"
											class="px-3 py-1 text-xs font-semibold rounded-full hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-secondary)]">Cancel</button>
										<button @click="submitEdit"
											class="px-4 py-1.5 text-xs font-semibold bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full hover:opacity-90 transition-opacity">Send</button>
									</div>
								</div>
								<!-- View Mode -->
								<div v-else class="relative group/bubble">
									<div
										class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-5 py-3 rounded-[24px] text-[15px] font-medium leading-relaxed tracking-tight shadow-sm border border-[var(--border-light)]">
										<div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
									</div>

									<!-- Action bar (Hover only) -->
									<div
										class="absolute -top-10 right-0 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity bg-[var(--bg-main)]/80 backdrop-blur-sm border border-[var(--border-light)] rounded-lg p-1 shadow-sm">
										<button @click="copyMessage(message.content)"
											class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
											:title="$t('chat.copy')">
											<Copy :size="14" />
										</button>
										<button @click="startEditing(message)"
											class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
											:title="$t('common.edit')">
											<Pencil :size="14" />
										</button>
									</div>
								</div>
							</div>

							<!-- Bot Message -->
							<div v-else
								class="text-[var(--text-primary)] px-1 py-1 text-[15px] leading-relaxed tracking-tight break-words font-normal">
								<div v-if="!message.content && chatStore.isLoading && chatStore.loadingConversationId === currentConversationId && currentConversation?.messages[currentConversation.messages.length - 1]?.id === message.id"
									class="py-2">
									<div class="flex space-x-1.5">
										<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"
											style="animation-delay: 0s"></div>
										<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"
											style="animation-delay: 0.15s"></div>
										<div class="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"
											style="animation-delay: 0.3s"></div>
									</div>
								</div>
								<div v-else class="relative inline-block w-full">
									<MarkdownContent :content="message.content" />
									<span
										v-if="chatStore.isLoading && chatStore.loadingConversationId === currentConversationId && currentConversation?.messages[currentConversation.messages.length - 1]?.id === message.id"
										class="inline-block w-1.5 h-4 bg-[var(--text-primary)] dark:bg-white ml-1 animate-pulse align-middle"></span>
								</div>

								<!-- Assistant Action Bar -->
								<div class="mt-3 flex items-center gap-0.5">
									<!-- Copy -->
									<button @click.stop="copyMessage(message.content)"
										class="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
										:title="$t('chat.copy')">
										<Copy :size="15" />
									</button>
									<!-- Share -->
									<button @click.stop="shareMessage(message.content)"
										class="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
										:title="$t('chat.share')">
										<Share2 :size="15" />
									</button>
									<!-- Regenerate (only show on last assistant message) -->
									<button
										v-if="currentConversation?.messages[currentConversation.messages.length - 1]?.id === message.id"
										@click.stop="regenerateMessage()" :disabled="chatStore.isLoading"
										class="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors disabled:opacity-40"
										:title="$t('chat.regenerate')">
										<RefreshCw :size="15" :class="chatStore.isLoading ? 'animate-spin' : ''" />
									</button>
								</div>
							</div>

							<!-- Time/Meta (Hidden by default, shown on hover) -->
							<div
								class="mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[11px] text-[var(--text-tertiary)] font-medium">
								<span>{{ message.role === 'user' ? 'You' : getModelDisplayName(message.model ||
									currentConversation?.model, currentConversation?.modelId) }}</span>
								<ClientOnly>
									<span>· {{ formatMessageTime(message.timestamp) }}</span>
								</ClientOnly>
							</div>
						</div>
					</div>
				</component>

				<!-- Send Failed Retry Banner -->
				<div v-if="failedMessageContent"
					class="flex items-center gap-3 mt-4 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-[13px]">
					<span class="text-red-500 flex-1">{{ $t('chat.send_failed') }}</span>
					<button @click="retryMessage"
						class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-colors">
						<RefreshCw :size="13" />
						{{ $t('chat.retry') }}
					</button>
					<button @click="failedMessageContent = null"
						class="p-1 text-red-400 hover:text-red-500 transition-colors">
						<X :size="13" />
					</button>
				</div>
				<!-- Follow-up Questions -->
				<div v-if="followUpLoading || followUpQuestions.length > 0"
					class="mt-4 ml-12 flex flex-col gap-2 max-w-[600px]">
					<template v-if="followUpLoading">
						<div v-for="i in 3" :key="i"
							class="h-[46px] rounded-2xl bg-[var(--background-gray-subtle)] animate-pulse" />
					</template>
					<button v-else v-for="(q, i) in followUpQuestions" :key="i" @click="fillFollowUpQuestion(q)"
						class="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] text-[14px] text-[var(--text-primary)] text-left transition-colors group/fq">
						<span>{{ q }}</span>
						<span
							class="text-[var(--text-tertiary)] group-hover/fq:text-[var(--text-secondary)] shrink-0 transition-colors">→</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Scroll to Bottom Button -->
		<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-2"
			enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
			<button v-if="isUserScrolledUp" @click="scrollToBottom(false, true)"
				class="absolute bottom-36 right-8 z-40 size-9 flex items-center justify-center rounded-full bg-[var(--bg-main)] border border-[var(--border-light)] shadow-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:shadow-xl transition-all">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
					stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 5v14" />
					<path d="m19 12-7 7-7-7" />
				</svg>
			</button>
		</Transition>

		<!-- Floating Input Pill -->
		<div class="absolute bottom-8 left-0 right-0 z-50 px-4 pointer-events-none">
			<div class="max-w-[840px] mx-auto relative pointer-events-auto">
				<!-- Input Container -->
				<div
					class="flex flex-col gap-6 rounded-[22px] relative bg-[var(--fill-input-chat)] py-3 w-full shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] border border-black/5 dark:border-[var(--border-main)] focus-within:border-black/10 transition-all duration-300">
					<!-- Uploaded Files Preview — above editor -->
					<div v-if="uploadedFiles.length > 0" class="flex flex-wrap gap-2 px-3 pt-2 pb-1">
						<div v-for="file in uploadedFiles" :key="file.id" class="relative group/file shrink-0">
							<!-- Image file -->
							<div v-if="file.type?.startsWith('image/')"
								class="relative w-16 h-16 rounded-xl overflow-hidden border border-[var(--border-light)] shadow-sm bg-[var(--bg-hover)]">
								<img :src="file.localUrl || file.url" class="w-full h-full object-cover" />
								<div v-if="file.uploading"
									class="absolute inset-0 bg-black/40 flex items-center justify-center">
									<Loader2 :size="18" class="animate-spin text-white" />
								</div>
							</div>
							<!-- Non-image file -->
							<div v-else
								class="relative flex items-center gap-2 h-12 px-3 rounded-xl border border-[var(--border-light)] shadow-sm bg-[var(--bg-hover)] max-w-[180px]">
								<div
									class="shrink-0 w-7 h-7 rounded-lg bg-[var(--fill-tsp-gray-main)] flex items-center justify-center text-[var(--text-secondary)]">
									<Loader2 v-if="file.uploading" :size="14" class="animate-spin" />
									<FileText v-else :size="14" />
								</div>
								<span class="text-[12px] font-medium text-[var(--text-primary)] truncate">{{ file.name
								}}</span>
							</div>
							<!-- Delete button (only when upload is done) -->
							<button v-if="!file.uploading" @click="removeFile(file.id)"
								class="absolute -top-1.5 -right-1.5 size-5 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/file:opacity-100 transition-opacity z-10">
								<X :size="10" stroke-width="3" />
							</button>
						</div>
					</div>

					<div
						class="overflow-auto ps-4 pe-2 bg-transparent pt-[1px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full placeholder:text-[var(--text-disable)] text-[15px] leading-[24px] min-h-[50px] max-h-[216px]">
						<editor-content :editor="editor" class="w-full" />
					</div>

					<input type="file" ref="fileInputRef" class="hidden" multiple @change="handleFileUpload" />
					<div class="flex items-center justify-between px-3 gap-2">
						<div class="flex items-center gap-2 flex-wrap flex-1">
							<!-- Model Selector -->
							<ModelSelector variant="pill" :capability="selectorCapability" />

							<!-- Media Parameters Integrated -->
							<template v-if="isImageModel || isVideoModel">
								<!-- Integrated Image/Video Prompt Buttons -->
								<div class="group/chip relative" v-if="supportsMediaPrompt">
									<button @click="toggleDropdown('media_prompt')"
										class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
										:class="activeDropdownField === 'media_prompt' ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : uploadedMediaFiles.length > 0 ? 'border-[var(--border-main)]' : ''"
										:disabled="isUploading">
										<Loader2 v-if="isUploading" :size="14"
											class="animate-spin text-[var(--text-secondary)]" />
										<template v-else-if="uploadedMediaFiles.length > 0">
											<div class="relative shrink-0">
												<img :src="uploadedMediaFiles[0]?.url"
													class="w-4 h-4 rounded-sm object-cover" />
												<div v-if="uploadedMediaFiles.length > 1"
													class="absolute -top-1.5 -right-1.5 min-w-[12px] h-[12px] bg-[var(--text-primary)] rounded-full text-[7px] text-[var(--bg-main)] flex items-center justify-center font-bold px-0.5 leading-none">
													{{ uploadedMediaFiles.length }}
												</div>
											</div>
										</template>
										<ImagePlus v-else :size="14" class="text-[var(--text-secondary)]" />
										<span class="text-[12px] font-medium text-[var(--text-primary)]">
											{{ uploadedMediaFiles.length > 0 ? `${uploadedMediaFiles.length}
											${isVideoModel ? 'frame' :
													'prompt image'}${uploadedMediaFiles.length > 1 ? 's' : ''}` : isVideoModel ?
												(modelInputFields.end_image ? 'Start / End frame' : 'Start frame') : `Image
											prompt` }}
										</span>
									</button>

									<!-- Media Prompt Popover -->
									<Transition enter-active-class="transition duration-150 ease-out"
										enter-from-class="translate-y-1 opacity-0 scale-95"
										enter-to-class="translate-y-0 opacity-100 scale-100"
										leave-active-class="transition duration-100 ease-in"
										leave-from-class="translate-y-0 opacity-100"
										leave-to-class="translate-y-1 opacity-0">
										<div v-if="activeDropdownField === 'media_prompt'"
											class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[280px]">
											<div class="rounded-2xl bg-[var(--bg-main)] border border-[var(--border-light)] p-4 shadow-xl flex flex-col gap-4"
												style="background-color: var(--bg-main)">
												<p
													class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
													{{ isVideoModel ? (modelInputFields.end_image ? `Upload a start
													frame and / or end
													frame to anchor your video` : `Start frame anchors the opening of
													your video.`) :
														`Image prompts apply style and content to your generation.` }}
													Upload or select from assets.
												</p>
												<div class="flex flex-col gap-2">
													<button @click="triggerFileUploadAndClose"
														class="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-full py-2.5 text-[13px] font-bold transition-colors">
														<Plus :size="14" stroke-width="3" />
														Upload
													</button>
													<button @click="selectAssetAndClose"
														class="w-full flex items-center justify-center gap-2 bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full py-2.5 text-[13px] font-bold transition-colors border border-[var(--border-main)] shadow-sm"
														style="background-color: var(--bg-main)">
														<ImagePlus :size="14" />
														Select asset
													</button>
												</div>
											</div>
										</div>
									</Transition>
								</div>

								<!-- Dynamic Select Fields -->
								<div v-for="field in dynamicSelectFields" :key="field.key" class="relative group/chip">
									<template v-if="field.key === 'aspect_ratio'">
										<button @click="toggleDropdown(field.key)"
											class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
											:class="activeDropdownField === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : ''">
											<span class="flex items-center justify-center">
												<div v-if="String(currentConversation?.params?.[field.key] || field.default).startsWith('16:') || String(currentConversation?.params?.[field.key] || field.default).startsWith('21:') || String(currentConversation?.params?.[field.key] || field.default).startsWith('3:2')"
													class="w-3.5 h-2 border-[1.5px] border-current rounded-[1px]"></div>
												<div v-else-if="String(currentConversation?.params?.[field.key] || field.default).startsWith('1:')"
													class="w-3 h-3 border-[1.5px] border-current rounded-[1px]"></div>
												<div v-else
													class="w-2 h-3.5 border-[1.5px] border-current rounded-[1px]"></div>
											</span>
											<span class="text-[12px] font-medium text-[var(--text-primary)]">{{
												currentConversation?.params?.[field.key] || field.default }}</span>
										</button>
										<Transition enter-active-class="transition duration-150 ease-out"
											enter-from-class="translate-y-1 opacity-0 scale-95"
											enter-to-class="translate-y-0 opacity-100 scale-100"
											leave-active-class="transition duration-100 ease-in"
											leave-from-class="translate-y-0 opacity-100"
											leave-to-class="translate-y-1 opacity-0">
											<div v-if="activeDropdownField === field.key"
												class="absolute bottom-full left-0 mb-2 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl shadow-xl p-4 z-[60] flex gap-5 items-center min-w-[max-content]"
												style="background-color: var(--bg-main)">
												<div class="flex flex-col gap-2.5">
													<span
														class="text-[var(--text-tertiary)] px-1 font-bold text-[10px] uppercase tracking-widest text-center">Aspect
														Ratio</span>
													<div class="flex gap-1.5 min-w-[max-content]">
														<button v-for="opt in field.options" :key="opt"
															@click="setParamAndClose(field.key, opt)"
															class="flex flex-col items-center justify-center gap-2 w-16 h-16 rounded-xl transition-all border"
															:class="(currentConversation?.params?.[field.key] || field.default) === opt ? 'bg-[var(--fill-tsp-gray-main)] border-[var(--text-primary)]/20 shadow-sm' : 'bg-transparent border-transparent hover:bg-[var(--bg-hover)] hover:border-[var(--border-main)]'">
															<div v-if="String(opt).startsWith('16:') || String(opt).startsWith('21:') || String(opt).startsWith('3:2')"
																class="w-6 h-3.5 border-[1.8px] border-[var(--text-primary)] rounded-[2px] opacity-80">
															</div>
															<div v-else-if="String(opt).startsWith('9:16') || String(opt).startsWith('3:4') || String(opt).startsWith('4:5')"
																class="w-3.5 h-6 border-[1.8px] border-[var(--text-primary)] rounded-[2px] opacity-80">
															</div>
															<div v-else
																class="w-5 h-5 border-[1.8px] border-[var(--text-primary)] rounded-[2px] opacity-80">
															</div>
															<span
																class="text-[10px] font-bold text-[var(--text-primary)]">{{
																	opt }}</span>
														</button>
													</div>
												</div>
												<div
													class="relative flex items-center justify-center w-[120px] h-[120px] bg-transparent shrink-0">
													<div class="relative bg-[var(--fill-tsp-gray-main)] rounded-lg border border-[var(--border-main)] transition-all duration-300 flex items-center justify-center overflow-hidden shadow-inner"
														:style="getPreviewStyle(currentConversation?.params?.[field.key] || field.default)">
														<div
															class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
															<div v-for="i in 9" :key="i"
																class="border-[0.5px] border-[var(--text-primary)]">
															</div>
														</div>
													</div>
												</div>
											</div>
										</Transition>
									</template>

									<!-- Style Transfer -->
									<template v-else-if="field.key === 'style'">
										<button @click="toggleDropdown(field.key)"
											class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
											:class="activeDropdownField === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : ''">
											<Palette :size="14" class="text-[var(--text-secondary)]" />
											<span class="text-[12px] font-medium text-[var(--text-primary)]">
												{{ currentConversation?.params?.[field.key] === 'No Style' ||
													!currentConversation?.params?.[field.key] ? 'Style' :
													currentConversation?.params?.[field.key] }}
											</span>
										</button>
										<Transition enter-active-class="transition duration-150 ease-out"
											enter-from-class="translate-y-1 opacity-0"
											enter-to-class="translate-y-0 opacity-100"
											leave-active-class="transition duration-100 ease-in"
											leave-from-class="translate-y-0 opacity-100"
											leave-to-class="translate-y-1 opacity-0">
											<div v-if="activeDropdownField === field.key"
												class="absolute bottom-full left-0 mb-2 w-44 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl shadow-xl p-1.5 z-[60] max-h-56 overflow-y-auto custom-scrollbar"
												style="background-color: var(--bg-main)">
												<button v-for="s in field.options" :key="s"
													@click="setParamAndClose(field.key, s)"
													class="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left">
													<span class="text-[12px] font-medium"
														:class="currentConversation?.params?.[field.key] === s ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{
															s }}</span>
												</button>
											</div>
										</Transition>
									</template>

									<!-- Generic Tools (Quality, Duration, etc.) -->
									<template v-else>
										<button @click="toggleDropdown(field.key)"
											class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
											:class="activeDropdownField === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : ''">
											<Gem v-if="field.key === 'resolution'" :size="14"
												class="text-[var(--text-secondary)]" />
											<Clock v-else-if="field.key === 'duration'" :size="14"
												class="text-[var(--text-secondary)]" />
											<LayoutGrid v-else :size="14" class="text-[var(--text-secondary)]" />
											<span class="text-[12px] font-medium text-[var(--text-primary)] mb-[-2px]">
												<span v-if="field.key !== 'resolution' && field.key !== 'duration'"
													class="uppercase font-bold text-[9px] tracking-wider opacity-60 mr-1">{{
														field.key.substring(0, 3) }}:</span>
												{{ currentConversation?.params?.[field.key] || field.default }}{{
													field.key === 'duration' ? 's' : '' }}
											</span>
										</button>
										<Transition enter-active-class="transition duration-150 ease-out"
											enter-from-class="translate-y-1 opacity-0 scale-95"
											enter-to-class="translate-y-0 opacity-100 scale-100"
											leave-active-class="transition duration-100 ease-in"
											leave-from-class="translate-y-0 opacity-100"
											leave-to-class="translate-y-1 opacity-0">
											<div v-if="activeDropdownField === field.key"
												class="absolute bottom-full left-0 mb-2 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl shadow-xl p-3.5 z-[60] min-w-[170px]"
												style="background-color: var(--bg-main)">
												<p
													class="text-[10px] font-bold text-[var(--text-tertiary)] mb-2.5 px-1 uppercase tracking-widest text-center">
													{{ field.label || field.key.replace(/_/g, ' ') }}</p>
												<div
													class="flex flex-col gap-1 max-h-[220px] overflow-y-auto custom-scrollbar">
													<button v-for="opt in field.options" :key="opt"
														@click="setParamAndClose(field.key, opt)"
														class="w-full flex items-center justify-between gap-4 py-2.5 px-3 rounded-xl group transition-all"
														:class="(currentConversation?.params?.[field.key] || field.default) === opt ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-sm' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'">
														<span class="text-[13px] font-bold">{{ opt }}{{ field.key ===
															'duration' ? 's' : '' }}</span>
														<div class="flex items-center justify-center">
															<div v-if="(currentConversation?.params?.[field.key] || field.default) === opt"
																class="w-4 h-4 rounded-full bg-black dark:bg-white flex items-center justify-center"
																style="background-color: var(--text-primary)">
																<Check :size="10" class="text-[var(--bg-main)]"
																	stroke-width="4" />
															</div>
															<div v-else
																class="w-4 h-4 rounded-full border-[2px] border-black/20 dark:border-white/20">
															</div>
														</div>
													</button>
												</div>
											</div>
										</Transition>
									</template>
								</div>

								<!-- Dynamic Number Fields (Outputs) -->
								<div v-for="field in dynamicNumberFields" :key="field.key" class="relative group/chip">
									<button @click="toggleDropdown(field.key)"
										class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
										:class="activeDropdownField === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : ''">
										<Monitor :size="14" class="text-[var(--text-secondary)]" />
										<span class="text-[12px] font-medium text-[var(--text-primary)]">{{
											currentConversation?.params?.[field.key] || field.default }} Outputs</span>
									</button>
									<Transition enter-active-class="transition duration-150 ease-out"
										enter-from-class="translate-y-1 opacity-0"
										enter-to-class="translate-y-0 opacity-100"
										leave-active-class="transition duration-100 ease-in"
										leave-from-class="translate-y-0 opacity-100"
										leave-to-class="translate-y-1 opacity-0">
										<div v-if="activeDropdownField === field.key"
											class="absolute bottom-full left-0 mb-2 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl shadow-xl p-3 z-[60] min-w-[180px]"
											style="background-color: var(--bg-main)">
											<p
												class="text-[11px] font-bold text-[var(--text-tertiary)] mb-2 px-1 uppercase tracking-widest text-center">
												{{ field.label || 'Outputs' }}</p>
											<div class="flex flex-wrap gap-1.5 justify-center">
												<button v-for="n in field.max - field.min + 1" :key="n"
													@click="setParamAndClose(field.key, n + field.min - 1)"
													class="size-9 rounded-xl font-bold flex items-center justify-center transition-all border text-[13px]"
													:class="(currentConversation?.params?.[field.key] || field.default) === n + field.min - 1 ? 'bg-[var(--text-primary)] text-[var(--bg-main)] border-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-primary)]'">
													{{ n + field.min - 1 }}
												</button>
											</div>
										</div>
									</Transition>
								</div>
							</template>

							<div class="h-4 w-px bg-[var(--border-light)]/50 mx-1 self-center"
								v-if="supportsFileUpload || supportsWebSearch"></div>

							<!-- Bottom Left Tools -->
							<!-- Attach Button -->
							<Tooltip v-if="supportsFileUpload" text="Add Attachment">
								<button @click="triggerFileUpload" :disabled="isUploading"
									class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors">
									<Plus :size="20" />
								</button>
							</Tooltip>

							<!-- Web Search -->
							<Popover v-if="supportsWebSearch" class="relative" v-slot="{ open }">
								<Tooltip text="Web Search">
									<PopoverButton
										class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors relative"
										:class="{ 'text-[var(--text-primary)] bg-[var(--bg-hover)]': open || isWebSearchEnabled }">
										<Globe :size="18" />
										<div v-if="isWebSearchEnabled"
											class="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--text-primary)] rounded-full border border-[var(--bg-main)]">
										</div>
									</PopoverButton>
								</Tooltip>
								<Transition enter-active-class="transition duration-150 ease-out"
									enter-from-class="translate-y-1.5 opacity-0 scale-[0.98]"
									enter-to-class="translate-y-0 opacity-100 scale-100"
									leave-active-class="transition duration-100 ease-in"
									leave-from-class="translate-y-0 opacity-100"
									leave-to-class="translate-y-1.5 opacity-0">
									<PopoverPanel
										class="absolute bottom-full left-0 mb-3 z-50 w-[300px] max-w-[calc(100vw-2rem)] bg-[var(--bg-main)] rounded-2xl shadow-lg border border-[var(--border-light)] p-4 cursor-default">
										<div class="text-[14px] font-semibold text-[var(--text-primary)] mb-3">Web
											Search</div>
										<div class="h-[1px] bg-[var(--border-light)] -mx-4 mb-3"></div>
										<div class="flex items-start justify-between">
											<div class="pr-4">
												<div class="text-[13px] font-medium text-[var(--text-primary)]">Enable
													Web Search
												</div>
												<div
													class="text-[12px] text-[var(--text-tertiary)] leading-relaxed mt-0.5">
													Enable
													web search and real-time information access.</div>
											</div>
											<Switch v-model="isWebSearchEnabled"
												:class="isWebSearchEnabled ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'"
												class="relative inline-flex h-5 w-[36px] shrink-0 items-center rounded-full transition-colors focus:outline-none mt-1">
												<span
													:class="isWebSearchEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'"
													class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm" />
											</Switch>
										</div>
									</PopoverPanel>
								</Transition>
							</Popover>

							<!-- Parameters Settings (Hidden for Media Models) -->
							<Popover v-if="!isImageModel && !isVideoModel" class="relative" v-slot="{ open }">
								<Tooltip text="Model Parameters">
									<PopoverButton
										class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
										:class="{ 'text-[var(--text-primary)] bg-[var(--bg-hover)]': open }">
										<Settings :size="18" />
									</PopoverButton>
								</Tooltip>
								<Transition enter-active-class="transition duration-150 ease-out"
									enter-from-class="translate-y-1.5 opacity-0 scale-[0.98]"
									enter-to-class="translate-y-0 opacity-100 scale-100"
									leave-active-class="transition duration-100 ease-in"
									leave-from-class="translate-y-0 opacity-100"
									leave-to-class="translate-y-1.5 opacity-0">
									<PopoverPanel
										class="absolute bottom-full left-0 mb-3 z-50 w-[300px] max-w-[calc(100vw-2rem)] bg-[var(--bg-main)] rounded-2xl shadow-lg border border-[var(--border-light)]">
										<!-- Header -->
										<div
											class="px-4 pt-3.5 pb-3 border-b border-[var(--border-light)] flex items-center justify-between">
											<div class="flex items-center gap-2">
												<SlidersHorizontal :size="14" class="text-[var(--text-tertiary)]" />
												<span
													class="text-[13px] font-semibold text-[var(--text-primary)]">Parameters</span>
											</div>
											<button @click="resetParams"
												class="text-[12px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Reset</button>
										</div>
										<ModelParameters :model-input="modelStore.selectedModel?.model_input"
											:values="currentConversation?.params || {}" @update:values="updateParams" />
									</PopoverPanel>
								</Transition>
							</Popover>
						</div>

						<!-- Stop / Send Button -->
						<Tooltip
							:text="chatStore.isLoading ? 'Stop generating' : hasContent ? 'Send Message' : 'Type something...'">
							<button v-if="chatStore.isLoading" @click="stopGeneration"
								class="flex items-center justify-center w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full transition-transform active:scale-90 dark:bg-[var(--text-white)] dark:text-[var(--bg-main)] shrink-0 self-end mb-1">
								<Square :size="12" fill="currentColor" />
							</button>
							<button v-else @click="() => sendMessage()"
								:disabled="(!hasContent && uploadedFiles.length === 0) || isUploading"
								class="flex items-center justify-center w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full transition-transform active:scale-90 disabled:opacity-20 disabled:scale-100 dark:bg-[var(--text-white)] dark:text-[var(--bg-main)] shrink-0 self-end mb-1">
								<ArrowUp :size="16" :stroke-width="2.5" />
							</button>
						</Tooltip>
					</div>
				</div>

				<!-- Suggestions -->
				<div v-if="currentConversation?.messages.length === 0" class="mt-6 flex flex-wrap justify-center gap-2">
					<button v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 3)" :key="suggestion.id"
						@click="handleApplyPrompt(suggestion)"
						class="flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded-full border border-[var(--border-light)] transition-all text-sm font-medium shadow-sm active:scale-95">
						<span class="opacity-70 text-xs">{{ suggestion.icon }}</span>
						<span>{{ suggestion.label }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Asset Picker Modal -->
		<AssetPickerModal :show="isAssetPickerOpen" @close="isAssetPickerOpen = false" @select="onAssetsSelected" />

		<!-- Image Preview Lightbox -->
		<Teleport to="body">
			<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
				enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
				leave-from-class="opacity-100" leave-to-class="opacity-0">
				<div v-if="previewImage"
					class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
					@click="previewImage = null" @keydown.esc.window="previewImage = null">
					<div class="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" @click.stop>
						<img :src="previewImage"
							class="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
						<!-- Close -->
						<button @click="previewImage = null"
							class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors border border-white/20">
							<X :size="14" />
						</button>
						<!-- Download -->
						<a :href="previewImage" download="image.jpg" target="_blank" @click.stop
							class="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white text-[12px] font-medium transition-colors border border-white/10">
							<Download :size="13" />
							Download
						</a>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, h, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownContent from '../../components/MarkdownContent.vue'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '../../utils/prompts'
import { Popover, PopoverButton, PopoverPanel, Switch } from '@headlessui/vue'
import { useConversationStore } from '../../stores/conversation'
import { useChatStore } from '../../stores/chat'
import { useModelStore } from '../../stores/models'
import { useUserStore } from '../../stores/user'
import { useDiscoveryStore } from '../../stores/discovery'
import { useUIStore } from '../../stores/ui'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Tooltip from '../../components/Tooltip.vue'
import AssetPickerModal from '../../components/AssetPickerModal.vue'
import { Copy, Pencil, Plus, Globe, Settings, ArrowUp, Square, SlidersHorizontal, Loader2, X, FileText, Share2, RefreshCw, Palette, Gem, LayoutGrid, Check, ImagePlus, Monitor, Clock, Download, Expand } from 'lucide-vue-next'
import { fetchChatStream, generateImageStream, generateVideoStream, uploadFile, type ModelInputField } from '../../utils/api'
import { generateConversationTitle, generateFollowUpQuestions } from '../../api/conversation'
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const modelStore = useModelStore()
const userStore = useUserStore()
const discoveryStore = useDiscoveryStore()
const uiStore = useUIStore()

const supportsFileUpload = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields
	return !!(fields?.file_ids || fields?.image_urls)
})

const supportsWebSearch = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields
	return !!fields?.enable_web_search
})

const supportsMediaPrompt = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields || {}
	return !!(fields.image_urls || fields.file_ids || fields.image || fields.images || fields.input_images || fields.input_image || fields.init_image || fields.end_image || fields.ref_image)
})

// Max images allowed based on model field type:
// 'image'/'init_image'/'end_image'/'ref_image'/'input_image' → single (or 2 if both init+end)
// 'input_images'/'images' → multiple
const mediaImageUploadLimit = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields || {}
	if (fields.input_images || fields.images) return Infinity
	if (fields.init_image && fields.end_image) return 2
	return 1
})

const uploadedMediaFiles = computed(() => {
	return uploadedFiles.value.filter((f) => f.type?.startsWith('image/'))
})

const isAssetPickerOpen = ref(false)
const previewImage = ref<string | null>(null)

const triggerFileUploadAndClose = () => {
	activeDropdownField.value = null
	_mediaUploadContext.value = true
	if (fileInputRef.value) {
		fileInputRef.value.multiple = mediaImageUploadLimit.value > 1
	}
	triggerFileUpload()
}

const selectAssetAndClose = () => {
	activeDropdownField.value = null
	isAssetPickerOpen.value = true
}

const selectorCapability = computed(() => {
	const cap = currentConversation.value?.capability
	if (cap === 'image' || cap === 'image_generation') return 'image_generation'
	if (cap === 'video' || cap === 'video_generation') return 'video_generation'
	return 'chat'
})

const onAssetsSelected = (assets: { key: string; url: string }[]) => {
	assets.forEach((asset) => {
		uploadedFiles.value.push({
			id: Math.random().toString(36).slice(2),
			name: 'Asset',
			key: asset.key,
			url: asset.url,
			type: 'image/png',
			uploading: false,
		})
	})
	isAssetPickerOpen.value = false
}

const isImageModel = computed(() => {
	const model = modelStore.selectedModel
	const mCap = model?.model_input?.capability || model?.capabilities?.[0]
	const mMatch = mCap === 'image_generation' || mCap === 'image'
	const cCap = currentConversation.value?.capability
	const cMatch = cCap === 'image_generation' || cCap === 'image'
	return mMatch || cMatch
})

const isVideoModel = computed(() => {
	const model = modelStore.selectedModel
	const mCap = model?.model_input?.capability || model?.capabilities?.[0]
	const mMatch = mCap === 'video_generation' || mCap === 'video'
	const cCap = currentConversation.value?.capability
	const cMatch = cCap === 'video_generation' || cCap === 'video'
	return mMatch || cMatch
})

const modelInputFields = computed(() => {
	return modelStore.selectedModel?.model_input?.fields || {}
})

const dynamicSelectFields = computed(() => {
	const fields = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if ((field as any).type === 'select') {
			fields.push({ key, ...(field as any) })
		}
	}
	return fields
})

const dynamicNumberFields = computed(() => {
	const fields = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if ((field as any).type === 'number') {
			fields.push({ key, ...(field as any) })
		}
	}
	return fields
})

const activeDropdownField = ref<string | null>(null)
const toggleDropdown = (key: string) => {
	activeDropdownField.value = activeDropdownField.value === key ? null : key
}

const setParamAndClose = (key: string, val: any) => {
	updateParams({ ...currentConversation.value?.params, [key]: val })
	activeDropdownField.value = null
}

const getPreviewStyle = (ratio: string) => {
	const baseSize = 120
	if (ratio === '1:1') return { width: baseSize + 'px', height: baseSize + 'px' }
	if (ratio === '16:9') return { width: baseSize + 'px', height: baseSize * (9 / 16) + 'px' }
	if (ratio === '9:16') return { width: baseSize * (9 / 16) + 'px', height: baseSize + 'px' }
	if (ratio === '4:3') return { width: baseSize + 'px', height: baseSize * (3 / 4) + 'px' }
	if (ratio === '3:4') return { width: baseSize * (3 / 4) + 'px', height: baseSize + 'px' }
	if (ratio === '21:9') return { width: baseSize + 'px', height: baseSize * (9 / 21) + 'px' }
	if (ratio === '9:21') return { width: baseSize * (9 / 21) + 'px', height: baseSize + 'px' }
	if (ratio === '3:2') return { width: baseSize + 'px', height: baseSize * (2 / 3) + 'px' }
	if (ratio === '2:3') return { width: baseSize * (2 / 3) + 'px', height: baseSize + 'px' }
	return { width: baseSize + 'px', height: baseSize + 'px' }
}
const messagesContainer = ref<HTMLElement | null>(null)
const inputMessage = ref('')
const activeSubPrompts = ref<string[]>([])
const isMountedInitial = ref(false)

// Editing state
const editingMessageId = ref<string | null>(null)
const editingContent = ref('')
const editContentRef = ref<HTMLElement | null>(null)

// Failed message retry state
const failedMessageContent = ref<string | null>(null)
const titleTriggered = ref(false)
const followUpQuestions = ref<string[]>([])
const followUpLoading = ref(false)

// Scroll lock: don't auto-scroll when user has scrolled up
const isUserScrolledUp = ref(false)
const hasScrolledToBottom = ref(false)
const onMessagesScroll = () => {
	if (!messagesContainer.value || !hasScrolledToBottom.value) return
	const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
	isUserScrolledUp.value = scrollHeight - scrollTop - clientHeight > 80
}

// Drag & drop upload
const isDraggingOver = ref(false)
let dragCounter = 0
const onDragEnter = () => {
	dragCounter++
	isDraggingOver.value = true
}
const onDragLeave = () => {
	dragCounter--
	if (dragCounter <= 0) {
		dragCounter = 0
		isDraggingOver.value = false
	}
}
const onDrop = (e: DragEvent) => {
	dragCounter = 0
	isDraggingOver.value = false
	if (!supportsFileUpload.value) return
	const files = Array.from(e.dataTransfer?.files || [])
	if (files.length > 0) handleFilesUpload(files)
}

// Abort controller for stream cancellation
const abortController = ref<AbortController | null>(null)

// File Upload State
const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedFiles = ref<{ id: string; name: string; key: string; url: string; type: string; uploading: boolean; localUrl?: string }[]>([])
const isWebSearchEnabled = ref(true)
const _mediaUploadContext = ref(false)

const triggerFileUpload = () => {
	fileInputRef.value?.click()
}

const handleFilesUpload = async (files: File[], applyMediaLimit = false) => {
	if (applyMediaLimit) {
		const limit = mediaImageUploadLimit.value
		const currentImageCount = uploadedMediaFiles.value.length
		const remaining = Math.max(0, limit - currentImageCount)
		if (remaining === 0) {
			uiStore.showToast(limit === 1 ? t('chat.max_one_image') : t('chat.max_images_reached'), 'error')
			return
		}
		files = files.slice(0, remaining)
	}
	const placeholders = files.map((file) => ({
		id: Math.random().toString(36).slice(2),
		name: file.name,
		key: '',
		url: '',
		type: file.type,
		uploading: true,
		localUrl: file.type?.startsWith('image/') ? URL.createObjectURL(file) : undefined,
	}))
	uploadedFiles.value.push(...placeholders)
	isUploading.value = true

	await Promise.allSettled(
		files.map(async (file, i) => {
			const placeholder = placeholders[i]
			if (!placeholder) return
			try {
				const { key, url } = await uploadFile(file, 'chat')
				const item = uploadedFiles.value.find((f) => f.id === placeholder.id)
				if (item) {
					item.key = key
					item.url = url
					item.uploading = false
				}
			} catch {
				uploadedFiles.value = uploadedFiles.value.filter((f) => f.id !== placeholder.id)
				uiStore.showToast(t('chat.upload_failed', { name: file.name }), 'error')
			}
		}),
	)

	isUploading.value = uploadedFiles.value.some((f) => f.uploading)
}

const handleFileUpload = async (event: Event) => {
	const target = event.target as HTMLInputElement
	if (!target.files?.length) return
	const files = Array.from(target.files)
	if (fileInputRef.value) fileInputRef.value.value = ''
	const fromMedia = _mediaUploadContext.value
	_mediaUploadContext.value = false
	await handleFilesUpload(files, fromMedia)
}

const removeFile = (id: string) => {
	const item = uploadedFiles.value.find((f) => f.id === id)
	if (item?.localUrl) URL.revokeObjectURL(item.localUrl)
	uploadedFiles.value = uploadedFiles.value.filter((f) => f.id !== id)
}

const stopGeneration = () => {
	abortController.value?.abort()
	abortController.value = null
}

const currentConversationId = computed(() => route.params.id as string)
const currentConversation = computed(() => conversationStore.currentConversation)

// Only show derivative messages whose parent_id is the last non-derivative message
const visibleMessages = computed(() => {
	const msgs = currentConversation.value?.messages
	if (!msgs) return []
	const nonDerivative = msgs.filter((m: any) => m.role !== 'derivative')
	const lastNonDerivative = nonDerivative[nonDerivative.length - 1]
	return msgs.filter((m: any) => {
		if (m.role !== 'derivative') return true
		return lastNonDerivative && String(m.parent_id) === String(lastNonDerivative.id)
	})
})

const currentCharacter = computed(() => {
	if (!currentConversation.value?.characterId || currentConversation.value.characterId <= 1) return null
	const bot = discoveryStore.allItems.find((b) => Number(b.related_id || b.id) === Number(currentConversation.value?.characterId))
	return bot
		? {
			name: bot.title,
			icon: bot.cover,
			avatar: bot.cover,
		}
		: null
})

// --- Typewriter Placeholder Effect ---
const displayedPlaceholder = ref('')
let typewriterInterval: ReturnType<typeof setInterval> | null = null

const runTypewriter = () => {
	if (typewriterInterval) clearInterval(typewriterInterval)
	displayedPlaceholder.value = ''
	let i = 0
	const text = t('chat.assign_task')
	typewriterInterval = setInterval(() => {
		if (i < text.length) {
			displayedPlaceholder.value += text[i]
			i++
			if (editor.value) {
				editor.value.view.dispatch(editor.value.state.tr)
			}
		} else {
			clearInterval(typewriterInterval!)
		}
	}, 20)
}

const editor = useEditor({
	content: '',
	extensions: [
		StarterKit.configure({
			heading: false,
			bulletList: false,
			orderedList: false,
			blockquote: false,
			codeBlock: false,
			horizontalRule: false,
		}),
		Placeholder.configure({
			placeholder: () => displayedPlaceholder.value,
		}),
	],
	editorProps: {
		attributes: {
			class: 'prose dark:prose-invert focus:outline-none min-h-[44px]  py-3 text-[15px] font-medium leading-relaxed text-[var(--text-primary)]',
		},
	},
	onUpdate: ({ editor }) => {
		inputMessage.value = editor.getText()
	},
})

// Custom key handler for Enter
const handleEnter = (e: KeyboardEvent) => {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault()
		sendMessage()
	}
}

// Add event listener to editor DOM element when mounted
watch(
	() => editor.value,
	(newEditor) => {
		if (newEditor) {
			newEditor.setOptions({
				editorProps: {
					handleKeyDown: (view, event) => {
						if (event.key === 'Enter' && !event.shiftKey) {
							event.preventDefault()
							sendMessage()
							return true
						}
						return false
					},
					handlePaste: (view, event) => {
						if (!supportsFileUpload.value) return false
						const items = Array.from(event.clipboardData?.items || [])
						const imageItems = items.filter((item) => item.type?.startsWith('image/'))
						if (imageItems.length === 0) return false
						event.preventDefault()
						const files = imageItems.map((item) => item.getAsFile()).filter(Boolean) as File[]
						if (files.length > 0) {
							handleFilesUpload(files)
						}
						return true
					},
					attributes: {
						class: 'prose dark:prose-invert focus:outline-none min-h-[44px] px-4 py-3 text-[15px] font-medium leading-relaxed text-[var(--text-primary)]',
					},
				},
			})
		}
	},
	{ immediate: true },
)

const hasContent = computed(() => {
	return inputMessage.value.trim().length > 0
})

// Draft persistence per conversation
const DRAFT_PREFIX = 'chat_draft_'
const saveDraft = (text: string) => {
	const id = currentConversationId.value
	if (!id) return
	if (text.trim()) {
		localStorage.setItem(DRAFT_PREFIX + id, text)
	} else {
		localStorage.removeItem(DRAFT_PREFIX + id)
	}
}
const loadDraft = () => {
	const id = currentConversationId.value
	if (!id) return
	const draft = localStorage.getItem(DRAFT_PREFIX + id)
	if (draft && editor.value) {
		editor.value.commands.setContent(draft)
		inputMessage.value = draft
	}
}
watch(inputMessage, (val) => saveDraft(val))

const getModelIcon = (modelId?: string, numericId?: number) => {
	const id = (modelId || '').toLowerCase()
	const model = numericId
		? modelStore.models.find((m) => m.id === numericId) || modelStore.models.find((m) => m.model === modelId)
		: modelStore.models.find((m) => m.model === modelId)
	const provider = (model?.provider || '').toLowerCase()

	if (provider.includes('openai') || id.includes('gpt') || id.includes('o1')) return '/icons/openai.svg'
	if (provider.includes('google') || id.includes('gemini')) return '/icons/gemini.svg'
	if (provider.includes('anthropic') || id.includes('claude')) return '/icons/anthropic.svg'
	if (provider.includes('deepseek')) return '/icons/deepseek.svg'
	if (provider.includes('meta') || id.includes('llama')) return '/icons/meta.svg'
	if (provider.includes('zhipu') || id.includes('glm') || id.includes('chatglm')) return '/icons/zhipu.svg'
	if (provider.includes('bytedance') || id.includes('doubao')) return '/icons/doubao.svg'
	if (provider.includes('xai') || id.includes('grok')) return '/icons/grok.svg'
	if (provider.includes('moonshot') || id.includes('kimi')) return '/icons/kimi.svg'
	if (id.includes('fastgpt')) return '/icons/fastgpt.svg'

	return '/icons/openai.svg'
}

const getModelDisplayName = (modelId?: string, numericId?: number): string => {
	const byNumeric = numericId ? modelStore.models.find((m: any) => m.id === numericId) : null
	if (byNumeric?.display_name) return byNumeric.display_name
	if (!modelId) return 'AI'
	const model = modelStore.models.find((m: any) => m.model === modelId || `${m.provider}:${m.model}` === modelId)
	if (model?.display_name) return model.display_name
	return (modelId.includes(':') ? modelId.split(':')[1] : modelId) ?? modelId
}

const extractImageUrls = (content: string): string[] => {
	// JSON format: {"capability":"image","success":true,"data":[{"type":"image","url":"..."}]}
	try {
		const json = JSON.parse(content)
		if (json.data && Array.isArray(json.data)) {
			return json.data.filter((item: any) => item.type === 'image' && item.url).map((item: any) => item.url)
		}
	} catch { }
	// Fallback: markdown image format
	const matches = [...content.matchAll(/!\[.*?\]\((https?:\/\/[^)]+)\)/g)]
	return matches.map((m) => m[1]).filter((u): u is string => !!u)
}

const extractVideoUrl = (content: string): string | null => {
	// JSON format: {"capability":"video","data":[{"type":"video","url":"..."}]}
	try {
		const json = JSON.parse(content)
		if (json.data && Array.isArray(json.data)) {
			const item = json.data.find((i: any) => i.type === 'video' && i.url)
			if (item) return item.url
		}
	} catch { }
	// Fallback: markdown video link format
	const match = content.match(/\[Generated Video\]\((https?:\/\/[^)]+)\)/)
	if (match) return match[1]
	return null
}

const imageGenerationGroups = computed(() => {
	if (!currentConversation.value?.messages) return []
	const messages = currentConversation.value.messages
	const groups: { userMsg: any; assistantMsg: any | null; images: string[]; isLoading: boolean }[] = []

	// Build id→message map for parent_id lookup
	const msgById = new Map(messages.map((m: any) => [m.id, m]))

	// Collect assistant messages keyed by parent_id
	const assistantByParentId = new Map<string | number, any>()
	const assignedAssistants = new Set<string | number>()
	for (const m of messages) {
		const pid = (m as any).parent_id
		if (m.role === 'assistant' && pid && msgById.has(pid)) {
			assistantByParentId.set(pid, m)
		}
	}

	const isCurrentlyLoading = chatStore.isLoading && chatStore.loadingConversationId === currentConversationId.value
	const lastMsg = messages[messages.length - 1]

	for (let i = 0; i < messages.length; i++) {
		const msg = messages[i]
		if (!msg || msg.role !== 'user') continue

		// Try parent_id-based match first, then fall back to next sequential message
		let assistantMsg: any = null
		const msgParentKey = (msg as any).id
		if (assistantByParentId.has(msgParentKey)) {
			assistantMsg = assistantByParentId.get(msgParentKey)
			assignedAssistants.add(assistantMsg.id)
		} else {
			const next = messages[i + 1]
			if (next?.role === 'assistant' && !assignedAssistants.has(next.id)) {
				assistantMsg = next
				assignedAssistants.add(next.id)
				i++
			}
		}

		const isLastGroup = !assistantMsg || assistantMsg.id === lastMsg?.id
		groups.push({
			userMsg: msg,
			assistantMsg,
			images: assistantMsg ? extractImageUrls(assistantMsg.content) : [],
			isLoading: isCurrentlyLoading && isLastGroup && (!assistantMsg || !assistantMsg.content),
		})
	}
	return groups
})

const videoGenerationGroups = computed(() => {
	if (!currentConversation.value?.messages) return []
	const messages = currentConversation.value.messages
	const groups: { userMsg: any; assistantMsg: any | null; videoUrl: string | null; isLoading: boolean }[] = []

	const msgById = new Map(messages.map((m: any) => [m.id, m]))
	const assistantByParentId = new Map<string | number, any>()
	const assignedAssistants = new Set<string | number>()
	for (const m of messages) {
		const pid = (m as any).parent_id
		if (m.role === 'assistant' && pid && msgById.has(pid)) {
			assistantByParentId.set(pid, m)
		}
	}

	const isCurrentlyLoading = chatStore.isLoading && chatStore.loadingConversationId === currentConversationId.value
	const lastMsg = messages[messages.length - 1]

	for (let i = 0; i < messages.length; i++) {
		const msg = messages[i]
		if (!msg || msg.role !== 'user') continue

		let assistantMsg: any = null
		const msgParentKey = (msg as any).id
		if (assistantByParentId.has(msgParentKey)) {
			assistantMsg = assistantByParentId.get(msgParentKey)
			assignedAssistants.add(assistantMsg.id)
		} else {
			const next = messages[i + 1]
			if (next?.role === 'assistant' && !assignedAssistants.has(next.id)) {
				assistantMsg = next
				assignedAssistants.add(next.id)
				i++
			}
		}

		const isLastGroup = !assistantMsg || assistantMsg.id === lastMsg?.id
		groups.push({
			userMsg: msg,
			assistantMsg,
			videoUrl: assistantMsg ? extractVideoUrl(assistantMsg.content) : null,
			isLoading: isCurrentlyLoading && isLastGroup && (!assistantMsg || !assistantMsg.content),
		})
	}
	return groups
})

const regenerateFromGroup = (group: { userMsg: any }) => {
	if (!currentConversation.value || chatStore.isLoading) return
	conversationStore.truncateFromMessage(currentConversationId.value, group.userMsg.id)
	if (editor.value) {
		editor.value.commands.setContent(group.userMsg.content)
		inputMessage.value = group.userMsg.content
		sendMessage()
	}
}

const fillFollowUpQuestion = (q: string) => {
	inputMessage.value = q
	if (editor.value) {
		editor.value.commands.setContent(q)
	}
}

const reuseGroupPrompt = (group: { userMsg: any }) => {
	if (editor.value) {
		editor.value.commands.setContent(group.userMsg.content)
		inputMessage.value = group.userMsg.content
		editor.value.commands.focus()
	}
}

const downloadAllImages = (urls: string[]) => {
	urls.forEach((url, idx) => {
		const a = document.createElement('a')
		a.href = url
		a.download = `generated-image-${idx + 1}.jpg`
		a.target = '_blank'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	})
}

// 触发标题生成（每条消息结束时调用一次，由 titleTriggered 控制不重复）
const triggerTitleGeneration = (convId: number | string, messages: { role: string; content: string }[]) => {
	let generated = ''
	generateConversationTitle(
		convId,
		messages,
		(chunk) => {
			generated += chunk
			// 实时更新当前会话标题
			if (currentConversation.value) currentConversation.value.title = generated
			// 实时更新侧边栏标题
			const c = conversationStore.conversations.find((c: any) => c.id == convId)
			if (c) c.title = generated
		},
		() => {
			// done: 最终标题已由服务端写入，本地已实时更新
		},
	)
}

const formatMessageTime = (timestamp?: number) => {
	if (!timestamp) return ''
	return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const updateParams = (params: Record<string, any>) => {
	if (currentConversationId.value) {
		conversationStore.updateModelParams(currentConversationId.value, params)
	}
}

const resetParams = () => {
	if (currentConversationId.value) {
		conversationStore.updateModelParams(currentConversationId.value, {})
	}
}

const handleApplyPrompt = (suggestion: PromptSuggestion) => {
	if (editor.value) {
		editor.value.commands.setContent(suggestion.prompt)
		inputMessage.value = suggestion.prompt
		editor.value.commands.focus()
	}
}

onMounted(async () => {
	// Start typewriter placeholder animation
	runTypewriter()

	// 1. 初始化本地存储
	await conversationStore.initFromLocalStorage()

	const conversationId = currentConversationId.value
	if (conversationId) {
		// 2. 切换会话
		const conversation = await conversationStore.switchConversation(conversationId)

		if (conversation) {
			syncConversationModel(conversation)

			// Re-hydrate uploaded files from params if available
			if (conversation.params?.files && Array.isArray(conversation.params.files)) {
				uploadedFiles.value = conversation.params.files.map((f: any) => ({
					...f,
					uploading: false,
					localUrl: f.url, // Fallback to remote URL for re-hydration
				}))
			}

			nextTick(() => {
				scrollToBottom(true, true)
				setTimeout(() => {
					isMountedInitial.value = true
					// If there's a pending message from WelcomeScreen, send it
					if (chatStore.pendingMessage) {
						sendMessage(true)
					} else {
						loadDraft()
					}
				}, 50)
			})
		}
	} else {
		isMountedInitial.value = true
	}
})

onBeforeUnmount(() => {
	editor.value?.destroy()
})

watch(
	() => currentConversationId.value,
	async (newId, oldId) => {
		// oldId 为 null 说明是 onMounted 里 switchConversation 触发的首次赋值，已经处理过，跳过
		if (!oldId || !newId || newId === oldId) return
		if (newId) {
			hasScrolledToBottom.value = false
			isUserScrolledUp.value = false
			await conversationStore.switchConversation(newId)
			if (currentConversation.value) {
				syncConversationModel(currentConversation.value)
				// 只同步 selectedGroupId，不重新加载会话列表（避免清空消息）
				if (currentConversation.value.groupId !== conversationStore.selectedGroupId) {
					conversationStore.selectedGroupId = currentConversation.value.groupId
				}
			}
			nextTick(() => {
				scrollToBottom(true, true)
				loadDraft()
			})
		}
	},
)

watch(
	() => currentConversation.value?.messages.length,
	() => {
		nextTick(() => scrollToBottom())
	},
)

// Sync model selection when switching conversations:
// prefer modelId (numeric), fall back to model string, ignore if neither set
const syncConversationModel = (conv: { modelId?: number; model?: string }) => {
	if (conv.modelId) {
		const found = modelStore.models.find((m: any) => m.id === conv.modelId)
		if (found) {
			modelStore.selectModel(`${found.provider}:${found.model}`)
			return
		}
	}
	if (conv.model) {
		modelStore.selectModel(conv.model)
	}
}

const scrollToBottom = (instant = false, force = false) => {
	if (!messagesContainer.value) return
	if (!force && isUserScrolledUp.value) return
	messagesContainer.value.scrollTo({
		top: messagesContainer.value.scrollHeight,
		behavior: instant ? 'auto' : 'smooth',
	})
	hasScrolledToBottom.value = true
}

const sendMessage = async (isInitial = false) => {
	// For initial messages, the message is already in the store,
	// but we need to derive userMessage for the stream.
	// Allow sending just files without text
	let userMessage = inputMessage.value.trim()

	if (isInitial && chatStore.pendingMessage) {
		userMessage = chatStore.pendingMessage
		chatStore.setPendingMessage(null) // Consume it
	}

	// Double check editor content if inputMessage is empty (to avoid race conditions)
	if (!userMessage && editor.value) {
		userMessage = editor.value.getText().trim()
	}

	if (!userMessage && uploadedFiles.value.length === 0 && !isInitial) {
		return
	}

	if ((chatStore.isLoading && !isInitial) || !currentConversation.value) {
		return
	}

	const conversationId = currentConversation.value.id
	// 确保 model 格式是 provider:model
	let model = currentConversation.value.model || modelStore.selectedModelId || 'openai:gpt-4o-mini'

	if (!model.includes(':')) {
		const modelObj = modelStore.models.find((m) => m.model === model)
		if (modelObj) {
			model = `${modelObj.provider}:${modelObj.model}`
		}
	}

	// Merge user-defined parameters with model defaults and initial conversation params
	const currentParams = currentConversation.value.params || {}
	const mergedParams = {
		...currentParams,
		...uploadedFiles.value.reduce((acc: any, file) => {
			if (file.type?.startsWith('image/')) {
				acc.image_urls = acc.image_urls || []
				acc.image_urls.push(file.key)
			} else {
				acc.file_ids = acc.file_ids || []
				acc.file_ids.push(file.key)
			}
			return acc
		}, {}),
	}

	// For initial messages, ensure we don't clear existing file lists if current uploadedFiles is empty
	if (isInitial && uploadedFiles.value.length === 0) {
		mergedParams.image_urls = mergedParams.image_urls || currentParams.image_urls || []
		mergedParams.file_ids = mergedParams.file_ids || currentParams.file_ids || []
	}

	const payloadOptions: any = {
		...mergedParams,
		enable_web_search: isWebSearchEnabled.value,
	}

	// Advanced Media Field Mapping (e.g. input_images, image, ref_image)
	if (isImageModel.value || isVideoModel.value) {
		const fields = modelInputFields.value
		const readyMedia = uploadedFiles.value.filter((f) => !f.uploading && f.type?.startsWith('image/'))

		// Use re-hydrated media if local uploadedFiles is empty (for initial send)
		const effectiveMedia = readyMedia.length > 0 ? readyMedia : (isInitial ? (currentParams.files || []).filter((f: any) => f?.type?.startsWith('image/')) : [])

		if (effectiveMedia.length > 0) {
			if ('input_images' in fields) {
				payloadOptions.input_images = effectiveMedia.map((f: any) => f.url)
			} else if ('image' in fields) {
				payloadOptions.image = effectiveMedia[0]?.url
			} else if ('images' in fields) {
				payloadOptions.images = effectiveMedia.map((f: any) => f.url)
			} else if ('ref_image' in fields) {
				payloadOptions.ref_image = effectiveMedia[0]?.url
			} else if ('init_image' in fields) {
				payloadOptions.init_image = effectiveMedia[0]?.url
				// If model also has end_image, second uploaded image maps to it
				if ('end_image' in fields && effectiveMedia[1]) {
					payloadOptions.end_image = effectiveMedia[1].url
				}
			} else if ('end_image' in fields) {
				payloadOptions.end_image = effectiveMedia[0]?.url
			} else if ('input_image' in fields) {
				payloadOptions.input_image = effectiveMedia[0]?.url
			}
		}
	}

	// Reset scroll lock when user sends a new message
	isUserScrolledUp.value = false
	failedMessageContent.value = null
	titleTriggered.value = false
	followUpQuestions.value = []
	followUpLoading.value = false

	// 1. Clear input if not initial
	if (!isInitial) {
		inputMessage.value = ''
		editor.value?.commands.clearContent()
		uploadedFiles.value = []
		localStorage.removeItem(DRAFT_PREFIX + currentConversationId.value)
	}

	// 2. Add user message ONLY IF not already there (initial messages are added by the caller)
	// Correction: For initial send from WelcomeScreen, we MUST add it to the UI list
	if (!isInitial || (isInitial && userMessage)) {
		// Only add if the message isn't already the last one (avoid duplicates on reload)
		const lastMsg = currentConversation.value?.messages[currentConversation.value.messages.length - 1]
		if (lastMsg?.content !== userMessage || lastMsg?.role !== 'user') {
			conversationStore.addMessage(conversationId, {
				role: 'user',
				content: userMessage,
			})
		}

	}

	// 3. Set loading and add assistant placeholder
	chatStore.setLoading(true, conversationId)
	abortController.value = new AbortController()

	try {
		conversationStore.addMessage(conversationId, {
			role: 'assistant',
			content: '',
		})

		const modelInput = modelStore.selectedModel?.model_input
		const modelDefaults: Record<string, any> = {}
		if (modelInput) {
			Object.entries(modelInput.fields).forEach(([k, f]) => {
				modelDefaults[k] = (f as any).default
			})
		}

		const userParams = currentConversation.value.params || {}
		const finalParams = { ...modelDefaults, ...userParams, ...payloadOptions }
		const options: Record<string, any> = {}
		Object.entries(finalParams).forEach(([k, v]) => {
			if (v !== null) options[k] = v
		})

		const context: Record<string, any> = {
			conversation_id: conversationId,
			max_history: 20,
		}

		if (currentConversation.value.characterId && currentConversation.value.characterId !== 0) {
			context.character_id = currentConversation.value.characterId
		}

		let tokenBuffer = ''
		let lastFlushTime = Date.now()
		const FLUSH_INTERVAL = 60 // 60ms throttle for UI updates

		if (isImageModel.value || isVideoModel.value) {
			const { image_urls, file_ids, files, capability, enable_web_search, ...cleanOptions } = options
			const apiToCall = isImageModel.value ? generateImageStream : generateVideoStream
			await apiToCall(
				{
					...cleanOptions,
					prompt: userMessage,
					model,
					context: { conversation_id: conversationId },
				},
				{
					onTask: (data) => {
						console.log('Task started:', data)
					},
					onImage: (data) => {
						if (isVideoModel.value) {
							conversationStore.updateLastMessageContent(conversationId, JSON.stringify({ capability: 'video', data: [{ type: 'video', url: data.url }] }))
						} else {
							conversationStore.updateLastMessageContent(conversationId, `![Generated Image](${data.url})`)
						}
					},
					onDone: () => {
						abortController.value = null
						triggerTitleGeneration(conversationId, [{ role: 'user', content: userMessage }])
					},
					onError: (error) => {
						console.error('Generation error:', error)
						conversationStore.removeLastAssistantMessage(conversationId)
						failedMessageContent.value = userMessage
						uiStore.showToast(error?.message || t('chat.connection_failed'), 'error')
					},
				},
				abortController.value.signal,
			)
		} else {
			const { image_urls, file_ids, files, capability, ...chatOptions } = options
			await fetchChatStream({
				message: userMessage,
				model,
				options: {
					...chatOptions,
					context,
				},
				signal: abortController.value.signal,
				onMessage: (content) => {
					tokenBuffer += content
					const now = Date.now()
					if (now - lastFlushTime > FLUSH_INTERVAL) {
						conversationStore.updateLastMessageContent(conversationId, tokenBuffer)
						tokenBuffer = ''
						lastFlushTime = now
					}
					// 累计回复达 200 字时触发标题生成（只触发一次）
					const accum = currentConversation.value?.messages[currentConversation.value.messages.length - 1]?.content || ''
					if (!titleTriggered.value && accum.length >= 200) {
						titleTriggered.value = true
						triggerTitleGeneration(conversationId, [{ role: 'user', content: userMessage }, { role: 'assistant', content: accum.substring(0, 200) }])
					}
				},
				onError: (error) => {
					console.error('Chat error:', error)
					const lastMsg = currentConversation.value?.messages[currentConversation.value.messages.length - 1]
					if (lastMsg?.role === 'assistant' && !lastMsg.content) {
						conversationStore.removeLastAssistantMessage(conversationId)
					}
					failedMessageContent.value = userMessage
					uiStore.showToast(error?.message || t('chat.connection_failed'), 'error')
				},
				onFinish: () => {
					abortController.value = null
					if (tokenBuffer) {
						conversationStore.updateLastMessageContent(conversationId, tokenBuffer)
					}
					const assistantContent = currentConversation.value?.messages[currentConversation.value.messages.length - 1]?.content || ''
					// 回复结束时若还没触发过（回复不足 200 字），现在触发
					if (!titleTriggered.value) {
						titleTriggered.value = true
						triggerTitleGeneration(conversationId, [{ role: 'user', content: userMessage }, { role: 'assistant', content: assistantContent }])
					}
					// 生成衍生问题
					followUpLoading.value = true
					generateFollowUpQuestions(
						[{ role: 'user', content: userMessage }, { role: 'assistant', content: assistantContent }],
						(questions) => {
							followUpQuestions.value = questions
							followUpLoading.value = false
						},
					)
				},
			})
		}
		// Call the full update method once at the end to sync updatedAt and trigger storage save
		const finalContent = currentConversation.value?.messages[currentConversation.value.messages.length - 1]?.content || ''
		conversationStore.updateLastMessage(conversationId, finalContent, false)

		chatStore.setLoading(false)
	} catch (error: any) {
		abortController.value = null
		conversationStore.removeLastAssistantMessage(conversationId)
		if (error?.name !== 'AbortError') {
			failedMessageContent.value = userMessage
			uiStore.showToast(t('chat.send_failed'), 'error')
		}
		chatStore.setLoading(false)
	}
}

const copyMessage = (content: string) => {
	navigator.clipboard
		.writeText(content)
		.then(() => {
			uiStore.showToast(t('chat.copied'))
		})
		.catch(() => {
			uiStore.showToast(t('chat.copy_failed'), 'error')
		})
}

const shareMessage = (content: string) => {
	navigator.clipboard
		.writeText(content)
		.then(() => {
			uiStore.showToast(t('chat.copied'))
		})
		.catch(() => {
			uiStore.showToast(t('chat.copy_failed'), 'error')
		})
}

const regenerateMessage = () => {
	if (!currentConversation.value || chatStore.isLoading) return
	const messages = currentConversation.value.messages
	// Remove the last assistant message and resend
	const lastUserMsgIndex = [...messages].reverse().findIndex((m) => m.role === 'user')
	if (lastUserMsgIndex === -1) return
	const lastUserMsg = messages[messages.length - 1 - lastUserMsgIndex]
	if (!lastUserMsg) return
	conversationStore.truncateFromMessage(currentConversationId.value, lastUserMsg.id)
	if (editor.value) {
		editor.value.commands.setContent(lastUserMsg.content)
		inputMessage.value = lastUserMsg.content
		sendMessage()
	}
}

const startEditing = (message: any) => {
	editingMessageId.value = message.id
	editingContent.value = message.content
	nextTick(() => {
		const el = Array.isArray(editContentRef.value) ? editContentRef.value[0] : editContentRef.value
		if (el) {
			el.textContent = message.content
			// Place cursor at end
			const range = document.createRange()
			const sel = window.getSelection()
			range.selectNodeContents(el)
			range.collapse(false)
			sel?.removeAllRanges()
			sel?.addRange(range)
			el.focus()
		}
	})
}

const cancelEditing = () => {
	editingMessageId.value = null
	editingContent.value = ''
}

const submitEdit = () => {
	const el = Array.isArray(editContentRef.value) ? editContentRef.value[0] : editContentRef.value
	const content = (el?.textContent || editingContent.value).trim()
	if (!content) return

	const messageId = editingMessageId.value!
	cancelEditing()

	// Truncate conversation from the edited message onwards, then regenerate
	conversationStore.truncateFromMessage(currentConversationId.value, messageId)

	if (editor.value) {
		editor.value.commands.setContent(content)
		inputMessage.value = content
		sendMessage()
	}
}

const retryMessage = () => {
	if (!failedMessageContent.value || chatStore.isLoading) return
	const content = failedMessageContent.value
	failedMessageContent.value = null
	if (editor.value) {
		editor.value.commands.setContent(content)
		inputMessage.value = content
		sendMessage()
	}
}

// Global click handler for dynamic content (like code block copy buttons)
const handleMessageClick = (e: MouseEvent) => {
	const target = e.target as HTMLElement
	// Check if clicked element or parent is .copy-code-btn
	const btn = target.closest('.copy-code-btn') as HTMLElement

	if (btn) {
		const code = btn.getAttribute('data-code')
		if (code) {
			copyMessage(code)
		}
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

.message-list-enter-active,
.message-list-leave-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-list-enter-from,
.message-list-leave-to {
	opacity: 0;
	transform: translateY(10px);
}

.prose {
	/* Improve prose readability */
	line-height: 1.625;
}

:deep(.dark) .prose {
	color: var(--text-primary);
}

/* Tiptap Styles */
:deep(.tiptap) {
	outline: none !important;

	p.is-editor-empty:first-child::before {
		color: var(--text-tertiary);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
}

/* Code Block Styles */
:deep(.code-block-wrapper) {
	margin: 0.5rem 0 1rem 0;
	/* Reduced top margin further */
	border-radius: 0.75rem;
	overflow: hidden;
	background-color: #1a1a1b;
	/* Sleeker dark background */
	border: 1px solid var(--border-light);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.code-block-wrapper pre) {
	margin: 0 !important;
	/* Reset default prose margins */
	padding: 1.25rem;
}

:deep(.code-block-header) {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.625rem 1rem;
	background-color: rgba(255, 255, 255, 0.03);
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	font-size: 0.7rem;
	color: var(--text-tertiary);
	font-weight: 500;
	letter-spacing: 0.025em;
}

:deep(.code-lang) {
	font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
	text-transform: uppercase;
	opacity: 0.8;
}

:deep(.copy-code-btn) {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	cursor: pointer;
	padding: 0.25rem 0.625rem;
	border-radius: 0.375rem;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	color: var(--text-tertiary);
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid transparent;
}

:deep(.copy-code-btn:hover) {
	background-color: rgba(255, 255, 255, 0.1);
	color: var(--text-primary);
	border-color: rgba(255, 255, 255, 0.1);
}

:deep(.copy-code-btn:active) {
	transform: scale(0.96);
}

:deep(.hljs) {
	padding: 1.25rem;
	margin: 0 !important;
	background: transparent !important;
	font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
	font-size: 0.825rem;
	line-height: 1.6;
	overflow-x: auto;
}
</style>
