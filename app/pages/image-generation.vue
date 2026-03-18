<template>
	<div
		class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">
		<!-- Tab Switcher (Fixed at Top, Outside Scroll Area) -->
		<div class="flex justify-center py-4 bg-[var(--background-gray-main)] border-b border-transparent">
			<div
				class="bg-[var(--fill-tsp-gray-main)] p-1 rounded-full border border-[var(--border-main)] flex items-center">
				<button @click="activeTab = 'inspiration'"
					class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
					:class="activeTab === 'inspiration' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">Inspiration</button>
				<button @click="activeTab = 'creations'"
					class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
					:class="activeTab === 'creations' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">My
					Gallery</button>
			</div>
		</div>

		<!-- Category Filter Chips (Fixed, Outside Scroll Area) -->
		<div v-if="activeTab === 'inspiration'" class="flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
			<button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
				:class="['px-4 py-1.5 text-[13px] font-medium rounded-full border transition-all whitespace-nowrap', selectedCategory === cat ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]']">
				{{ cat }}
			</button>
		</div>

		<!-- Scrollable Content Area -->
		<main class="flex-1 overflow-y-auto px-4 py-6 pb-56 custom-scrollbar relative">
			<div class="max-w-full mx-auto">
				<!-- Tab Content -->
				<div v-if="activeTab === 'inspiration'">
					<!-- Masonry Grid Layout for Inspiration -->
					<div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
						<div v-for="(example, index) in exampleImages" :key="index"
							class="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-card)] border border-[var(--border-main)] hover:border-[var(--text-tertiary)] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
							@click="useExample(example.prompt)">
							<img :src="example.url"
								class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
								:alt="example.prompt" />
							<div
								class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
								<p class="text-white text-[13px] font-medium line-clamp-2 italic mb-3 leading-snug">"{{
									example.prompt }}"</p>
								<div class="flex items-center">
									<span
										class="px-4 py-1.5 rounded-full bg-white text-[11px] font-bold text-black uppercase tracking-wider backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Use
										Prompt</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-else>
					<!-- Noir Excellence Empty State (V2 Integrated) -->
					<div v-if="generatedImages.length === 0 && activeTasks.length === 0"
						class="py-32 flex flex-col items-center justify-center relative overflow-hidden">
						<!-- Architectural Shadow/Light (Theme Aware) -->
						<div
							class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--text-primary)]/[0.015] blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-40">
						</div>

						<!-- Precision Particles -->
						<div class="absolute inset-0 pointer-events-none">
							<div v-for="i in 8" :key="i"
								class="absolute size-[1px] bg-[var(--text-primary)]/10 animate-float" :style="{
									top: `${Math.random() * 60 + 20}%`,
									left: `${Math.random() * 60 + 20}%`,
									animationDelay: `${Math.random() * 10}s`,
									animationDuration: `${Math.random() * 15 + 10}s`,
								}"></div>
						</div>

						<div class="relative group cursor-default">
							<!-- Architectural Sphere -->
							<div
								class="absolute inset-0 bg-gradient-to-tr from-[var(--text-primary)]/5 to-[var(--text-primary)]/0 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-1000">
							</div>
							<div
								class="relative size-32 rounded-3xl bg-[var(--bg-main)] backdrop-blur-[40px] border border-[var(--border-main)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-700 group-hover:border-[var(--text-tertiary)]/30 group-hover:shadow-[var(--shadow-L)]">
								<!-- Architectural Lens Icon -->
								<svg viewBox="0 0 40 40"
									class="size-12 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors duration-500"
									fill="none" stroke="currentColor">
									<rect x="10" y="10" width="20" height="20" rx="3" stroke-width="1.5" />
									<circle cx="20" cy="20" r="4" stroke-width="1.2" stroke-dasharray="2 2"
										class="animate-rotate-progress" />
									<path d="M10 15H30M10 25H30M15 10V30M25 10V30" stroke-width="0.5"
										stroke-opacity="0.1" />
								</svg>
							</div>
						</div>

						<div class="text-center mt-14 relative z-10 space-y-3">
							<h3 class="text-[15px] font-black text-[var(--text-primary)] tracking-[0.25em] uppercase">
								The Archive of Vision</h3>
							<p
								class="text-[var(--text-tertiary)] text-[13.5px] max-w-[320px] px-4 leading-relaxed font-normal tracking-wide italic opacity-80">
								Every rendered reality finds its place in the Aura collection. Start your first
								orchestration.</p>
						</div>

						<button @click="triggerFocus"
							class="mt-14 px-12 py-3 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl hover:shadow-[var(--shadow-M)] flex items-center gap-4 group/btn">
							<span>Start Rendering</span>
							<div
								class="size-1 bg-[var(--bg-main)] rounded-full group-hover:scale-150 transition-transform">
							</div>
						</button>
					</div>

					<!-- Premium Gallery Grid -->
					<div v-if="generatedImages.length > 0 || activeTasks.length > 0"
						class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
						<!-- Noir Generation Task Cards (Integrated) -->
						<div v-for="task in activeTasks" :key="task.id"
							class="break-inside-avoid relative rounded-2xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] transition-all duration-700 shadow-2xl group/gen">
							<!-- Technical Preview Area -->
							<div
								class="relative aspect-square flex items-center justify-center overflow-hidden bg-black">
								<!-- Premium Placeholder Background -->
								<img v-if="!task.imageUrl" src="/noir_placeholder.png"
									class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />

								<!-- Precision Scanner (Theme Aware) -->
								<div v-if="!task.imageUrl"
									class="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan-y z-10 pointer-events-none">
								</div>

								<!-- Negative-to-Positive Reveal -->
								<img v-if="task.imageUrl" :src="task.imageUrl"
									class="w-full h-full object-cover animate-noir-reveal relative z-20" />

								<!-- Industrial Loader (Integrated) -->
								<div v-else class="flex flex-col items-center gap-8 z-20">
									<div class="relative size-24 flex items-center justify-center">
										<div
											class="absolute inset-0 bg-[var(--text-primary)]/[0.03] rounded-full animate-ping-slow">
										</div>
										<!-- Precision Ring -->
										<svg class="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
											<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor"
												class="text-[var(--text-primary)]" stroke-opacity="0.05"
												stroke-width="1" />
											<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor"
												class="text-[var(--text-primary)] transition-all duration-1000 ease-linear"
												stroke-width="2" stroke-linecap="round" stroke-dasharray="290"
												:stroke-dashoffset="290 - (290 * task.progress) / 100" />
										</svg>
										<span
											class="text-[16px] font-mono font-bold text-[var(--text-primary)] tracking-tighter">{{
												task.progress }}%</span>
									</div>
									<div class="flex flex-col items-center gap-2">
										<p
											class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.3em] uppercase opacity-60">
											{{ task.status }}</p>
										<div class="flex gap-2">
											<div v-for="i in 3" :key="i"
												class="size-[2px] bg-[var(--text-primary)] animate-pulse"
												:style="{ animationDelay: `${i * 0.3}s` }"></div>
										</div>
									</div>
								</div>
							</div>

							<!-- Technical Footer -->
							<div class="p-6 bg-[var(--bg-main)] relative z-30 border-t border-[var(--border-main)]">
								<div class="flex items-center justify-between mb-4">
									<div class="flex items-center gap-3">
										<div class="size-1.5 bg-[var(--text-primary)] animate-pulse rounded-full"></div>
										<span
											class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.2em] uppercase">SYSTEM_ACTIVE</span>
									</div>
									<span v-if="task.usage"
										class="text-[10px] font-mono text-[var(--text-tertiary)] bg-[var(--fill-tsp-gray-main)] px-2.5 py-1 rounded-[6px] border border-[var(--border-main)]">
										{{ task.usage.credits }} UNITS </span>
								</div>
								<p
									class="text-[var(--text-secondary)] text-[12.5px] font-normal line-clamp-2 leading-relaxed tracking-wide italic leading-snug">
									"{{ task.prompt }}"</p>

								<div v-if="task.taskId"
									class="mt-5 pt-5 border-t border-dashed border-[var(--border-main)] flex items-center justify-between opacity-50">
									<div class="flex flex-col">
										<span
											class="text-[8px] text-[var(--text-tertiary)] uppercase font-black tracking-widest">RECORD_ID</span>
										<span
											class="text-[10px] text-[var(--text-secondary)] font-mono tracking-tighter">{{
												task.taskId.substring(0, 16) }}</span>
									</div>
								</div>
							</div>
						</div>

						<div v-for="(image, index) in filteredGeneratedImages" :key="image.id"
							class="break-inside-avoid group relative rounded-[24px] overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-indigo-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">
							<!-- Image Container with Inner Shadow -->
							<div class="relative overflow-hidden aspect-auto min-h-[100px] bg-[var(--bg-hover)]">
								<!-- Image Grid Cell -->
								<template v-if="image.status === 1">
									<img :src="image.thumbnail || getRecordPrimaryUrl(image)"
										class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" />
								</template>

								<!-- Processing State in History -->
								<div v-else
									class="h-full min-h-[240px] relative flex flex-col items-center justify-center overflow-hidden bg-black/40">
									<img src="/noir_placeholder.png"
										class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
									<div class="relative z-10 flex flex-col items-center gap-4">
										<div
											class="size-10 rounded-full border border-white/10 border-t-white/40 animate-spin">
										</div>
										<span
											class="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">Synchronizing</span>
									</div>
								</div>

								<div class="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[24px]"></div>
							</div>

							<!-- Content Overlay (Sophisticated Gradient) -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-5">
								<!-- Top Actions (Glassmorphism) -->
								<div
									class="flex justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
									<button @click.stop="handleDownload(getRecordPrimaryUrl(image))"
										class="size-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all shadow-2xl group/btn">
										<Download :size="18" class="group-hover/btn:scale-110 transition-transform" />
									</button>
								</div>

								<!-- Bottom Info -->
								<div
									class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
									<div class="flex items-center gap-2 mb-2">
										<span
											class="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/80 uppercase tracking-wider">
											{{ formatModel(getRecordModel(image)) }}
										</span>
										<span class="text-[10px] font-medium text-white/60">
											{{ formatDate(image.created_at) }}
										</span>
									</div>

									<!-- Technical Metadata (Noir Style) -->
									<div v-if="getRecordParams(image)" class="flex flex-wrap gap-2 mb-4 opacity-70">
										<div v-if="getRecordParams(image).aspect_ratio"
											class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											{{ getRecordParams(image).aspect_ratio }}
										</div>
										<div v-if="getRecordParams(image).resolution"
											class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											{{ getRecordParams(image).resolution }}
										</div>
										<div v-if="getRecordParams(image).num_inference_steps"
											class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											{{ getRecordParams(image).num_inference_steps }} STEPS</div>
										<div v-if="getRecordParams(image).seed"
											class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-white/80 uppercase">
											SEED: {{ getRecordParams(image).seed }}</div>
									</div>

									<p
										class="text-white text-[13px] font-medium mb-4 line-clamp-3 leading-relaxed italic">
										"{{
											getRecordPrompt(image) || 'No description' }}"</p>
									<button @click.stop="useExample(getRecordPrompt(image))"
										class="w-full py-2.5 bg-white text-black rounded-xl font-bold text-[12px] hover:bg-indigo-50 transition-colors shadow-xl flex items-center justify-center gap-2 group/reuse">
										<Zap :size="14" fill="currentColor"
											class="text-indigo-600 group-hover/reuse:animate-pulse" />
										Reuse Prompt
									</button>
								</div>
							</div>

							<!-- Static Reveal Info -->
							<div
								class="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/20 backdrop-blur-md opacity-100 group-hover:opacity-0 transition-opacity duration-300">
								<p class="text-white/80 text-[10px] font-medium truncate max-w-[120px]">
									{{ formatDate(image.created_at) }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<!-- Floating Pill Control Bar (Bottom - Aligned with Manus Design) -->
		<div class="absolute bottom-12 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
			<div class="w-full max-w-[840px] relative pointer-events-auto">
				<transition enter-active-class="duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
					enter-from-class="opacity-0 translate-y-8 scale-90"
					enter-to-class="opacity-100 translate-y-0 scale-100">
					<!-- Active Task Monitor (Manus Integrated Glass) -->
					<div v-if="isGenerating"
						class="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-5 px-6 py-3 bg-[var(--bg-main)]/90 backdrop-blur-2xl border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-L)] z-[60]">
						<!-- Precision Progress Indicator (System Wide) -->
						<div class="relative size-10 flex items-center justify-center">
							<div class="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping"></div>
							<Loader2 :size="20" class="animate-spin text-[var(--text-primary)]" />
						</div>

						<div class="flex flex-col pr-4">
							<span
								class="text-[10px] font-black text-[var(--text-primary)] tracking-[0.2em] uppercase opacity-40">System
								Monitor</span>
							<span class="text-[11px] font-bold text-[var(--text-primary)]">{{ activeTasks.length }}
								Active
								Processing</span>
						</div>
					</div>
				</transition>

				<div ref="controlBarRef"
					class="bg-[var(--fill-input-chat)] rounded-[22px] border border-black/5 dark:border-[var(--border-main)] py-3 shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] flex flex-col gap-6 transition-all duration-300 focus-within:border-black/10">
					<!-- Uploaded Image Previews (above input) -->
					<div v-if="uploadedImages.length > 0" class="px-2 flex items-center gap-6 flex-wrap">
						<div v-for="(img, index) in uploadedImages" :key="img.url"
							class="relative shrink-0 group/preview">
							<img :src="img.url"
								class="w-14 h-14 object-cover rounded-2xl border border-[var(--border-main)] shadow-sm" />
							<!-- Upload loading overlay -->
							<div v-if="img.uploading"
								class="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
								<Loader2 :size="18" class="animate-spin text-white" />
							</div>
							<button v-else @click="removeImage(index)"
								class="absolute -top-1.5 -right-1.5 size-[18px] bg-[var(--text-primary)] text-[var(--bg-main)] rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/preview:opacity-100 transition-all scale-75 group-hover/preview:scale-100">
								<X :size="9" stroke-width="3.5" />
							</button>
						</div>
						<!-- Quick add button (multiple only) -->
						<button v-if="supportsMultipleImages" @click="triggerFileUpload"
							class="w-14 h-14 shrink-0 rounded-2xl border-2 border-dashed border-[var(--border-main)] flex items-center justify-center hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] transition-all">
							<Plus :size="16" class="text-[var(--text-tertiary)]" />
						</button>
					</div>

					<!-- Input Area -->
					<div
						class="overflow-auto ps-4 pe-2 bg-transparent pt-[1px] border-0 w-full text-[var(--text-primary)] placeholder:text-[var(--text-disable)] text-[15px] leading-[24px] min-h-[50px] max-h-[216px]">
						<div ref="inputRef" contenteditable="true" class="w-full outline-none font-normal"
							:data-placeholder="displayedPlaceholder" @input="handleInput"
							@keydown.enter="handleEnterKey" @paste="handlePaste"></div>
					</div>

					<!-- Bottom Row: Tools + Generate -->
					<div class="flex items-center justify-between gap-2 px-3">
						<!-- Tool Pills -->
						<div class="flex items-center gap-2 flex-wrap">
							<!-- Model Selector -->
							<ModelSelector capability="image_generation" class="mr-1" />

							<!-- Image Upload -->
							<div class="group/button relative" v-if="supportsImageUpload">
								<button @click="toggleImageUploadDropdown"
									class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
									:class="openImageUploadDropdown ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : uploadedImages.length > 0 ? 'border-[var(--border-main)]' : ''"
									:disabled="isUploading">
									<Loader2 v-if="isUploading" :size="16"
										class="animate-spin text-[var(--text-secondary)]" />
									<template v-else-if="uploadedImages.length > 0">
										<div class="relative shrink-0">
											<img :src="uploadedImages[0]?.url" class="w-4 h-4 rounded object-cover" />
											<div v-if="uploadedImages.length > 1"
												class="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-[var(--text-primary)] rounded-full text-[8px] text-[var(--bg-main)] flex items-center justify-center font-bold px-0.5 leading-none">
												{{ uploadedImages.length }}
											</div>
										</div>
									</template>
									<ImagePlus v-else :size="16" class="text-[var(--text-secondary)]" />
									<span class="text-[13px] font-medium text-[var(--text-primary)]">
										{{ uploadedImages.length > 0 ? `${uploadedImages.length}
										image${uploadedImages.length >
												1 ? 's' : ''}` : 'Image prompt' }}
									</span>
								</button>

								<!-- Popover -->
								<div v-if="openImageUploadDropdown"
									class="absolute bottom-[calc(100%+10px)] left-0 pb-2 z-[60] min-w-[300px]">
									<div class="rounded-2xl bg-[var(--bg-main)] border border-[var(--border-light)] p-4 shadow-lg flex flex-col gap-4"
										style="background-color: var(--bg-main)">
										<p
											class="text-[14px] font-medium text-[var(--text-primary)] text-center leading-snug px-2">
											Image prompts apply the style and content of any picture to your generation.
											Upload
											images or select from your asset library.</p>
										<div class="flex flex-col gap-2">
											<button @click="triggerUploadAndClose"
												class="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-full py-3 text-[14px] font-medium transition-colors">
												<div
													class="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
													<Plus :size="10" stroke-width="3" />
												</div>
												Upload
											</button>
											<button @click="selectAssetAndClose"
												class="w-full flex items-center justify-center gap-2 bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full py-3 text-[14px] font-medium transition-colors border border-[var(--border-main)] shadow-sm"
												style="background-color: var(--bg-main)">
												<ImagePlus :size="16" />
												Select asset
											</button>
										</div>
									</div>
								</div>
							</div>

							<!-- Dynamic Select Fields -->
							<div v-for="field in dynamicSelectFields" :key="field.key" class="relative">
								<!-- Aspect Ratio -->
								<template v-if="field.key === 'aspect_ratio'">
									<button @click="openDropdown = openDropdown === field.key ? null : field.key"
										class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
										:class="openDropdown === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : ''">
										<Square :size="16" class="text-[var(--text-secondary)]" />
										<span class="text-[13px] font-medium text-[var(--text-primary)]">{{
											dynamicParams[field.key] }}</span>
									</button>
									<div v-if="openDropdown === field.key"
										class="absolute bottom-full left-0 mb-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl shadow-lg p-6 z-[60] flex gap-8 items-center min-w-max"
										style="background-color: var(--bg-main)">
										<!-- Left: Ratio Buttons Grid -->
										<div class="flex flex-wrap gap-2 w-[280px]">
											<button v-for="r in field.options" :key="r"
												@click="dynamicParams[field.key] = r"
												class="px-3 py-2 rounded-xl text-[13px] font-bold border transition-all min-w-[64px] flex-1 text-center"
												:class="dynamicParams[field.key] === r ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--bg-main)] shadow-sm scale-[1.02]' : 'bg-transparent text-[var(--text-primary)] border-[var(--border-main)] hover:border-[var(--text-primary)]/20 hover:bg-[var(--bg-hover)]'">
												{{ r }}
											</button>
										</div>

										<!-- Right: Visual Preview -->
										<div
											class="relative flex items-center justify-center w-[160px] h-[160px] bg-transparent shrink-0">
											<!-- Dynamic Box -->
											<div class="relative bg-[var(--fill-tsp-gray-main)] rounded-xl border border-[var(--border-main)] transition-all duration-300 flex items-center justify-center overflow-hidden shadow-inner"
												:style="getPreviewStyle(dynamicParams[field.key])">
												<!-- 3x3 Grid -->
												<div
													class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
													<div v-for="i in 9" :key="i"
														class="border-[0.5px] border-[var(--border-main)] opacity-50">
													</div>
												</div>
											</div>
											<!-- Adjustment Handles -->
											<div
												class="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-[var(--text-tertiary)] rounded-full">
											</div>
											<div
												class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-[var(--text-tertiary)] rounded-full">
											</div>
											<div
												class="absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-3 bg-[var(--text-tertiary)] rounded-full">
											</div>
											<div
												class="absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-3 bg-[var(--text-tertiary)] rounded-full">
											</div>
										</div>
									</div>
								</template>

								<!-- Style Transfer -->
								<template v-else-if="field.key === 'style'">
									<button @click="openDropdown = openDropdown === field.key ? null : field.key"
										class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
										:class="openDropdown === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : ''">
										<Palette :size="16" class="text-[var(--text-secondary)]" />
										<span class="text-[13px] font-medium text-[var(--text-primary)]">
											{{ dynamicParams[field.key] === 'No Style' || !dynamicParams[field.key] ?
												'Style transfer' : dynamicParams[field.key] }}
										</span>
									</button>
									<div v-if="openDropdown === field.key"
										class="absolute bottom-full left-0 mb-3 w-48 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl shadow-lg p-1.5 z-[60] max-h-60 overflow-y-auto custom-scrollbar"
										style="background-color: var(--bg-main)">
										<button v-for="s in field.options" :key="s"
											@click="setParamAndClose(field.key, s)"
											class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left">
											<span class="text-[13px] font-medium"
												:class="dynamicParams[field.key] === s ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{
												s }}</span>
										</button>
									</div>
								</template>

								<!-- Generalized Tool (like Resolution) -->
								<template v-else>
									<button @click="openDropdown = openDropdown === field.key ? null : field.key"
										class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
										:class="openDropdown === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : ''">
										<Gem v-if="field.key === 'resolution'" :size="16"
											class="text-[var(--text-secondary)]" />
										<LayoutGrid v-else :size="16" class="text-[var(--text-secondary)]" />
										<span class="text-[13px] font-medium text-[var(--text-primary)]">
											<span v-if="field.key !== 'resolution'"
												class="uppercase font-bold text-[10px] tracking-wider opacity-60 mr-1">{{
												field.key }}:</span>{{ dynamicParams[field.key] }}
										</span>
									</button>
									<div v-if="openDropdown === field.key"
										class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl shadow-lg p-4 z-[60] min-w-[200px]"
										style="background-color: var(--bg-main)">
										<p
											class="text-[12px] font-medium text-[var(--text-tertiary)] mb-3 px-2 uppercase tracking-wide">
											{{ field.key.replace(/_/g, ' ') }}</p>
										<div
											class="flex flex-col gap-0.5 max-h-[180px] overflow-y-auto custom-scrollbar px-1 relative z-10">
											<button v-for="opt in field.options" :key="opt"
												@click="setParamAndClose(field.key, opt)"
												class="w-full flex items-center justify-between gap-3 py-2 px-3 rounded-[12px] group transition-all duration-200"
												:class="dynamicParams[field.key] === opt ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-md' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'">
												<span class="text-[13px] font-semibold tracking-tight">{{ opt }}</span>
												<div class="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
													:class="dynamicParams[field.key] === opt ? 'opacity-100' : ''">
													<Check :size="14" :stroke-width="3"
														:class="dynamicParams[field.key] === opt ? 'text-[var(--bg-main)]' : 'text-[var(--text-tertiary)]'" />
												</div>
											</button>
										</div>
									</div>
								</template>
							</div>

							<!-- Dynamic Number Fields (like Num Outputs) -->
							<div v-for="field in dynamicNumberFields" :key="field.key" class="relative">
								<button @click="openDropdown = openDropdown === field.key ? null : field.key"
									class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
									:class="openDropdown === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : ''">
									<Monitor :size="16" class="text-[var(--text-secondary)]" />
									<span class="text-[13px] font-medium text-[var(--text-primary)]">{{
										dynamicParams[field.key]
										}} Outputs</span>
								</button>
								<div v-if="openDropdown === field.key"
									class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl shadow-lg p-4 z-[60] min-w-[200px]"
									style="background-color: var(--bg-main)">
									<p
										class="text-[12px] font-medium text-[var(--text-tertiary)] mb-3 px-2 uppercase tracking-wide">
										Outputs Quantity</p>
									<div class="flex flex-wrap gap-2 justify-center max-w-[240px]">
										<button v-for="n in field.max - field.min + 1" :key="n"
											@click="setParamAndClose(field.key, n + field.min - 1)"
											class="size-10 rounded-xl font-bold flex items-center justify-center transition-colors border"
											:class="dynamicParams[field.key] === n + field.min - 1 ? 'bg-[var(--text-primary)] text-[var(--bg-main)] border-[var(--text-primary)] shadow-md' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-primary)]'">
											{{ n + field.min - 1 }}
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Generate Button -->
						<button @click="generateImage" :disabled="!prompt.trim()"
							class="flex items-center justify-center shrink-0 size-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] hover:opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none self-end relative">
							<Sparkles v-if="!isGenerating" :size="18" fill="currentColor" />
							<Loader2 v-else :size="18" class="animate-spin" />
						</button>
					</div>

					<!-- Hidden File Input -->
					<input type="file" ref="fileInput" class="hidden" accept="image/*"
						:multiple="supportsMultipleImages" @change="handleFileUpload" />
				</div>
			</div>
		</div>
	</div>

	<!-- Asset Picker Modal -->
	<AssetPickerModal :show="showAssetPicker" :multiple="supportsMultipleImages" file-type="image"
		@close="showAssetPicker = false" @select="onAssetsSelected" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Link2, ImagePlus, Palette, Square, Gem, Sparkle, Paperclip, Zap, Loader2, Monitor, X, Image as ImageIcon, Download, ChevronDown, LayoutGrid, Sparkles, Plus } from 'lucide-vue-next'
import { getModels, getAsyncTaskOutputs, uploadFile, getRecordPrompt, getRecordPrimaryUrl, getRecordModel, getRecordParams, type AIModel, type AsyncTaskRecord } from '@/utils/api'
import { useRouter } from 'vue-router'
import { useConversationStore } from '@/stores/conversation'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const conversationStore = useConversationStore()
const chatStore = useChatStore()

const activeTab = ref<'inspiration' | 'creations'>('inspiration')
const prompt = ref('')
interface ActiveTask {
	id: string
	taskId?: string
	prompt: string
	progress: number
	status: string
	imageUrl?: string
	usage?: any
}

const activeTasks = ref<ActiveTask[]>([])
const isGenerating = computed(() => activeTasks.value.length > 0)
const selectedCategory = ref('All')
const openDropdown = ref<string | null>(null)

// --- Typewriter Placeholder Effect ---
const displayedPlaceholder = ref('')
let typewriterInterval: ReturnType<typeof setInterval> | null = null

const runTypewriter = () => {
	if (typewriterInterval) clearInterval(typewriterInterval)
	displayedPlaceholder.value = ''
	let i = 0
	const text = 'Describe an image and click generate...'
	typewriterInterval = setInterval(() => {
		if (i < text.length) {
			displayedPlaceholder.value += text[i]
			i++
		} else {
			clearInterval(typewriterInterval!)
		}
	}, 20)
}

// Model & Options State
import { useModelStore } from '@/stores/models'
import ModelSelector from '@/components/ModelSelector.vue'

const modelStore = useModelStore()
const selectedModel = computed(() => modelStore.selectedModel)
const isImageModel = computed(() => {
	const model = selectedModel.value
	return model?.capabilities?.includes('image_generation') || model?.model_input?.capability === 'image_generation' || false
})

const dynamicParams = ref<Record<string, any>>({})

const modelInputFields = computed(() => {
	if (!isImageModel.value) return {}
	return selectedModel.value?.model_input?.fields || {}
})

const supportsImageUpload = computed(() => {
	const fields = modelInputFields.value
	return !!(fields['image'] || fields['images'] || fields['image_urls'] || fields['image_url'] || fields['input_images'] || fields['input_image'] || fields['init_image'] || fields['ref_image'])
})

const supportsMultipleImages = computed(() => {
	return 'input_images' in modelInputFields.value
})

const dynamicSelectFields = computed(() => {
	const fields = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if (field.type === 'select') {
			fields.push({ key, ...(field as any) })
		}
	}
	return fields
})

const dynamicNumberFields = computed(() => {
	const fields = []
	for (const [key, field] of Object.entries(modelInputFields.value)) {
		if (field.type === 'number') {
			fields.push({ key, ...(field as any) })
		}
	}
	return fields
})

watch(
	selectedModel,
	() => {
		if (selectedModel.value?.model_input?.fields) {
			const fields = selectedModel.value.model_input.fields
			dynamicParams.value = {}
			for (const [key, field] of Object.entries(fields)) {
				if (field.default !== undefined) {
					dynamicParams.value[key] = field.default
				} else if (field.options && field.options.length > 0) {
					dynamicParams.value[key] = field.options[0]
				} else if (field.type === 'number') {
					dynamicParams.value[key] = field.min || 1
				}
			}
		}
	},
	{ immediate: true },
)

// File Upload State
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedImages = ref<Array<{ key: string; url: string; uploading?: boolean }>>([])
const openImageUploadDropdown = ref(false)
const showAssetPicker = ref(false)
const inputRef = ref<HTMLDivElement | null>(null)

const onAssetsSelected = (assets: Array<{ key: string; url: string }>) => {
	if (supportsMultipleImages.value) {
		uploadedImages.value.push(...assets)
	} else {
		if (assets[0]) uploadedImages.value = [assets[0]]
	}
}

const categories = ['All', 'Trending', 'Sci-Fi', 'Nature', 'Portrait', 'Abstract']

const generatedImages = ref<AsyncTaskRecord[]>([])
const filteredGeneratedImages = computed(() => {
	const activeIds = new Set(activeTasks.value.map((t) => t.taskId).filter(Boolean))
	return generatedImages.value.filter((img) => !activeIds.has(img.provider_task_id))
})

const fetchHistory = async () => {
	try {
		const res = await getAsyncTaskOutputs({ capability: 'image', page_size: 50 })
		if (res.data && res.data.list) {
			generatedImages.value = res.data.list
		}
	} catch (error) {
		console.error('Failed to fetch history:', error)
	}
}

const controlBarRef = ref<HTMLDivElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
	if (openDropdown.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
		openDropdown.value = null
	}
	if (openImageUploadDropdown.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
		openImageUploadDropdown.value = false
	}
}

const toggleImageUploadDropdown = () => {
	openImageUploadDropdown.value = !openImageUploadDropdown.value
}

const triggerUploadAndClose = () => {
	triggerFileUpload()
	openImageUploadDropdown.value = false
}

const selectAssetAndClose = () => {
	openImageUploadDropdown.value = false
	showAssetPicker.value = true
}

const setParamAndClose = (key: string, val: any) => {
	dynamicParams.value[key] = val
	openDropdown.value = null
}

onMounted(() => {
	runTypewriter()
	fetchHistory()
	window.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
	window.removeEventListener('mousedown', handleClickOutside)
})

const triggerFocus = () => {
	if (inputRef.value) {
		inputRef.value.focus()
	}
}

const formatDate = (timestamp: number) => {
	if (!timestamp) return ''
	const date = new Date(timestamp * 1000)
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

const formatModel = (modelStr?: string) => {
	if (!modelStr) return 'STABLE DIFFUSION'
	// Remove provider prefix if exists
	const parts = modelStr.split(':')
	const name = parts.length > 1 ? parts[1] : parts[0]
	return (name || '').replace(/-/g, ' ').toUpperCase()
}

const exampleImages = [
	{ prompt: 'A mystical cyberpunk cat sitting on a neon rooftop, 8k cinematic.', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600' },
	{ prompt: 'Ethereal forest with floating islands and crystal waterfalls.', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600' },
	{ prompt: 'Hyper-realistic portrait of an iron knight with glowing blue eyes.', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600' },
	{ prompt: 'Vibrant futuristic sneaker design with energy circuits.', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600' },
	{ prompt: 'Retro-futuristic vaporwave city during sunset, pink and teal.', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600' },
	{ prompt: 'Ancient dragon made of black smoke and lightning clouds.', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600' },
]

const useExample = (examplePrompt: string) => {
	prompt.value = examplePrompt
	if (inputRef.value) {
		inputRef.value.innerText = examplePrompt
	}
	const mainEl = document.querySelector('main')
	if (mainEl) mainEl.scrollTo({ top: mainEl.scrollHeight, behavior: 'smooth' })
}

const handleInput = (e: Event) => {
	const target = e.target as HTMLDivElement
	prompt.value = target.innerText
}

const handleEnterKey = (e: KeyboardEvent) => {
	if (e.shiftKey) {
		// Let default behavior (new line) happen
		return
	}
	e.preventDefault()
	generateImage()
}

const handlePaste = (e: ClipboardEvent) => {
	e.preventDefault()
	const text = e.clipboardData?.getData('text/plain') || ''
	document.execCommand('insertText', false, text)
}

const triggerFileUpload = () => {
	fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
	const target = event.target as HTMLInputElement
	const files = target.files
	if (!files || files.length === 0) return

	openImageUploadDropdown.value = false
	const fileArray = Array.from(files)

	// Immediately show local blob previews
	const previews = fileArray.map((file) => ({
		key: '',
		url: URL.createObjectURL(file),
		uploading: true,
	}))

	if (supportsMultipleImages.value) {
		const startIndex = uploadedImages.value.length
		uploadedImages.value.push(...previews)
		// Upload each file and replace blob URL in-place
		for (let i = 0; i < fileArray.length; i++) {
			try {
				const res = await uploadFile(fileArray[i]!, 'generation')
				const item = uploadedImages.value[startIndex + i]
				if (res && item) {
					URL.revokeObjectURL(item.url)
					uploadedImages.value[startIndex + i] = { key: res.key, url: res.url, uploading: false }
				}
			} catch (error) {
				console.error('Failed to upload file:', error)
				uploadedImages.value.splice(startIndex + i, 1)
			}
		}
	} else {
		if (previews[0]) {
			uploadedImages.value = [previews[0]]
		}
		try {
			const res = await uploadFile(fileArray[0]!, 'generation')
			const item = uploadedImages.value[0]
			if (res && item) {
				URL.revokeObjectURL(item.url)
				const newImages: Array<{ key: string; url: string; uploading?: boolean }> = [{ key: res.key, url: res.url, uploading: false }]
				uploadedImages.value = newImages
			}
		} catch (error) {
			console.error('Failed to upload file:', error)
			uploadedImages.value = []
		}
	}

	if (fileInput.value) fileInput.value.value = ''
}

const removeImage = (index: number) => {
	uploadedImages.value.splice(index, 1)
}

const generateImage = async () => {
	if (!prompt.value.trim() || !selectedModel.value) return

	const currentPrompt = prompt.value
	prompt.value = ''
	if (inputRef.value) inputRef.value.innerText = ''

	const payload: { [key: string]: any } = {
		...dynamicParams.value,
	}

	const readyImages = uploadedImages.value.filter((i) => !i.uploading && i.url)
	const file_ids: string[] = []
	const image_urls: string[] = []
	const files: any[] = []

	if (readyImages.length > 0) {
		if ('input_images' in modelInputFields.value) {
			payload.input_images = readyImages.map((i) => i.url)
			image_urls.push(...readyImages.map((i) => i.key))
			files.push(...readyImages)
		} else if ('image' in modelInputFields.value) {
			payload.image = readyImages[0]?.url
			image_urls.push(readyImages[0]?.key || '')
			files.push(readyImages[0])
		}
	}

	const model = `${selectedModel.value.provider}:${selectedModel.value.model}`

	try {
		chatStore.setLoading(true)

		const conversationId = await conversationStore.createConversation({
			character_id: 1,
			model: model,
			model_id: selectedModel.value.id,
			group_id: conversationStore.selectedGroupId || 0,
			params: { ...payload, file_ids, image_urls, files },
			capability: 'image',
		})

		conversationStore.addMessage(conversationId, {
			role: 'user',
			content: currentPrompt,
		})

		chatStore.setPendingMessage(currentPrompt)

		uploadedImages.value = []

		router.push(`/chat/${conversationId}`)
	} catch (e) {
		console.error('Failed to start chat:', e)
		chatStore.setLoading(false)
	}
}

const getPreviewStyle = (ratio: string) => {
	const baseSize = 120
	let width = baseSize
	let height = baseSize

	switch (ratio) {
		case '4:3':
			height = (baseSize * 3) / 4
			break
		case '3:2':
			height = (baseSize * 2) / 3
			break
		case '16:9':
			height = (baseSize * 9) / 16
			break
		case '2.35:1':
			height = baseSize / 2.35
			break
		case '4:5':
			width = (baseSize * 4) / 5
			break
		case '2:3':
			width = (baseSize * 2) / 3
			break
		case '9:16':
			width = (baseSize * 9) / 16
			break
		case '1:1':
		default:
			width = baseSize
			height = baseSize
	}

	return {
		width: `${width}px`,
		height: `${height}px`,
	}
}

const handleDownload = (imageUrl: string) => {
	window.open(imageUrl, '_blank')
}
</script>

<style scoped lang="scss">
.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: var(--border-light) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: var(--border-light);
		border-radius: 10px;

		&:hover {
			background: var(--text-disable);
		}
	}
}

.no-scrollbar {
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

textarea::placeholder {
	color: var(--text-disable);
}

::selection {
	background: var(--background-selection);
	color: inherit;
}

[contenteditable]:empty:before {
	content: attr(data-placeholder);
	color: var(--text-disable);
	font-weight: 500;
	pointer-events: none;
	display: block;
}

[contenteditable] {
	white-space: pre-wrap;
	word-break: break-word;
}

.delay-75 {
	transition-delay: 75ms;
}

.delay-100 {
	transition-delay: 100ms;
}

/* Custom Shimmer/Pulse for empty state */
@keyframes pulse-slow {

	0%,
	100% {
		opacity: 0.1;
	}

	50% {
		opacity: 0.3;
	}
}

.animate-pulse-slow {
	animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes scanner {
	0% {
		transform: translateX(-100%);
		opacity: 0;
	}

	10% {
		opacity: 0.5;
	}

	50% {
		opacity: 1;
	}

	90% {
		opacity: 0.5;
	}

	100% {
		transform: translateX(100%);
		opacity: 0;
	}
}

.animate-scanner {
	animation: scanner 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes scan-y {
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

.animate-scan-y {
	animation: scan-y 3s linear infinite;
}

@keyframes noir-reveal {
	0% {
		filter: brightness(0) contrast(200%) blur(10px);
		opacity: 0;
		transform: scale(1.05);
	}

	50% {
		filter: brightness(1.5) contrast(150%) blur(5px);
		opacity: 0.8;
	}

	100% {
		filter: brightness(1) contrast(100%) blur(0);
		opacity: 1;
		transform: scale(1);
	}
}

.animate-noir-reveal {
	animation: noir-reveal 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes ping-slow {
	0% {
		transform: scale(1);
		opacity: 0.3;
	}

	100% {
		transform: scale(1.5);
		opacity: 0;
	}
}

.animate-ping-slow {
	animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.bg-mesh {
	background: radial-gradient(circle at 50% 50%, var(--bg-hover) 0%, var(--bg-main) 100%);
}

@keyframes rotate-progress {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

.animate-rotate-progress {
	animation: rotate-progress 2s linear infinite;
}

@keyframes float {

	0%,
	100% {
		transform: translateY(0) translateX(0);
	}

	33% {
		transform: translateY(-15px) translateX(10px);
	}

	66% {
		transform: translateY(-5px) translateX(-10px);
	}
}

.animate-float {
	animation: float 8s ease-in-out infinite;
}
</style>
