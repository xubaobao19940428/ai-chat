# AI 聚合聊天应用

基于 Vue 3 + TypeScript + Vite 构建的 AI 聚合聊天应用。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue 的状态管理库
- **Axios** - 基于 Promise 的 HTTP 客户端
- **TailwindCSS** - 实用优先的 CSS 框架
- **SCSS** - CSS 预处理器

## 项目结构

```
ai-chart/
├── src/
│   ├── api/              # API 接口封装
│   │   ├── request.ts    # Axios 请求封装
│   │   └── chat.ts      # 聊天相关 API
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   │   └── index.ts
│   ├── store/           # Pinia 状态管理
│   │   ├── index.ts
│   │   └── chat.ts      # 聊天状态管理
│   ├── views/           # 页面组件
│   │   ├── Home.vue     # 首页
│   │   └── Chat.vue     # 聊天页面
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── style.css        # 全局样式
├── public/              # 公共资源
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # TailwindCSS 配置
└── tsconfig.json        # TypeScript 配置
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 功能特性

- ✅ Vue 3 Composition API
- ✅ TypeScript 类型支持
- ✅ 路由管理（Vue Router）
- ✅ 状态管理（Pinia）
- ✅ HTTP 请求封装（Axios）
- ✅ TailwindCSS 样式框架
- ✅ SCSS 支持
- ✅ 路径别名配置（@ 指向 src）

## 开发说明

### API 配置

在 `src/api/request.ts` 中配置 API 基础 URL 和请求拦截器。

### 路由配置

在 `src/router/index.ts` 中添加新的路由。

### 状态管理

在 `src/store/` 目录下创建新的 store 模块。

### 样式

- 使用 TailwindCSS 进行样式开发
- 支持 SCSS 预处理器
- 全局样式在 `src/style.css` 中配置

## 下一步

1. 配置后端 API 地址
2. 实现具体的 AI 聊天接口
3. 添加更多功能（如多模型切换、历史记录等）
4. 优化 UI/UX 体验
