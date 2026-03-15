<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">
		<!-- Header Area: Search & Source Toggle -->
		<header class="bg-[var(--bg-main)] border-b border-[var(--border-main)] px-6 py-4 flex items-center justify-between gap-6 shrink-0 z-10">
			<div class="flex items-center gap-6 flex-1">
				<h1 class="text-xl font-bold text-[var(--text-primary)] tracking-tight">Library</h1>

				<!-- Search Bar -->
				<div class="relative flex-1 max-w-md">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" :size="16" />
					<input v-model="assetStore.filters.search" type="text" placeholder="Search assets..." class="w-full h-10 ps-10 pe-4 rounded-xl bg-[var(--fill-tsp-gray-main)] border border-transparent focus:border-[var(--text-tertiary)] focus:bg-[var(--bg-main)] text-[14px] transition-all outline-none" />
				</div>
			</div>

			<div class="flex items-center gap-3">
				<!-- Source Toggle -->
				<div class="bg-[var(--fill-tsp-gray-main)] p-1 rounded-xl border border-[var(--border-main)] flex items-center">
					<button v-for="s in sources" :key="s.id" @click="assetStore.filters.source = s.id as any" class="px-4 py-1.5 text-[12px] font-bold rounded-lg transition-all" :class="assetStore.filters.source === s.id ? 'bg-white text-[var(--text-primary)] shadow-sm dark:bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'">
						{{ s.label }}
					</button>
				</div>

				<!-- Upload Button -->
				<button @click="triggerUpload" class="flex items-center gap-2 px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-main)] rounded-xl font-bold text-[13px] hover:opacity-90 transition-all shadow-sm">
					<UploadCloud :size="16" />
					Upload
				</button>
			</div>
		</header>

		<!-- Filter Bar: Type Chips -->
		<div class="px-6 py-3 border-b border-[var(--border-main)]/50 bg-[var(--bg-main)]/50 backdrop-blur-sm flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 z-10">
			<button v-for="t in types" :key="t.id" @click="assetStore.filters.type = t.id as any" :class="['px-4 py-1.5 text-[12px] font-bold rounded-full border transition-all whitespace-nowrap', assetStore.filters.type === t.id ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm' : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]']">
				{{ t.label }}
			</button>
		</div>

		<!-- Main Content Grid -->
		<main class="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar relative">
			<AssetsGrid :items="assetStore.filteredItems" :is-loading="assetStore.isLoading" @preview="handlePreview" />
		</main>

		<!-- Batch Action Bar (Fixed at bottom) -->
		<Transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-20 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-20 opacity-0">
			<div v-if="assetStore.selectedIds.size > 0" class="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
				<div class="bg-black/90 dark:bg-white/90 backdrop-blur-xl border border-white/20 text-white dark:text-black rounded-[24px] px-6 py-4 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-w-[400px]">
					<div class="flex items-center gap-3 border-r border-white/20 dark:border-black/20 pe-8">
						<span class="text-[14px] font-bold">{{ assetStore.selectedIds.size }} items selected</span>
						<button @click="assetStore.clearSelection" class="text-[11px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100">Deselect all</button>
					</div>

					<div class="flex items-center gap-4">
						<button @click="handleBatchDownload" class="flex items-center gap-2 hover:bg-white/10 dark:hover:bg-black/10 px-4 py-2 rounded-xl transition-all font-bold text-[13px]">
							<Download :size="18" />
							Download
						</button>
						<button @click="handleBatchDelete" class="flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all font-bold text-[13px]">
							<Trash2 :size="18" />
							Delete
						</button>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Hidden File Input -->
		<input type="file" ref="fileInput" class="hidden" multiple @change="handleUpload" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, UploadCloud, Download, Trash2, X } from 'lucide-vue-next'
import { useAssetStore } from '@/stores/assets'
import AssetsGrid from '@/components/AssetsGrid.vue'
import { uploadFile } from '@/utils/api'
import { useUIStore } from '@/stores/ui'

const assetStore = useAssetStore()
const uiStore = useUIStore()
const fileInput = ref<HTMLInputElement | null>(null)

const sources = [
	{ id: 'all', label: 'All Sources' },
	{ id: 'ai', label: 'AI Generated' },
	{ id: 'local', label: 'Local Upload' },
]

const types = [
	{ id: 'all', label: 'All Types' },
	{ id: 'image', label: 'Images' },
	{ id: 'video', label: 'Videos' },
	{ id: 'audio', label: 'Audio' },
	{ id: '3d', label: '3D Assets' },
	{ id: 'document', label: 'Documents' },
]

onMounted(() => {
	assetStore.fetchAssets(true)
})

const handlePreview = (asset: any) => {
	// We'll implement a simple lightbox/preview later if needed
	window.open(asset.url, '_blank')
}

const triggerUpload = () => {
	fileInput.value?.click()
}

const handleUpload = async (e: Event) => {
	const files = (e.target as HTMLInputElement).files
	if (!files) return

	uiStore.showToast(`Uploading ${files.length} files...`)

	try {
		for (const file of Array.from(files)) {
			await uploadFile(file, 'library')
		}
		uiStore.showToast('Upload complete')
		assetStore.fetchAssets(true)
	} catch (error) {
		uiStore.showToast('Upload failed', 'error')
	}
}

const handleBatchDownload = () => {
	const selectedItems = assetStore.items.filter((item) => assetStore.selectedIds.has(item.id))
	selectedItems.forEach((item) => {
		const link = document.createElement('a')
		link.href = item.url
		link.download = item.name
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	})
	uiStore.showToast(`Downloading ${selectedItems.length} items`)
}

const handleBatchDelete = async () => {
	if (confirm(`Are you sure you want to delete ${assetStore.selectedIds.size} items?`)) {
		await assetStore.deleteSelected()
		uiStore.showToast('Deleted successfully')
	}
}
</script>

<style scoped lang="scss">
.no-scrollbar {
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
}

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
			background: var(--text-tertiary);
		}
	}
}
</style>
