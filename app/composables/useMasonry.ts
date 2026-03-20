import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'

type MasonryItem = { id: number | string; [key: string]: any }

export function useMasonry(getItems: () => MasonryItem[]) {
	const columnCount = ref(4)
	const columns = ref<MasonryItem[][]>([]) as Ref<MasonryItem[][]>
	const columnElRefs = ref<HTMLElement[]>([])
	let processedCount = 0

	const updateColumnCount = () => {
		const w = window.innerWidth
		if (w < 640) columnCount.value = 1
		else if (w < 1024) columnCount.value = 2
		else if (w < 1280) columnCount.value = 3
		else columnCount.value = 4
	}

	// Full reset: round-robin (no DOM heights available yet)
	const resetColumns = () => {
		const count = columnCount.value
		const cols: MasonryItem[][] = Array.from({ length: count }, () => [])
		const allItems = getItems()
		allItems.forEach((item, idx) => {
			cols[idx % count]!.push(item)
		})
		columns.value = cols
		processedCount = allItems.length
	}

	// Append: measure real column DOM heights, assign new items to shortest
	const appendItems = () => {
		const allItems = getItems()
		const newItems = allItems.slice(processedCount)
		if (newItems.length === 0) return

		// Measure actual column heights from DOM
		const heights = columns.value.map((_, i) => columnElRefs.value[i]?.offsetHeight || 0)

		// Clone columns arrays to trigger reactivity
		const cols = columns.value.map(c => [...c])

		for (const item of newItems) {
			const minIdx = heights.indexOf(Math.min(...heights))
			cols[minIdx]!.push(item)
			heights[minIdx] = (heights[minIdx] || 0) + 300
		}

		columns.value = cols
		processedCount = allItems.length
	}

	// Watch items changes
	watch(getItems, (newItems, oldItems) => {
		const count = columnCount.value
		if (
			columns.value.length !== count ||
			!oldItems ||
			newItems.length < processedCount
		) {
			resetColumns()
		} else if (newItems.length > processedCount) {
			appendItems()
		}
	}, { immediate: true })

	// Column count change -> full redistribute
	watch(columnCount, () => {
		resetColumns()
	})

	onMounted(() => {
		updateColumnCount()
		window.addEventListener('resize', updateColumnCount)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', updateColumnCount)
	})

	return { columns, columnCount, columnElRefs }
}
