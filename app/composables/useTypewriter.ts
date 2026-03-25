import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Typewriter placeholder animation.
 * Animates text character-by-character at 20ms intervals.
 */
export function useTypewriter(getText: () => string) {
	const displayedText = ref(getText())
	let interval: ReturnType<typeof setInterval> | null = null

	function start() {
		stop()
		displayedText.value = ''
		let i = 0
		const text = getText()
		interval = setInterval(() => {
			if (i < text.length) {
				displayedText.value += text[i]
				i++
			} else {
				if (interval) clearInterval(interval)
				interval = null
			}
		}, 20)
	}

	function stop() {
		if (interval) {
			clearInterval(interval)
			interval = null
		}
	}

	onMounted(() => start())
	onUnmounted(() => stop())

	return { displayedText, start, stop }
}
