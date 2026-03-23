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

---

## Code Standards

本项目的编码规范。所有新增和修改的代码必须遵循以下标准。

### 1. Vue 组件规范

#### SFC 结构顺序
```vue
<script setup lang="ts">
// 1. 类型导入
// 2. Vue/Nuxt 导入
// 3. 第三方库导入
// 4. Store 导入
// 5. 组件导入
// 6. Composable/Utils 导入
// 7. Props & Emits 定义
// 8. Store 实例化
// 9. Ref/Reactive 状态
// 10. Computed 属性
// 11. Watch 监听
// 12. 方法定义
// 13. 生命周期钩子
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 组件样式 */
</style>
```

#### Props 定义
- 始终使用 TypeScript 泛型形式：`defineProps<{...}>()`
- 有默认值时使用 `withDefaults(defineProps<{...}>(), {...})`
- Prop 名使用 camelCase

```typescript
// ✅ 正确
const props = withDefaults(
  defineProps<{
    variant?: 'standard' | 'ghost' | 'pill'
    showIcon?: boolean
  }>(),
  { variant: 'standard', showIcon: true }
)

// ❌ 错误 — 不使用运行时声明
defineProps({ variant: { type: String, default: 'standard' } })
```

#### Emits 定义
- 使用 TypeScript 泛型形式，包含事件参数类型

```typescript
// ✅ 正确
defineEmits<{
  modelSelected: [id: string]
  update: [value: number, label: string]
}>()
```

#### 组件大小限制
- 单个 `.vue` 文件不超过 **700 行**
- 超过时应拆分为子组件或抽取 composable
- 复杂的业务逻辑应提取到 composable 中

### 2. TypeScript 规范

#### 类型定义
- 接口使用 PascalCase：`interface ChatMessage { ... }`
- 类型别名使用 PascalCase：`type ThemeMode = 'light' | 'dark' | 'system'`
- 优先使用 `interface`，联合类型/工具类型才用 `type`
- 使用字面量联合类型替代 enum：`'success' | 'error' | 'warning'`
- **禁止**使用裸 `any`，应使用 `unknown` 或具体类型；确实无法明确类型时用 `// eslint-disable-next-line` 标注原因

```typescript
// ✅ 正确
export interface ChatModelOptions {
  temperature?: number
  onMessage?: (content: string) => void
  onError?: (error: unknown) => void
}

// ❌ 错误 — 避免 any
const data: any = response
```

#### 空值处理
- 使用可选链：`model?.display_name`
- 使用空值合并：`value ?? 'fallback'`
- 使用提前返回进行空值守卫：`if (!value) return`

#### 常量命名
- 模块级常量使用 UPPER_SNAKE_CASE：`const DEFAULT_CHAT_OPTIONS = { ... }`
- 避免魔术数字/字符串，提取为命名常量

```typescript
// ✅ 正确
const MAX_CACHE_SIZE = 500
const DEBOUNCE_MS = 300
if (cache.size > MAX_CACHE_SIZE) cache.clear()

// ❌ 错误 — 魔术数字
if (cache.size > 500) cache.clear()
```

### 3. Pinia Store 规范

#### 必须使用 Composition API 风格

```typescript
// ✅ 正确
export const useModelStore = defineStore('model', () => {
  const models = ref<AIModel[]>([])
  const isLoading = ref(false)

  const selectedModel = computed(() => { /* ... */ })

  async function fetchModels() { /* ... */ }

  return { models, isLoading, selectedModel, fetchModels }
})

// ❌ 错误 — 不使用 Options API 风格
export const useModelStore = defineStore('model', {
  state: () => ({ ... }),
  actions: { ... }
})
```

#### Store 使用规则
- 组件中赋值给 const：`const store = useXxxStore()`
- **不要**解构 store（会丢失响应性），需要解构时用 `storeToRefs()`
- Cookie 持久化用 `useCookie<T>('key', { default: () => value })`
- Store 文件放在 `app/stores/` 目录，文件名小写：`models.ts`

### 4. API 层规范

#### 文件组织
- 每个 API 资源一个文件：`app/api/chat.ts`、`app/api/image.ts`
- 类型定义与 API 函数同文件
- 通过 `app/utils/api.ts` 统一导出

#### 普通请求 — 使用 Axios 实例
```typescript
import request from '~/utils/request'
const { data } = await request.get('/api/endpoint')
```

#### 流式请求 — 使用 fetch + SSE
```typescript
// 流式 API 使用 fetch，提供 onMessage/onError/onFinish 回调
// 必须支持 AbortSignal 以允许取消
export async function sendStreamRequest(
  params: RequestParams,
  options: { onMessage?: (data: string) => void; signal?: AbortSignal }
) { /* ... */ }
```

### 5. Composable 规范

- 文件放在 `app/composables/` 目录
- 命名：`useXxx.ts`（camelCase）
- 导出命名函数：`export function useXxx(options?: Options) { ... }`
- 返回值用对象包裹：`return { state, actions }`
- 必须在 `onUnmounted` 中清理副作用（事件监听、定时器、Observer）

```typescript
// ✅ 正确
export function useFileUpload(options?: { purpose?: string }) {
  const isUploading = ref(false)
  const files = ref<UploadFile[]>([])

  function upload(file: File) { /* ... */ }
  function removeFile(id: string) { /* ... */ }

  onUnmounted(() => {
    files.value.forEach(f => URL.revokeObjectURL(f.previewUrl))
  })

  return { isUploading, files, upload, removeFile }
}
```

### 6. 样式规范

#### CSS 变量（设计系统）
- 命名：`--category-subcategory`（kebab-case）
- 颜色变量统一在 `app/assets/css/main.css` 中定义
- 组件中通过 Tailwind 任意值引用：`text-[var(--text-primary)]`

#### Tailwind 使用规则
- 优先使用 Tailwind 工具类，避免自定义 CSS
- 暗色模式使用 `dark:` 前缀
- 响应式使用 `sm:` / `md:` / `lg:` 前缀
- 动态类绑定使用数组语法：`:class="['base', isActive && 'active']"`

#### Scoped Styles
- 组件样式必须使用 `<style scoped>`
- 需要穿透子组件时使用 `:deep()` 选择器
- v-html 内容的样式需加注释说明：`/* v-html content is not scoped */`

### 7. 文件命名规范

| 类型 | 命名规则 | 示例 |
|---|---|---|
| 组件 | PascalCase | `ModelSelector.vue` |
| 页面 | kebab-case | `image-generation.vue` |
| Store | lowercase | `conversation.ts` |
| API | lowercase | `chat.ts` |
| Composable | camelCase + use 前缀 | `useFileUpload.ts` |
| 工具函数 | lowercase | `markdown.ts` |
| 类型文件 | kebab-case + `.d.ts` | `markdown-plugins.d.ts` |

### 8. 导入顺序

按以下分组排列，组间空行分隔：

```typescript
// 1. Vue / Nuxt 内置
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 2. 第三方库
import axios from 'axios'

// 3. Store / Composable
import { useUIStore } from '~/stores/ui'
import { useFileUpload } from '~/composables/useFileUpload'

// 4. API / Utils
import { sendChatMessage } from '~/utils/api'
import { renderMarkdown } from '~/utils/markdown'

// 5. 组件（仅在需要动态导入时）
import MarkdownContent from '~/components/MarkdownContent.vue'
```

路径别名统一使用 `~`（指向 `app/` 目录）。

### 9. i18n 规范

- 所有用户可见文本必须使用 i18n，禁止硬编码
- 模板中：`{{ $t('chat.welcome_title') }}`
- Script 中：`const { t } = useI18n()` → `t('key.subkey')`
- Key 使用点分层级命名：`chat.new_chat`、`settings.general`
- 新增 key 必须同时在 `en.json` 和 `zh.json` 中添加，其余语言可后续补充

### 10. 异步与错误处理

- 统一使用 `async/await`，不使用 `.then()` 链
- 流式操作使用回调模式：`onMessage`、`onError`、`onFinish`
- 所有异步操作必须 try-catch，错误用 `console.error()` 记录
- 支持取消的操作必须接受 `AbortSignal`
- 非中断性错误（如 AbortError）应静默处理：`if (error.name === 'AbortError') return`

### 11. 性能规范

- 高频操作必须 debounce（如流式写入 IndexedDB）
- 缓存必须设上限并在超限时清理
- 大型模块使用动态导入：`const module = await import('...')`
- 组件必须为异步内容提供骨架屏/loading 状态
- `onUnmounted` 中清理所有事件监听器、定时器、Observer、Blob URL

### 12. Git 提交规范

格式：`<type>: <description>`

| Type | 说明 |
|---|---|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（不改变行为） |
| `style` | 样式调整（不影响逻辑） |
| `perf` | 性能优化 |
| `docs` | 文档更新 |
| `chore` | 构建/依赖/配置变更 |

- 提交信息使用英文
- 描述简洁明了，说明"做了什么"而非"改了哪个文件"
- 一个提交只做一件事
