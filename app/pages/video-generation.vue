<template>
    <div
        class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">

        <!-- Tab Switcher (Fixed at Top, Outside Scroll Area) -->
        <div class="flex justify-center py-4 bg-[var(--background-gray-main)] border-b border-transparent">
            <div
                class="bg-[var(--fill-tsp-gray-main)] p-1 rounded-full border border-[var(--border-main)] flex items-center">
                <button @click="activeTab = 'inspiration'"
                    class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
                    :class="activeTab === 'inspiration' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
                    Inspiration
                </button>
                <button @click="activeTab = 'creations'"
                    class="px-6 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200"
                    :class="activeTab === 'creations' ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
                    My Videos
                </button>
            </div>
        </div>

        <!-- Category Filter Chips (Fixed, Outside Scroll Area) -->
        <div v-if="activeTab === 'inspiration'" class="flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
            <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="[
                'px-4 py-1.5 text-[13px] font-medium rounded-full border transition-all whitespace-nowrap',
                selectedCategory === cat
                    ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm'
                    : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]'
            ]">
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
                        <div v-for="(example, index) in exampleVideos" :key="index"
                            class="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-card)] border border-[var(--border-main)] hover:border-[var(--text-tertiary)] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                            @click="useExample(example.prompt)">
                            <img :src="example.thumbnail"
                                class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                :alt="example.prompt" />
                            <!-- Play Icon Overlay -->
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div
                                    class="size-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play :size="28" class="text-white ml-1" fill="currentColor" />
                                </div>
                            </div>
                            <div
                                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                <p class="text-white text-[13px] font-medium line-clamp-2 italic mb-3 leading-snug">"{{
                                    example.prompt
                                }}"</p>
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
                    <!-- Enhanced Empty State -->
                    <div v-if="generatedVideos.length === 0" class="py-40 flex flex-col items-center justify-center">
                        <div class="relative mb-8">
                            <div
                                class="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-150 animate-pulse-slow">
                            </div>
                            <div
                                class="relative size-24 rounded-[32px] bg-[var(--bg-main)] border border-[var(--border-main)] flex items-center justify-center shadow-2xl">
                                <Film :size="40" class="text-purple-500" />
                            </div>
                            <div
                                class="absolute -right-2 -bottom-2 size-10 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100 rotate-12">
                                <Sparkles :size="20" class="text-amber-500" />
                            </div>
                        </div>
                        <h3 class="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Your Video Gallery
                            Awaits</h3>
                        <p
                            class="text-[var(--text-tertiary)] text-[15px] mt-2 max-w-[280px] text-center leading-relaxed">
                            Transform your ideas into stunning videos. Every creation will be preserved here.
                        </p>
                        <button @click="triggerFocus"
                            class="mt-8 px-8 py-3 bg-[var(--text-primary)] text-white rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95">
                            Start Creating
                        </button>
                    </div>

                    <!-- Premium Video Gallery Grid -->
                    <div v-else class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        <div v-for="(video, index) in generatedVideos" :key="index"
                            class="break-inside-avoid group relative rounded-[24px] overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-purple-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">

                            <!-- Video Container -->
                            <div class="relative overflow-hidden aspect-video">
                                <img v-if="!playingVideoId || playingVideoId !== video.id" :src="video.thumbnail"
                                    class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                                <video v-else :src="getRecordPrimaryUrl(video)" class="w-full h-full object-cover" controls autoplay
                                    playsinline></video>
                                <div class="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[24px]"></div>

                                <!-- Play Button Overlay -->
                                <div v-if="!playingVideoId || playingVideoId !== video.id"
                                    class="absolute inset-0 flex items-center justify-center cursor-pointer"
                                    @click="playingVideoId = video.id">
                                    <div
                                        class="size-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                                        <Play :size="28" class="text-white ml-1" fill="currentColor" />
                                    </div>
                                </div>

                                <!-- Duration Badge -->
                                <div
                                    class="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                                    {{ formatDuration(5) }}
                                </div>
                            </div>

                            <!-- Content Overlay (Sophisticated Gradient) -->
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-5 pointer-events-none group-hover:pointer-events-auto">

                                <!-- Top Actions (Glassmorphism) -->
                                <div
                                    class="flex justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                    <button @click.stop="handleDownload(getRecordPrimaryUrl(video))"
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
                                            {{ formatModel(getRecordModel(video)) }}
                                        </span>
                                        <span class="text-[10px] font-medium text-white/60">
                                            {{ formatDate(video.created_at) }}
                                        </span>
                                    </div>
                                    <p
                                        class="text-white text-[13px] font-medium mb-4 line-clamp-3 leading-relaxed italic">
                                        "{{ getRecordPrompt(video) || 'No description' }}"
                                    </p>
                                    <button @click.stop="useExample(getRecordPrompt(video))"
                                        class="w-full py-2.5 bg-white text-black rounded-xl font-bold text-[12px] hover:bg-purple-50 transition-colors shadow-xl flex items-center justify-center gap-2 group/reuse">
                                        <Zap :size="14" fill="currentColor"
                                            class="text-purple-600 group-hover/reuse:animate-pulse" />
                                        Reuse Prompt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Floating Pill Control Bar (Bottom) - Krea Style -->
        <div class="absolute bottom-12 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
            <div class="w-full max-w-[760px] relative pointer-events-auto">

                <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0">
                    <div v-if="isGenerating"
                        class="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-full shadow-lg">
                        <Loader2 :size="14" class="animate-spin text-purple-500" />
                        <span class="text-[11px] font-bold text-[var(--text-primary)]">
                            {{ generationProgress }}% Generating... (~{{ estimatedTimeRemaining }})
                        </span>
                    </div>
                </transition>

                <div ref="controlBarRef"
                    class="bg-[var(--bg-main)] rounded-[40px] border border-[var(--border-main)] p-5 shadow-[var(--shadow-pill)] flex flex-col gap-4 transition-all">
                    <div class="flex w-full min-w-0 flex-col gap-2">

                        <!-- Input Area -->
                        <div class="px-2">
                            <textarea v-model="prompt"
                                class="w-full bg-transparent border-none text-[var(--text-primary)] focus:outline-none font-medium text-[17px] py-1 max-h-32 overflow-y-auto no-scrollbar relative min-h-[28px] outline-none resize-none px-0"
                                placeholder="Describe a video and click generate..." autocomplete="off" rows="1"
                                @keydown.enter="handleEnterKey"></textarea>
                        </div>

                        <!-- Bottom Row: Tools + Generate -->
                        <div class="flex justify-between gap-2 px-1 mt-auto">
                            <!-- Tool Pills -->
                            <div class="flex items-center gap-1 flex-wrap">
                                <!-- Model Selector -->
                                <ModelSelector capability="video_generation" class="mr-1" />

                                <!-- Start Frame Upload with Popover -->
                                <input type="file" ref="fileInput" accept="image/png, image/jpeg, video/mp4"
                                    class="hidden" @change="handleFileUpload" />
                                <div class="group/button relative" v-if="supportsImageUpload">
                                    <button @click="openStartFrameDropdown = !openStartFrameDropdown"
                                        class="focus-visible:ring-ring/50 inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap outline-none disabled:pointer-events-none disabled:opacity-50 h-[30px] px-4 py-1.5 rounded-full shadow-none bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
                                        :class="openStartFrameDropdown ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'"
                                        type="button" :disabled="isUploading">
                                        <ImagePlus v-if="!isUploading && !previewImageUrl" :size="14" />
                                        <Loader2 v-else-if="isUploading" :size="14" class="animate-spin" />
                                        <img v-else-if="previewImageUrl" :src="previewImageUrl"
                                            class="w-4 h-4 rounded-sm object-cover" />
                                        Start frame
                                    </button>

                                    <!-- Start Frame Popover -->
                                    <div v-if="openStartFrameDropdown"
                                        class="absolute bottom-[36px] left-0 pb-2 z-[60] min-w-[300px]">
                                        <div class="rounded-2xl bg-[var(--bg-main)] border border-[var(--border-light)] p-4 shadow-lg min-w-[300px] flex flex-col gap-4"
                                            style="background-color: var(--bg-main);">
                                            <p
                                                class="text-[14px] font-medium text-[var(--text-primary)] text-center leading-snug px-2">
                                                Start frame anchors the opening of your video. Upload an image/video or
                                                select one from your assets.
                                            </p>

                                            <div class="flex flex-col gap-2">
                                                <!-- Upload Button -->
                                                <button @click="triggerFileUpload(); openStartFrameDropdown = false"
                                                    class="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-full py-3 text-[14px] font-medium transition-colors">
                                                    <div
                                                        class="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                                                        <Plus :size="10" stroke-width="3" />
                                                    </div>
                                                    Upload
                                                </button>

                                                <!-- Select Asset Button -->
                                                <button @click="openStartFrameDropdown = false; showAssetPicker = true"
                                                    class="w-full flex items-center justify-center gap-2 bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-full py-3 text-[14px] font-medium transition-colors border border-[var(--border-main)] shadow-sm"
                                                    style="background-color: var(--bg-main);">
                                                    <ImagePlus :size="16" />
                                                    Select asset
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <!-- Dynamic Select Fields -->
                                <div v-for="field in dynamicSelectFields" :key="field.key"
                                    class="group/button relative">

                                    <!-- 1. Aspect Ratio Custom Style -->
                                    <template v-if="field.key === 'aspect_ratio'">
                                        <button @click="toggleDropdown(field.key)"
                                            class="inline-flex h-[30px] shrink-0 items-center justify-center gap-2 rounded-full px-4 py-1.5 font-medium whitespace-nowrap shadow-none outline-none cursor-pointer bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
                                            :class="activeDropdownField === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'">
                                            <span>
                                                <div v-if="String(dynamicParams[field.key]).startsWith('16:') || String(dynamicParams[field.key]).startsWith('21:') || !dynamicParams[field.key]"
                                                    class="w-4 h-2.5 border-[2px] border-current rounded-[2px]"
                                                    :title="dynamicParams[field.key]"></div>
                                                <div v-else-if="String(dynamicParams[field.key]).startsWith('1:')"
                                                    class="w-3.5 h-3.5 border-[2px] border-current rounded-[2px]"></div>
                                                <div v-else class="w-2.5 h-4 border-[2px] border-current rounded-[2px]"
                                                    :title="dynamicParams[field.key]"></div>
                                            </span>
                                        </button>
                                        <div v-if="activeDropdownField === field.key"
                                            class="absolute bottom-[38px] left-1/2 -translate-x-1/2 pb-2 z-[60]">
                                            <div class="rounded-2xl bg-[var(--bg-main)] border border-[var(--border-light)] p-3 shadow-lg flex flex-col gap-3"
                                                style="background-color: var(--bg-main);">
                                                <span
                                                    class="text-[var(--text-primary)] px-2 font-medium text-[13px] text-center pt-2">Aspect
                                                    Ratio</span>
                                                <div
                                                    class="flex gap-2 min-w-[max-content] pb-1 overflow-x-auto no-scrollbar">
                                                    <button v-for="opt in field.options" :key="opt"
                                                        @click="dynamicParams[field.key] = opt; toggleDropdown(field.key)"
                                                        class="flex flex-col items-center justify-center gap-3 w-[84px] h-[84px] rounded-[16px] transition-colors"
                                                        :class="dynamicParams[field.key] === opt ? 'bg-[var(--fill-tsp-gray-main)]' : 'bg-transparent hover:bg-[var(--bg-hover)]'">

                                                        <div v-if="String(opt).startsWith('16:') || String(opt).startsWith('21:') || String(opt).startsWith('3:2')"
                                                            class="w-[28px] h-[18px] border-[2.5px] border-[var(--text-primary)] rounded-[4px]">
                                                        </div>
                                                        <div v-else-if="String(opt).startsWith('9:16') || String(opt).startsWith('3:4') || String(opt).startsWith('4:5')"
                                                            class="w-[16px] h-[26px] border-[2.5px] border-[var(--text-primary)] rounded-[4px]">
                                                        </div>
                                                        <div v-else
                                                            class="w-[24px] h-[24px] border-[2.5px] border-[var(--text-primary)] rounded-[4px]">
                                                        </div>

                                                        <span
                                                            class="text-[12px] font-medium text-[var(--text-primary)] whitespace-nowrap">
                                                            {{ opt === '16:9' ? 'Landscape' : opt === '9:16' ?
                                                                'Portrait' : opt === '1:1' ? 'Square' : opt }}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <!-- 2. Duration Custom Style -->
                                    <template v-else-if="field.key === 'duration'">
                                        <button @click="toggleDropdown(field.key)"
                                            class="inline-flex h-[30px] shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-1.5 font-medium whitespace-nowrap shadow-none outline-none cursor-pointer bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
                                            :class="activeDropdownField === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'">
                                            <Clock :size="14" class="text-[var(--text-secondary)] opacity-80" />
                                            {{ dynamicParams[field.key] }}s
                                        </button>
                                        <div v-if="activeDropdownField === field.key"
                                            class="absolute bottom-[38px] left-1/2 -translate-x-1/2 pb-2 z-[60]">
                                            <div class="rounded-2xl bg-[var(--bg-main)] border border-[var(--border-light)] p-4 shadow-lg min-w-[170px] flex flex-col gap-3"
                                                style="background-color: var(--bg-main);">
                                                <span
                                                    class="text-[var(--text-tertiary)] font-medium text-[12px] text-center pt-1">Duration</span>
                                                <div
                                                    class="flex flex-col gap-1 max-h-[200px] overflow-y-auto no-scrollbar">
                                                    <button v-for="opt in field.options" :key="opt"
                                                        @click="dynamicParams[field.key] = opt; toggleDropdown(field.key)"
                                                        class="w-full flex items-center justify-between gap-4 py-2.5 px-3 rounded-2xl hover:bg-[var(--bg-hover)] transition-colors">
                                                        <span
                                                            class="text-[14px] font-bold text-black dark:text-white">{{
                                                                opt }}s</span>
                                                        <div class="flex items-center justify-center">
                                                            <div v-if="dynamicParams[field.key] === opt"
                                                                class="w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                                                                <Check :size="12" class="text-white dark:text-black"
                                                                    stroke-width="4" />
                                                            </div>
                                                            <div v-else
                                                                class="w-5 h-5 rounded-full border-[2.5px] border-black dark:border-white">
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <!-- 3. Generic Style for other properties (like resolution, style) -->
                                    <template v-else>
                                        <button @click="toggleDropdown(field.key)"
                                            class="inline-flex h-[30px] shrink-0 items-center justify-center gap-2 rounded-full px-4 py-1.5 font-medium whitespace-nowrap shadow-none outline-none min-w-[60px] cursor-pointer bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-main)] transition-all"
                                            :class="activeDropdownField === field.key ? 'border-[var(--border-main)] bg-[var(--bg-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'">
                                            <span
                                                class="text-[11px] font-bold tracking-wider opacity-60 uppercase mr-0.5">{{
                                                    field.key === 'resolution' ? 'Res' : field.key.substring(0, 3)
                                                }}:</span>
                                            {{ dynamicParams[field.key] }}
                                        </button>
                                        <div v-if="activeDropdownField === field.key"
                                            class="absolute bottom-[38px] left-1/2 -translate-x-1/2 pb-2 z-[60]">
                                            <div class="rounded-2xl bg-[var(--bg-main)] border border-[var(--border-light)] py-3 px-2 shadow-lg min-w-[140px] flex flex-col gap-2 relative overflow-hidden"
                                                style="background-color: var(--bg-main);">
                                                <!-- Decorative background element -->
                                                <div
                                                    class="absolute -top-10 -right-10 w-24 h-24 bg-[var(--text-primary)] opacity-5 rounded-full blur-xl pointer-events-none">
                                                </div>

                                                <span
                                                    class="text-[var(--text-tertiary)] font-bold text-[11px] text-center pt-1 tracking-widest uppercase">{{
                                                        field.key.replace(/_/g, ' ') }}</span>

                                                <div
                                                    class="flex flex-col gap-0.5 max-h-[180px] overflow-y-auto custom-scrollbar px-1 relative z-10">
                                                    <button v-for="opt in field.options" :key="opt"
                                                        @click="dynamicParams[field.key] = opt; toggleDropdown(field.key)"
                                                        class="w-full flex items-center justify-between gap-3 py-2 px-3 rounded-[12px] group transition-all duration-200"
                                                        :class="dynamicParams[field.key] === opt ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-md' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'">
                                                        <span class="text-[13px] font-semibold tracking-tight">{{ opt
                                                        }}</span>
                                                        <div class="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            :class="dynamicParams[field.key] === opt ? 'opacity-100' : ''">
                                                            <Check :size="14" :stroke-width="3"
                                                                :class="dynamicParams[field.key] === opt ? 'text-[var(--bg-main)]' : 'text-[var(--text-tertiary)]'" />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <!-- Generate Button -->
                            <button @click="generateVideo" :disabled="!prompt.trim() || isGenerating"
                                class="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] hover:opacity-90 transition-all disabled:opacity-50 disabled:pointer-events-none self-end">
                                <Sparkles v-if="!isGenerating" :size="18" fill="currentColor" />
                                <Loader2 v-else :size="18" class="animate-spin absolute" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Asset Picker Modal -->
    <AssetPickerModal :show="showAssetPicker" :multiple="false" file-type="image"
        @close="showAssetPicker = false"
        @select="onAssetSelected" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
    ImagePlus,
    Plus,
    Check,
    Zap,
    Loader2,
    X,
    Film,
    Download,
    ChevronDown,
    Sparkles,
    Play,
    Clock
} from 'lucide-vue-next'
import {
    getModels,
    generateVideoStream,
    getAsyncTaskOutputs,
    uploadFile,
    getRecordPrompt,
    getRecordPrimaryUrl,
    getRecordModel,
    type AIModel,
    type AsyncTaskRecord
} from '@/utils/api'
import { useModelStore } from '@/stores/models'
import ModelSelector from '@/components/ModelSelector.vue'

const modelStore = useModelStore()
const selectedModel = computed(() => modelStore.selectedModel)
const isVideoModel = computed(() => {
  const model = selectedModel.value
  return model?.capabilities?.includes('video_generation') || model?.model_input?.capability === 'video_generation' || false
})

// --- Dynamic Input Logic ---
const modelInputFields = computed(() => {
    if (!isVideoModel.value) return {}
    return selectedModel.value?.model_input?.fields || {}
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

const supportsImageUpload = computed(() => {
    const fields = modelInputFields.value
    return !!fields['image'] || !!fields['image_urls'] || !!fields['image_url']
})

const dynamicParams = ref<Record<string, any>>({})

// Initialize default values when model changes
watch(() => selectedModel.value, (newModel) => {
    const fields = newModel?.model_input?.fields || {}
    const newParams: Record<string, any> = {}
    for (const [key, field] of Object.entries(fields)) {
        if (field.default !== undefined) {
            newParams[key] = field.default
        } else if (field.type === 'select' && field.options && field.options.length > 0) {
            newParams[key] = field.options[0] // fallback to first option
        }
    }
    dynamicParams.value = newParams
}, { immediate: true })

const activeDropdownField = ref<string | null>(null)

const toggleDropdown = (key: string) => {
    activeDropdownField.value = activeDropdownField.value === key ? null : key
}
// -----------------------------

const activeTab = ref<'inspiration' | 'creations'>('inspiration')
const prompt = ref('')
const isGenerating = ref(false)
const generationProgress = ref(0)
const selectedCategory = ref('All')
const playingVideoId = ref<number | null>(null)

// File Upload State
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadedImageKey = ref('')
const previewImageUrl = ref('')
const inputRef = ref<HTMLDivElement | null>(null)
const openStartFrameDropdown = ref(false)
const showAssetPicker = ref(false)

const onAssetSelected = (assets: Array<{ key: string, url: string }>) => {
  if (assets.length > 0) {
    uploadedImageKey.value = assets[0].key
    previewImageUrl.value = assets[0].url
  }
}

const categories = [
    'All', 'Trending', 'Cinematic', 'Animation', 'Nature', 'Abstract'
]

const generatedVideos = ref<AsyncTaskRecord[]>([])

const estimatedTimeRemaining = computed(() => {
    const remaining = Math.max(0, 100 - generationProgress.value)
    // Try to guess duration from dynamic params if available
    const durationParam = Object.values(dynamicParams.value).find(v => typeof v === 'number' && v > 0 && v < 20) || 5
    const seconds = Math.round((remaining / 100) * (durationParam === 5 ? 120 : 180))
    if (seconds > 60) {
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    }
    return `${seconds}s`
})

const fetchHistory = async () => {
    try {
        const res = await getAsyncTaskOutputs({ capability: 'video_generation', page_size: 50 })
        if (res.data && res.data.list) {
            generatedVideos.value = res.data.list
        }
    } catch (error) {
        console.error('Failed to fetch history:', error)
    }
}

const controlBarRef = ref<HTMLDivElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (activeDropdownField.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
        activeDropdownField.value = null
    }
    // Also handle start frame dropdown
    if (openStartFrameDropdown.value && controlBarRef.value && !controlBarRef.value.contains(event.target as Node)) {
        openStartFrameDropdown.value = false
    }
}

onMounted(() => {
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
        minute: '2-digit'
    }).format(date)
}

const formatModel = (modelStr?: string) => {
    if (!modelStr) return 'RUNWAY'
    const parts = modelStr.split(':')
    const name = parts.length > 1 ? parts[1] : parts[0]
    return (name || '').replace(/-/g, ' ').toUpperCase()
}

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

const exampleVideos = [
    { prompt: 'A mystical whale swimming through a glowing underwater city at night.', thumbnail: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=600' },
    { prompt: 'Timelapse of cherry blossoms blooming in a Japanese garden.', thumbnail: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=600' },
    { prompt: 'Cinematic drone shot over a foggy mountain range at sunrise.', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600' },
    { prompt: 'Abstract flowing liquid metal transforming into geometric shapes.', thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=600' },
    { prompt: 'A futuristic city with flying cars and neon lights at night.', thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=600' },
    { prompt: 'Slow motion of a hummingbird drinking nectar from a flower.', thumbnail: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=600' }
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
        return
    }
    e.preventDefault()
    generateVideo()
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
    const file = target.files?.[0]
    if (!file) return

    isUploading.value = true
    try {
        const { key, url } = await uploadFile(file)
        uploadedImageKey.value = key
        previewImageUrl.value = url
    } catch (error) {
        console.error('Failed to upload file:', error)
    } finally {
        isUploading.value = false
        if (fileInput.value) fileInput.value.value = ''
    }
}

const removeAttachedImage = () => {
    uploadedImageKey.value = ''
    previewImageUrl.value = ''
}

const generateVideo = async () => {
    if (!prompt.value.trim() || isGenerating.value || !selectedModel.value) return
    isGenerating.value = true
    generationProgress.value = 0

    // Construct payload dynamically based on current selections
    const payload: Record<string, any> = {
        model: `${selectedModel.value.provider}:${selectedModel.value.model}`,
        prompt: prompt.value,
        ...dynamicParams.value
    }

    // Add image if supported
    if (supportsImageUpload.value && uploadedImageKey.value) {
        const imageField = modelInputFields.value['image_urls'] ? 'image_urls' : 'image'
        if (imageField === 'image_urls') {
            payload['image_urls'] = [uploadedImageKey.value]
        } else {
            payload['image'] = uploadedImageKey.value
        }
    }

    prompt.value = ''
    if (inputRef.value) inputRef.value.innerText = ''

    await generateVideoStream(
        payload,
        {
            onProgress: (percent) => {
                generationProgress.value = percent
            },
            onDone: async () => {
                generationProgress.value = 100
                isGenerating.value = false
                await fetchHistory()
                activeTab.value = 'creations'
            },
            onError: () => {
                isGenerating.value = false
            }
        }
    )
}

const handleDownload = (videoUrl: string) => {
    window.open(videoUrl, '_blank')
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

::selection {
    background: var(--background-selection);
    color: inherit;
}

[contenteditable]:empty:before {
    content: attr(data-placeholder);
    color: var(--text-disable);
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
</style>
