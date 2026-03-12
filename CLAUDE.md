# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:4000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

No test runner is configured in this project.

## Architecture Overview

This is **Aura AI** — a Nuxt 4 chat application built with Vue 3, Pinia, Tailwind CSS, and `@nuxtjs/i18n`. All application source lives under `app/`.

### Request Layer

- `app/utils/request.ts` — Axios instance with request/response interceptors. Every request is signed using MD5 HMAC (timestamp + nonce + sorted params) via `app/utils/sign.ts`. Auth token is read from `localStorage` and injected as the `Authorization` header. Auth errors from the API trigger `uiStore.openLoginModal()`.
- `app/api/chat.ts` — The chat API is **not** handled by Axios. It uses the native `fetch` API directly with SSE streaming, reading `ReadableStream` chunks and dispatching callbacks (`onMessage`, `onError`, `onFinish`). This is the only place where streaming is implemented.
- `app/utils/api.ts` — Re-exports everything from `app/api/*` as a unified barrel import.

### State Management (Pinia Stores)

| Store | File | Responsibility |
|---|---|---|
| `useConversationStore` | `stores/conversation.ts` | Conversations list, messages, CRUD, streaming message updates, local cache sync |
| `useUserStore` | `stores/user.ts` | Auth token + user profile (stored in `localStorage`) |
| `useUIStore` | `stores/ui.ts` | Theme (cookie-persisted), sidebar state, modal visibility flags, toast queue |
| `useChatStore` | `stores/chat.ts` | Loading state and pending message for the active chat |
| `useModelsStore` | `stores/models.ts` | Available AI models list |
| `useProjectsStore` | `stores/projects.ts` | Conversation groups/projects |

### Offline / Local Persistence

`app/utils/storage.ts` wraps IndexedDB (`AuraChatDB`) with two object stores:
- `messages` — keyed by conversation ID
- `conversations` — single `"list"` key for the full sidebar list

The conversation store loads from IndexedDB on init and debounce-saves during streaming to avoid write storms.

### Markdown Rendering

`app/utils/markdown.ts` exports a singleton `renderMarkdown(content)` function. It uses `markdown-it` with:
- `highlight.js` for syntax highlighting (atom-one-dark theme)
- `markdown-it-katex` for LaTeX math
- `mermaid` for diagrams (rendered client-side via a `<pre class="mermaid">` element)
- Task lists, footnotes, sub/sup scripts, mark, ins, abbr plugins

The rendered HTML is consumed by `app/components/MarkdownContent.vue`, which also handles click events for copy buttons and Mermaid zoom/download controls.

### Theme System

Theme is persisted in a cookie (`theme-mode`: `light | dark | system`). An inline `<script>` in `nuxt.config.ts` applies the dark class before hydration to prevent flash. Runtime management is in `useUIStore.initTheme()`.

### i18n

8 locales (en, zh, ja, ko, es, fr, de, pt) in `app/locales/*.json`. Strategy is `no_prefix` — locale is detected from a cookie (`i18n_redirected`) and not from URL segments.

### API Configuration

Runtime config keys (set in `nuxt.config.ts`, overridable via environment):
- `NUXT_PUBLIC_API_BASE` — backend base URL (default: `https://ai-test.iappdaily.com`)
- `NUXT_PUBLIC_APP_ID` — app identifier
- `NUXT_PUBLIC_APP_KEY` — signing secret key
