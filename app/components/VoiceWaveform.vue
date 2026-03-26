<template>
	<canvas ref="canvasRef" class="w-full block" style="height: 100%;" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
	audioLevel?: number
	active?: boolean
}>(), {
	audioLevel: 0,
	active: false,
})

const SAMPLE_MS = 70
const BAR_W = 3.5
const BAR_GAP = 3
const MIN_H = 4
const BAR_RADIUS = 1.5
const FADE_COUNT = 16

const canvasRef = ref<HTMLCanvasElement | null>(null)

// Each bar stores its final height — never changes once pushed
const bars: { h: number; live: boolean }[] = []
let maxBars = 0
let timerId: ReturnType<typeof setInterval> | null = null
let inited = false

function getColors() {
	const el = canvasRef.value
	if (!el) return { idle: 'rgba(0,0,0,0.18)', active: '#000' }
	const style = getComputedStyle(el)
	const primary = style.getPropertyValue('--text-primary').trim() || '#000'
	const tertiary = style.getPropertyValue('--text-tertiary').trim() || 'rgba(0,0,0,0.18)'
	return { idle: tertiary, active: primary }
}

function calcMaxBars() {
	const el = canvasRef.value
	if (!el) return
	const w = el.clientWidth
	maxBars = Math.floor((w + BAR_GAP) / (BAR_W + BAR_GAP))
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

	const maxH = h - 2 // leave 1px padding top/bottom
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

function initIdleBars() {
	calcMaxBars()
	bars.length = 0
	for (let i = 0; i < maxBars; i++) {
		bars.push({ h: MIN_H, live: false })
	}
	inited = true
	draw()
}

function sample() {
	const canvas = canvasRef.value
	if (!canvas) return
	const maxH = canvas.getBoundingClientRect().height - 2
	const level = props.audioLevel
	// Map audioLevel (0~1) to bar height
	const barH = MIN_H + level * (maxH - MIN_H)
	bars.push({ h: barH, live: true })
	draw()
}

watch(() => props.active, (val) => {
	if (val) {
		nextTick(() => {
			if (!inited) initIdleBars()
			timerId = setInterval(sample, SAMPLE_MS)
		})
	} else {
		if (timerId !== null) {
			clearInterval(timerId)
			timerId = null
		}
		bars.length = 0
		inited = false
	}
}, { immediate: true })

onMounted(() => {
	if (props.active && !inited) {
		initIdleBars()
	}
})

onUnmounted(() => {
	if (timerId !== null) {
		clearInterval(timerId)
	}
})
</script>
