import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const mobileMenuOpen = ref(false)

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
    toggleSidebar,
    setSidebarCollapsed,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
  }
})

