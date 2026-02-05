<template>
	<TransitionRoot as="template" :show="show">
		<Dialog as="div" class="relative z-50" @close="onCancel">
			<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/70 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel class="relative transform overflow-hidden rounded-[16px] bg-[var(--background-white-main)] text-left shadow-[var(--shadow-XL)] transition-all sm:my-8 sm:w-full sm:max-w-sm border border-[var(--border-main)]">
							<div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
								<div class="sm:flex sm:items-start">
									<div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[14px] bg-[var(--function-error-tsp)] sm:mx-0 sm:h-10 sm:w-10">
										<AlertTriangle :size="24" class="text-[var(--function-error)]" />
									</div>
									<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<DialogTitle as="h3" class="text-base font-black leading-6 text-[var(--text-primary)] tracking-tight">{{ title }}</DialogTitle>
										<div class="mt-2">
											<p class="text-sm text-[var(--text-secondary)] font-bold tracking-tight">{{ message }}</p>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-[var(--fill-tsp-white-main)] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
								<button type="button" class="inline-flex w-full justify-center rounded-[10px] bg-[var(--function-error)] px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-S)] hover:opacity-90 sm:w-auto transition-all" @click="onConfirm">Delete</button>
								<button type="button" class="mt-3 inline-flex w-full justify-center rounded-[10px] bg-[var(--background-white-main)] px-4 py-2 text-sm font-bold text-[var(--text-primary)] shadow-[var(--shadow-S)] ring-1 ring-inset ring-[var(--border-main)] hover:bg-[var(--fill-tsp-white-main)] sm:mt-0 sm:w-auto transition-all" @click="onCancel">Cancel</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { AlertTriangle } from 'lucide-vue-next'

defineProps<{
	show: boolean
	title: string
	message: string
}>()

const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'cancel'): void
}>()

const onConfirm = () => {
	emit('confirm')
}

const onCancel = () => {
	emit('cancel')
}
</script>
