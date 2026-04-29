<template>
	<footer class="border-t border-[var(--border-light)] bg-[var(--background-gray-main)] px-5 py-6">
		<div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
			<p class="text-xs font-medium text-[var(--text-tertiary)]">© 2026 MixU. All rights reserved.</p>
			<nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Footer links">
				<NuxtLink v-for="link in links" :key="link.to" :to="link.to"
					class="text-xs font-semibold text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]">
					{{ link.label }}
				</NuxtLink>
			</nav>
		</div>
	</footer>
</template>

<script setup lang="ts">
const links = [
	{ label: 'Privacy Policy', to: '/privacy-policy' },
	{ label: 'Terms of Service', to: '/terms-of-service' },
]
</script>
