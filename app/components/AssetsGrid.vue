<template>
	<div class="w-full">
		<!-- Skeleton: initial load -->
		<div v-if="isLoading && items.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
			<div v-for="n in 18" :key="n" class="rounded-2xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-main)] animate-pulse">
				<div class="aspect-square bg-[var(--fill-tsp-gray-main)]"></div>
				<div class="p-3 space-y-2">
					<div class="h-3 bg-[var(--fill-tsp-gray-main)] rounded w-3/4"></div>
					<div class="h-2.5 bg-[var(--fill-tsp-gray-main)] rounded w-1/2"></div>
				</div>
			</div>
		</div>

		<!-- Empty State -->
		<div v-else-if="items.length === 0" class="py-40 flex flex-col items-center justify-center">
			<div class="size-20 rounded-3xl bg-[var(--fill-tsp-gray-main)] flex items-center justify-center text-[var(--text-tertiary)] mb-4">
				<Library :size="32" />
			</div>
			<h3 class="text-xl font-bold text-[var(--text-primary)]">No assets found</h3>
			<p class="text-[var(--text-tertiary)] text-[14px] mt-2">Try adjusting your filters or upload/generate something new.</p>
		</div>

		<!-- Grid State -->
		<div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
			<AssetCard v-for="asset in items" :key="asset.id" :asset="asset" :is-selected="assetStore.isSelected(asset.id)" @click="$emit('preview', asset)" @toggle-select="assetStore.toggleSelection" />
		</div>

		<!-- Load more spinner -->
		<div v-if="isLoading && items.length > 0" class="flex justify-center py-10">
			<Loader2 :size="24" class="animate-spin text-[var(--text-tertiary)]" />
		</div>

		<!-- Infinite Scroll Trigger -->
		<div ref="loadMoreTrigger" class="h-10"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Library, Loader2 } from 'lucide-vue-next'
import AssetCard from './AssetCard.vue'
import { useAssetStore, type UnifiedAsset } from '@/stores/assets'

const props = defineProps<{
	items: UnifiedAsset[]
	isLoading: boolean
}>()

const emit = defineEmits<{
	preview: [asset: UnifiedAsset]
}>()

const assetStore = useAssetStore()
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
	observer = new IntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting && !props.isLoading && assetStore.hasMore) {
				assetStore.fetchAssets()
			}
		},
		{ threshold: 0.1 },
	)

	if (loadMoreTrigger.value) {
		observer.observe(loadMoreTrigger.value)
	}
})

onUnmounted(() => {
	if (observer) observer.disconnect()
})
</script>
