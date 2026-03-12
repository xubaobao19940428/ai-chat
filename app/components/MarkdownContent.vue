<template>
	<div class="markdown-content prose dark:prose-invert prose-neutral max-w-none break-words" v-html="renderedContent" ref="markdownRef"></div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUpdated, nextTick, watch } from 'vue'
import { renderMarkdown } from '../utils/markdown'

const props = defineProps<{
	content: string
}>()

const markdownRef = ref<HTMLElement | null>(null)

// Use computed to memoize the rendering result
const renderedContent = computed(() => {
	return renderMarkdown(props.content)
})

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
})

const initMermaid = async () => {
	if (typeof window === 'undefined') return

	if (!mermaid) {
		try {
			const m = await import('mermaid')
			mermaid = m.default
			mermaid.initialize({
				startOnLoad: false,
				theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
				securityLevel: 'loose',
				fontFamily: 'inherit',
			})
		} catch (e) {
			console.error('Failed to load mermaid', e)
		}
	}

	if (mermaid && markdownRef.value) {
		const isDark = document.documentElement.classList.contains('dark')
		const mermaidElements = markdownRef.value.querySelectorAll('.mermaid:not([data-processed="true"])')

		for (const el of Array.from(mermaidElements)) {
			try {
				const content = (el.textContent || '').trim()

				// Basic heuristic: Don't render if it looks like partial/streaming content
				// (e.g. doesn't have at least one arrow or node definition, or is too short)
				if (content.length < 10 || (!content.includes('-->') && !content.includes('->') && !content.includes(':'))) {
					continue
				}

				const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

				// Re-initialize for each render to ensure theme is current
				mermaid.initialize({
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

				const { svg } = await mermaid.render(id, content)
				el.innerHTML = svg
				el.setAttribute('data-processed', 'true')
				el.classList.add('rendered')
			} catch (e) {
				// During streaming, errors are expected. We don't mark as processed so it can retry.
				console.debug('Mermaid waiting for complete syntax...')
			}
		}
	}
}

// Watch for dark mode changes
if (typeof window !== 'undefined') {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === 'class' && mermaid) {
				const isDark = document.documentElement.classList.contains('dark')
				mermaid.initialize({
					theme: isDark ? 'dark' : 'default',
					fontFamily: 'inherit',
				})
				// Important: for Mermaid to re-render existing ones, it's easier to just trigger initMermaid
				initMermaid()
			}
		})
	})

	onMounted(() => {
		observer.observe(document.documentElement, { attributes: true })
		initMermaid()
	})
}

let mermaidDebounceTimer: ReturnType<typeof setTimeout> | null = null
onUpdated(() => {
	if (mermaidDebounceTimer) clearTimeout(mermaidDebounceTimer)
	mermaidDebounceTimer = setTimeout(() => {
		nextTick(() => initMermaid())
	}, 300)
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
