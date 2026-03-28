<template>
	<div class="markdown-content prose dark:prose-invert prose-neutral max-w-none break-words" v-html="renderedContent" ref="markdownRef"></div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUpdated, onUnmounted, nextTick, watch } from 'vue'
import { renderMarkdown } from '../utils/markdown'

const props = withDefaults(
	defineProps<{
		content: string
		streaming?: boolean
	}>(),
	{ streaming: false }
)

const markdownRef = ref<HTMLElement | null>(null)

// --- Throttled rendering during streaming ---
const RENDER_THROTTLE_MS = 120
let renderTimer: ReturnType<typeof setTimeout> | null = null
const throttledHtml = ref('')

// Immediate render for non-streaming; throttled for streaming
const renderedContent = computed(() => {
	if (!props.streaming) {
		// Not streaming — render synchronously (computed cache handles dedup)
		return renderMarkdown(props.content)
	}
	// During streaming, return the throttled snapshot
	return throttledHtml.value
})

watch(
	() => props.content,
	(content) => {
		if (!props.streaming) return
		if (renderTimer) return // already scheduled
		renderTimer = setTimeout(() => {
			throttledHtml.value = renderMarkdown(content)
			renderTimer = null
		}, RENDER_THROTTLE_MS)
	}
)

// When streaming ends, do a final full render
watch(
	() => props.streaming,
	(streaming, prev) => {
		if (prev && !streaming) {
			if (renderTimer) {
				clearTimeout(renderTimer)
				renderTimer = null
			}
			throttledHtml.value = renderMarkdown(props.content)
		}
	}
)

// --- Code block collapse for long blocks ---
const CODE_COLLAPSE_THRESHOLD = 15

const initCodeCollapse = () => {
	if (!markdownRef.value) return
	const wrappers = markdownRef.value.querySelectorAll('.code-block-wrapper:not([data-collapse-init])')
	wrappers.forEach((wrapper) => {
		wrapper.setAttribute('data-collapse-init', 'true')
		const codeEl = wrapper.querySelector('pre code')
		if (!codeEl) return
		const lineCount = (codeEl.textContent || '').split('\n').length
		if (lineCount <= CODE_COLLAPSE_THRESHOLD) return

		const pre = wrapper.querySelector('pre') as HTMLElement
		if (!pre) return

		// Mark as collapsed
		wrapper.classList.add('code-collapsed')
		pre.style.maxHeight = '320px'

		// Create toggle button
		const toggleBtn = document.createElement('button')
		toggleBtn.className = 'code-collapse-toggle'
		toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg><span>Show all (${lineCount} lines)</span>`
		toggleBtn.addEventListener('click', () => {
			const isCollapsed = wrapper.classList.contains('code-collapsed')
			if (isCollapsed) {
				wrapper.classList.remove('code-collapsed')
				pre.style.maxHeight = 'none'
				toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg><span>Collapse</span>`
			} else {
				wrapper.classList.add('code-collapsed')
				pre.style.maxHeight = '320px'
				toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg><span>Show all (${lineCount} lines)</span>`
			}
		})
		wrapper.appendChild(toggleBtn)
	})
}

// Mermaid integration
let mermaid: any = null

const initInteractiveMermaid = () => {
	if (!markdownRef.value) return

	// Event delegation for Mermaid interactive buttons
	markdownRef.value.addEventListener('click', async (e) => {
		const target = e.target as HTMLElement
		const btn = target.closest('button')
		if (!btn) return

		const container = btn.closest('.mermaid-container') as HTMLElement
		if (!container) return

		const viewer = container.querySelector('.mermaid-viewer') as HTMLElement
		const mermaidEl = container.querySelector('.mermaid') as HTMLElement
		const sourceEl = container.querySelector('.mermaid-source-view') as HTMLElement

		// 1. Download SVG
		if (btn.classList.contains('download-btn')) {
			const svg = mermaidEl.querySelector('svg')
			if (svg) {
				const svgData = new XMLSerializer().serializeToString(svg)
				const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
				const url = URL.createObjectURL(svgBlob)
				const downloadLink = document.createElement('a')
				downloadLink.href = url
				downloadLink.download = `mermaid-diagram-${Date.now()}.svg`
				document.body.appendChild(downloadLink)
				downloadLink.click()
				document.body.removeChild(downloadLink)
				URL.revokeObjectURL(url)
			}
		}

		// 2. Toggle Source View
		if (btn.classList.contains('toggle-source-btn')) {
			const isRendered = container.getAttribute('data-view') === 'rendered'
			container.setAttribute('data-view', isRendered ? 'source' : 'rendered')
			if (isRendered) {
				mermaidEl.style.display = 'none'
				sourceEl.style.display = 'block'
				btn.classList.add('active')
			} else {
				mermaidEl.style.display = 'flex'
				sourceEl.style.display = 'none'
				btn.classList.remove('active')
			}
		}

		// 3. Zoom Controls
		if (btn.classList.contains('zoom-btn')) {
			const svg = mermaidEl.querySelector('svg')
			if (!svg) return

			let scale = parseFloat(svg.getAttribute('data-scale') || '1')
			if (btn.classList.contains('zoom-in')) scale += 0.2
			if (btn.classList.contains('zoom-out')) scale = Math.max(0.2, scale - 0.2)
			if (btn.classList.contains('zoom-reset')) scale = 1

			svg.setAttribute('data-scale', scale.toString())
			svg.style.transform = `scale(${scale})`
			svg.style.transformOrigin = 'center top'
		}

		// 5. Copy Code (Universal for Mermaid and normal blocks)
		if (btn.classList.contains('copy-code-btn')) {
			const code = btn.getAttribute('data-code')
			if (code) {
				try {
					await navigator.clipboard.writeText(code)
					const originalContent = btn.innerHTML
					btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Copied!</span>'
					btn.classList.add('copied')
					setTimeout(() => {
						btn.innerHTML = originalContent
						btn.classList.remove('copied')
					}, 2000)
				} catch (err) {
					console.error('Failed to copy code', err)
				}
			}
		}
	})
}

onMounted(() => {
	initInteractiveMermaid()
	initCodeCollapse()
})

// --- Mermaid theme config (single source of truth) ---
const getMermaidConfig = (isDark: boolean) => ({
	startOnLoad: false,
	theme: isDark ? 'dark' : 'default',
	securityLevel: 'loose',
	fontFamily: 'Inter, system-ui, sans-serif',
	themeVariables: {
		primaryColor: isDark ? '#312e81' : '#f5f3ff',
		primaryTextColor: isDark ? '#e0e7ff' : '#4338ca',
		primaryBorderColor: isDark ? '#4338ca' : '#a5b4fc',
		lineColor: isDark ? '#6366f1' : '#6366f1',
		secondaryColor: isDark ? '#1e1b4b' : '#f8fafc',
		tertiaryColor: isDark ? '#1e1b4b' : '#f8fafc',
		fontSize: '14px',
		mainBkg: isDark ? '#1e1b4b' : '#f5f3ff',
		nodeBorder: isDark ? '#4338ca' : '#8b5cf6',
		clusterBkg: isDark ? '#111827' : '#f8fafc',
		edgeLabelBackground: isDark ? '#1f2937' : '#ffffff',
		borderRadius: '8px',
	},
	flowchart: {
		padding: 20,
		useMaxWidth: true,
		htmlLabels: true,
		curve: 'basis',
	},
})

const initMermaid = async () => {
	if (typeof window === 'undefined') return
	// Skip mermaid during streaming — wait for final content
	if (props.streaming) return

	if (!mermaid) {
		try {
			const m = await import('mermaid')
			mermaid = m.default
			mermaid.initialize(getMermaidConfig(document.documentElement.classList.contains('dark')))
		} catch (e) {
			console.error('Failed to load mermaid', e)
		}
	}

	if (mermaid && markdownRef.value) {
		const mermaidElements = markdownRef.value.querySelectorAll('.mermaid:not([data-processed="true"])')
		if (mermaidElements.length === 0) return

		// Initialize once per render pass (not per element)
		const isDark = document.documentElement.classList.contains('dark')
		mermaid.initialize(getMermaidConfig(isDark))

		for (const el of Array.from(mermaidElements)) {
			try {
				const content = (el.textContent || '').trim()

				if (content.length < 10 || (!content.includes('-->') && !content.includes('->') && !content.includes(':'))) {
					continue
				}

				const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
				const { svg } = await mermaid.render(id, content)
				el.innerHTML = svg
				el.setAttribute('data-processed', 'true')
				el.classList.add('rendered')
			} catch (e) {
				console.debug('Mermaid waiting for complete syntax...')
			}
		}
	}
}

// Watch for dark mode changes
let darkModeObserver: MutationObserver | null = null
if (typeof window !== 'undefined') {
	darkModeObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === 'class' && mermaid) {
				const isDark = document.documentElement.classList.contains('dark')
				mermaid.initialize(getMermaidConfig(isDark))
				initMermaid()
			}
		})
	})

	onMounted(() => {
		darkModeObserver!.observe(document.documentElement, { attributes: true })
		initMermaid()
	})

	onUnmounted(() => {
		darkModeObserver!.disconnect()
	})
}

let mermaidDebounceTimer: ReturnType<typeof setTimeout> | null = null
onUpdated(() => {
	// Skip heavy post-processing during streaming
	if (props.streaming) return
	if (mermaidDebounceTimer) clearTimeout(mermaidDebounceTimer)
	mermaidDebounceTimer = setTimeout(() => {
		nextTick(() => {
			initMermaid()
			initCodeCollapse()
		})
	}, 300)
})

onUnmounted(() => {
	if (renderTimer) clearTimeout(renderTimer)
	if (mermaidDebounceTimer) clearTimeout(mermaidDebounceTimer)
})

</script>

<style lang="scss">
/* v-html content is not scoped — use global selectors */
.markdown-content {
	/* Override prose's hardcoded colors with theme-aware vars */
	color: inherit;
	font-size: inherit;
	line-height: inherit;

	p {
		margin-bottom: 1em;

		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
