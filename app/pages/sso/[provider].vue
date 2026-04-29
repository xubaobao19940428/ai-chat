<template>
	<div class="flex h-screen w-full flex-col items-center justify-center bg-[var(--background-gray-main)] px-4 text-center">
		<div class="flex flex-col items-center gap-4 rounded-3xl border border-[var(--border-main)] bg-[var(--bg-main)] px-8 py-10 shadow-sm">
			<Loader2 v-if="status === 'loading'" class="h-10 w-10 animate-spin text-[var(--text-blue)]" />

			<div v-else-if="status === 'success'"
				class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--function-success-tsp)] text-[var(--function-success)]">
				<Check class="h-6 w-6" />
			</div>

			<div v-else
				class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--function-error-tsp)] text-[var(--function-error)]">
				<X class="h-6 w-6" />
			</div>

			<div>
				<h1 class="text-lg font-semibold text-[var(--text-primary)]">{{ title }}</h1>
				<p class="mt-1 text-sm text-[var(--text-tertiary)]">{{ description }}</p>
			</div>

			<button v-if="status === 'error'" @click="navigateTo('/chat')"
				class="mt-2 rounded-xl bg-[var(--Button-primary-black)] px-5 py-2 text-sm font-medium text-[var(--text-onblack)] transition-opacity hover:opacity-90">
				Return to Chat
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Check, Loader2, X } from 'lucide-vue-next'
import { socialLoginCallback } from '~/utils/api'
import { useUserStore } from '~/stores/user'
import { useProjectStore } from '~/stores/projects'
import { useConversationStore } from '~/stores/conversation'

definePageMeta({
	layout: 'legal',
})

const route = useRoute()
const userStore = useUserStore()
const projectStore = useProjectStore()
const conversationStore = useConversationStore()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMsg = ref('')

const title = computed(() => {
	if (status.value === 'success') return 'Authentication successful'
	if (status.value === 'error') return 'Authentication failed'
	return 'Completing authentication'
})

const description = computed(() => {
	if (status.value === 'success') return 'Redirecting you back to MixU...'
	if (status.value === 'error') return errorMsg.value || 'Please try signing in again.'
	return 'Please do not close this window.'
})

onMounted(async () => {
	const provider = String(route.params.provider || route.query.provider || 'google')
	const params = { ...route.query }

	if (!params.code && !params.token) {
		status.value = 'error'
		errorMsg.value = 'No authorization code found.'
		return
	}

	try {
		const res: any = params.token ? { token: params.token } : await socialLoginCallback(provider, params)
		const token = res?.token || res?.data?.token
		if (!token) {
			status.value = 'error'
			errorMsg.value = 'Authentication failed: missing token.'
			return
		}

		userStore.setToken(String(token))
		await userStore.fetchUserInfo()
		await Promise.all([
			projectStore.fetchProjects(),
			conversationStore.fetchConversations(),
		])
		status.value = 'success'
		setTimeout(() => {
			navigateTo('/chat', { replace: true })
		}, 600)
	} catch (err: any) {
		status.value = 'error'
		errorMsg.value = err?.message || 'Authentication failed.'
	}
})
</script>
