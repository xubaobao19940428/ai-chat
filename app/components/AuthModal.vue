<template>
	<Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
		<div v-if="uiStore.showLoginModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"></div>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center sm:p-4 text-center sm:items-center">
					<Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div class="relative transform bg-[var(--background-white-main)] text-left shadow-[var(--shadow-XL)] transition-all w-full h-screen sm:h-auto sm:max-h-[95vh] sm:my-4 sm:w-full sm:max-w-4xl rounded-[16px] flex flex-col sm:flex-row overflow-hidden border border-[var(--border-main)]">
							<!-- Close Button -->
							<button @click="uiStore.closeLoginModal" class="absolute top-5 right-5 z-50 p-1.5 rounded-lg hover:bg-[var(--fill-tsp-white-main)] transition-colors">
								<X class="w-4 h-4 text-[var(--icon-secondary)]" />
							</button>

							<!-- Left Side: Branding -->
							<div class="hidden sm:flex w-[42%] flex-col bg-[var(--background-gray-main)] p-10 relative overflow-hidden border-r border-[var(--border-main)]">
								<div class="flex-1 flex flex-col justify-between">
									<!-- Logo & Name -->
									<div>
										<div class="flex items-center gap-2.5 mb-8">
											<img src="/favicon.svg" class="w-8 h-8" alt="Aura" />
											<span class="text-lg font-semibold text-[var(--text-primary)]">Aura AI</span>
										</div>
										<h2 class="text-2xl font-semibold text-[var(--text-primary)] leading-snug mb-3">{{ $t('auth.headline') }}</h2>
										<p class="text-sm text-[var(--text-secondary)] leading-relaxed">{{ $t('auth.subheadline') }}</p>
									</div>

									<!-- Feature Highlights -->
									<div class="space-y-5">
										<div v-for="feature in features" :key="feature.title" class="flex items-start gap-3">
											<div class="mt-0.5 w-7 h-7 rounded-lg bg-[var(--fill-blue)] flex items-center justify-center flex-shrink-0">
												<component :is="feature.icon" class="w-3.5 h-3.5 text-[var(--text-blue)]" />
											</div>
											<div>
												<div class="text-sm font-medium text-[var(--text-primary)]">{{ feature.title }}</div>
												<div class="text-xs text-[var(--text-secondary)] mt-0.5">{{ feature.desc }}</div>
											</div>
										</div>
									</div>

									<!-- Footer -->
									<p class="text-xs text-[var(--text-tertiary)]">{{ $t('auth.safe_private') }}</p>
								</div>
							</div>

							<!-- Right Side: Auth Form -->
							<div class="flex-1 flex flex-col p-8 sm:p-10 justify-center bg-[var(--background-white-main)]">
								<div class="max-w-sm mx-auto w-full">
									<div class="mb-8">
										<h3 class="text-xl font-semibold text-[var(--text-primary)]">
											{{ authStep === 'email' ? $t('auth.sign_in_title') : isRegistering ? $t('auth.create_account_title') : $t('auth.welcome_back') }}
										</h3>
										<p class="text-sm text-[var(--text-secondary)] mt-1">
											{{ authStep === 'email' ? $t('auth.email_started') : isRegistering ? $t('auth.set_password') : $t('auth.enter_password') }}
										</p>
									</div>

									<!-- Provider Buttons -->
									<div v-if="authStep === 'email'" class="space-y-2.5 mb-6">
										<button class="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-[10px] hover:opacity-90 transition-opacity font-medium text-sm">
											<img src="/icons/google.svg" class="w-4 h-4" alt="Google" />
											{{ $t('auth.continue_google') }}
										</button>
										<button class="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-[var(--border-main)] rounded-[10px] hover:bg-[var(--fill-tsp-white-main)] transition-colors bg-[var(--background-white-main)] text-[var(--text-primary)] font-medium text-sm">
											<img src="/icons/apple.svg" class="w-4 h-4 dark:invert" alt="Apple" />
											{{ $t('auth.continue_apple') }}
										</button>
									</div>

									<div v-if="authStep === 'email'" class="relative my-6">
										<div class="absolute inset-0 flex items-center">
											<div class="w-full border-t border-[var(--border-main)]"></div>
										</div>
										<div class="relative flex justify-center text-xs">
											<span class="px-4 bg-[var(--background-white-main)] text-[var(--text-tertiary)]">{{ $t('auth.or_email') }}</span>
										</div>
									</div>

									<!-- Email / Auth Form -->
									<form @submit.prevent="authStep === 'email' ? handleCheckEmail() : handleAuth()" class="space-y-3">
										<Transition enter-active-class="transition ease-out duration-300 transform" enter-from-class="opacity-0 translate-x-4" enter-to-class="opacity-100 translate-x-0" leave-active-class="transition ease-in duration-200 transform absolute" leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-4">
											<div v-if="authStep === 'email'" key="email-step" class="space-y-3">
												<div class="relative">
													<Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--icon-secondary)]" />
													<input type="email" id="email" v-model="email" required class="w-full pl-10 pr-4 py-3 rounded-[8px] border border-[var(--border-main)] bg-[var(--background-white-main)] text-[var(--text-primary)] focus:border-[var(--border-blue)] outline-none transition-colors placeholder:text-[var(--text-disable)] text-sm" :placeholder="$t('auth.email_placeholder')" />
												</div>
												<button type="submit" class="w-full py-3 px-4 bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-[8px] font-medium text-sm transition-opacity hover:opacity-90">
													{{ $t('auth.continue') }}
												</button>
											</div>

											<div v-else key="auth-step" class="space-y-3">
												<!-- Back / Email display -->
												<button type="button" @click="authStep = 'email'" class="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-1">
													<ChevronLeft class="w-3.5 h-3.5" />
													<span class="font-medium">{{ confirmedEmail }}</span>
												</button>

												<!-- Verification code (register) -->
												<div v-if="isRegistering" class="flex gap-2">
													<div class="relative flex-1">
														<ShieldCheck class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--icon-secondary)]" />
														<input type="text" v-model="code" required class="w-full pl-10 pr-4 py-3 rounded-[8px] border border-[var(--border-main)] bg-[var(--background-white-main)] text-[var(--text-primary)] focus:border-[var(--border-blue)] outline-none transition-colors text-sm" :placeholder="$t('auth.verification_code')" />
													</div>
													<button type="button" @click="handleSendCode" :disabled="countdown > 0 || sendingCode" class="px-4 py-3 bg-[var(--Button-secondary-gray)] text-[var(--text-primary)] rounded-[8px] font-medium text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap hover:opacity-80">
														{{ countdown > 0 ? `${countdown}s` : $t('auth.send_code') }}
													</button>
												</div>

												<!-- Password -->
												<div class="relative">
													<Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--icon-secondary)]" />
													<input :type="showPassword ? 'text' : 'password'" v-model="password" required class="w-full pl-10 pr-10 py-3 rounded-[8px] border border-[var(--border-main)] bg-[var(--background-white-main)] text-[var(--text-primary)] focus:border-[var(--border-blue)] outline-none transition-colors placeholder:text-[var(--text-disable)] text-sm" :placeholder="$t('auth.password')" />
													<button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--icon-secondary)] hover:text-[var(--text-primary)] transition-colors">
														<Eye v-if="!showPassword" class="w-4 h-4" />
														<EyeOff v-else class="w-4 h-4" />
													</button>
												</div>

												<!-- Error / Success -->
												<div v-if="errorMsg" class="p-3 bg-[var(--function-error-tsp)] text-[var(--function-error)] text-xs rounded-lg border border-[var(--function-error)]/20 flex items-center gap-2">
													<AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
													{{ errorMsg }}
												</div>
												<div v-if="successMsg" class="p-3 bg-[var(--function-success-tsp)] text-[var(--function-success)] text-xs rounded-lg border border-[var(--function-success)]/20 flex items-center gap-2">
													<CheckCircle class="w-3.5 h-3.5 flex-shrink-0" />
													{{ successMsg }}
												</div>

												<button type="submit" :disabled="loading" class="w-full py-3 px-4 bg-[var(--Button-primary-brand)] text-[var(--text-onblack)] rounded-[8px] font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50">
													<div class="flex items-center justify-center gap-2">
														<svg v-if="loading" class="animate-spin h-4 w-4 text-[var(--text-onblack)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
															<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
															<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
														</svg>
														{{ loading ? $t('auth.processing') : isRegistering ? $t('auth.create_account_btn') : $t('auth.sign_in_btn') }}
													</div>
												</button>

												<div class="text-center pt-1">
													<button type="button" @click="toggleAuthMode" class="text-xs text-[var(--text-secondary)] hover:text-[var(--text-blue)] transition-colors">
														{{ isRegistering ? $t('auth.have_account') : $t('auth.no_account') }}
													</button>
												</div>
											</div>
										</Transition>
									</form>

									<p class="text-[11px] text-[var(--text-tertiary)] leading-relaxed mt-8 text-center">
										{{ $t('auth.terms_prefix') }}
										<a href="#" class="underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors">{{ $t('auth.terms') }}</a>
										{{ $t('auth.and') }}
										<a href="#" class="underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors">{{ $t('auth.privacy_policy') }}</a>.
									</p>
								</div>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { X, Mail, Lock, Eye, EyeOff, ChevronLeft, ShieldCheck, AlertCircle, CheckCircle, MessageSquare, Zap, SlidersHorizontal } from 'lucide-vue-next'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'

const uiStore = useUIStore()
const userStore = useUserStore()
const { t } = useI18n()

const authStep = ref<'email' | 'code'>('email')
const isRegistering = ref(false)
const email = ref('')
const confirmedEmail = ref('')
const code = ref('')
const password = ref('')
const showPassword = ref(false)
const countdown = ref(0)
const sendingCode = ref(false)
let timer: any = null

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const features = computed(() => [
	{ icon: MessageSquare, title: t('auth.feature_natural'), desc: t('auth.feature_natural_desc') },
	{ icon: Zap, title: t('auth.feature_fast'), desc: t('auth.feature_fast_desc') },
	{ icon: SlidersHorizontal, title: t('auth.feature_models'), desc: t('auth.feature_models_desc') },
])

const toggleAuthMode = () => {
	isRegistering.value = !isRegistering.value
	errorMsg.value = ''
	successMsg.value = ''
	password.value = ''
	code.value = ''
	showPassword.value = false
}

const startCountdown = () => {
	countdown.value = 60
	timer = setInterval(() => {
		countdown.value--
		if (countdown.value <= 0) {
			clearInterval(timer)
		}
	}, 1000)
}

onUnmounted(() => {
	if (timer) clearInterval(timer)
})

const handleSendCode = async () => {
	if (!confirmedEmail.value || sendingCode.value || countdown.value > 0) return
	sendingCode.value = true
	errorMsg.value = ''
	successMsg.value = ''
	try {
		if (isRegistering.value) {
			await userStore.sendCode(confirmedEmail.value)
		} else {
			await userStore.sendLoginCodeAction(confirmedEmail.value)
		}
		successMsg.value = t('auth.code_sent')
		startCountdown()
	} catch (err: any) {
		errorMsg.value = err.message || t('auth.failed_send_code')
	} finally {
		sendingCode.value = false
	}
}

const handleCheckEmail = () => {
	if (!email.value) return
	confirmedEmail.value = email.value
	authStep.value = 'code'
	errorMsg.value = ''
	successMsg.value = ''
}

const handleAuth = async () => {
	loading.value = true
	errorMsg.value = ''
	try {
		if (isRegistering.value) {
			await userStore.register({
				email: confirmedEmail.value,
				code: code.value,
				password: password.value,
			})
			successMsg.value = t('auth.register_success')
			isRegistering.value = false
			code.value = ''
			password.value = ''
			authStep.value = 'code'
		} else {
			const success = await userStore.login({
				email: confirmedEmail.value,
				password: password.value,
			})
			if (success) {
				uiStore.closeLoginModal()
				authStep.value = 'email'
				email.value = ''
				confirmedEmail.value = ''
				code.value = ''
				password.value = ''
			} else {
				errorMsg.value = t('auth.login_failed')
			}
		}
	} catch (err: any) {
		errorMsg.value = err.message || t('auth.auth_failed')
	} finally {
		loading.value = false
	}
}
</script>
