<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="uiStore.showLoginModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1a] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl h-[600px] flex">
              <!-- Close Button -->
               <button @click="uiStore.closeLoginModal" class="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
              </button>

              <!-- Left Side: Marketing (Hidden on Mobile) -->
              <div class="hidden sm:flex flex-col flex-1 bg-gray-50 dark:bg-black p-8 justify-center items-center text-center relative overflow-hidden">
                   <!-- Decorative Background Elements -->
                   <div class="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none grid grid-cols-12 gap-4 p-4">
                       <div v-for="i in 48" :key="i" class="bg-gray-900 dark:bg-white rounded aspect-square"></div>
                   </div>

                   <div class="relative z-10">
                       <div class="text-indigo-600 dark:text-indigo-400 mb-4 flex justify-center">
                           <!-- Logo or Icon -->
                           <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                           </svg>
                       </div>
                       <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join Millions of Happy Users</h2>
                       <p class="text-gray-600 dark:text-gray-400">Experience the power of AI communication today.</p>

                        <div class="mt-8 flex gap-4 justify-center">
                           <div class="text-sm font-medium text-gray-500">Powered By</div>
                        </div>
                        <div class="mt-2 flex gap-4 justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-all">
                             <!-- Mock Logos -->
                            <span class="font-bold text-gray-800 dark:text-gray-300">OpenAI</span>
                            <span class="font-bold text-gray-800 dark:text-gray-300">Anthropic</span>
                            <span class="font-bold text-gray-800 dark:text-gray-300">Google</span>
                        </div>
                   </div>
              </div>

              <!-- Right Side: Auth Form -->
              <div class="flex-1 flex flex-col p-8 sm:p-12 justify-center bg-white dark:bg-[#1f1f1f]">
                  <div class="text-center mb-8 sm:hidden">
                       <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                  </div>

                  <!-- Provider Buttons -->
                  <div class="space-y-3 mb-6">
                      <button class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-transparent text-gray-700 dark:text-white font-medium">
                          <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M24 12.276c0-1.16-.105-2.275-.3-3.35h-11.7v6.35h6.69c-.29 1.55-1.17 2.87-2.49 3.76v3.13h4.03c2.36-2.17 3.72-5.37 3.72-9.16z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-4.03-3.13c-1.07.72-2.44 1.15-3.9 1.15-3.01 0-5.56-2.03-6.47-4.76H1.54v2.99C3.6 21.43 7.51 24 12 24z"/><path fill="#FBBC05" d="M5.53 14.35c-.24-.72-.37-1.48-.37-2.35s.13-1.63.37-2.35V6.66H1.54C.56 8.63 0 10.85 0 13.5s.56 4.87 1.54 6.84l3.99-2.99z"/><path fill="#4285F4" d="M12 4.75c1.76 0 3.35.61 4.6 1.79l3.44-3.44C17.94 1.2 15.24 0 12 0 7.51 0 3.6 2.57 1.54 6.66l3.99 2.99C6.44 6.78 8.99 4.75 12 4.75z"/></svg>
                          Continue with Google
                      </button>
                      <button class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-transparent text-gray-700 dark:text-white font-medium">
                          <svg class="w-5 h-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.81-.04 2.37-1.11 3.97-.48 1.58.62 2.68 1.94 3.23 2.76-2.85 1.55-2.27 5.66.42 7.02l-.52 1.48c-.46 1.07-1.12 1.95-2.18 2.91zm-3.8-17.5c.34 1.59-1.32 3.19-2.7 3.14-.52-1.7 1.35-3.4 2.7-3.14z"/></svg>
                          Continue with Apple
                      </button>
                  </div>

                  <div class="relative my-6">
                      <div class="absolute inset-0 flex items-center">
                          <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <div class="relative flex justify-center text-sm">
                          <span class="px-2 bg-white dark:bg-[#1f1f1f] text-gray-500">or</span>
                      </div>
                  </div>

                  <!-- Email Form -->
                  <form @submit.prevent="authStep === 'email' ? handleCheckEmail() : handleAuth()">
                      <div v-if="authStep === 'email'" class="space-y-4">
                          <div>
                              <label for="email" class="sr-only">Email</label>
                              <input
                                  type="email"
                                  id="email"
                                  v-model="email"
                                  required
                                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                  placeholder="Enter your email"
                              >
                          </div>
                          <button type="submit" class="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                              Continue with Email
                          </button>
                      </div>

                      <div v-else class="space-y-4">
                          <div class="text-left mb-2">
                              <button type="button" @click="authStep = 'email'" class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center">
                                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                                  {{ email }}
                              </button>
                          </div>

                          <div v-if="isRegistering">
                            <input
                                  type="text"
                                  v-model="nickname"
                                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow mb-4"
                                  placeholder="Nickname (Optional)"
                              >
                          </div>
                          
                          <div>
                              <input
                                  type="password"
                                  v-model="password"
                                  required
                                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                  placeholder="Password"
                              >
                          </div>

                          <div v-if="errorMsg" class="text-red-500 text-sm">
                            {{ errorMsg }}
                          </div>
                          <div v-if="successMsg" class="text-green-500 text-sm">
                            {{ successMsg }}
                          </div>

                          <button type="submit" :disabled="loading" class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                              {{ loading ? 'Processing...' : (isRegistering ? 'Sign up' : 'Log in') }}
                          </button>
                          
                          <div class="text-center mt-4">
                              <button type="button" @click="isRegistering = !isRegistering" class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                  {{ isRegistering ? 'Already have an account? Log in' : 'Don\'t have an account? Sign up' }}
                              </button>
                          </div>
                      </div>
                  </form>
                  
                  <div class="mt-8 text-center">
                      <p class="text-xs text-gray-500 leading-normal">
                          By proceeding, you agree to our <a href="#" class="underline">Terms of Service</a> and read our <a href="#" class="underline">Privacy Policy</a>.
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
import { ref } from 'vue'

const uiStore = useUIStore()
const userStore = useUserStore()

const authStep = ref<'email' | 'password'>('email')
const isRegistering = ref(false)
const email = ref('')
const password = ref('')
const nickname = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleCheckEmail = () => {
    if (!email.value) return
    // In a real app, check if email exists to determine flow.
    // Here we implicitly assume Login unless they toggle.
    authStep.value = 'password'
    errorMsg.value = ''
}

const handleAuth = async () => {
    loading.value = true
    errorMsg.value = ''
    try {
        if (isRegistering.value) {
            await userStore.register({
                email: email.value,
                password: password.value,
                nickname: nickname.value
            })
            successMsg.value = 'Registration successful! Please login.'
            isRegistering.value = false
            password.value = ''
        } else {
            const success = await userStore.login({
                email: email.value,
                password: password.value
            })
            if (success) {
                uiStore.closeLoginModal()
                // Reset state
                authStep.value = 'email'
                email.value = ''
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
