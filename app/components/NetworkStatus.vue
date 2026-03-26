<template>
	<Transition
		enter-active-class="transition duration-300 ease-out"
		enter-from-class="-translate-y-full opacity-0"
		enter-to-class="translate-y-0 opacity-100"
		leave-active-class="transition duration-200 ease-in"
		leave-from-class="translate-y-0 opacity-100"
		leave-to-class="-translate-y-full opacity-0"
	>
		<div v-if="visible" :class="['fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium text-white', restored ? 'bg-emerald-500' : 'bg-red-500']">
			<WifiOff v-if="!restored" :size="14" />
			<Wifi v-else :size="14" />
			<span>{{ restored ? $t('common.network_restored') : $t('common.network_offline') }}</span>
			<button v-if="!restored" @click="visible = false" :aria-label="$t('common.close')" class="ml-2 p-0.5 rounded hover:bg-white/20 transition-colors">
				<X :size="12" />
			</button>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { WifiOff, Wifi, X } from 'lucide-vue-next'

const visible = ref(false)
const restored = ref(false)
let restoreTimer: ReturnType<typeof setTimeout> | null = null

function onOffline() {
	restored.value = false
	visible.value = true
}

function onOnline() {
	if (!visible.value) return
	restored.value = true
	restoreTimer = setTimeout(() => {
		visible.value = false
		restored.value = false
	}, 2000)
}

onMounted(() => {
	window.addEventListener('offline', onOffline)
	window.addEventListener('online', onOnline)

	// Check initial state
	if (!navigator.onLine) {
		onOffline()
	}
})

onUnmounted(() => {
	window.removeEventListener('offline', onOffline)
	window.removeEventListener('online', onOnline)
	if (restoreTimer) clearTimeout(restoreTimer)
})
</script>
