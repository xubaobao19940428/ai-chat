<template>
  <TransitionRoot appear :show="uiStore.showSettingsModal" as="template">
    <Dialog as="div" @close="uiStore.closeSettingsModal" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-[920px] transform overflow-hidden rounded-[20px] bg-[var(--background-gray-main)] border border-[var(--border-main)] text-left align-middle shadow-[var(--shadow-XL)] transition-all flex flex-col md:flex-row h-[min(672px,calc(100vh-82px))]">
              
              <!-- Sidebar -->
              <div class="md:w-[221px] flex-shrink-0 border-r border-[var(--border-main)] relative flex flex-col bg-[var(--background-gray-main)]">
                <!-- Logo -->
                <div class="items-center px-5 pt-5 pb-3 flex">
                  <div class="flex gap-0.5 text-black dark:text-white">
                     <!-- Manus Logo SVG from HTML -->
                     <svg height="30" width="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-black dark:text-white">
                        <path d="M17.6 22.6C19.3 21.5 20.4 15.9 20.2 14.2C20.2 14.2 19.9 13.3 19.3 13.3C18.6 13.3 18.4 14 18.4 14C18.4 14 17.3 18 16.3 18.5C15.3 19 14.3 18.5 14.3 18.5C15 21.2 16 23.6 17.6 22.6Z" fill="currentColor"/>
                        <path d="M14.9 9.4L13.2 9.1L13.2 9L13.2 9L14.9 9.4ZM15.1 8.4L16.8 8.7L16.8 8.7L16.8 8.8L15.1 8.4ZM14.9 7.6L15.3 6L15.5 6L15.7 6.1L14.9 7.6ZM13.6 8L12.2 6.9L12.3 6.8L12.4 6.7L13.6 8ZM12.4 9.6L14 10.4L13.8 10.7L13.6 10.9L12.4 9.6ZM11.8 10.5L13.5 10.2L14.2 13.5L11.1 12L11.8 10.5ZM7.7 14.1L6 14.5H6L7.7 14.1ZM8.6 14.8L8.5 13.1C9.1 13.1 9.7 13.4 10 13.8C10.3 14.3 10.4 14.9 10.2 15.4L8.6 14.8ZM8.4 16.1L10.1 16H10.1L8.4 16.1ZM15.6 12.2L17.1 11.3H17.1L15.6 12.2ZM12.8 18.2L12.3 19.8L12.3 19.8L12.2 19.8L12.8 18.2ZM15.9 18.9L16.2 17.2L16.2 17.2L16.3 17.2L15.9 18.9ZM17.9 15.5L18.4 13.9H18.4L17.9 15.5ZM18.2 15.7L18.9 14.1L20 14.6L19.9 15.7L18.2 15.7ZM17.3 17.8L15.9 16.8H15.9L17.3 17.8ZM4.9 9L3.4 8.2H3.4L4.9 9ZM8.1 11.1L8.8 9.6H8.8L8.1 11.1ZM7.9 8.8L7.4 10.4H7.4L7.9 8.8ZM13.2 9L13.5 7.9L16.8 8.8L16.6 9.9L13.2 9Z" fill="currentColor"/>
                     </svg>
                     <span class="font-bold text-lg tracking-tight ml-2">manus</span>
                  </div>
                </div>

                <!-- Nav Items -->
                <nav class="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                  <button v-for="item in menuItems" :key="item.name" 
                    @click="activeItem = item.name"
                    :class="['w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium transition-colors', 
                      item.name === activeItem 
                        ? 'bg-[var(--fill-tsp-white-main)] font-semibold text-[var(--text-primary)]' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] hover:text-[var(--text-primary)]']">
                    <component :is="item.icon" class="w-4 h-4" />
                    {{ item.name }}
                  </button>
                </nav>

                <!-- Footer Separator -->
                <div class="px-2.5">
                    <div class="h-[1px] bg-[var(--border-primary)]"></div>
                </div>

                <!-- Footer -->
                <div class="p-2">
                  <a href="https://help.manus.im" target="_blank" class="w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[14px] font-medium text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-white-main)] hover:text-[var(--text-primary)] transition-colors">
                    <div class="flex items-center gap-3">
                      <QuestionMarkCircleIcon class="w-4 h-4" />
                      Get help
                    </div>
                    <ArrowUpRightIcon class="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <!-- Content Content -->
              <div class="flex-1 flex flex-col bg-[var(--background-gray-main)] relative overflow-hidden">
                 <!-- Close Button -->
                <div class="absolute top-[20px] right-[12px] z-20">
                    <button @click="uiStore.closeSettingsModal" class="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--fill-tsp-gray-main)] text-[var(--icon-tertiary)] hover:text-[var(--text-primary)]">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                </div>

                <!-- Header -->
                <div class="gap-1 items-center px-6 py-5 hidden md:flex self-stretch border-b border-[var(--border-main)]">
                    <h3 class="text-[18px] font-semibold leading-7 text-[var(--text-primary)]">{{ activeItem }}</h3>
                </div>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto px-6 pt-4 pb-4 custom-scrollbar">
                    <div v-if="activeItem === 'Account'" class="w-full space-y-6">
                        <!-- User Profile Header -->
                        <div class="flex items-center justify-between pb-6">
                            <div class="flex items-center gap-4">
                                <div class="h-16 w-16 rounded-full overflow-hidden border border-[var(--border-main)]">
                                     <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" class="w-full h-full object-cover" />
                                     <div v-else class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                                        {{ userStore.userInfo?.nickname?.[0]?.toUpperCase() || 'U' }}
                                     </div>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-[var(--text-primary)] leading-tight">{{ userStore.userInfo?.nickname || 'User' }}</h3>
                                    <p class="text-[13px] text-[var(--text-tertiary)] mt-0.5">{{ userStore.userInfo?.email || 'user@example.com' }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <button class="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] hover:text-[var(--text-primary)] transition-colors">
                                    <UserIcon class="w-5 h-5" />
                                </button>
                                <button @click="userStore.logout" class="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border-main)] text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors">
                                    <ArrowRightStartOnRectangleIcon class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <!-- Plan Card -->
                        <div class="rounded-[16px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] p-5">
                            <div class="flex items-center justify-between mb-4">
                                <span class="font-serif text-xl font-bold text-[var(--text-primary)]">Free</span>
                                <button class="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-80 transition-opacity">Upgrade</button>
                            </div>
                            
                            <div class="border-t border-dashed border-[var(--border-main)] my-4"></div>

                            <div class="space-y-5">
                                <!-- Credits -->
                                <div class="flex items-center justify-between">
                                    <div class="flex items-start gap-2.5">
                                        <SparklesIcon class="w-5 h-5 text-[var(--text-secondary)] mt-0.5" />
                                        <div>
                                            <div class="flex items-center gap-1.5">
                                                <span class="text-sm font-bold text-[var(--text-primary)]">Credits</span>
                                                <QuestionMarkCircleIcon class="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                                            </div>
                                            <div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">Free credits</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm font-bold text-[var(--text-primary)]">1,000</div>
                                        <div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">1,000</div>
                                    </div>
                                </div>

                                <!-- Daily Refresh -->
                                <div class="flex items-center justify-between">
                                    <div class="flex items-start gap-2.5">
                                        <CalendarIcon class="w-5 h-5 text-[var(--text-secondary)] mt-0.5" />
                                        <div>
                                            <div class="flex items-center gap-1.5">
                                                <span class="text-sm font-bold text-[var(--text-primary)]">Daily refresh credits</span>
                                                <QuestionMarkCircleIcon class="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                                            </div>
                                            <div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">Refresh to 300 at 00:00 every day</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm font-bold text-[var(--text-primary)]">300</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="activeItem === 'Usage'" class="w-full space-y-6">
                         <!-- Plan Card (Reused) -->
                        <div class="rounded-[16px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] p-5">
                            <div class="flex items-center justify-between mb-4">
                                <span class="font-serif text-xl font-bold text-[var(--text-primary)]">Free</span>
                                <button class="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-80 transition-opacity">Upgrade</button>
                            </div>
                            
                            <div class="border-t border-dashed border-[var(--border-main)] my-4"></div>

                            <div class="space-y-5">
                                <!-- Credits -->
                                <div class="flex items-center justify-between">
                                    <div class="flex items-start gap-2.5">
                                        <SparklesIcon class="w-5 h-5 text-[var(--text-secondary)] mt-0.5" />
                                        <div>
                                            <div class="flex items-center gap-1.5">
                                                <span class="text-sm font-bold text-[var(--text-primary)]">Credits</span>
                                                <QuestionMarkCircleIcon class="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                                            </div>
                                            <div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">Free credits</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm font-bold text-[var(--text-primary)]">1,000</div>
                                        <div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">1,000</div>
                                    </div>
                                </div>

                                <!-- Daily Refresh -->
                                <div class="flex items-center justify-between">
                                    <div class="flex items-start gap-2.5">
                                        <CalendarIcon class="w-5 h-5 text-[var(--text-secondary)] mt-0.5" />
                                        <div>
                                            <div class="flex items-center gap-1.5">
                                                <span class="text-sm font-bold text-[var(--text-primary)]">Daily refresh credits</span>
                                                <QuestionMarkCircleIcon class="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                                            </div>
                                            <div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">Refresh to 300 at 00:00 every day</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm font-bold text-[var(--text-primary)]">300</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Billing Link -->
                        <button class="w-full flex items-center justify-between p-4 rounded-[12px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors">
                            <div class="flex items-center gap-3">
                                <CreditCardIcon class="w-5 h-5 text-[var(--text-secondary)]" />
                                <span class="text-sm font-bold text-[var(--text-primary)]">Website usage & billing</span>
                            </div>
                            <ChevronRightIcon class="w-4 h-4 text-[var(--text-tertiary)]" />
                        </button>

                        <!-- Usage History Table -->
                        <div class="rounded-[16px] bg-[var(--fill-tsp-white-main)] border border-[var(--border-main)] overflow-hidden">
                            <div class="bg-[var(--fill-tsp-gray-main)] px-4 py-2 flex items-center text-xs font-medium text-[var(--text-tertiary)] border-b border-[var(--border-main)]">
                                <div class="flex-1">Details</div>
                                <div class="w-40 text-left">Date</div>
                                <div class="w-24 text-right">Credits change</div>
                            </div>
                            <div class="divide-y divide-[var(--border-light)]">
                                <div class="px-4 py-3 flex items-center text-sm group hover:bg-[var(--fill-tsp-white-light)] transition-colors">
                                    <div class="flex-1 text-[var(--text-primary)]">Hello</div>
                                    <div class="w-40 text-[var(--text-tertiary)]">2026-01-29 18:39</div>
                                    <div class="w-24 text-right text-[var(--text-primary)]">-18</div>
                                </div>
                                <div class="px-4 py-3 flex items-center text-sm group hover:bg-[var(--fill-tsp-white-light)] transition-colors">
                                    <div class="flex-1 text-[var(--text-primary)]">你好</div>
                                    <div class="w-40 text-[var(--text-tertiary)]">2026-01-29 00:43</div>
                                    <div class="w-24 text-right text-[var(--text-primary)]">-4</div>
                                </div>
                                <div class="px-4 py-3 flex items-center text-sm group hover:bg-[var(--fill-tsp-white-light)] transition-colors">
                                    <div class="flex-1 text-[var(--text-primary)]">你好</div>
                                    <div class="w-40 text-[var(--text-tertiary)]">2026-01-28 23:46</div>
                                    <div class="w-24 text-right text-[var(--text-primary)]">-4</div>
                                </div>
                                <div class="px-4 py-3 flex items-center text-sm group hover:bg-[var(--fill-tsp-white-light)] transition-colors">
                                    <div class="flex-1 text-[var(--text-primary)]">Bonus for new users</div>
                                    <div class="w-40 text-[var(--text-tertiary)]">2026-01-28 22:33</div>
                                    <div class="w-24 text-right text-green-600 font-medium">+1,000</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="activeItem === 'Settings'" class="w-full space-y-8">
                        
                        <!-- General -->
                        <div class="pb-8 border-b border-[var(--border-light)]">
                            <div class="text-[13px] font-medium text-[var(--text-tertiary)] mb-1">General</div>
                            <div class="mb-6">
                                <div class="text-sm font-medium text-[var(--text-primary)] mb-3">Language</div>
                                <div class="relative w-[208px]">
                                    <select class="w-full appearance-none bg-[var(--fill-tsp-gray-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-white)] text-[var(--text-primary)] text-sm rounded-lg py-2 pl-3 pr-8 outline-none cursor-pointer">
                                        <option>English</option>
                                        <option>简体中文</option>
                                    </select>
                                    <ChevronDownIcon class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)] pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <div class="text-sm font-medium text-[var(--text-primary)] mb-3">Appearance</div>
                                <div class="flex gap-6">
                                    <!-- Light -->
                                    <button @click="uiStore.setThemeMode('light')" class="group flex flex-col gap-2.5 items-center">
                                        <div :class="['w-[90px] h-[60px] rounded-[10px] border box-border overflow-hidden transition-all', uiStore.themeMode === 'light' ? 'border-[var(--icon-blue)] ring-1 ring-[var(--icon-blue)]' : 'border-[var(--border-main)] group-hover:border-[var(--icon-blue)]']">
                                            <div class="w-full h-full bg-[#fcfcfc] relative">
                                                <div class="absolute top-2 left-2 right-2 h-1.5 bg-[#e5e5e5] rounded-full"></div>
                                                <div class="absolute top-5 left-2 w-8 h-1.5 bg-[#e5e5e5] rounded-full"></div>
                                            </div>
                                        </div>
                                        <div class="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">Light</div>
                                    </button>
                                    <!-- Dark -->
                                    <button @click="uiStore.setThemeMode('dark')" class="group flex flex-col gap-2.5 items-center">
                                        <div :class="['w-[90px] h-[60px] rounded-[10px] border box-border overflow-hidden transition-all', uiStore.themeMode === 'dark' ? 'border-[var(--icon-blue)] ring-1 ring-[var(--icon-blue)]' : 'border-[var(--border-main)] group-hover:border-[var(--icon-blue)]']">
                                            <div class="w-full h-full bg-[#1a1a1a] relative">
                                                <div class="absolute top-2 left-2 right-2 h-1.5 bg-[#333] rounded-full"></div>
                                                <div class="absolute top-5 left-2 w-8 h-1.5 bg-[#333] rounded-full"></div>
                                            </div>
                                        </div>
                                        <div class="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">Dark</div>
                                    </button>
                                    <!-- System -->
                                    <button @click="uiStore.setThemeMode('system')" class="group flex flex-col gap-2.5 items-center">
                                        <div :class="['w-[90px] h-[60px] rounded-[10px] border box-border overflow-hidden transition-all', uiStore.themeMode === 'system' ? 'border-[var(--icon-blue)] ring-1 ring-[var(--icon-blue)]' : 'border-[var(--border-main)] group-hover:border-[var(--icon-blue)]']">
                                            <div class="w-full h-full flex">
                                                <div class="w-1/2 bg-[#fcfcfc]"></div>
                                                <div class="w-1/2 bg-[#1a1a1a]"></div>
                                            </div>
                                        </div>
                                        <div class="text-[13px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">Follow System</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Communication -->
                        <div class="pb-8 border-b border-[var(--border-light)]">
                            <div class="text-[13px] font-medium text-[var(--text-tertiary)] mb-1">Communication preferences</div>
                            
                            <div class="flex items-start justify-between py-3">
                                <div class="pr-4">
                                    <div class="text-sm font-medium text-[var(--text-primary)]">Receive exclusive content</div>
                                    <div class="text-[13px] text-[var(--text-tertiary)] leading-relaxed mt-0.5">Get exclusive offers, event updates, excellent case examples and new feature guides.</div>
                                </div>
                                <Switch v-model="notifications.exclusive" :class="notifications.exclusive ? 'bg-blue-600' : 'bg-gray-200'" class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none">
                                    <span :class="notifications.exclusive ? 'translate-x-3.5' : 'translate-x-0.5'" class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform" />
                                </Switch>
                            </div>

                            <div class="flex items-start justify-between py-3">
                                <div class="pr-4">
                                    <div class="text-sm font-medium text-[var(--text-primary)]">Email me when my queued task starts</div>
                                    <div class="text-[13px] text-[var(--text-tertiary)] leading-relaxed mt-0.5">When enabled, we'll send you a timely email once your task finishes queuing and begins processing.</div>
                                </div>
                                <Switch v-model="notifications.queue" :class="notifications.queue ? 'bg-blue-600' : 'bg-gray-200'" class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none">
                                    <span :class="notifications.queue ? 'translate-x-3.5' : 'translate-x-0.5'" class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform" />
                                </Switch>
                            </div>
                        </div>

                        <!-- Cookies -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-[var(--text-primary)]">Manage Cookies</span>
                            <button class="px-3 py-1.5 rounded-[10px] border border-[var(--border-btn-main)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--fill-tsp-white-light)] transition-colors">
                                Manage
                            </button>
                        </div>

                    </div>
                    
                    <!-- Other Tabs Placeholder -->
                    <div v-else class="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)]">
                        <p>Content for {{ activeItem }}</p>
                    </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild, Switch } from '@headlessui/vue'
import { useUIStore } from '../stores/ui'
import { useUserStore } from '../stores/user'
import { 
    UserIcon, 
    AdjustmentsHorizontalIcon, 
    ChartBarIcon, 
    CalendarIcon, 
    EnvelopeIcon, 
    CircleStackIcon, 
    GlobeAltIcon, 
    Squares2X2Icon, 
    PuzzlePieceIcon, 
    LinkIcon, 
    RocketLaunchIcon,
    QuestionMarkCircleIcon,
    ArrowUpRightIcon,
    XMarkIcon,
    ChevronDownIcon,
    SparklesIcon,
    ArrowRightStartOnRectangleIcon,
    PencilSquareIcon,
    CreditCardIcon,
    ChevronRightIcon
} from '@heroicons/vue/24/outline'

const uiStore = useUIStore()
const userStore = useUserStore()
const activeItem = ref('Account')

const menuItems = [
    { name: 'Account', icon: UserIcon },
    { name: 'Settings', icon: AdjustmentsHorizontalIcon },
    { name: 'Usage', icon: ChartBarIcon },
    { name: 'Scheduled tasks', icon: CalendarIcon },
    { name: 'Mail Manus', icon: EnvelopeIcon },
    { name: 'Data controls', icon: CircleStackIcon },
    { name: 'Cloud browser', icon: GlobeAltIcon },
    { name: 'Personalization', icon: Squares2X2Icon },
    { name: 'Skills', icon: PuzzlePieceIcon },
    { name: 'Connectors', icon: LinkIcon },
    { name: 'Integrations', icon: RocketLaunchIcon },
]

const notifications = reactive({
    exclusive: true,
    queue: true
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 0px; 
}
</style>
