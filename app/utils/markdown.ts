import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md: any = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        return `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-lang">${lang}</span><button class="copy-code-btn" data-code="${md.utils.escapeHtml(str)}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span class="pointer-events-none">Copy</span></button></div><pre class="hljs"><code>${highlighted}</code></pre></div>`
      } catch (__) { }
    }

    return `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-lang">text</span><button class="copy-code-btn" data-code="${md.utils.escapeHtml(str)}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span class="pointer-events-none">Copy</span></button></div><pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre></div>`
  }
})

export function renderMarkdown(content: string): string {
  return md.render(content)
}
