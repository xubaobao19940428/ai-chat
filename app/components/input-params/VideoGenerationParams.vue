<template>
	<!-- Reference Image (single: image field) -->
	<div v-if="showRefImage" class="relative group/chip">
		<button @click="fields.toggleDropdown('ref_image')" :disabled="isUploading" class="unified-pill"
			:class="fields.activeDropdown.value === 'ref_image' ? 'unified-pill-active' : refImageFile ? 'border-[var(--border-main)]' : ''">
			<Loader2 v-if="isUploading && uploadingParam === 'image'" :size="14" class="animate-spin text-[var(--text-secondary)]" />
			<template v-else-if="refImageFile">
				<img :src="refImageFile.url" class="w-4 h-4 rounded-sm object-cover shrink-0" />
			</template>
			<ImagePlus v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">Reference</span>
			<button v-if="refImageFile" @click.stop="$emit('remove-media', 'image')"
				class="ml-0.5 -mr-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors">
				<X :size="10" class="text-[var(--text-tertiary)]" />
			</button>
		</button>

		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === 'ref_image'"
				class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[250px]">
				<div class="unified-popover flex flex-col gap-4">
					<p class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
						Upload a reference image to guide generation.
					</p>
					<div class="flex flex-col gap-2">
						<button @click="$emit('trigger-upload', 'image')" class="unified-upload-btn-primary">
							<Plus :size="14" stroke-width="3" />
							Upload
						</button>
						<button @click="$emit('select-asset', 'image')" class="unified-upload-btn-secondary">
							<ImagePlus :size="14" />
							Select asset
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- Reference Images (multiple: input_images field) -->
	<div v-if="showRefImages" class="relative group/chip">
		<button @click="fields.toggleDropdown('ref_images')" :disabled="isUploading" class="unified-pill"
			:class="fields.activeDropdown.value === 'ref_images' ? 'unified-pill-active' : refImagesFiles.length > 0 ? 'border-[var(--border-main)]' : ''">
			<Loader2 v-if="isUploading && uploadingParam === 'input_images'" :size="14" class="animate-spin text-[var(--text-secondary)]" />
			<template v-else-if="refImagesFiles.length > 0">
				<div class="relative shrink-0">
					<img :src="refImagesFiles[0]?.url" class="w-4 h-4 rounded-sm object-cover" />
					<div v-if="refImagesFiles.length > 1"
						class="absolute -top-1.5 -right-1.5 min-w-[12px] h-[12px] bg-[var(--text-primary)] rounded-full text-[7px] text-[var(--bg-main)] flex items-center justify-center font-bold px-0.5 leading-none">
						{{ refImagesFiles.length }}
					</div>
				</div>
			</template>
			<Images v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">
				{{ refImagesFiles.length > 0 ? `${refImagesFiles.length} images` : 'Images' }}
			</span>
			<button v-if="refImagesFiles.length > 0" @click.stop="$emit('remove-media', 'input_images')"
				class="ml-0.5 -mr-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors">
				<X :size="10" class="text-[var(--text-tertiary)]" />
			</button>
		</button>

		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === 'ref_images'"
				class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[250px]">
				<div class="unified-popover flex flex-col gap-4">
					<p class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
						Upload multiple reference images.
					</p>
					<div class="flex flex-col gap-2">
						<button @click="$emit('trigger-upload', 'input_images')" class="unified-upload-btn-primary">
							<Plus :size="14" stroke-width="3" />
							Upload
						</button>
						<button @click="$emit('select-asset', 'input_images')" class="unified-upload-btn-secondary">
							<ImagePlus :size="14" />
							Select asset
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- Start Frame (init_image) -->
	<div v-if="showStartFrame" class="relative group/chip">
		<button @click="fields.toggleDropdown('start_frame')" :disabled="isUploading" class="unified-pill"
			:class="fields.activeDropdown.value === 'start_frame' ? 'unified-pill-active' : startFrameFile ? 'border-[var(--border-main)]' : ''">
			<Loader2 v-if="isUploading && uploadingParam === 'init_image'" :size="14" class="animate-spin text-[var(--text-secondary)]" />
			<template v-else-if="startFrameFile">
				<img :src="startFrameFile.url" class="w-4 h-4 rounded-sm object-cover shrink-0" />
			</template>
			<ImagePlus v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">Start frame</span>
			<button v-if="startFrameFile" @click.stop="$emit('remove-media', 'init_image')"
				class="ml-0.5 -mr-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors">
				<X :size="10" class="text-[var(--text-tertiary)]" />
			</button>
		</button>

		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === 'start_frame'"
				class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[250px]">
				<div class="unified-popover flex flex-col gap-4">
					<p class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
						Start frame anchors the opening of your video.
					</p>
					<div class="flex flex-col gap-2">
						<button @click="$emit('trigger-upload', 'init_image')" class="unified-upload-btn-primary">
							<Plus :size="14" stroke-width="3" />
							Upload
						</button>
						<button @click="$emit('select-asset', 'init_image')" class="unified-upload-btn-secondary">
							<ImagePlus :size="14" />
							Select asset
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- End Frame (end_image) -->
	<div v-if="showEndFrame" class="relative group/chip">
		<button @click="fields.toggleDropdown('end_frame')" :disabled="isUploading" class="unified-pill"
			:class="fields.activeDropdown.value === 'end_frame' ? 'unified-pill-active' : endFrameFile ? 'border-[var(--border-main)]' : ''">
			<Loader2 v-if="isUploading && uploadingParam === 'end_image'" :size="14" class="animate-spin text-[var(--text-secondary)]" />
			<template v-else-if="endFrameFile">
				<img :src="endFrameFile.url" class="w-4 h-4 rounded-sm object-cover shrink-0" />
			</template>
			<ImagePlus v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">End frame</span>
			<button v-if="endFrameFile" @click.stop="$emit('remove-media', 'end_image')"
				class="ml-0.5 -mr-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors">
				<X :size="10" class="text-[var(--text-tertiary)]" />
			</button>
		</button>

		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === 'end_frame'"
				class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[250px]">
				<div class="unified-popover flex flex-col gap-4">
					<p class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
						End frame anchors the ending of your video.
					</p>
					<div class="flex flex-col gap-2">
						<button @click="$emit('trigger-upload', 'end_image')" class="unified-upload-btn-primary">
							<Plus :size="14" stroke-width="3" />
							Upload
						</button>
						<button @click="$emit('select-asset', 'end_image')" class="unified-upload-btn-secondary">
							<ImagePlus :size="14" />
							Select asset
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- Reference Video (single: video field) -->
	<div v-if="showRefVideo" class="relative group/chip">
		<button @click="fields.toggleDropdown('ref_video')" :disabled="isUploading" class="unified-pill"
			:class="fields.activeDropdown.value === 'ref_video' ? 'unified-pill-active' : refVideoFile ? 'border-[var(--border-main)]' : ''">
			<Loader2 v-if="isUploading && uploadingParam === 'video'" :size="14" class="animate-spin text-[var(--text-secondary)]" />
			<template v-else-if="refVideoFile">
				<Video :size="14" class="text-green-500" />
			</template>
			<Video v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">{{ refVideoFile ? 'Video ✓' : 'Video' }}</span>
			<button v-if="refVideoFile" @click.stop="$emit('remove-media', 'video')"
				class="ml-0.5 -mr-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors">
				<X :size="10" class="text-[var(--text-tertiary)]" />
			</button>
		</button>

		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === 'ref_video'"
				class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[250px]">
				<div class="unified-popover flex flex-col gap-4">
					<p class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
						Upload a reference video.
					</p>
					<div class="flex flex-col gap-2">
						<button @click="$emit('trigger-upload', 'video')" class="unified-upload-btn-primary">
							<Plus :size="14" stroke-width="3" />
							Upload
						</button>
						<button @click="$emit('select-asset', 'video')" class="unified-upload-btn-secondary">
							<Video :size="14" />
							Select asset
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- Reference Videos (multiple: input_videos field) -->
	<div v-if="showRefVideos" class="relative group/chip">
		<button @click="fields.toggleDropdown('ref_videos')" :disabled="isUploading" class="unified-pill"
			:class="fields.activeDropdown.value === 'ref_videos' ? 'unified-pill-active' : refVideosFiles.length > 0 ? 'border-[var(--border-main)]' : ''">
			<Loader2 v-if="isUploading && uploadingParam === 'input_videos'" :size="14" class="animate-spin text-[var(--text-secondary)]" />
			<template v-else-if="refVideosFiles.length > 0">
				<Video :size="14" class="text-green-500" />
			</template>
			<Video v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">
				{{ refVideosFiles.length > 0 ? `${refVideosFiles.length} videos` : 'Videos' }}
			</span>
			<button v-if="refVideosFiles.length > 0" @click.stop="$emit('remove-media', 'input_videos')"
				class="ml-0.5 -mr-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors">
				<X :size="10" class="text-[var(--text-tertiary)]" />
			</button>
		</button>

		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === 'ref_videos'"
				class="absolute bottom-full left-0 mb-2 pb-2 z-[60] min-w-[250px]">
				<div class="unified-popover flex flex-col gap-4">
					<p class="text-[13px] font-medium text-[var(--text-primary)] text-center leading-snug px-1">
						Upload multiple reference videos.
					</p>
					<div class="flex flex-col gap-2">
						<button @click="$emit('trigger-upload', 'input_videos')" class="unified-upload-btn-primary">
							<Plus :size="14" stroke-width="3" />
							Upload
						</button>
						<button @click="$emit('select-asset', 'input_videos')" class="unified-upload-btn-secondary">
							<Video :size="14" />
							Select asset
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- Dynamic Select Fields (aspect_ratio, duration, resolution, style, etc.) -->
	<div v-for="field in fields.dynamicSelectFields.value" :key="field.key" class="relative group/chip">
		<!-- Aspect Ratio -->
		<template v-if="field.key === 'aspect_ratio'">
			<button ref="ratioPillRef" @click="fields.toggleDropdown(field.key)" class="unified-pill"
				:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
				<Square :size="14" class="text-[var(--text-secondary)]" />
				<span class="unified-pill-text">{{ getParamValue(field.key, field.default) }}</span>
			</button>
			<Teleport to="body">
				<Transition enter-active-class="transition duration-150 ease-out"
					enter-from-class="translate-y-1 opacity-0 scale-95"
					enter-to-class="translate-y-0 opacity-100 scale-100"
					leave-active-class="transition duration-100 ease-in"
					leave-from-class="translate-y-0 opacity-100"
					leave-to-class="translate-y-1 opacity-0">
					<div v-if="fields.activeDropdown.value === field.key" ref="ratioPopoverRef"
						data-ratio-popover class="fixed z-[9999]" :style="ratioPopoverStyle">
						<div class="p-6 flex gap-8 items-center min-w-max rounded-2xl border border-[var(--border-light)] bg-[var(--bg-main)] shadow-[0_20px_25px_-5px_rgb(0_0_0/0.1),0_8px_10px_-6px_rgb(0_0_0/0.1)]">
							<!-- Left: Ratio Buttons Grid -->
							<div class="flex flex-wrap gap-2 w-[280px]">
								<button v-for="opt in field.options" :key="opt"
									@click="fields.setParamAndClose(field.key, opt)"
									class="px-3 py-2 rounded-xl text-[13px] font-bold border transition-all min-w-[64px] flex-1 text-center"
									:class="getParamValue(field.key, field.default) === opt ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--bg-main)] shadow-sm scale-[1.02]' : 'bg-transparent text-[var(--text-primary)] border-[var(--border-main)] hover:border-[var(--text-primary)]/20 hover:bg-[var(--bg-hover)]'">
									{{ opt }}
								</button>
							</div>
							<!-- Right: Visual Preview -->
							<div
								class="relative flex items-center justify-center w-[160px] h-[160px] bg-transparent shrink-0">
								<div class="relative bg-[var(--fill-tsp-gray-main)] rounded-xl border border-[var(--border-main)] transition-all duration-300 flex items-center justify-center overflow-hidden shadow-inner"
									:style="fields.getPreviewStyle(getParamValue(field.key, field.default))">
									<div class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
										<div v-for="i in 9" :key="i"
											class="border-[0.5px] border-[var(--border-main)] opacity-50"></div>
									</div>
								</div>
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
					</div>
				</Transition>
			</Teleport>
		</template>

		<!-- Duration -->
		<template v-else-if="field.key === 'duration'">
			<button @click="fields.toggleDropdown(field.key)" class="unified-pill"
				:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
				<Clock :size="14" class="text-[var(--text-secondary)]" />
				<span class="unified-pill-text">{{ getParamValue(field.key, field.default) }}s</span>
			</button>
			<Transition enter-active-class="transition duration-150 ease-out"
				enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
				leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
				leave-to-class="translate-y-1 opacity-0">
				<div v-if="fields.activeDropdown.value === field.key"
					class="absolute bottom-full left-0 mb-2 z-[60] min-w-[170px]">
					<div class="unified-popover p-3.5">
						<p class="text-[10px] font-bold text-[var(--text-tertiary)] mb-2.5 px-1 uppercase tracking-widest text-center">Duration</p>
						<div class="flex flex-col gap-1 max-h-[220px] overflow-y-auto custom-scrollbar">
							<button v-for="opt in field.options" :key="opt"
								@click="fields.setParamAndClose(field.key, opt)"
								class="w-full flex items-center justify-between gap-4 py-2.5 px-3 rounded-xl group transition-all"
								:class="getParamValue(field.key, field.default) === opt ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-sm' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'">
								<span class="text-[13px] font-bold">{{ opt }}s</span>
								<div class="flex items-center justify-center">
									<div v-if="getParamValue(field.key, field.default) === opt"
										class="w-4 h-4 rounded-full flex items-center justify-center" style="background-color: var(--bg-main)">
										<Check :size="10" style="color: var(--text-primary)" stroke-width="4" />
									</div>
									<div v-else class="w-4 h-4 rounded-full border-[2px] border-black/20 dark:border-white/20"></div>
								</div>
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</template>

		<!-- Style Transfer -->
		<template v-else-if="field.key === 'style'">
			<button @click="fields.toggleDropdown(field.key)" class="unified-pill"
				:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
				<Palette :size="14" class="text-[var(--text-secondary)]" />
				<span class="unified-pill-text">
					{{ getParamValue(field.key, field.default) === 'No Style' || !getParamValue(field.key, field.default) ? 'Style' : getParamValue(field.key, field.default) }}
				</span>
			</button>
			<Transition enter-active-class="transition duration-150 ease-out" enter-from-class="translate-y-1 opacity-0"
				enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-100 ease-in"
				leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
				<div v-if="fields.activeDropdown.value === field.key"
					class="absolute bottom-full left-0 mb-2 w-44 z-[60] max-h-56 overflow-y-auto custom-scrollbar">
					<div class="unified-popover p-1.5">
						<button v-for="s in field.options" :key="s" @click="fields.setParamAndClose(field.key, s)"
							class="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left">
							<span class="text-[12px] font-medium"
								:class="getParamValue(field.key, field.default) === s ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">{{ s }}</span>
						</button>
					</div>
				</div>
			</Transition>
		</template>

		<!-- Generic Select (resolution, audio_enabled, etc.) -->
		<template v-else>
			<button @click="fields.toggleDropdown(field.key)" class="unified-pill"
				:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
				<Gem v-if="field.key === 'resolution'" :size="14" class="text-[var(--text-secondary)]" />
				<LayoutGrid v-else :size="14" class="text-[var(--text-secondary)]" />
				<span class="unified-pill-text">
					<span v-if="field.key !== 'resolution'" class="uppercase font-bold text-[9px] tracking-wider opacity-60 mr-1">{{ field.key.substring(0, 3) }}:</span>
					{{ getParamValue(field.key, field.default) }}
				</span>
			</button>
			<Transition enter-active-class="transition duration-150 ease-out"
				enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
				leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
				leave-to-class="translate-y-1 opacity-0">
				<div v-if="fields.activeDropdown.value === field.key"
					class="absolute bottom-full left-0 mb-2 z-[60] min-w-[170px]">
					<div class="unified-popover p-3.5">
						<p class="text-[10px] font-bold text-[var(--text-tertiary)] mb-2.5 px-1 uppercase tracking-widest text-center">
							{{ field.label || field.key.replace(/_/g, ' ') }}</p>
						<div class="flex flex-col gap-1 max-h-[220px] overflow-y-auto custom-scrollbar">
							<button v-for="opt in field.options" :key="opt"
								@click="fields.setParamAndClose(field.key, opt)"
								class="w-full flex items-center justify-between gap-4 py-2.5 px-3 rounded-xl group transition-all"
								:class="getParamValue(field.key, field.default) === opt ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-sm' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'">
								<span class="text-[13px] font-bold">{{ opt }}</span>
								<div class="flex items-center justify-center">
									<div v-if="getParamValue(field.key, field.default) === opt"
										class="w-4 h-4 rounded-full flex items-center justify-center" style="background-color: var(--bg-main)">
										<Check :size="10" style="color: var(--text-primary)" stroke-width="4" />
									</div>
									<div v-else class="w-4 h-4 rounded-full border-[2px] border-black/20 dark:border-white/20"></div>
								</div>
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</template>
	</div>

	<!-- Dynamic Number Fields (duration, num_outputs, etc.) -->
	<div v-for="field in fields.dynamicNumberFields.value" :key="field.key" class="relative group/chip">
		<button @click="fields.toggleDropdown(field.key)" class="unified-pill"
			:class="fields.activeDropdown.value === field.key ? 'unified-pill-active' : ''">
			<Clock v-if="field.key === 'duration'" :size="14" class="text-[var(--text-secondary)]" />
			<Monitor v-else :size="14" class="text-[var(--text-secondary)]" />
			<span class="unified-pill-text">
				{{ getParamValue(field.key, field.default) }}{{ field.key === 'duration' ? 's' : ` ${field.label || field.key.replace(/_/g, ' ')}` }}
			</span>
		</button>
		<Transition enter-active-class="transition duration-150 ease-out"
			enter-from-class="translate-y-1 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0">
			<div v-if="fields.activeDropdown.value === field.key"
				class="absolute bottom-full left-0 mb-2 z-[60]"
				:class="field.max - field.min > 10 ? 'min-w-[220px]' : 'min-w-[170px]'">
				<div class="unified-popover p-3.5">
					<p class="text-[10px] font-bold text-[var(--text-tertiary)] mb-2.5 px-1 uppercase tracking-widest text-center">
						{{ field.key === 'duration' ? 'Duration' : (field.label || field.key.replace(/_/g, ' ')) }}
					</p>

					<!-- Slider UI for large ranges (>10) -->
					<template v-if="field.max - field.min > 10">
						<div class="flex items-center gap-2.5 mb-2">
							<button @click="adjustNumber(field.key, field.min, field.max, field.default, -1)"
								class="size-7 rounded-lg flex items-center justify-center border border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors text-sm font-bold shrink-0">
								−
							</button>
							<div class="flex-1 text-center">
								<span class="text-[18px] font-black text-[var(--text-primary)] tabular-nums">
									{{ getParamValue(field.key, field.default) }}
								</span>
								<span v-if="field.key === 'duration'" class="text-[11px] text-[var(--text-tertiary)] font-medium ml-0.5">s</span>
							</div>
							<button @click="adjustNumber(field.key, field.min, field.max, field.default, 1)"
								class="size-7 rounded-lg flex items-center justify-center border border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors text-sm font-bold shrink-0">
								+
							</button>
						</div>
						<div class="relative px-0.5">
							<input type="range"
								:min="field.min" :max="field.max" :step="1"
								:value="getParamValue(field.key, field.default)"
								@input="(e: Event) => fields.setParam(field.key, Number((e.target as HTMLInputElement).value))"
								class="number-slider w-full" />
							<div class="flex justify-between mt-1">
								<span class="text-[9px] text-[var(--text-tertiary)] font-medium">{{ field.min }}{{ field.key === 'duration' ? 's' : '' }}</span>
								<span class="text-[9px] text-[var(--text-tertiary)] font-medium">{{ field.max }}{{ field.key === 'duration' ? 's' : '' }}</span>
							</div>
						</div>
					</template>

					<!-- Button grid for small ranges (≤10) -->
					<div v-else class="flex flex-wrap gap-1.5 justify-center">
						<button v-for="n in field.max - field.min + 1" :key="n"
							@click="fields.setParamAndClose(field.key, n + field.min - 1)"
							class="size-9 rounded-xl font-bold flex items-center justify-center transition-all border text-[13px]"
							:class="getParamValue(field.key, field.default) === n + field.min - 1 ? 'bg-[var(--text-primary)] text-[var(--bg-main)] border-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-primary)]'">
							{{ n + field.min - 1 }}{{ field.key === 'duration' ? 's' : '' }}
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { ImagePlus, Images, Loader2, Plus, Palette, Gem, Square, Clock, LayoutGrid, Monitor, Check, X, Video } from 'lucide-vue-next'
import type { useInputFields } from '~/composables/useInputFields'
import type { UploadedFile } from '~/composables/useFileUpload'

const props = defineProps<{
	fields: ReturnType<typeof useInputFields>
	/** All uploaded files (with paramKey tags) */
	allFiles: UploadedFile[]
	isUploading: boolean
	externalParams?: Record<string, any>
	/** Which paramKey is currently being uploaded */
	uploadingParam?: string | null
}>()

defineEmits<{
	'trigger-upload': [paramKey: string]
	'select-asset': [paramKey: string]
	'remove-media': [paramKey: string]
}>()

// --- Visibility based on model fields ---
const modelFields = computed(() => props.fields.modelInputFields.value)

const showRefImage = computed(() => !!modelFields.value.image)
const showRefImages = computed(() => !!modelFields.value.input_images)
const showStartFrame = computed(() => !!(modelFields.value.init_image || modelFields.value.start_image))
const showEndFrame = computed(() => !!modelFields.value.end_image)
const showRefVideo = computed(() => !!modelFields.value.video)
const showRefVideos = computed(() => !!modelFields.value.input_videos)

// --- File getters by paramKey ---
const refImageFile = computed(() => props.allFiles.find(f => f.paramKey === 'image') || null)
const refImagesFiles = computed(() => props.allFiles.filter(f => f.paramKey === 'input_images'))
const startFrameFile = computed(() => props.allFiles.find(f => f.paramKey === 'init_image') || null)
const endFrameFile = computed(() => props.allFiles.find(f => f.paramKey === 'end_image') || null)
const refVideoFile = computed(() => props.allFiles.find(f => f.paramKey === 'video') || null)
const refVideosFiles = computed(() => props.allFiles.filter(f => f.paramKey === 'input_videos'))

function getParamValue(key: string, defaultVal: any) {
	if (props.externalParams) return props.externalParams[key] ?? defaultVal
	return props.fields.dynamicParams.value[key] ?? defaultVal
}

function adjustNumber(key: string, min: number, max: number, defaultVal: any, delta: number) {
	const current = Number(getParamValue(key, defaultVal))
	const next = Math.min(max, Math.max(min, current + delta))
	props.fields.setParam(key, next)
}

const ratioPillRef = ref<HTMLElement | null>(null)
const ratioPopoverRef = ref<HTMLElement | null>(null)
const ratioPopoverStyle = ref<Record<string, string>>({ visibility: 'hidden' })

watch(() => props.fields.activeDropdown.value, async (val) => {
	if (val === 'aspect_ratio') {
		// First render offscreen to measure
		ratioPopoverStyle.value = { visibility: 'hidden' }
		await nextTick()
		positionRatioPopover()
	}
})

function positionRatioPopover() {
	const pill = Array.isArray(ratioPillRef.value) ? ratioPillRef.value[0] : ratioPillRef.value
	const popover = Array.isArray(ratioPopoverRef.value) ? ratioPopoverRef.value[0] : ratioPopoverRef.value
	if (!pill || !popover) return

	const pillRect = pill.getBoundingClientRect()
	const popoverRect = popover.getBoundingClientRect()
	const vw = window.innerWidth
	const MARGIN = 16
	const GAP = 21

	// Vertical: above the pill, matching `bottom-full mb-2` behavior
	const top = pillRect.top - popoverRect.height - GAP

	// Horizontal: center on the pill, then clamp within viewport
	let left = pillRect.left + pillRect.width / 2 - popoverRect.width / 2
	left = Math.max(MARGIN, Math.min(left, vw - popoverRect.width - MARGIN))

	ratioPopoverStyle.value = {
		top: `${Math.max(MARGIN, top)}px`,
		left: `${left}px`,
	}
}
</script>

<style scoped>
.unified-pill {
	display: flex; align-items: center; gap: 0.5rem; height: 34px; padding: 0 0.75rem;
	border-radius: 9999px; background: var(--fill-tsp-gray-main); border: 1px solid transparent;
	transition: all 0.15s; cursor: pointer;
}
.unified-pill:hover { background: var(--bg-hover); border-color: var(--border-main); }
.unified-pill-active { border-color: var(--border-main); background: var(--bg-hover); }
.unified-pill-text { font-size: 12px; font-weight: 500; color: var(--text-primary); }
.unified-popover {
	border-radius: 1rem; background-color: var(--bg-main); border: 1px solid var(--border-light);
	padding: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
.unified-upload-btn-primary {
	width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
	background: black; color: white; border-radius: 9999px; padding: 0.625rem 0;
	font-size: 13px; font-weight: 700; transition: colors 0.15s;
}
:root.dark .unified-upload-btn-primary { background: white; color: black; }
.unified-upload-btn-secondary {
	width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
	background-color: var(--bg-main); color: var(--text-primary); border-radius: 9999px;
	padding: 0.625rem 0; font-size: 13px; font-weight: 700; transition: colors 0.15s;
	border: 1px solid var(--border-main); box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-dark); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }

/* Number slider */
.number-slider {
	-webkit-appearance: none;
	appearance: none;
	height: 4px;
	border-radius: 2px;
	background: var(--border-main);
	outline: none;
	cursor: pointer;
}
.number-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: var(--text-primary);
	border: 2px solid var(--bg-main);
	box-shadow: 0 1px 3px rgba(0,0,0,0.2);
	cursor: pointer;
	transition: transform 0.1s;
}
.number-slider::-webkit-slider-thumb:hover {
	transform: scale(1.15);
}
.number-slider::-moz-range-thumb {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: var(--text-primary);
	border: 2px solid var(--bg-main);
	box-shadow: 0 1px 3px rgba(0,0,0,0.2);
	cursor: pointer;
}
.number-slider::-moz-range-track {
	height: 4px;
	border-radius: 2px;
	background: var(--border-main);
}
</style>
