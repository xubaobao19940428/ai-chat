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
        <div class="flex min-h-full items-center justify-center sm:p-4 text-center sm:items-center">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div class="relative transform bg-white dark:bg-[#1a1a1a] text-left shadow-xl transition-all w-full h-screen sm:h-auto sm:max-h-[95vh] sm:my-4 sm:w-full sm:max-w-5xl sm:rounded-3xl flex flex-col sm:flex-row overflow-hidden border border-gray-100 dark:border-gray-800">
              <!-- Close Button -->
               <button @click="uiStore.closeLoginModal" class="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-gray-100 dark:hover:bg-gray-800 backdrop-blur-sm transition-colors shadow-sm">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
              </button>

              <!-- Left Side: Branding & Testimonials (55% width) -->
              <div class="hidden sm:flex flex-[1.2] flex-col bg-[#fcfcfd] dark:bg-black p-10 relative overflow-hidden border-r border-gray-100 dark:border-gray-900">
                   <!-- Grid Pattern Background -->
                   <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                        style="background-image: radial-gradient(#000 0.5px, transparent 0.5px), radial-gradient(#000 0.5px, transparent 0.5px); background-size: 24px 24px; background-position: 0 0, 12px 12px;">
                   </div>

                   <div class="relative z-10 flex-1 flex flex-col">
                        <!-- Branding Header -->
                        <div class="flex flex-col items-center text-center mt-4">
                            <!-- #1 Badge -->
                            <div class="inline-flex flex-col items-center mb-6">
                                <div class="flex items-center gap-1 mb-1">
                                    <div class="flex text-yellow-400">
                                        <svg v-for="i in 5" :key="i" class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    </div>
                                </div>
                                <div class="text-xl font-bold text-gray-900 dark:text-white">#1 AI Chatbot</div>
                                <div class="text-3xl font-black text-gray-900 dark:text-white mt-1">35M+ users</div>
                                <div class="mt-4 px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm text-xs font-semibold text-gray-600 dark:text-gray-300">
                                    Available on
                                </div>
                            </div>

                            <!-- Platform Icons -->
                            <div class="flex items-center justify-center gap-4 mb-12">
                                <img src="https://img.icons8.com/color/48/google-play.png" class="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity" alt="Play Store">
                                <img src="https://img.icons8.com/color/48/apple-app-store--v1.png" class="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity" alt="App Store">
                                <img src="https://img.icons8.com/color/48/chrome.png" class="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity" alt="Chrome">
                                <img src="https://img.icons8.com/color/48/firefox.png" class="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity" alt="Firefox">
                                <img src="https://img.icons8.com/color/48/microsoft-edge.png" class="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity" alt="Edge">
                                <img src="https://img.icons8.com/color/48/whatsapp--v1.png" class="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity" alt="WhatsApp">
                            </div>

                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Trusted by Millions</h3>
                        </div>

                        <!-- Testimonial Carousel -->
                        <div class="relative mt-auto overflow-hidden">
                            <div class="flex gap-4 animate-scroll whitespace-nowrap py-4">
                                <!-- Duplicate 3 times for a truly smooth infinite loop across container width -->
                                <div v-for="group in 3" :key="group" class="flex gap-4">
                                    <div v-for="t in testimonials" :key="t.name" 
                                         class="inline-block w-64 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm whitespace-normal">
                                        <div class="flex gap-0.5 mb-2">
                                            <svg v-for="i in 5" :key="i" class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                        </div>
                                        <div class="font-bold text-sm mb-1 text-gray-900 dark:text-white">{{ t.title }}</div>
                                        <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4 italic truncate-multiline">"{{ t.content }}"</p>
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                {{ t.name.split(' ').map(n => n[0]).join('') }}
                                            </div>
                                            <div class="text-left">
                                                <div class="text-[10px] font-bold text-gray-900 dark:text-white">{{ t.name }}</div>
                                                <div class="text-[9px] text-gray-500">{{ t.role }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
              </div>

              <!-- Right Side: Auth Form (45% width) -->
              <div class="flex-1 flex flex-col p-8 sm:p-12 justify-center bg-white dark:bg-[#1a1a1a] min-h-full">
                  <div class="max-w-md mx-auto w-full">
                      <!-- Powered By -->
                      <div class="text-center mb-8">
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Powered By</p>
                          <div class="flex items-center justify-center gap-6 px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                               <div class="flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default scale-90">
                                   <img src="https://img.icons8.com/ios-filled/50/chatgpt.png" class="w-4 h-4 dark:invert" alt="OpenAI">
                                   <span class="text-xs font-bold text-gray-700 dark:text-gray-300">OpenAI</span>
                               </div>
                               <div class="flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default scale-90">
                                   <span class="text-xs font-black text-red-600">A</span>
                                   <span class="text-xs font-bold text-gray-700 dark:text-gray-300">Anthropic</span>
                               </div>
                               <div class="flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default scale-90">
                                   <img src="https://img.icons8.com/color/48/google-logo.png" class="w-4 h-4" alt="Google">
                                   <span class="text-xs font-bold text-gray-700 dark:text-gray-300">Google</span>
                               </div>
                          </div>
                      </div>

                      <div class="text-center mb-8">
                           <h2 class="text-3xl font-black text-gray-900 dark:text-white leading-tight">Join Millions of Happy Users</h2>
                      </div>

                      <!-- Provider Buttons -->
                      <div class="space-y-3 mb-6">
                          <button class="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:opacity-90 transition-all font-bold shadow-lg shadow-gray-200 dark:shadow-none">
                              <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                              Continue with Google
                          </button>
                          <button class="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-100 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all bg-white dark:bg-transparent text-gray-700 dark:text-white font-bold">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.81-.04 2.37-1.11 3.97-.48 1.58.62 2.68 1.94 3.23 2.76-2.85 1.55-2.27 5.66.42 7.02l-.52 1.48c-.46 1.07-1.12 1.95-2.18 2.91zm-3.8-17.5c.34 1.59-1.32 3.19-2.7 3.14-.52-1.7 1.35-3.4 2.7-3.14z"/></svg>
                              Continue with Apple
                          </button>
                      </div>

                      <div class="relative my-8">
                          <div class="absolute inset-0 flex items-center">
                              <div class="w-full border-t border-gray-100 dark:border-gray-800"></div>
                          </div>
                          <div class="relative flex justify-center text-[10px] font-black uppercase tracking-wider">
                              <span class="px-4 bg-white dark:bg-[#1a1a1a] text-gray-400">or</span>
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
                                      class="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                      placeholder="Enter your email"
                                  >
                              </div>
                              <button type="submit" class="w-full py-4 px-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold transition-all">
                                  Continue with Email
                              </button>
                          </div>

                          <div v-else class="space-y-4">
                              <div class="text-left mb-2">
                                  <button type="button" @click="authStep = 'email'" class="px-3 py-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:opacity-80 flex items-center mb-4">
                                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                                      {{ email }}
                                  </button>
                              </div>

                              <div v-if="isRegistering">
                                <input
                                      type="text"
                                      v-model="nickname"
                                      class="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all mb-4 font-medium"
                                      placeholder="Nickname (Optional)"
                                  >
                              </div>
                              
                              <div>
                                  <input
                                      type="password"
                                      v-model="password"
                                      required
                                      class="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-medium"
                                      placeholder="Password"
                                  >
                              </div>

                              <div v-if="errorMsg" class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/30">
                                {{ errorMsg }}
                              </div>
                              <div v-if="successMsg" class="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-xl border border-green-100 dark:border-green-900/30">
                                {{ successMsg }}
                              </div>

                              <button type="submit" :disabled="loading" class="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-200 dark:shadow-none">
                                  {{ loading ? 'Processing...' : (isRegistering ? 'Sign up' : 'Log in') }}
                              </button>
                              
                              <div class="text-center mt-6">
                                  <button type="button" @click="isRegistering = !isRegistering" class="text-sm font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                      {{ isRegistering ? 'Already have an account? Log in' : 'Don\'t have an account? Sign up' }}
                                  </button>
                              </div>
                          </div>
                      </form>
                      
                      <div class="mt-12 text-center">
                          <p class="text-[10px] text-gray-400 leading-relaxed font-medium">
                              By proceeding, you agree to our <a href="#" class="underline hover:text-gray-600 transition-colors">Terms of Service</a> and read our <a href="#" class="underline hover:text-gray-600 transition-colors">Privacy Policy</a>.
                          </p>
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

const testimonials = [
    {
        name: 'Emma Taylor',
        role: 'Product Manager',
        title: 'Very user friendly',
        content: 'This one is the most easy-to-use AI app I\'ve used so far. Love it for any question I have.'
    },
    {
        name: 'Noah Johnson',
        role: 'Content Writer',
        title: 'The perfect all-in-one app!',
        content: 'So crazy how complicated and intelligent this is, but also the excellent feedback you get to inspire or help you.'
    },
    {
        name: 'Liam Smith',
        role: 'Digital Marketer',
        title: 'Loving the AI',
        content: 'So personalized and so fast! I\'m loving how this AI App responds to anything immediately.'
    },
    {
        name: 'Sophia Brown',
        role: 'Customer Support',
        title: 'Perfect AI Tool',
        content: 'It\'s a great time-saver to access all the latest AI models through a single, simple interface.'
    }
]

const handleCheckEmail = () => {
    if (!email.value) return
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

<style scoped>
@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-66.666%); }
}

.animate-scroll {
    animation: scroll 30s linear infinite;
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

/* For smooth hardware accelerated transform */
.animate-scroll {
    will-change: transform;
}
</style>
