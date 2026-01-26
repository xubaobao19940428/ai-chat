<template>
  <div class="flex h-screen bg-[#fcfbfb] dark:bg-[#000000] transition-colors">
    <!-- 桌面端侧边栏 -->
    <Sidebar />
    
    <!-- 移动端侧边栏抽屉 -->
    <MobileSidebar />

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 移动端顶部导航栏 -->
      <div class="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#1a1a1a] bg-[#fcfbfb] dark:bg-[#000000] transition-colors">
        <button
          @click="uiStore.openMobileMenu"
          class="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Chatbot App</h1>
        <div class="w-10"></div> <!-- 占位，保持居中 -->
      </div>

      <!-- 主内容 -->
      <div class="flex-1 flex flex-col relative">
        <slot />
        <AuthModal />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const uiStore = useUIStore()
</script>

<style scoped lang="scss">
</style>
