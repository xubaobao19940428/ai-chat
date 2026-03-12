/// <reference path="../types/markdown-plugins.d.ts" />
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import katex from 'markdown-it-katex'
import taskLists from 'markdown-it-task-lists'
import footnote from 'markdown-it-footnote'
import sub from 'markdown-it-sub'
import sup from 'markdown-it-sup'
import mark from 'markdown-it-mark'
import ins from 'markdown-it-ins'
import abbr from 'markdown-it-abbr'

// Simple cache for highlighted code blocks to improve performance during re-renders
const highlightCache = new Map<string, string>()

const md: any = new MarkdownIt({
    html: true, // OpenAI level usually allows some HTML
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        const cacheKey = `${lang}:${str}`
        if (highlightCache.has(cacheKey)) {
            return highlightCache.get(cacheKey)!
        }

        // Special handling for mermaid
        const normalizedLang = (lang || '').toLowerCase().trim()
        const isMermaid = normalizedLang === 'mermaid' || normalizedLang === 'mermaid-diagram' || normalizedLang.startsWith('mermaid') || (!lang && (str.trim().startsWith('graph ') || str.trim().startsWith('sequenceDiagram ') || str.trim().startsWith('gannt ') || str.trim().startsWith('classDiagram ')))

        if (isMermaid) {
            const escapedCode = md.utils.escapeHtml(str)
            return `<div class="mermaid-container" data-view="rendered"><div class="mermaid-header"><div class="header-left"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg><span>Mermaid Diagram</span></div><div class="header-actions"><button class="mermaid-action-btn download-btn" title="Download SVG"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button><button class="mermaid-action-btn toggle-source-btn" title="Toggle Source"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button><button class="mermaid-action-btn copy-code-btn" title="Copy Source" data-code="${escapedCode}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button></div></div><div class="mermaid-viewer"><pre class="mermaid">${escapedCode}</pre><div class="mermaid-source-view" style="display: none;"><pre class="hljs"><code>${escapedCode}</code></pre></div><div class="mermaid-zoom-controls"><button class="zoom-btn zoom-in" title="Zoom In">+</button><button class="zoom-btn zoom-out" title="Zoom Out">-</button><button class="zoom-btn zoom-reset" title="Reset Zoom">⟲</button><button class="zoom-btn fullscreen-btn" title="Fullscreen"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg></button></div></div></div>`
        }

        let result = ''
        if (lang && hljs.getLanguage(lang)) {
            try {
                const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
                result = `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-lang">${lang}</span><button class="copy-code-btn" data-code="${md.utils.escapeHtml(str)}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span class="pointer-events-none">Copy</span></button></div><pre class="hljs"><code>${highlighted}</code></pre></div>`
            } catch (__) { }
        }

        if (!result) {
            result = `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-lang">${lang || 'text'}</span><button class="copy-code-btn" data-code="${md.utils.escapeHtml(str)}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span class="pointer-events-none">Copy</span></button></div><pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre></div>`
        }

        // Limit cache size to prevent memory leaks
        if (highlightCache.size > 500) {
            const firstKey = highlightCache.keys().next().value
            if (firstKey) highlightCache.delete(firstKey)
        }
        highlightCache.set(cacheKey, result)
        return result
    },
})
    .use(katex, { throwOnError: false, errorColor: ' #cc0000' })
    .use(taskLists, { enabled: true, label: true, labelAfter: true })
    .use(footnote)
    .use(sub)
    .use(sup)
    .use(mark)
    .use(ins)
    .use(abbr)

/**
 * Closes any unclosed fenced code block (``` or ~~~) before rendering.
 * Prevents the rest of a streaming response from being swallowed into
 * a code block when the closing fence hasn't arrived yet.
 */
function sanitizeStreamingContent(content: string): string {
    const lines = content.split('\n')
    let inFence = false
    let fenceChar = ''

    for (const line of lines) {
        const trimmed = line.trimStart()
        if (!inFence) {
            const m = trimmed.match(/^(`{3,}|~{3,})/)
            if (m && m[1]) {
                inFence = true
                fenceChar = m[1].charAt(0)
            }
        } else {
            const m = trimmed.match(/^(`{3,}|~{3,})\s*$/)
            if (m && m[1] && m[1].charAt(0) === fenceChar) {
                inFence = false
            }
        }
    }

    return inFence ? content.trimEnd() + '\n```' : content
}

export function renderMarkdown(content: string): string {
    if (!content) return ''
    return md.render(sanitizeStreamingContent(content))
}
