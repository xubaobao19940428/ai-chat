<template>
	<div class="flex h-screen bg-[var(--background-white-main)] dark:bg-[var(--background-white-main)] transition-colors overflow-hidden">
		<!-- Sidebar (Desktop) -->
		<Sidebar />

		<!-- Mobile Sidebar Drawer -->
		<MobileSidebar />

		<!-- Main Content Area -->
		<div class="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[var(--background-gray-main)]">
			<!-- Shared Top Bar (Manus Style) -->
			<TopBar />

			<!-- Page Specific Content -->
			<main class="flex-1 relative min-h-0 overflow-y-auto custom-scrollbar">
				<slot />
				<!-- Global Modals -->
				<ClientOnly>
					<AuthModal />
					<SettingsModal />
					<SearchModal />
					<RenameModal />
					<WebsiteReferenceModal />
				</ClientOnly>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUIStore } from '../stores/ui'
const uiStore = useUIStore()
</script>

<style scoped lang="scss">
.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: rgba(156, 163, 175, 0.1) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.1);
		border-radius: 10px;
	}
}
</style>
