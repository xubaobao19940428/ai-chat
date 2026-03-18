<template>
	<div class="w-full space-y-6">
		<!-- User Profile Header -->
		<div class="flex items-center justify-between pb-6">
			<div class="flex items-center gap-4">
				<!-- Avatar Upload -->
				<div @click="triggerUpload" class="group relative h-16 w-16 rounded-full overflow-hidden border border-[var(--border-main)] cursor-pointer">
					<img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" class="w-full h-full object-cover transition-opacity group-hover:opacity-75" />
					<div v-else class="w-full h-full bg-[var(--fill-tsp-white-main)] flex items-center justify-center text-2xl font-bold text-[var(--text-secondary)] transition-opacity group-hover:opacity-75">
						{{ userStore.userInfo?.nickname?.[0]?.toUpperCase() || 'U' }}
					</div>
					<!-- Hover Overlay -->
					<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
						<SquarePen :size="24" class="text-white drop-shadow-md" />
					</div>
					<input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
				</div>
				<div>
					<h3 class="text-xl font-bold text-[var(--text-primary)] leading-tight">{{ userStore.userInfo?.nickname || 'User' }}</h3>
					<p class="text-[13px] text-[var(--text-tertiary)] mt-0.5">{{ userStore.userInfo?.email || 'user@example.com' }}</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<button class="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] hover:text-[var(--text-primary)] transition-colors">
					<User :size="20" />
				</button>
				<button @click="userStore.logout" class="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border-main)] text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors">
					<LogOut :size="20" />
				</button>
			</div>
		</div>

		<!-- Plan Card -->
		<PlanCard @upgrade="$emit('upgrade')" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, LogOut, SquarePen } from 'lucide-vue-next'
import { useUserStore } from '../../stores/user'
import { useUIStore } from '../../stores/ui'
import PlanCard from './PlanCard.vue'

defineEmits<{
	upgrade: []
}>()

const userStore = useUserStore()
const uiStore = useUIStore()
const fileInput = ref<HTMLInputElement | null>(null)

const triggerUpload = () => {
	fileInput.value?.click()
}

const handleFileChange = async (e: Event) => {
	const input = e.target as HTMLInputElement
	if (input.files && input.files[0]) {
		try {
			await userStore.uploadAvatar(input.files[0])
		} catch (error) {
			uiStore.showToast('Avatar upload failed', 'error')
		}
	}
}
</script>
