<template>
	<Teleport to="body">
		<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2 pointer-events-none">
			<TransitionGroup name="toast" tag="div" class="flex flex-col items-center gap-2">
				<div
					v-for="toast in uiStore.toasts"
					:key="toast.id"
					class="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border text-sm font-medium pointer-events-auto cursor-default select-none"
					:class="{
						'bg-[var(--bg-main)] border-[var(--border-light)] text-[var(--text-primary)]': toast.type === 'success',
						'bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300': toast.type === 'error',
						'bg-[var(--bg-main)] border-[var(--border-light)] text-[var(--text-secondary)]': toast.type === 'info',
					}"
					@click="uiStore.removeToast(toast.id)"
				>
					<CheckCircle v-if="toast.type === 'success'" :size="15" class="text-green-500 shrink-0" />
					<XCircle v-else-if="toast.type === 'error'" :size="15" class="text-red-500 shrink-0" />
					<Info v-else :size="15" class="text-[var(--text-tertiary)] shrink-0" />
					<span>{{ toast.message }}</span>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, Info } from 'lucide-vue-next'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
</script>

<style scoped>
.toast-enter-active {
	transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
	transition: all 0.2s ease-in;
}
.toast-enter-from {
	opacity: 0;
	transform: translateY(12px) scale(0.95);
}
.toast-leave-to {
	opacity: 0;
	transform: translateY(4px) scale(0.97);
}
</style>
