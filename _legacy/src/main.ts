import { createApp } from 'vue'
import './style.css'
// import 'highlight.js/styles/atom-one-dark.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { useUIStore } from './store/ui'

const app = createApp(App)

app.use(pinia)
app.use(router)

// 初始化主题
const uiStore = useUIStore()
uiStore.initTheme()

app.mount('#app')
