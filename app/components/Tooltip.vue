<template>
	<div :class="['relative group', fullWidth ? 'block w-full' : 'inline-block']">
		<slot />
		<div
			v-if="!disabled"
			:class="[
				'absolute px-2.5 py-1.5 bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] text-[11px] font-medium leading-none rounded-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[100] transform shadow-lg',
				// Positioning logic
				position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2 translate-y-[4px] group-hover:translate-y-0' : '',
				position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2 translate-y-[-4px] group-hover:translate-y-0' : '',
				position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2 translate-x-[4px] group-hover:translate-x-0' : '',
				position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2 translate-x-[-4px] group-hover:translate-x-0' : '',
			]"
		>
			{{ text }}
			<!-- Tooltip arrow -->
			<div
				v-if="showArrow"
				class="absolute border-[5px] border-transparent"
				:class="[
					position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-[#1A1A1A] dark:border-t-white' : '',
					position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1A1A1A] dark:border-b-white' : '',
					position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-[#1A1A1A] dark:border-l-white' : '',
					position === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-[#1A1A1A] dark:border-r-white' : '',
				]"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
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
</script>
