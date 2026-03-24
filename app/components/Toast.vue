<template>
	<Teleport to="body">
		<div class="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2 pointer-events-none">
			<TransitionGroup name="toast" tag="div" class="flex flex-col items-center gap-2">
				<div
					v-for="toast in uiStore.toasts"
					:key="toast.id"
					class="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border text-sm font-medium pointer-events-auto cursor-default select-none overflow-hidden"
					:class="{
						'bg-[var(--bg-main)] border-[var(--border-light)] text-[var(--text-primary)]': toast.type === 'success',
						'bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300': toast.type === 'error',
						'bg-[var(--bg-main)] border-[var(--border-light)] text-[var(--text-secondary)]': toast.type === 'info',
					}"
					@click="uiStore.removeToast(toast.id)"
					@mouseenter="pauseToast(toast.id)"
					@mouseleave="resumeToast(toast.id)"
				>
					<CheckCircle v-if="toast.type === 'success'" :size="15" class="text-green-500 shrink-0" />
					<XCircle v-else-if="toast.type === 'error'" :size="15" class="text-red-500 shrink-0" />
					<Info v-else :size="15" class="text-[var(--text-tertiary)] shrink-0" />
					<span>{{ toast.message }}</span>

					<!-- Progress bar -->
					<div class="absolute bottom-0 left-0 right-0 h-[2px]">
						<div
							class="h-full transition-none"
							:class="{
								'bg-green-500/30': toast.type === 'success',
								'bg-red-500/30': toast.type === 'error',
								'bg-[var(--text-tertiary)]/20': toast.type === 'info',
							}"
							:style="{ width: getProgress(toast) + '%' }"
						></div>
					</div>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CheckCircle, XCircle, Info } from 'lucide-vue-next'
import { useUIStore, type Toast } from '../stores/ui'

const uiStore = useUIStore()

const pausedIds = ref<Set<number>>(new Set())
let rafId: number | null = null
const tick = ref(0)

const pauseToast = (id: number) => {
	pausedIds.value.add(id)
	const toast = uiStore.toasts.find(t => t.id === id)
	if (toast) {
		// Freeze remaining time by adjusting createdAt
		const elapsed = Date.now() - toast.createdAt
		;(toast as any)._remainingOnPause = toast.duration - elapsed
	}
}

const resumeToast = (id: number) => {
	pausedIds.value.delete(id)
	const toast = uiStore.toasts.find(t => t.id === id)
	if (toast && (toast as any)._remainingOnPause !== undefined) {
		// Reset createdAt so remaining time continues from where it paused
		toast.createdAt = Date.now() - (toast.duration - (toast as any)._remainingOnPause)
		delete (toast as any)._remainingOnPause
	}
}

const getProgress = (toast: Toast) => {
	// Force reactivity
	void tick.value
	if (pausedIds.value.has(toast.id) && (toast as any)._remainingOnPause !== undefined) {
		return ((toast as any)._remainingOnPause / toast.duration) * 100
	}
	const elapsed = Date.now() - toast.createdAt
	const remaining = Math.max(0, toast.duration - elapsed)
	return (remaining / toast.duration) * 100
}

const update = () => {
	tick.value++
	// Remove expired toasts
	const now = Date.now()
	uiStore.toasts
		.filter(t => !pausedIds.value.has(t.id) && now - t.createdAt >= t.duration)
		.forEach(t => uiStore.removeToast(t.id))

	rafId = requestAnimationFrame(update)
}

onMounted(() => {
	rafId = requestAnimationFrame(update)
})

onUnmounted(() => {
	if (rafId) cancelAnimationFrame(rafId)
})
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
	transform: translateY(-12px) scale(0.95);
}
.toast-leave-to {
	opacity: 0;
	transform: translateY(-4px) scale(0.97);
}
</style>
