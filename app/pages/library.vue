<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] transition-colors relative overflow-hidden">
		<!-- Header: Desktop -->
		<header
			class="hidden lg:flex bg-[var(--bg-main)] border-b border-[var(--border-main)] px-6 py-3 items-center justify-between gap-6 shrink-0 z-10">
			<div class="flex items-center gap-6 flex-1">
				<h1 class="text-xl font-bold text-[var(--text-primary)] tracking-tight">Library</h1>
				<div class="relative flex-1 max-w-md">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" :size="16" />
					<input v-model="assetStore.filters.search" type="text" placeholder="Search assets..."
						class="search-input" />
				</div>
			</div>
			<div class="flex items-center gap-3">
				<button @click="triggerUpload" class="upload-btn">
					<UploadCloud :size="16" />
					Upload
				</button>
			</div>
		</header>

		<!-- Header: Mobile -->
		<header class="lg:hidden bg-[var(--bg-main)] border-b border-[var(--border-main)] px-4 shrink-0 z-10">
			<div class="flex items-center justify-between gap-3 py-2">
				<div class="flex items-center gap-3">
					<button @click="uiStore.openMobileMenu()"
						class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
						<Menu :size="20" />
					</button>
					<h1 class="text-xl font-bold text-[var(--text-primary)] tracking-tight">Library</h1>
				</div>
				<button @click="triggerUpload" class="upload-btn">
					<UploadCloud :size="16" />
				</button>
			</div>
			<div class="pb-2.5">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" :size="16" />
					<input v-model="assetStore.filters.search" type="text" placeholder="Search assets..."
						class="search-input" />
				</div>
			</div>
		</header>

		<!-- Filter Bar -->
		<div class="border-b border-[var(--border-main)]/50 bg-[var(--bg-main)]/50 backdrop-blur-sm shrink-0 z-10">
			<!-- Type chips -->
			<div class="flex items-center gap-2 px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar">
				<button v-for="t in types" :key="t.id"
					@click="assetStore.filters.type = t.id as any"
					class="filter-chip" :class="filterChipClass(assetStore.filters.type, t.id)">
					{{ t.label }}
				</button>
			</div>
		</div>

		<!-- Main Content Grid -->
		<main class="flex-1 overflow-y-auto px-3 sm:px-6 py-4 custom-scrollbar relative">
			<AssetsGrid :items="assetStore.filteredItems" :is-loading="assetStore.isLoading" @preview="handlePreview" />
		</main>

		<!-- Batch Action Bar -->
		<Transition enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-y-20 opacity-0" enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-20 opacity-0">
			<div v-if="assetStore.selectedIds.size > 0"
				class="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
				<div class="batch-bar">
					<div class="flex items-center gap-2 sm:gap-3">
						<span class="text-[13px] sm:text-[14px] font-bold">
							{{ assetStore.selectedIds.size }} selected
						</span>
						<button @click="assetStore.clearSelection"
							class="text-[11px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100">
							Clear
						</button>
					</div>
					<div class="flex items-center gap-2 sm:gap-4">
						<button @click="handleBatchDownload" class="batch-action">
							<Download :size="16" />
							<span class="hidden sm:inline">Download</span>
						</button>
						<button @click="handleBatchDelete" class="batch-action text-red-400 hover:bg-red-500/10">
							<Trash2 :size="16" />
							<span class="hidden sm:inline">Delete</span>
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
definePageMeta({ hideTopBar: true })
import { ref, watch, onMounted } from 'vue'
import { Search, UploadCloud, Download, Trash2, X, Menu } from 'lucide-vue-next'
import { useAssetStore } from '@/stores/assets'
import AssetsGrid from '@/components/AssetsGrid.vue'
import { uploadFile } from '@/utils/api'
import { useUIStore } from '@/stores/ui'

const assetStore = useAssetStore()
const uiStore = useUIStore()
const fileInput = ref<HTMLInputElement | null>(null)

// Reset synchronously so skeleton shows on first frame
assetStore.items = []
assetStore.isLoading = true

const types = [
	{ id: 'all', label: 'All Types' },
	{ id: 'image', label: 'Images' },
	{ id: 'video', label: 'Videos' },
	{ id: 'audio', label: 'Audio' },
	{ id: '3d', label: '3D Assets' },
	{ id: 'document', label: 'Documents' },
]

const filterChipClass = (current: string, id: string) =>
	current === id
		? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-sm'
		: 'bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-main)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]'

onMounted(() => {
	assetStore.fetchAssets(true)
})

// Re-fetch when type filter changes
watch(() => assetStore.filters.type, () => {
	assetStore.fetchAssets(true)
})

const handlePreview = (asset: any) => {
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
	&::-webkit-scrollbar { display: none; }
}

.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: var(--border-light) transparent;
	&::-webkit-scrollbar { width: 4px; }
	&::-webkit-scrollbar-track { background: transparent; }
	&::-webkit-scrollbar-thumb {
		background: var(--border-light);
		border-radius: 10px;
		&:hover { background: var(--text-tertiary); }
	}
}

.search-input {
	@apply w-full h-9 ps-10 pe-4 rounded-xl text-[14px] transition-all outline-none;
	@apply bg-[var(--fill-tsp-gray-main)] border border-transparent;
	@apply focus:border-[var(--text-tertiary)] focus:bg-[var(--bg-main)];
}

.upload-btn {
	@apply flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px];
	@apply bg-[var(--text-primary)] text-[var(--bg-main)];
	@apply hover:opacity-90 transition-all shadow-sm;
}

.filter-chip {
	@apply px-3 sm:px-4 py-1.5 text-[12px] font-bold rounded-full border transition-all whitespace-nowrap;
}

.batch-bar {
	@apply flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3 sm:py-4;
	@apply bg-black/90 dark:bg-white/90 backdrop-blur-xl text-white dark:text-black;
	@apply border border-white/20 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.3)];
}

.batch-action {
	@apply flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-bold text-[13px];
	@apply hover:bg-white/10 dark:hover:bg-black/10;
}
</style>
