<template>
  <div class="flex h-screen bg-white overflow-hidden">
    <!-- 桌面端侧边栏 -->
    <Sidebar />
    
    <!-- 移动端侧边栏抽屉 -->
    <MobileSidebar />

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- 移动端顶部导航栏 -->
      <div class="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <button
          @click="uiStore.openMobileMenu"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-gray-900">Chatbot App</h1>
        <div class="w-10"></div> <!-- 占位，保持居中 -->
      </div>

      <!-- 主内容 -->
      <div class="flex-1 overflow-hidden">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import MobileSidebar from '@/components/MobileSidebar.vue'
import { useUIStore } from '@/store/ui'

const uiStore = useUIStore()
</script>

<style scoped lang="scss">
</style>
