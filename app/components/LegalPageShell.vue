<template>
	<section class="min-h-full bg-[var(--background-gray-main)] px-5 py-12 md:px-8 md:py-16">
		<div class="mx-auto max-w-3xl">
			<header class="mb-10 border-b border-[var(--border-main)] pb-8">
				<p class="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-tertiary)]">MixU</p>
				<h1 class="text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-4xl">{{ title }}</h1>
				<p class="mt-3 text-sm text-[var(--text-tertiary)]">Last updated: 2026-04-29</p>
			</header>

			<article class="space-y-8 text-[15px] leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
				<slot />
			</article>
		</div>
	</section>
</template>

<script setup lang="ts">
defineProps<{
	title: string
}>()
</script>
