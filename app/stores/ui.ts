import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = useCookie('sidebar-collapsed', { default: () => false })
  const mobileMenuOpen = ref(false)
  const themeMode = useCookie<ThemeMode>('theme-mode', { default: () => 'system' })
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
    if (import.meta.client && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      systemTheme.value = 'dark'
    } else {
      systemTheme.value = 'light'
    }
  }

  // 应用主题
  const applyTheme = (theme: 'light' | 'dark') => {
    if (!import.meta.client) return
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
    // 立即应用主题
    const themeToApply = getCurrentTheme()
    applyTheme(themeToApply)
  }

  // 初始化主题
  const initTheme = () => {
    if (!import.meta.client) return

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

  // 登录弹窗控制
  const showLoginModal = ref(false)

  const openLoginModal = () => {
    showLoginModal.value = true
  }

  const closeLoginModal = () => {
    showLoginModal.value = false
  }

  // Settings Modal Control
  const showSettingsModal = ref(false)
  const openSettingsModal = () => {
    showSettingsModal.value = true
  }
  const closeSettingsModal = () => {
    showSettingsModal.value = false
  }

  // Download Modal Control
  const showDownloadModal = ref(false)
  const openDownloadModal = () => {
    showDownloadModal.value = true
  }
  const closeDownloadModal = () => {
    showDownloadModal.value = false
  }

  // Project Modal Control
  const showProjectModal = ref(false)
  const setProjectModal = (show: boolean) => {
    showProjectModal.value = show
  }

  // Search Modal Control
  const showSearchModal = ref(false)
  const openSearchModal = () => {
    showSearchModal.value = true
  }
  const closeSearchModal = () => {
    showSearchModal.value = false
  }

  // Rename Modal Control
  const showRenameModal = ref(false)
  const renameConversation = ref<any>(null)
  const openRenameModal = (conversation: any) => {
    renameConversation.value = conversation
    showRenameModal.value = true
  }
  const closeRenameModal = () => {
    showRenameModal.value = false
    renameConversation.value = null
  }

  return {
    sidebarCollapsed,
    mobileMenuOpen,
    themeMode,
    currentTheme,
    showLoginModal,
    showSettingsModal,
    showDownloadModal,
    toggleSidebar,
    setSidebarCollapsed,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    setThemeMode,
    initTheme,
    openLoginModal,
    closeLoginModal,
    openSettingsModal,
    closeSettingsModal,
    openDownloadModal,
    closeDownloadModal,
    showProjectModal,
    setProjectModal,
    showSearchModal,
    openSearchModal,
    closeSearchModal,
    showRenameModal,
    renameConversation,
    openRenameModal,
    closeRenameModal,
  }
})
