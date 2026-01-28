<template>
	<Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
		<div v-if="uiStore.showLoginModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"></div>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center sm:p-4 text-center sm:items-center">
					<Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div class="relative transform bg-[var(--background-white-main)] text-left shadow-[var(--shadow-L)] transition-all w-full h-screen sm:h-auto sm:max-h-[95vh] sm:my-4 sm:w-full sm:max-w-5xl sm:rounded-3xl flex flex-col sm:flex-row overflow-hidden border border-[var(--border-main)]">
							<!-- Close Button -->
							<button @click="uiStore.closeLoginModal" class="absolute top-6 right-6 z-50 p-2 rounded-full bg-[var(--background-white-main)] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-main)] transition-all shadow-[var(--shadow-S)]">
								<svg class="w-5 h-5 text-[var(--icon-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							</button>

							<!-- Left Side: Branding & Testimonials (55% width) -->
							<div class="hidden sm:flex flex-[1.2] flex-col bg-gradient-to-br from-[var(--background-gray-main)] via-[var(--background-white-main)] to-[var(--background-gray-main)] p-10 relative overflow-hidden border-r border-[var(--border-main)]">
								<!-- Animated Background Glow -->
								<div class="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
								<div class="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>

								<!-- Grid Pattern Background -->
								<div
									class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
									style="
										background-image: radial-gradient(#000 0.5px, transparent 0.5px), radial-gradient(#000 0.5px, transparent 0.5px);
										background-size: 24px 24px;
										background-position:
											0 0,
											12px 12px;
									"></div>

								<div class="relative z-10 flex-1 flex flex-col">
									<!-- Branding Header -->
									<div class="flex flex-col items-center text-center mt-4">
										<!-- #1 Badge -->
										<div class="inline-flex flex-col items-center mb-6">
											<div class="flex items-center gap-1 mb-2">
												<div class="flex text-yellow-400">
													<svg v-for="i in 5" :key="i" class="w-4 h-4 fill-current drop-shadow-sm" viewBox="0 0 20 20">
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
												</div>
											</div>
											<div class="text-xl font-bold text-[var(--text-primary)] tracking-tight">#1 AI Chatbot</div>
											<div class="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-tertiary)] mt-1">35M+ users</div>
											<div class="mt-6 px-4 py-1.5 bg-[var(--background-tsp-menu-white)] backdrop-blur-md rounded-full border border-[var(--border-main)] shadow-[var(--shadow-XS)] text-xs font-bold text-[var(--text-secondary)]">Available on</div>
										</div>

										<!-- Platform Icons -->
										<div class="flex items-center justify-center gap-5 mb-12">
											<img v-for="(img, idx) in platformIcons" :key="idx" :src="img.src" class="w-8 h-8 opacity-70 hover:opacity-100 hover:scale-110 transition-all cursor-pointer" :alt="img.alt" />
										</div>

										<h3 class="text-2xl font-bold text-[var(--text-primary)] mb-8">Trusted by Millions</h3>
									</div>

									<!-- Testimonial Carousel -->
									<div class="relative mt-auto overflow-hidden">
										<div class="flex gap-4 animate-scroll whitespace-nowrap py-6">
											<!-- Duplicate for a truly smooth infinite loop -->
											<div v-for="group in 3" :key="group" class="flex gap-4">
												<div v-for="t in testimonials" :key="t.name" class="inline-block w-72 p-6 bg-[var(--background-tsp-menu-white)] backdrop-blur-xl rounded-3xl border border-[var(--border-white)] shadow-[var(--shadow-M)] whitespace-normal hover:-translate-y-1 transition-transform">
													<div class="flex gap-0.5 mb-3">
														<svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
															<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
														</svg>
													</div>
													<div class="font-bold text-base mb-2 text-gray-900 dark:text-white">{{ t.title }}</div>
													<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 italic truncate-multiline">"{{ t.content }}"</p>
													<div class="flex items-center gap-3">
														<div class="w-10 h-10 rounded-2xl bg-[var(--fill-blue)] flex items-center justify-center text-sm font-bold text-[var(--text-blue)]">
															{{
																t.name
																	.split(' ')
																	.map((n) => n[0])
																	.join('')
															}}
														</div>
														<div class="text-left">
															<div class="text-xs font-bold text-[var(--text-primary)]">{{ t.name }}</div>
															<div class="text-[10px] text-[var(--text-tertiary)] font-medium">{{ t.role }}</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Right Side: Auth Form (45% width) -->
							<div class="flex-1 flex flex-col p-8 sm:p-12 justify-center bg-[var(--background-white-main)] relative">
								<div class="max-w-md mx-auto w-full relative z-10">
									<!-- Powered By -->
									<div class="text-center mb-10">
										<p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Integrations</p>
										<div class="flex items-center justify-center gap-8 py-3 px-6 bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-800/50">
											<div v-for="p in ['OpenAI', 'Anthropic', 'Google']" :key="p" class="group flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
												<img v-if="p === 'OpenAI'" src="https://img.icons8.com/ios-filled/50/chatgpt.png" class="w-4 h-4 dark:invert group-hover:rotate-180 transition-transform duration-500" alt="OpenAI" />
												<span v-if="p === 'Anthropic'" class="text-xs font-black text-red-600 group-hover:scale-125 transition-transform">A</span>
												<img v-if="p === 'Google'" src="https://img.icons8.com/color/48/google-logo.png" class="w-4 h-4 group-hover:scale-110 transition-transform" alt="Google" />
												<span class="text-[11px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{{ p }}</span>
											</div>
										</div>
									</div>

									<div class="text-center mb-10">
										<h2 class="text-3xl font-black text-[var(--text-primary)] leading-tight tracking-tight">Experience Cosmic Intelligence</h2>
										<p class="mt-3 text-sm text-[var(--text-secondary)] font-medium">Step into the future of human-AI collaboration.</p>
									</div>

									<!-- Provider Buttons -->
									<div class="space-y-3 mb-8">
										<button class="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-2xl hover:opacity-90 transition-all font-bold shadow-[var(--shadow-S)] hover:scale-[1.01] active:scale-[0.99]">
											<svg class="w-5 h-5" viewBox="0 0 24 24">
												<path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
											</svg>
											Continue with Google
										</button>
										<button class="w-full flex items-center justify-center gap-3 px-4 py-4 border-2 border-[var(--border-main)] rounded-2xl hover:bg-[var(--fill-tsp-white-main)] transition-all bg-[var(--background-white-main)] text-[var(--text-primary)] font-bold hover:scale-[1.01] active:scale-[0.99]">
											<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.81-.04 2.37-1.11 3.97-.48 1.58.62 2.68 1.94 3.23 2.76-2.85 1.55-2.27 5.66.42 7.02l-.52 1.48c-.46 1.07-1.12 1.95-2.18 2.91zm-3.8-17.5c.34 1.59-1.32 3.19-2.7 3.14-.52-1.7 1.35-3.4 2.7-3.14z" />
											</svg>
											Continue with Apple
										</button>
									</div>

									<div class="relative my-10">
										<div class="absolute inset-0 flex items-center">
											<div class="w-full border-t border-gray-100 dark:border-gray-800/50"></div>
										</div>
										<div class="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
											<span class="px-6 bg-[var(--background-white-main)] text-[var(--text-disable)]">or use email</span>
										</div>
									</div>

									<!-- Email Form -->
									<form @submit.prevent="authStep === 'email' ? handleCheckEmail() : handleAuth()" class="space-y-6">
										<Transition enter-active-class="transition ease-out duration-300 transform" enter-from-class="opacity-0 translate-x-4" enter-to-class="opacity-100 translate-x-0" leave-active-class="transition ease-in duration-200 transform absolute" leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-4">
											<div v-if="authStep === 'email'" key="email-step" class="space-y-4">
												<div class="relative group">
													<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-disable)] group-focus-within:text-[var(--text-blue)] transition-colors">
														<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
														</svg>
													</div>
													<input type="email" id="email" v-model="email" required class="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] focus:border-[var(--border-blue)] outline-none transition-all placeholder:text-[var(--text-disable)] font-medium" placeholder="Enter your email" />
												</div>
												<button type="submit" class="w-full py-4 px-6 bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[var(--shadow-S)]">Continue with Email</button>
											</div>

											<div v-else key="auth-step" class="space-y-4">
												<div class="text-left mb-2">
													<button type="button" @click="authStep = 'email'" class="px-3 py-1 text-xs font-bold bg-[var(--fill-blue)] text-[var(--text-blue)] rounded-lg hover:opacity-80 flex items-center mb-4 transition-all">
														<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
														{{ email }}
													</button>
												</div>

												<div v-if="isRegistering" class="flex gap-2 mb-4">
													<div class="relative flex-1 group">
														<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-disable)] group-focus-within:text-[var(--text-blue)] transition-colors">
															<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
															</svg>
														</div>
														<input type="text" v-model="code" required class="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] focus:border-[var(--border-blue)] outline-none transition-all font-medium" placeholder="Verification Code" />
													</div>
													<button type="button" @click="handleSendCode" :disabled="countdown > 0 || sendingCode" class="px-5 py-4 bg-[var(--Button-secondary-gray)] text-[var(--text-primary)] rounded-2xl font-bold transition-all disabled:opacity-50 whitespace-nowrap min-w-[120px] hover:bg-[var(--fill-tsp-gray-main)]">
														{{ countdown > 0 ? `${countdown}s` : 'Send Code' }}
													</button>
												</div>

												<div class="relative group">
													<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-disable)] group-focus-within:text-[var(--text-blue)] transition-colors">
														<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
														</svg>
													</div>
													<input :type="showPassword ? 'text' : 'password'" v-model="password" required class="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] text-[var(--text-primary)] focus:border-[var(--border-blue)] outline-none transition-all font-medium" placeholder="Password" />
													<button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
														<svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
														</svg>
														<svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
														</svg>
													</button>
												</div>

												<div v-if="errorMsg" class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-2">
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
													{{ errorMsg }}
												</div>
												<div v-if="successMsg" class="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-xl border border-green-100 dark:border-green-900/30 flex items-center gap-2">
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
													{{ successMsg }}
												</div>

												<button type="submit" :disabled="loading" class="w-full py-4 px-6 bg-[var(--Button-primary-brand)] text-[var(--text-onblack)] rounded-2xl font-bold transition-all disabled:opacity-50 shadow-[var(--shadow-S)] hover:scale-[1.02] active:scale-[0.98]">
													<div class="flex items-center justify-center gap-2">
														<svg v-if="loading" class="animate-spin h-5 w-5 text-[var(--text-onblack)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
															<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
															<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
														</svg>
														{{ loading ? 'Processing...' : isRegistering ? 'Sign up' : 'Log in' }}
													</div>
												</button>

												<div class="text-center mt-6">
													<button type="button" @click="toggleAuthMode" class="text-sm font-bold text-[var(--text-blue)] hover:opacity-80 decoration-2 hover:underline underline-offset-4 transition-all">
														{{ isRegistering ? 'Already have an account? Log in' : "Don't have an account? Sign up" }}
													</button>
												</div>
											</div>
										</Transition>
									</form>

									<div class="mt-12 text-center">
										<p class="text-[10px] text-gray-400 leading-relaxed font-medium">By proceeding, you agree to our <a href="#" class="underline hover:text-gray-600 transition-colors">Terms of Service</a> and read our <a href="#" class="underline hover:text-gray-600 transition-colors">Privacy Policy</a>.</p>
									</div>
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
import { ref, onUnmounted } from 'vue'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'

const uiStore = useUIStore()
const userStore = useUserStore()

const authStep = ref<'email' | 'code'>('email')
const isRegistering = ref(false)
const email = ref('')
const code = ref('')
const password = ref('')
const showPassword = ref(false)
const countdown = ref(0)
const sendingCode = ref(false)
let timer: any = null

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const testimonials = [
	{
		name: 'Emma Taylor',
		role: 'Product Manager',
		title: 'Very user friendly',
		content: "This one is the most easy-to-use AI app I've used so far. Love it for any question I have.",
	},
	{
		name: 'Noah Johnson',
		role: 'Content Writer',
		title: 'The perfect all-in-one app!',
		content: 'So crazy how complicated and intelligent this is, but also the excellent feedback you get to inspire or help you.',
	},
	{
		name: 'Liam Smith',
		role: 'Digital Marketer',
		title: 'Loving the AI',
		content: "So personalized and so fast! I'm loving how this AI App responds to anything immediately.",
	},
	{
		name: 'Sophia Brown',
		role: 'Customer Support',
		title: 'Perfect AI Tool',
		content: "It's a great time-saver to access all the latest AI models through a single, simple interface.",
	},
]

const platformIcons = [
	{ src: 'https://img.icons8.com/color/48/google-play.png', alt: 'Play Store' },
	{ src: 'https://img.icons8.com/color/48/apple-app-store--v1.png', alt: 'App Store' },
	{ src: 'https://img.icons8.com/color/48/chrome.png', alt: 'Chrome' },
	{ src: 'https://img.icons8.com/color/48/firefox.png', alt: 'Firefox' },
	{ src: 'https://img.icons8.com/color/48/microsoft-edge.png', alt: 'Edge' },
	{ src: 'https://img.icons8.com/color/48/whatsapp--v1.png', alt: 'WhatsApp' },
]

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
	if (!email.value || sendingCode.value || countdown.value > 0) return
	sendingCode.value = true
	errorMsg.value = ''
	successMsg.value = ''
	try {
		if (isRegistering.value) {
			await userStore.sendCode(email.value)
		} else {
			await userStore.sendLoginCodeAction(email.value)
		}
		successMsg.value = 'Verification code sent!'
		startCountdown()
	} catch (err: any) {
		errorMsg.value = err.message || 'Failed to send code.'
	} finally {
		sendingCode.value = false
	}
}

const handleCheckEmail = () => {
	if (!email.value) return
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
				email: email.value,
				code: code.value,
				password: password.value,
			})
			successMsg.value = 'Registration successful! You can now log in.'
			isRegistering.value = false
			code.value = ''
			password.value = ''
			authStep.value = 'code'
		} else {
			const success = await userStore.login({
				email: email.value,
				password: password.value,
			})
			if (success) {
				uiStore.closeLoginModal()
				authStep.value = 'email'
				email.value = ''
				code.value = ''
				password.value = ''
			} else {
				errorMsg.value = 'Login failed. Invalid credentials.'
			}
		}
	} catch (err: any) {
		errorMsg.value = err.message || 'Authentication failed.'
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
@keyframes scroll {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-66.666%);
	}
}

.animate-scroll {
	animation: scroll 40s linear infinite;
	will-change: transform;
}

.animate-scroll:hover {
	animation-play-state: paused;
}

.truncate-multiline {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	white-space: normal;
}

/* Custom scrollbar for mobile */
.overflow-y-auto::-webkit-scrollbar {
	width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
	background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, 0.1);
	border-radius: 10px;
}
.dark .overflow-y-auto::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.1);
}
</style>
