<template>
	<div ref="triggerRef" :class="['relative', fullWidth ? 'block w-full' : 'inline-block']" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
		<slot />
		<Teleport to="body">
			<Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
				<div v-if="show && !disabled" :style="tooltipStyle" class="fixed px-2.5 py-1.5 bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] text-[11px] font-medium leading-none rounded-[8px] whitespace-nowrap pointer-events-none z-[9999] shadow-lg">
					{{ text }}
					<!-- Tooltip arrow -->
					<div
						v-if="showArrow"
						class="absolute border-[5px] border-transparent"
						:class="[position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-[#1A1A1A] dark:border-t-white' : '', position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1A1A1A] dark:border-b-white' : '', position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-[#1A1A1A] dark:border-l-white' : '', position === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-[#1A1A1A] dark:border-r-white' : '']"></div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
	defineProps<{
		text: string
		position?: 'top' | 'bottom' | 'left' | 'right'
		showArrow?: boolean
		disabled?: boolean
		fullWidth?: boolean
	}>(),
	{
		position: 'top',
		showArrow: true,
		disabled: false,
		fullWidth: false,
	},
)

const triggerRef = ref<HTMLElement | null>(null)
const show = ref(false)
const coords = ref({ top: 0, left: 0 })

const handleMouseEnter = () => {
	if (props.disabled) return
	if (triggerRef.value) {
		const rect = triggerRef.value.getBoundingClientRect()
		const offset = 8 // Space between trigger and tooltip

		let t = 0
		let l = 0

		// This is a simplified positioning logic.
		// For a more robust solution, one would need to consider the tooltip's own dimensions.
		// But since we are usually using this for small labels, we can estimate or use a more complex logic later.
		// For 'right' position (most common in sidebar), it's easy:

		if (props.position === 'right') {
			t = rect.top + rect.height / 2
			l = rect.right + offset
		} else if (props.position === 'left') {
			t = rect.top + rect.height / 2
			l = rect.left - offset
		} else if (props.position === 'top') {
			t = rect.top - offset
			l = rect.left + rect.width / 2
		} else if (props.position === 'bottom') {
			t = rect.bottom + offset
			l = rect.left + rect.width / 2
		}

		coords.value = { top: t, left: l }
		show.value = true
	}
}

const handleMouseLeave = () => {
	show.value = false
}

const tooltipStyle = computed(() => {
	const transform = {
		top: 'translate(-50%, -100%)',
		bottom: 'translate(-50%, 0)',
		left: 'translate(-100%, -50%)',
		right: 'translate(0, -50%)',
	}[props.position]

	return {
		top: `${coords.value.top}px`,
		left: `${coords.value.left}px`,
		transform: transform,
	}
})
</script>
