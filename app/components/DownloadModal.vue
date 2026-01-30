<template>
	<TransitionRoot appear :show="uiStore.showDownloadModal" as="template">
		<Dialog as="div" @close="uiStore.closeDownloadModal" class="relative z-50">
			<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center">
					<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
						<DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[16px] bg-[var(--background-white-main)] p-8 text-center align-middle shadow-[var(--shadow-XL)] transition-all border border-[var(--border-main)] relative">
							<button @click="uiStore.closeDownloadModal" class="absolute top-4 right-4 p-2 rounded-full text-[var(--icon-disable)] hover:bg-[var(--fill-tsp-gray-main)] hover:text-[var(--text-primary)] transition-all">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
							</button>

							<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-[14px] bg-[var(--fill-blue)] mb-6">
								<svg class="h-8 w-8 text-[var(--text-blue)]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
								</svg>
							</div>

							<DialogTitle as="h3" class="text-xl font-black leading-6 text-[var(--text-primary)] mb-2">
								Download Mobile App
							</DialogTitle>
							<div class="mt-2">
								<p class="text-sm text-[var(--text-secondary)] font-bold">
									Scan the QR code to experience Manus on your mobile device.
								</p>
							</div>

							<div class="mt-8 mb-8 flex justify-center">
								<div class="p-3 bg-white rounded-xl border border-[var(--border-main)] shadow-sm">
									<!-- Placeholder QR Code -->
									<div class="w-40 h-40 bg-[var(--text-primary)] relative overflow-hidden rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" class="w-full h-full text-[var(--bg-main)]">
                                            <path d="M10 10h30v30h-30zM50 10h10v10h-10zM70 10h20v20h-20zM10 50h20v20h-20zM40 40h10v20h-10zM60 40h10v10h-10zM80 40h10v20h-10zM10 80h20v10h-20zM40 70h10v30h-10zM60 60h30v30h-30z" stroke="none"/>
                                            <rect x="15" y="15" width="20" height="20" rx="2" fill="var(--bg-main)"/>
                                            <rect x="20" y="20" width="10" height="10" fill="currentColor"/>
                                        </svg>
                                    </div>
								</div>
							</div>

							<div class="flex gap-3 justify-center">
								<button class="px-4 py-2 rounded-[10px] bg-[var(--Button-secondary-gray)] text-[var(--text-primary)] text-xs font-bold hover:bg-[var(--fill-tsp-gray-main)] transition-colors flex items-center gap-2">
									<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.81-.04 2.37-1.11 3.97-.48 1.58.62 2.68 1.94 3.23 2.76-2.85 1.55-2.27 5.66.42 7.02l-.52 1.48c-.46 1.07-1.12 1.95-2.18 2.91zm-3.8-17.5c.34 1.59-1.32 3.19-2.7 3.14-.52-1.7 1.35-3.4 2.7-3.14z"/></svg>
									App Store
								</button>
								<button class="px-4 py-2 rounded-[10px] bg-[var(--Button-secondary-gray)] text-[var(--text-primary)] text-xs font-bold hover:bg-[var(--fill-tsp-gray-main)] transition-colors flex items-center gap-2">
									<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L3.84,2.15C3.84,2.15 6.05,2.66 6.05,2.66Z" /></svg>
									Google Play
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
</script>
