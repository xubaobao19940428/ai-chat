<template>
	<div class="flex gap-6" :key="'masonry-' + columnCount">
		<div
			v-for="(column, colIndex) in columns"
			:key="colIndex"
			:ref="(el) => { if (el) columnElRefs[colIndex] = el as HTMLElement }"
			class="flex-1 flex flex-col gap-6"
		>
			<slot v-for="item in column" :key="item.id" :item="item" />
		</div>
	</div>
</template>

<script setup lang="ts" generic="T extends { id: number | string }">
import { useMasonry } from '~/composables/useMasonry'

const props = defineProps<{
	items: T[]
}>()

const { columns, columnCount, columnElRefs } = useMasonry(() => props.items)
</script>
