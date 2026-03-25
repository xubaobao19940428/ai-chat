<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-hidden relative transition-colors">
		<!-- Top Header -->
		<header
			class="flex-shrink-0 flex items-center justify-between px-4 h-[52px] border-b border-[var(--border-light)] bg-[var(--bg-main)]/80 backdrop-blur-md z-20">
			<button @click="router.back()"
				class="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm">
				<ChevronLeft :size="18" />
			</button>
			<h2 class="text-[15px] font-semibold text-[var(--text-primary)]">{{ $t('character_create.title') }}</h2>
			<div class="w-8"></div>
		</header>

		<!-- Scrollable Content -->
		<div class="flex-1 overflow-y-auto custom-scrollbar">
			<div class="max-w-[640px] mx-auto w-full px-4 py-8 sm:py-12">

				<!-- Avatar Upload -->
				<div class="flex flex-col items-center mb-10">
					<div class="relative group cursor-pointer" @click="triggerAvatarUpload">
						<div
							class="w-[96px] h-[96px] rounded-full overflow-hidden border-2 border-[var(--border-light)] bg-[var(--bg-hover)] flex items-center justify-center transition-all group-hover:border-[var(--accent-primary)] group-hover:shadow-lg">
							<img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
							<div v-else class="flex flex-col items-center justify-center text-[var(--text-tertiary)]">
								<UserCircle :size="40" :stroke-width="1.2" />
							</div>
						</div>
						<!-- Camera overlay -->
						<div
							class="absolute bottom-0 right-0 w-[28px] h-[28px] rounded-full bg-[var(--accent-primary,#3b82f6)] border-2 border-[var(--bg-main)] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
							<Camera :size="13" class="text-white" />
						</div>
						<!-- Upload progress overlay -->
						<div v-if="isUploadingAvatar"
							class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
							<div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent">
							</div>
						</div>
					</div>
					<input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
				</div>

				<!-- Name Field -->
				<div class="mb-6">
					<label class="block text-[14px] font-semibold text-[var(--text-primary)] mb-2">
						{{ $t('character_create.name_label') }}
					</label>
					<input v-model="form.name" type="text" :placeholder="$t('character_create.name_placeholder')"
						maxlength="64" :class="[
							'w-full h-[44px] px-4 rounded-xl text-[15px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all outline-none',
							'bg-[var(--bg-hover)] border border-[var(--border-light)]',
							'focus:border-[var(--accent-primary,#3b82f6)] focus:ring-2 focus:ring-[var(--accent-primary,#3b82f6)]/20',
							errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
						]" @input="errors.name = ''" />
					<p v-if="errors.name" class="mt-1.5 text-[12px] text-red-400">{{ errors.name }}</p>
				</div>

				<!-- Description Field -->
				<div class="mb-6">
					<label class="block text-[14px] font-semibold text-[var(--text-primary)] mb-2">
						{{ $t('character_create.description_label') }}
					</label>
					<textarea v-model="form.description" :placeholder="$t('character_create.description_placeholder')" rows="3"
						class="w-full px-4 py-3 rounded-xl text-[15px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all outline-none resize-none leading-relaxed bg-[var(--bg-hover)] border border-[var(--border-light)] focus:border-[var(--accent-primary,#3b82f6)] focus:ring-2 focus:ring-[var(--accent-primary,#3b82f6)]/20" />
				</div>

				<!-- Prompt Field -->
				<div class="mb-6">
					<label class="block text-[14px] font-semibold text-[var(--text-primary)] mb-2">
						{{ $t('character_create.prompt_label') }}
						<span class="text-red-400 ml-0.5">*</span>
					</label>
					<textarea v-model="form.prompt" :placeholder="$t('character_create.prompt_placeholder')" rows="6"
						:class="[
							'w-full px-4 py-3 rounded-xl text-[15px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all outline-none resize-none leading-relaxed',
							'bg-[var(--bg-hover)] border border-[var(--border-light)]',
							'focus:border-[var(--accent-primary,#3b82f6)] focus:ring-2 focus:ring-[var(--accent-primary,#3b82f6)]/20',
							errors.prompt ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
						]" @input="errors.prompt = ''" />
					<p v-if="errors.prompt" class="mt-1.5 text-[12px] text-red-400">{{ errors.prompt }}</p>
				</div>

				<!-- Access Settings -->
				<div class="mb-10">
					<label class="block text-[14px] font-semibold text-[var(--text-primary)] mb-2">
						{{ $t('character_create.access_label') }}
					</label>
					<button @click="openAccessModal"
						class="w-full flex items-center justify-between h-[48px] px-4 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[var(--border-main)] transition-all group">
						<div class="flex items-center gap-3">
							<div class="w-[28px] h-[28px] rounded-full flex items-center justify-center"
								:class="form.access_type === 2 ? 'bg-blue-500/10 text-blue-500' : 'bg-[var(--text-tertiary)]/10 text-[var(--text-tertiary)]'">
								<Globe v-if="form.access_type === 2" :size="15" />
								<Lock v-else :size="15" />
							</div>
							<span class="text-[14px] text-[var(--text-primary)]">
								{{ form.access_type === 2 ? $t('character_create.access_public') :
									$t('character_create.access_private') }}
							</span>
						</div>
						<ChevronRight :size="16"
							class="text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors" />
					</button>
				</div>

				<!-- Submit Button -->
				<button @click="handleSubmit" :disabled="!canSubmit || isSubmitting"
					class="w-full h-[48px] rounded-xl font-semibold text-[15px] bg-[var(--text-primary)] text-[var(--bg-main)] transition-all"
					:class="!canSubmit || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer'">
					<span v-if="isSubmitting" class="flex items-center justify-center gap-2">
						<div class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
						{{ $t('character_create.creating') }}
					</span>
					<span v-else>{{ $t('character_create.submit') }}</span>
				</button>
			</div>
		</div>

		<!-- Access Settings Modal -->
		<Teleport to="body">
			<Transition name="modal">
				<div v-if="showAccessModal" class="fixed inset-0 z-[9999] flex items-center justify-center"
					@click.self="showAccessModal = false">
					<!-- Backdrop -->
					<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showAccessModal = false"></div>
					<!-- Modal -->
					<div
						class="relative bg-[var(--bg-main)] rounded-2xl w-[90vw] max-w-[420px] shadow-2xl border border-[var(--border-light)] overflow-hidden animate-in zoom-in-95 duration-200">
						<!-- Header -->
						<div class="flex items-center justify-between px-6 pt-5 pb-3">
							<h3 class="text-[16px] font-bold text-[var(--text-primary)]">{{
								$t('character_create.access_label') }}</h3>
							<button @click="showAccessModal = false"
								class="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] transition-colors">
								<X :size="16" />
							</button>
						</div>

						<!-- Options -->
						<div class="px-4 pb-2">
							<!-- Public -->
							<button @click="selectAccess(2)"
								class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all mb-1"
								:class="tempAccessType === 2 ? 'bg-blue-500/5' : 'hover:bg-[var(--bg-hover)]'">
								<div class="w-[32px] h-[32px] rounded-full flex items-center justify-center"
									:class="tempAccessType === 2 ? 'bg-blue-500/15 text-blue-500' : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'">
									<Globe :size="16" />
								</div>
								<span class="flex-1 text-left text-[14px]"
									:class="tempAccessType === 2 ? 'text-blue-500 font-semibold' : 'text-[var(--text-primary)]'">
									{{ $t('character_create.access_public') }}
								</span>
								<Check v-if="tempAccessType === 2" :size="18" class="text-blue-500" />
							</button>

							<!-- Private -->
							<button @click="selectAccess(1)"
								class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all mb-1"
								:class="tempAccessType === 1 ? 'bg-blue-500/5' : 'hover:bg-[var(--bg-hover)]'">
								<div class="w-[32px] h-[32px] rounded-full flex items-center justify-center"
									:class="tempAccessType === 1 ? 'bg-blue-500/15 text-blue-500' : 'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'">
									<Lock :size="16" />
								</div>
								<span class="flex-1 text-left text-[14px]"
									:class="tempAccessType === 1 ? 'text-blue-500 font-semibold' : 'text-[var(--text-primary)]'">
									{{ $t('character_create.access_private') }}
								</span>
								<Check v-if="tempAccessType === 1" :size="18" class="text-blue-500" />
							</button>
						</div>

						<!-- Confirm Button -->
						<div class="px-4 pb-5 pt-2">
							<button @click="confirmAccess"
								class="w-full h-[42px] rounded-xl bg-[var(--text-primary)] text-[var(--bg-main)] hover:opacity-90 font-semibold text-[14px] transition-all active:scale-[0.98]">
								{{ $t('common.confirm') }}
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight, Camera, Globe, Lock, X, Check, UserCircle } from 'lucide-vue-next'
import { createCharacter } from '~/api/character'
import { uploadFile } from '~/utils/api'
import { useUIStore } from '~/stores/ui'

definePageMeta({ hideTopBar: true })

const { t } = useI18n()
const router = useRouter()
const uiStore = useUIStore()

// Form state
const form = reactive({
	name: '',
	description: '',
	prompt: '',
	access_type: 2, // default public
})
const avatarUrl = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)
const isUploadingAvatar = ref(false)
const isSubmitting = ref(false)
const showAccessModal = ref(false)
const tempAccessType = ref(2)

const errors = reactive({
	name: '',
	prompt: '',
})

// Button enabled only when prompt is filled
const canSubmit = computed(() => form.prompt.trim().length > 0)

// Avatar upload
const triggerAvatarUpload = () => {
	avatarInput.value?.click()
}

const handleAvatarChange = async (event: Event) => {
	const target = event.target as HTMLInputElement
	const file = target.files?.[0]
	if (!file) return

	// Preview immediately
	const reader = new FileReader()
	reader.onload = (e) => {
		avatarUrl.value = e.target?.result as string
	}
	reader.readAsDataURL(file)

	// Upload
	isUploadingAvatar.value = true
	try {
		const result = await uploadFile(file, 'avatar')
		avatarUrl.value = result.url
	} catch (err) {
		console.error('Avatar upload failed:', err)
		avatarUrl.value = ''
		uiStore.showToast('Avatar upload failed', 'error')
	} finally {
		isUploadingAvatar.value = false
		// Reset input so same file can be re-selected
		if (avatarInput.value) avatarInput.value.value = ''
	}
}

// Access modal
const selectAccess = (type: number) => {
	tempAccessType.value = type
}

const confirmAccess = () => {
	form.access_type = tempAccessType.value
	showAccessModal.value = false
}

// Show access modal – sync temp value
const openAccessModal = () => {
	tempAccessType.value = form.access_type
	showAccessModal.value = true
}

// Validation and submit
const validate = (): boolean => {
	let valid = true
	if (!form.name.trim()) {
		errors.name = t('character_create.name_required')
		valid = false
	}
	if (!form.prompt.trim()) {
		errors.prompt = t('character_create.prompt_required')
		valid = false
	}
	return valid
}

const handleSubmit = async () => {
	if (!validate() || isSubmitting.value) return

	isSubmitting.value = true
	try {
		const res: any = await createCharacter({
			name: form.name.trim(),
			description: form.description.trim() || undefined,
			prompt: form.prompt.trim(),
			avatar: avatarUrl.value || undefined,
			access_type: form.access_type,
		})

		if (res?.data?.id) {
			uiStore.showToast(t('character_create.create_success'), 'success')
			// Navigate to the newly created character
			router.push(`/character/${res.data.id}`)
		} else {
			const msg = res?.message || t('character_create.create_failed')
			uiStore.showToast(msg, 'error')
		}
	} catch (err: any) {
		console.error('Create character failed:', err)
		// Extract error message from various possible sources
		const msg = err?.response?.data?.message || err?.message || t('character_create.create_failed')
		uiStore.showToast(msg, 'error')
	} finally {
		isSubmitting.value = false
	}
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: var(--text-disable);
	border-radius: 10px;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}

.modal-enter-active>div:last-child,
.modal-leave-active>div:last-child {
	transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from>div:last-child {
	transform: scale(0.95);
	opacity: 0;
}

.modal-leave-to>div:last-child {
	transform: scale(0.95);
	opacity: 0;
}
</style>
