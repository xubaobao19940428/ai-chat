import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const mobileMenuOpen = ref(false)
  const themeMode = ref<ThemeMode>('system')
  const systemTheme = ref<'light' | 'dark'>('light')

  // 计算实际主题
  const currentTheme = computed(() => {
    if (themeMode.value === 'system') {
      return systemTheme.value
    }
    return themeMode.value
  })

  // 检测系统主题
  const detectSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      systemTheme.value = 'dark'
    } else {
      systemTheme.value = 'light'
    }
  }

  // 应用主题
  const applyTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement
    const body = document.body
    
    if (theme === 'dark') {
      root.classList.add('dark')
      body.style.backgroundColor = '#000000'
      body.style.color = '#ffffff'
    } else {
      root.classList.remove('dark')
      body.style.backgroundColor = '#fcfbfb'
      body.style.color = '#1f2937'
    }
    // 设置 color-scheme 以支持系统级主题
    root.style.colorScheme = theme
  }

  // 获取当前应该应用的主题
  const getCurrentTheme = (): 'light' | 'dark' => {
    if (themeMode.value === 'system') {
      return systemTheme.value
    }
    return themeMode.value
  }

  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem('theme-mode', mode)
    // 立即应用主题
    const themeToApply = getCurrentTheme()
    applyTheme(themeToApply)
  }

  // 初始化主题
  const initTheme = () => {
    // 从 localStorage 读取保存的主题
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      themeMode.value = savedTheme
    }

    // 检测系统主题
    detectSystemTheme()

    // 监听系统主题变化
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        systemTheme.value = e.matches ? 'dark' : 'light'
        if (themeMode.value === 'system') {
          applyTheme(getCurrentTheme())
        }
      }
      
      // 使用 addEventListener 如果支持，否则使用 addListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
      } else {
        mediaQuery.addListener(handleChange)
      }
    }

    // 应用初始主题
    applyTheme(getCurrentTheme())
  }

  // 监听主题变化（作为备用，确保响应式更新）
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  // 切换侧边栏收起/展开
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置侧边栏状态
  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  // 打开移动端菜单
  const openMobileMenu = () => {
    mobileMenuOpen.value = true
  }

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    mobileMenuOpen.value = false
  }

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  return {
    sidebarCollapsed,
    mobileMenuOpen,
    themeMode,
    currentTheme,
    toggleSidebar,
    setSidebarCollapsed,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    setThemeMode,
    initTheme,
  }
})

