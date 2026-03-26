<template>
	<canvas ref="canvasRef" class="w-full block" style="height: 100%;" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
	audioLevel?: number
}>(), {
	audioLevel: 0,
})

const SAMPLE_MS = 70
const BAR_W = 3.5
const BAR_GAP = 3
const MIN_H = 4
const BAR_RADIUS = 1.5
const FADE_COUNT = 16

const canvasRef = ref<HTMLCanvasElement | null>(null)

const bars: { h: number; live: boolean }[] = []
let maxBars = 0
let timerId: ReturnType<typeof setInterval> | null = null

function getColors() {
	const el = canvasRef.value
	if (!el) return { idle: 'rgba(0,0,0,0.18)', active: '#000' }
	const style = getComputedStyle(el)
	const primary = style.getPropertyValue('--text-primary').trim() || '#000'
	const tertiary = style.getPropertyValue('--text-tertiary').trim() || 'rgba(0,0,0,0.18)'
	return { idle: tertiary, active: primary }
}

function draw() {
	const canvas = canvasRef.value
	if (!canvas) return
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	const dpr = window.devicePixelRatio || 1
	const rect = canvas.getBoundingClientRect()
	canvas.width = rect.width * dpr
	canvas.height = rect.height * dpr
	ctx.scale(dpr, dpr)

	const w = rect.width
	const h = rect.height
	ctx.clearRect(0, 0, w, h)

	const maxH = h - 2
	const colors = getColors()
	const isScrolling = bars.length > maxBars
	const visible = isScrolling ? bars.slice(bars.length - maxBars) : bars
	const centerY = h / 2

	for (let i = 0; i < visible.length; i++) {
		const bar = visible[i]!
		let opacity = 1
		if (isScrolling && i < FADE_COUNT) {
			opacity = 0.08 + (i / FADE_COUNT) * 0.92
		}

		ctx.globalAlpha = opacity
		ctx.fillStyle = bar.live ? colors.active : colors.idle

		const barH = Math.min(Math.max(MIN_H, bar.h), maxH)
		const x = i * (BAR_W + BAR_GAP)
		const y = centerY - barH / 2

		ctx.beginPath()
		ctx.roundRect(x, y, BAR_W, barH, BAR_RADIUS)
		ctx.fill()
	}

	ctx.globalAlpha = 1
}

function sample() {
	const canvas = canvasRef.value
	if (!canvas) return
	const maxH = canvas.getBoundingClientRect().height - 2
	const level = props.audioLevel
	const barH = MIN_H + level * (maxH - MIN_H)
	bars.push({ h: barH, live: true })
	draw()
}

onMounted(() => {
	const canvas = canvasRef.value
	if (!canvas) return

	// Calculate how many bars fit
	const w = canvas.clientWidth
	maxBars = Math.floor((w + BAR_GAP) / (BAR_W + BAR_GAP))

	// Fill with gray idle bars and draw immediately
	for (let i = 0; i < maxBars; i++) {
		bars.push({ h: MIN_H, live: false })
	}
	draw()

	// Start sampling right away
	timerId = setInterval(sample, SAMPLE_MS)
})

onUnmounted(() => {
	if (timerId !== null) {
		clearInterval(timerId)
	}
})
</script>
