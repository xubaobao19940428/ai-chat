<template>
	<div class="group relative rounded-2xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-[var(--text-tertiary)] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer" :class="{ 'ring-2 ring-[var(--text-primary)] shadow-lg': isSelected }" @click="$emit('click', asset)">
		<!-- Thumbnail / Icon Area -->
		<div class="aspect-square relative bg-[var(--fill-tsp-gray-main)] flex items-center justify-center overflow-hidden">
			<template v-if="asset.thumbnail || asset.type === 'image' || asset.type === 'video'">
				<img :src="asset.thumbnail || asset.url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
				<div v-if="asset.type === 'video'" class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
					<div class="size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
						<Play :size="20" fill="currentColor" />
					</div>
				</div>
			</template>
			<template v-else>
				<div class="flex flex-col items-center gap-2 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
					<div class="size-12 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center">
						<template v-if="asset.type === 'audio'"><Music :size="28" /></template>
						<template v-else-if="asset.type === 'document'"><FileText :size="28" /></template>
						<template v-else-if="asset.type === '3d'"><Box :size="28" /></template>
						<template v-else><File :size="28" /></template>
					</div>
					<span class="text-[12px] font-medium px-2 text-center truncate max-w-full">{{ asset.mime_type || asset.type }}</span>
				</div>
			</template>

			<!-- Source Badge -->
			<div class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-wider border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
				{{ asset.source }}
			</div>

			<!-- Select Checkbox (Always visible if selected, visible on hover otherwise) -->
			<div class="absolute top-2 right-2 size-6 rounded-full border-2 transition-all flex items-center justify-center" :class="isSelected ? 'bg-[var(--text-primary)] border-[var(--text-primary)] scale-110 shadow-md' : 'bg-black/10 border-white/50 opacity-0 group-hover:opacity-100 hover:border-white hover:bg-black/30'" @click.stop="$emit('toggle-select', asset.id)">
				<Check v-if="isSelected" :size="14" class="text-white" stroke-width="4" />
			</div>
		</div>

		<!-- Metadata Area -->
		<div class="p-3">
			<div class="flex items-center justify-between gap-2 mb-1">
				<h4 class="text-[13px] font-bold text-[var(--text-primary)] truncate flex-1">{{ asset.name }}</h4>
				<span class="text-[10px] font-medium text-[var(--text-tertiary)] shrink-0">{{ formatDate(asset.created_at) }}</span>
			</div>
			<div class="flex items-center gap-2">
				<span v-if="asset.metadata?.model" class="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-tight bg-[var(--bg-hover)] px-1.5 py-0.5 rounded">
					{{ formatModel(asset.metadata.model) }}
				</span>
				<span v-else-if="asset.size" class="text-[10px] font-medium text-[var(--text-tertiary)]">
					{{ formatSize(asset.size) }}
				</span>
			</div>
		</div>

		<!-- Hover Actions (Download) -->
		<div class="absolute bottom-16 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
			<button @click.stop="handleDownload" class="size-8 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md border border-[var(--border-main)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-white transition-all shadow-lg">
				<Download :size="14" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Play, Music, FileText, Box, File, Check, Download } from 'lucide-vue-next'
import type { UnifiedAsset } from '@/stores/assets'

const props = defineProps<{
	asset: UnifiedAsset
	isSelected: boolean
}>()

const emit = defineEmits<{
	click: [asset: UnifiedAsset]
	'toggle-select': [id: string | number]
}>()

const formatDate = (ts: number) => {
	const date = new Date(ts * 1000)
	return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

const formatSize = (bytes: number) => {
	if (bytes === 0) return '0 B'
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatModel = (modelStr: string) => {
	return modelStr.split(':')[1]?.toUpperCase() || modelStr.toUpperCase()
}

const handleDownload = () => {
	window.open(props.asset.url, '_blank')
}
</script>
