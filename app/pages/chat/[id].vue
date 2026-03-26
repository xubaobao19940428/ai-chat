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
		<!-- Main Chat Area -->
		<div class="flex-1 overflow-y-auto px-4 pb-48 pt-6 custom-scrollbar relative z-10" ref="messagesContainer"
			@scroll="onMessagesScroll">
			<div class="max-w-full md:max-w-[900px] mx-auto py-6">
				<!-- Initial Loading State: Skeleton -->
				<div v-if="conversationStore.isLoading && (!currentConversation?.messages || currentConversation.messages.length === 0)"
					class="space-y-6 animate-pulse">

					<!-- Image Generation Skeleton -->
					<template v-if="isImageModel">
						<div v-for="i in 2" :key="i" class="flex gap-4 items-start">
							<div class="w-[420px] shrink-0">
								<div class="rounded-2xl bg-[var(--bg-hover)] p-4 space-y-2.5">
									<div class="h-3 bg-[var(--border-light)] rounded w-full"></div>
									<div class="h-3 bg-[var(--border-light)] rounded w-[90%]"></div>
									<div class="h-3 bg-[var(--border-light)] rounded w-4/5"></div>
									<div class="h-3 bg-[var(--border-light)] rounded w-2/3"></div>
									<div class="h-3 bg-[var(--border-light)] rounded w-1/2 mt-3"></div>
								</div>
							</div>
							<div class="flex-1 min-w-0">
								<div class="w-[200px]">
									<div class="rounded-xl bg-[var(--bg-hover)] overflow-hidden relative"
										style="aspect-ratio: 1 / 1">
										<div
											class="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border-light)]/40 to-transparent skeleton-shimmer">
										</div>
									</div>
								</div>
							</div>
						</div>
					</template>

					<!-- Video Generation Skeleton -->
					<template v-else-if="isVideoModel">
						<div v-for="i in 2" :key="i"
							class="w-full max-w-[640px] mx-auto rounded-2xl border border-[var(--border-light)] overflow-hidden">
							<div class="px-4 py-3 border-b border-[var(--border-light)] flex justify-between">
								<div class="space-y-1.5 flex-1">
									<div class="h-3 bg-[var(--bg-hover)] rounded w-3/4"></div>
									<div class="h-3 bg-[var(--bg-hover)] rounded w-1/2"></div>
								</div>
								<div class="w-20 h-5 bg-[var(--bg-hover)] rounded"></div>
							</div>
							<div class="bg-black/[0.03] dark:bg-white/[0.03] relative overflow-hidden"
								style="aspect-ratio: 16 / 9">
								<div
									class="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border-light)]/30 to-transparent skeleton-shimmer">
								</div>
							</div>
							<div class="px-4 py-2.5 flex gap-2">
								<div class="h-7 w-16 bg-[var(--bg-hover)] rounded-lg"></div>
								<div class="h-7 w-20 bg-[var(--bg-hover)] rounded-lg"></div>
							</div>
						</div>
					</template>

					<!-- Chat Skeleton -->
					<template v-else>
						<div v-for="i in 5" :key="i" class="flex" :class="i % 3 === 1 ? 'justify-end' : ''">
							<div v-if="i % 3 === 1" class="max-w-[70%]">
								<div class="bg-[var(--bg-hover)] rounded-[24px] px-5 py-3 space-y-1.5"
									:style="{ width: [180, 240, 160][i % 3] + 'px' }">
									<div class="h-3 bg-[var(--border-light)] rounded w-full"></div>
									<div v-if="i % 2 === 0" class="h-3 bg-[var(--border-light)] rounded w-2/3"></div>
								</div>
							</div>
							<div v-else class="w-full space-y-1.5">
								<div class="h-3 bg-[var(--bg-hover)] rounded"
									:style="{ width: [85, 70, 90, 60, 75][i % 5] + '%' }"></div>
								<div class="h-3 bg-[var(--bg-hover)] rounded"
									:style="{ width: [60, 80, 50, 70, 55][i % 5] + '%' }"></div>
								<div v-if="i % 2 === 0" class="h-3 bg-[var(--bg-hover)] rounded"
									:style="{ width: [40, 55, 45][i % 3] + '%' }"></div>
							</div>
						</div>
					</template>
				</div>

				<!-- Image Generation Mode: Prompt left, Images right -->
				<div v-if="isImageModel" class="space-y-6">
					<div v-for="group in imageGenerationGroups" :key="group.userMsg.id" class="flex gap-4 items-start">
						<!-- Left: Prompt Card -->
						<div class="w-[420px] shrink-0">
							<div
								class="bg-[var(--background-gray-subtle,#f4f4f5)] dark:bg-[var(--background-gray-subtle)] rounded-2xl px-4 py-4 text-[13.5px] text-[var(--text-primary)] leading-relaxed tracking-tight whitespace-pre-wrap break-words flex flex-col gap-3 min-h-[90px] max-h-[300px] overflow-y-auto custom-scrollbar">
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
							<!-- Loading state with progress -->
							<div v-if="group.isLoading">
								<div class="w-[200px]">
									<div
										class="relative rounded-xl bg-black/[0.03] dark:bg-white/[0.03] overflow-hidden flex items-center justify-center py-12 px-6">
										<!-- Scan line animation -->
										<div class="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-tertiary)]/30 to-transparent z-10 pointer-events-none"
											style="animation: img-scan-y 3s linear infinite"></div>

										<div class="flex flex-col items-center gap-3 z-20">
											<!-- Progress ring -->
											<div class="relative size-12 flex items-center justify-center">
												<svg class="absolute inset-0 size-full -rotate-90"
													viewBox="0 0 100 100">
													<circle cx="50" cy="50" r="42" fill="none" stroke="currentColor"
														class="text-[var(--border-light)]" stroke-width="3" />
													<circle cx="50" cy="50" r="42" fill="none" stroke="currentColor"
														class="text-[var(--text-secondary)] transition-all duration-500 ease-out"
														stroke-width="4" stroke-linecap="round" stroke-dasharray="264"
														:stroke-dashoffset="264 - (264 * (chatStore.generationProgress || 0)) / 100" />
												</svg>
												<span
													class="text-[12px] font-bold text-[var(--text-primary)] tabular-nums">{{
														chatStore.generationProgress || 0 }}%</span>
											</div>
											<p
												class="text-[11px] text-[var(--text-tertiary)] font-medium tracking-wide text-center">
												{{ chatStore.generationStatus || 'Initializing...' }}
											</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Images grid -->
							<div v-else-if="group.images.length > 0">
								<div class="grid gap-1 w-[200px]"
									:class="group.images.length === 4 ? 'grid-cols-2' : group.images.length === 3 ? 'grid-cols-3' : group.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'">
									<div v-for="(url, idx) in group.images" :key="idx"
										class="relative rounded-xl overflow-hidden group/img bg-[var(--background-gray-subtle,#f4f4f5)]"
										style="aspect-ratio: 1 / 1">
										<img :src="url" class="w-full h-full object-cover block cursor-zoom-in"
											@click="previewImage = url" />

										<!-- Hover overlay: zoom + download -->
										<div
											class="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-end justify-end p-2 gap-1.5 opacity-0 group-hover/img:opacity-100">
											<button @click.stop="previewImage = url" :aria-label="$t('common.preview')"
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

								<!-- Action bar -->
								<div class="flex items-center gap-0.5 mt-1.5 text-[12px] text-[var(--text-tertiary)]">
									<button @click="regenerateFromGroup(group)" :disabled="chatStore.isLoading"
										class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
										<RefreshCw :size="12" />
										{{ $t('chat.retry') }}
									</button>
									<button @click="reuseGroupPrompt(group)"
										class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
										<ArrowUp :size="12" />
										{{ $t('chat.reuse_params') }}
									</button>
									<button @click="downloadAllImages(group.images)"
										class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">
										<Download :size="12" />
										{{ $t('chat.download_all') }}
									</button>
								</div>
							</div>

							<!-- Generation failed / empty state -->
							<div v-else>
								<div class="w-[200px] rounded-xl bg-[var(--background-gray-subtle,#f4f4f5)] dark:bg-white/[0.03] flex flex-col items-center justify-center gap-2 py-8 px-4"
									style="aspect-ratio: 1 / 1">
									<div class="size-8 rounded-full bg-red-500/10 flex items-center justify-center">
										<TriangleAlert :size="16" class="text-red-500" />
									</div>
									<p class="text-[12px] font-medium text-[var(--text-primary)]">{{
										$t('chat.image_generation_failed_title') }}</p>
									<p class="text-[11px] text-[var(--text-tertiary)] text-center leading-relaxed">
										{{ $t('chat.image_generation_failed_desc') }}</p>
									<button @click="regenerateFromGroup(group)" :disabled="chatStore.isLoading"
										class="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] text-[11px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
										<RefreshCw :size="11" />
										{{ $t('chat.retry') }}
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
							<div class="flex-1 min-w-0 pr-4 max-h-[200px] overflow-y-auto custom-scrollbar">
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
							<!-- Loading state (polished) -->
							<div v-if="group.isLoading"
								class="relative flex flex-col items-center justify-center gap-4 py-16 overflow-hidden">
								<div
									class="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-white/[0.06] to-white/[0.02] animate-pulse">
								</div>
								<div class="relative">
									<div
										class="w-10 h-10 border-2 border-white/10 border-t-white/80 rounded-full animate-spin">
									</div>
									<div class="absolute inset-0 w-10 h-10 border-2 border-white/5 border-b-white/30 rounded-full animate-spin"
										style="animation-direction: reverse; animation-duration: 1.5s;"></div>
								</div>
								<p class="text-[12px] text-white/50 font-medium tracking-wider">{{
									$t('chat.generating_video') }}</p>
							</div>
							<!-- Video player -->
							<video v-else-if="group.videoUrl" :src="group.videoUrl" controls playsinline
								class="w-full max-h-[480px] object-contain"></video>
							<!-- Error state (with inline retry) -->
							<div v-else class="flex flex-col items-center justify-center gap-3 py-14">
								<div class="text-white/30 text-[13px]">{{ $t('chat.video_generation_failed') }}</div>
								<button @click="regenerateFromGroup(group)" :disabled="chatStore.isLoading"
									class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-[12px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
									<RefreshCw :size="12" />
									{{ $t('chat.retry') }}
								</button>
							</div>
						</div>

						<!-- Card Footer: Actions -->
						<div v-if="!group.isLoading"
							class="flex items-center gap-0 px-2 py-2 border-t border-[var(--border-light)] overflow-x-auto no-scrollbar">
							<button @click="regenerateFromGroup(group)" :disabled="chatStore.isLoading"
								class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[12px] whitespace-nowrap">
								<RefreshCw :size="12" />
								{{ $t('chat.retry') }}
							</button>
							<button @click="reuseGroupPrompt(group)"
								class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[12px] whitespace-nowrap">
								<ArrowUp :size="12" />
								{{ $t('chat.reuse_params') }}
							</button>
							<button v-if="group.videoUrl"
								@click="copyMessage(group.userMsg.content, `video-${group.userMsg.id}`)"
								class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-[12px] whitespace-nowrap"
								:class="copiedId === `video-${group.userMsg.id}` ? 'text-green-500' : 'hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
								<Check v-if="copiedId === `video-${group.userMsg.id}`" :size="12" />
								<Copy v-else :size="12" />
								{{ copiedId === `video-${group.userMsg.id}` ? $t('chat.copied') : $t('chat.copy_prompt')
								}}
							</button>
							<a v-if="group.videoUrl" :href="group.videoUrl" download="video.mp4" target="_blank"
								class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[12px] whitespace-nowrap">
								<Download :size="12" />
								{{ $t('chat.download') }}
							</a>
						</div>
					</div>
				</div>

				<!-- Chat Mode: standard message list -->
				<component v-else :is="isMountedInitial ? 'TransitionGroup' : 'div'" name="message-list"
					class="space-y-6">
					<div v-for="message in visibleMessages" :key="message.id" class="flex group"
						:class="message.role === 'user' ? 'justify-end' : ''" @click="handleMessageClick">
						<!-- Message Content -->
						<div class="flex flex-col relative"
							:class="message.role === 'user' ? 'items-end w-full' : 'items-start w-full min-w-0'" <!--
							User Message -->
							<div v-if="message.role === 'user'" class="w-full flex flex-col items-end">
								<!-- Edit Mode -->
								<div v-if="editingMessageId === message.id"
									class="w-full max-w-full bg-[var(--bg-chat-bubble-user)] rounded-2xl p-4 animate-in fade-in duration-200">
									<div ref="editContentRef" contenteditable="true"
										@input="editingContent = ($event.target as HTMLElement).textContent || ''"
										@keydown.enter.exact.prevent="submitEdit" @keydown.escape="cancelEditing()"
										class="w-full bg-transparent outline-none text-[15px] leading-relaxed min-h-[32px] max-h-48 overflow-y-auto custom-scrollbar whitespace-pre-wrap break-words text-[var(--text-primary)]">
									</div>
									<div class="flex justify-end items-center gap-2 mt-3">
										<button @click="cancelEditing()"
											class="px-4 py-1.5 text-[13px] font-medium rounded-full border border-[var(--border-main)] hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-primary)]">
											{{ $t('common.cancel') }}
										</button>
										<button @click="submitEdit"
											class="px-4 py-1.5 text-[13px] font-medium bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full hover:opacity-90 transition-opacity">
											{{ $t('chat.send') }}
										</button>
									</div>
								</div>
								<!-- View Mode -->
								<div v-else class="group/bubble max-w-[70%]">
									<div
										class="bg-[var(--bg-chat-bubble-user)] text-[var(--text-primary)] px-4 py-2.5 rounded-[22px] text-[15px] leading-6 max-h-[300px] overflow-y-auto custom-scrollbar">
										<div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
									</div>
									<!-- Action bar — below bubble, right-aligned -->
									<div
										class="flex justify-end gap-1 mt-1 pr-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
										<button @click="copyMessage(message.content, `user-${message.id}`)"
											class="p-1 rounded-md transition-colors"
											:class="copiedId === `user-${message.id}` ? 'text-green-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'"
											:title="$t('chat.copy')">
											<Check v-if="copiedId === `user-${message.id}`" :size="16" />
											<Copy v-else :size="16" />
										</button>
										<button @click="startEditing(message)"
											class="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-md transition-colors"
											:title="$t('common.edit')">
											<Pencil :size="16" />
										</button>
									</div>
								</div>
							</div>

							<!-- Bot Message -->
							<div v-else
								class="text-[var(--text-primary)] px-1 py-1 text-[15px] leading-relaxed tracking-tight break-words font-normal">
								<div v-if="!message.content && chatStore.isLoading && String(chatStore.loadingConversationId) === String(currentConversationId) && currentConversation?.messages[currentConversation.messages.length - 1]?.id === message.id"
									class="py-2 flex items-center gap-2.5">
									<div class="flex space-x-1">
										<div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce"
											style="animation-delay: 0s"></div>
										<div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce"
											style="animation-delay: 0.15s"></div>
										<div class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce"
											style="animation-delay: 0.3s"></div>
									</div>
									<span class="text-[13px] text-[var(--text-tertiary)] font-medium thinking-text">{{
										$t('chat.thinking') }}</span>
								</div>
								<div v-else class="relative inline-block w-full">
									<MarkdownContent :content="message.content" />
									<span
										v-if="chatStore.isLoading && String(chatStore.loadingConversationId) === String(currentConversationId) && currentConversation?.messages[currentConversation.messages.length - 1]?.id === message.id"
										class="inline-block w-1.5 h-4 bg-[var(--text-primary)] dark:bg-white ml-1 animate-pulse align-middle"></span>
								</div>

								<!-- Assistant Action Bar -->
								<div class="mt-3 flex items-center gap-0.5">
									<!-- Copy -->
									<button @click.stop="copyMessage(message.content, `assistant-${message.id}`)"
										class="p-1.5 rounded-md transition-colors"
										:class="copiedId === `assistant-${message.id}` ? 'text-green-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'"
										:title="$t('chat.copy')">
										<Check v-if="copiedId === `assistant-${message.id}`" :size="15" />
										<Copy v-else :size="15" />
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
										class="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										:title="$t('chat.regenerate')">
										<RefreshCw :size="15" :class="chatStore.isLoading ? 'animate-spin' : ''" />
									</button>
								</div>

								<!-- Derivative follow-up questions from history -->
								<div v-if="derivativeQuestionsMap.get(String(message.id))?.length"
									class="mt-3 flex flex-col gap-2 items-start">
									<button v-for="(q, i) in derivativeQuestionsMap.get(String(message.id))" :key="i"
										@click="fillFollowUpQuestion(q)"
										class="h-[38px] flex items-center gap-2 px-4 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] text-[13px] text-[var(--text-primary)] transition-colors group/fq">
										<span>{{ q }}</span>
										<span
											class="text-[var(--text-tertiary)] group-hover/fq:text-[var(--text-secondary)] shrink-0 transition-colors">→</span>
									</button>
								</div>
							</div>

							<!-- Time/Meta (Hidden by default, shown on hover) -->
							<div
								class="mt-1 px-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex gap-2 text-[11px] text-[var(--text-tertiary)] font-medium">
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
					<button @click="failedMessageContent = null" :aria-label="$t('common.close')"
						class="p-1 text-red-400 hover:text-red-500 transition-colors">
						<X :size="13" />
					</button>
				</div>
				<!-- Follow-up Questions -->
				<div v-if="followUpLoading || followUpQuestions.length > 0"
					class="mt-4 flex flex-col gap-2 items-start">
					<template v-if="followUpLoading">
						<div v-for="i in 3" :key="i"
							class="h-[38px] w-[180px] rounded-full bg-[var(--background-gray-subtle)] animate-pulse" />
					</template>
					<button v-else v-for="(q, i) in followUpQuestions" :key="i" @click="fillFollowUpQuestion(q)"
						class="h-[38px] flex items-center gap-2 px-4 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] text-[13px] text-[var(--text-primary)] transition-colors group/fq">
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
				:aria-label="$t('chat.scroll_to_bottom')"
				class="absolute bottom-36 right-8 z-40 size-9 flex items-center justify-center rounded-full bg-[var(--bg-main)] border border-[var(--border-light)] shadow-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:shadow-xl transition-all">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
					stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 5v14" />
					<path d="m19 12-7 7-7-7" />
				</svg>
			</button>
		</Transition>

		<!-- Floating Input Pill -->
		<div class="absolute left-0 right-0 z-50 px-4 pointer-events-none"
			:style="{ bottom: keyboardHeight > 0 ? `${keyboardHeight + 8}px` : '12px' }">
			<div class="max-w-[840px] mx-auto relative pointer-events-auto">
				<UnifiedInput ref="unifiedInputRef" :capability="selectorCapability" :is-loading="chatStore.isLoading"
					:external-params="currentConversation?.params" :show-model-selector="true" @send="handleUnifiedSend"
					@stop="stopGeneration" @update:params="updateParams" />

				<!-- Suggestions -->
				<!-- <div v-if="currentConversation?.messages.length === 0" class="mt-6 flex flex-wrap justify-center gap-2">
					<button v-for="suggestion in PROMPT_SUGGESTIONS.slice(0, 3)" :key="suggestion.id"
						@click="handleApplyPrompt(suggestion)"
						class="flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded-full border border-[var(--border-light)] transition-all text-sm font-medium shadow-sm active:scale-95">
						<span class="opacity-70 text-xs">{{ suggestion.icon }}</span>
						<span>{{ suggestion.label }}</span>
					</button>
				</div> -->
			</div>
		</div>

		<!-- Asset Picker Modal -->
		<AssetPickerModal :show="isAssetPickerOpen" @close="isAssetPickerOpen = false" @select="onAssetsSelected" />

		<!-- Discard Edit Confirm -->
		<ConfirmDialog :show="showDiscardConfirm" :title="$t('chat.discard_changes')"
			:message="$t('chat.discard_changes_message')" :confirm-text="$t('chat.discard')" @confirm="confirmDiscard"
			@cancel="showDiscardConfirm = false" />

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
						<button @click="previewImage = null" :aria-label="$t('common.close')"
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
definePageMeta({ ssr: false })
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownContent from '../../components/MarkdownContent.vue'
import { PROMPT_SUGGESTIONS, type PromptSuggestion } from '../../utils/prompts'
import { useConversationStore } from '../../stores/conversation'
import { useChatStore } from '../../stores/chat'
import { useModelStore } from '../../stores/models'
import { useDiscoveryStore } from '../../stores/discovery'
import { useUIStore } from '../../stores/ui'
import AssetPickerModal from '../../components/AssetPickerModal.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import UnifiedInput from '../../components/UnifiedInput.vue'
import { Copy, Check, Pencil, ArrowUp, X, Share2, RefreshCw, Download, Expand, TriangleAlert } from 'lucide-vue-next'
import { fetchChatStream, generateImageStream, generateVideoStream } from '../../utils/api'
import { generateConversationTitle, generateFollowUpQuestions } from '../../api/conversation'
import { useKeyboardOffset } from '~/composables/useKeyboardOffset'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { keyboardHeight } = useKeyboardOffset()

const route = useRoute()
const conversationStore = useConversationStore()
const chatStore = useChatStore()
const modelStore = useModelStore()
const discoveryStore = useDiscoveryStore()
const uiStore = useUIStore()

const supportsFileUpload = computed(() => {
	const fields = modelStore.selectedModel?.model_input?.fields
	return !!(fields?.file_ids || fields?.image_urls)
})

const isAssetPickerOpen = ref(false)
const previewImage = ref<string | null>(null)

const selectorCapability = computed(() => {
	const cap = currentConversation.value?.capability
	if (cap === 'image' || cap === 'image_generation') return 'image_generation'
	if (cap === 'video' || cap === 'video_generation') return 'video_generation'
	return 'chat'
})

const unifiedInputRef = ref<InstanceType<typeof UnifiedInput> | null>(null)

const handleUnifiedSend = (payload: { content: string; params: Record<string, any>; files: any[]; mediaFiles: any[] }) => {
	// Populate uploadedFiles from UnifiedInput payload
	uploadedFiles.value = payload.files.map((f: any) => ({
		id: f.id || Math.random().toString(36).slice(2),
		name: f.name || 'File',
		key: f.key || '',
		url: f.url || '',
		type: f.type || '',
		uploading: false,
	}))

	// Set the input message for sendMessage to pick up
	inputMessage.value = payload.content

	// Merge params
	if (Object.keys(payload.params).length > 0) {
		updateParams({ ...currentConversation.value?.params, ...payload.params })
	}

	// Call existing sendMessage
	sendMessage()
}

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

const messagesContainer = ref<HTMLElement | null>(null)
const inputMessage = ref('')
const isMountedInitial = ref(false)

// Editing state
const editingMessageId = ref<string | null>(null)
const editingContent = ref('')
const editingOriginalContent = ref('')
const editContentRef = ref<HTMLElement | null>(null)
const showDiscardConfirm = ref(false)

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
	if (files.length > 0) unifiedInputRef.value?.addFiles(files)
}

// Abort controller for stream cancellation
const abortController = ref<AbortController | null>(null)

// File Upload State
const uploadedFiles = ref<{ id: string; name: string; key: string; url: string; type: string; uploading: boolean; localUrl?: string }[]>([])
const isWebSearchEnabled = ref(true)

const stopGeneration = () => {
	abortController.value?.abort()
	abortController.value = null
}

const currentConversationId = computed(() => route.params.id as string)
const currentConversation = computed(() => conversationStore.currentConversation)

// Filter out derivative messages from the main list — they are shown inline below their parent assistant message
const visibleMessages = computed(() => {
	const msgs = currentConversation.value?.messages
	if (!msgs) return []
	return msgs.filter((m: any) => m.role !== 'derivative')
})

// Build a map: assistant message id -> derivative questions (by message order, derivative follows its assistant)
const derivativeQuestionsMap = computed(() => {
	const msgs = currentConversation.value?.messages
	if (!msgs) return new Map<string, string[]>()
	const map = new Map<string, string[]>()
	let lastAssistantId: string | null = null
	for (const m of msgs) {
		if (m.role === 'assistant') {
			lastAssistantId = String(m.id)
		} else if (m.role === 'derivative' && lastAssistantId) {
			const questions = m.content.split('\n').map((q: string) => q.replace(/^\d+\.\s*/, '').trim()).filter((q: string) => q.length > 0)
			if (questions.length > 0) {
				const existing = map.get(lastAssistantId) || []
				map.set(lastAssistantId, [...existing, ...questions])
			}
		}
	}
	return map
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

const getModelIcon = (modelId?: string, numericId?: number) => {
	const model = numericId
		? modelStore.models.find((m) => m.id === numericId) || modelStore.models.find((m) => m.model === modelId)
		: modelStore.models.find((m) => m.model === modelId)
	if (model?.icon) return model.icon
	const id = (modelId || '').toLowerCase()
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
	if (match) return match[1] ?? ''
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

	const isCurrentlyLoading = chatStore.isLoading && String(chatStore.loadingConversationId) === String(currentConversationId.value)
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

	const isCurrentlyLoading = chatStore.isLoading && String(chatStore.loadingConversationId) === String(currentConversationId.value)
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
	inputMessage.value = group.userMsg.content
	unifiedInputRef.value?.setContent(group.userMsg.content)
	sendMessage()
}

const fillFollowUpQuestion = (q: string) => {
	inputMessage.value = q
	unifiedInputRef.value?.setContent(q)
}

const reuseGroupPrompt = (group: { userMsg: any }) => {
	inputMessage.value = group.userMsg.content
	unifiedInputRef.value?.setContent(group.userMsg.content)
	unifiedInputRef.value?.focus()
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

const handleApplyPrompt = (suggestion: PromptSuggestion) => {
	inputMessage.value = suggestion.prompt
	unifiedInputRef.value?.setContent(suggestion.prompt)
	unifiedInputRef.value?.focus()
}

onMounted(async () => {
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
					}
				}, 50)
			})
		}
	} else {
		isMountedInitial.value = true
	}
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
const syncConversationModel = (conv: { modelId?: number; model?: string; capability?: string }) => {
	// Set active capability from conversation FIRST, so selectModel stores under the right key
	if (conv.capability) {
		const cap = conv.capability
		if (cap === 'image' || cap === 'image_generation') {
			modelStore.setActiveCapability('image_generation')
		} else if (cap === 'video' || cap === 'video_generation') {
			modelStore.setActiveCapability('video_generation')
		} else {
			modelStore.setActiveCapability('chat')
		}
	}

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

	// Double check UnifiedInput content if inputMessage is empty (to avoid race conditions)
	if (!userMessage && unifiedInputRef.value) {
		userMessage = unifiedInputRef.value.getContent().trim()
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
		unifiedInputRef.value?.clearContent()
		uploadedFiles.value = []
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
	if (isImageModel.value || isVideoModel.value) {
		chatStore.startFakeProgress()
	}
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
					onProgress: (percent, message) => {
						chatStore.setGenerationProgress(percent, message)
					},
					onImage: (data) => {
						chatStore.completeGeneration()
						if (isVideoModel.value) {
							conversationStore.updateLastMessageContent(conversationId, JSON.stringify({ capability: 'video', data: [{ type: 'video', url: data.url }] }))
						} else {
							conversationStore.updateLastMessageContent(conversationId, `![Generated Image](${data.url})`)
						}
					},
					onDone: () => {
						chatStore.completeGeneration()
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
						conversationId,
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

// Track which element is showing "copied" feedback
const copiedId = ref<string | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

const copyMessage = (content: string, feedbackId?: string) => {
	navigator.clipboard
		.writeText(content)
		.then(() => {
			if (feedbackId) {
				copiedId.value = feedbackId
				if (copiedTimer) clearTimeout(copiedTimer)
				copiedTimer = setTimeout(() => { copiedId.value = null }, 1500)
			}
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
	inputMessage.value = lastUserMsg.content
	unifiedInputRef.value?.setContent(lastUserMsg.content)
	sendMessage()
}

const startEditing = (message: any) => {
	editingMessageId.value = message.id
	editingContent.value = message.content
	editingOriginalContent.value = message.content
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

const cancelEditing = (force = false) => {
	if (!force && editingContent.value !== editingOriginalContent.value) {
		showDiscardConfirm.value = true
		return
	}
	editingMessageId.value = null
	editingContent.value = ''
	editingOriginalContent.value = ''
	showDiscardConfirm.value = false
}

const confirmDiscard = () => {
	editingMessageId.value = null
	editingContent.value = ''
	editingOriginalContent.value = ''
	showDiscardConfirm.value = false
}

const submitEdit = () => {
	const el = Array.isArray(editContentRef.value) ? editContentRef.value[0] : editContentRef.value
	const content = (el?.textContent || editingContent.value).trim()
	if (!content) return

	const messageId = editingMessageId.value!
	cancelEditing()

	// Truncate conversation from the edited message onwards, then regenerate
	conversationStore.truncateFromMessage(currentConversationId.value, messageId)
	inputMessage.value = content
	unifiedInputRef.value?.setContent(content)
	sendMessage()
}

const retryMessage = () => {
	if (!failedMessageContent.value || chatStore.isLoading) return
	const content = failedMessageContent.value
	failedMessageContent.value = null
	inputMessage.value = content
	unifiedInputRef.value?.setContent(content)
	sendMessage()
}

// Global click handler for dynamic content (like code block copy buttons)
const handleMessageClick = (e: MouseEvent) => {
	const target = e.target as HTMLElement
	const btn = target.closest('.copy-code-btn') as HTMLElement

	if (btn) {
		const code = btn.getAttribute('data-code')
		if (code) {
			navigator.clipboard.writeText(code).then(() => {
				// Swap icon + text to "Copied!" feedback
				const svg = btn.querySelector('svg')
				const label = btn.querySelector('span')
				if (svg) {
					svg.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none" style="color:#22c55e"><polyline points="20 6 9 17 4 12"/></svg>'
				}
				if (label) label.textContent = 'Copied!'
				btn.style.color = '#22c55e'

				setTimeout(() => {
					const newSvg = btn.querySelector('svg')
					if (newSvg) {
						newSvg.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v1"/></svg>'
					}
					if (label) label.textContent = 'Copy'
					btn.style.color = ''
				}, 1500)
			}).catch(() => {
				uiStore.showToast(t('chat.copy_failed'), 'error')
			})
		}
	}
}
</script>

<style scoped lang="scss">
@keyframes thinking-pulse {

	0%,
	100% {
		opacity: 0.4;
	}

	50% {
		opacity: 1;
	}
}

.thinking-text {
	animation: thinking-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
	0% {
		transform: translateX(-100%);
	}

	100% {
		transform: translateX(100%);
	}
}

.skeleton-shimmer {
	animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes img-scan-y {
	0% {
		top: 0;
		opacity: 0;
	}

	10% {
		opacity: 1;
	}

	90% {
		opacity: 1;
	}

	100% {
		top: 100%;
		opacity: 0;
	}
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

.message-list-enter-active,
.message-list-leave-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-list-enter-from,
.message-list-leave-to {
	opacity: 0;
	transform: translateY(10px);
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
