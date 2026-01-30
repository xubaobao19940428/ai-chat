<template>
	<TransitionRoot :show="show" as="template">
		<Dialog as="div" class="relative z-[60]" @close="handleClose">
			<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
					<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel class="relative transform overflow-hidden rounded-[16px] bg-[var(--background-white-main)] px-4 pb-4 pt-5 text-left shadow-[var(--shadow-XL)] transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-8 border border-[var(--border-main)]">
							<div class="absolute right-0 top-0 pr-4 pt-4">
								<button type="button" class="rounded-full bg-[var(--fill-tsp-white-main)] p-2 text-[var(--icon-disable)] hover:text-[var(--icon-primary)] focus:outline-none transition-colors border border-transparent hover:border-[var(--border-main)]" @click="handleClose">
									<span class="sr-only">Close</span>
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							<div>
								<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-[16px] bg-[var(--fill-tsp-gray-main)] mb-6">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-[var(--text-secondary)]">
										<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
									</svg>
								</div>
								<div class="text-left">
									<DialogTitle as="h3" class="text-xl font-bold leading-6 text-[var(--text-primary)]">
										{{ editingProject ? 'Edit project' : 'Create project' }}
									</DialogTitle>
								</div>
							</div>

							<div class="mt-6 space-y-6">
								<div>
									<label for="projectName" class="block text-sm font-bold text-[var(--text-primary)] mb-2">Project name</label>
									<input type="text" id="projectName" v-model="projectName" placeholder="Enter the name" class="block w-full rounded-[10px] border border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-disable)] focus:border-[var(--border-blue)] outline-none sm:text-sm transition-all font-medium" />
								</div>

								<div>
									<label for="projectDesc" class="block text-sm font-bold text-[var(--text-primary)] mb-2">Instructions (optional)</label>
									<textarea id="projectDesc" v-model="projectDesc" rows="5" placeholder="e.g. &quot;Focus on Python best practices&quot;, &quot;Maintain a professional tone&quot;, or &quot;Always provide sources for important conclusions&quot;." class="block w-full rounded-[10px] border border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-disable)] focus:border-[var(--border-blue)] outline-none sm:text-sm transition-all resize-none font-medium custom-scrollbar"></textarea>
								</div>

								<!-- Color Picker (Hidden to match screenshot, but kept in code structure if needed later) -->
								<!-- 
								<div>
									<label class="block text-sm font-bold text-[var(--text-primary)] mb-2">Project Color</label>
									<div class="flex gap-3">
										<button v-for="c in colorPresets" :key="c.value" type="button" @click="selectedColor = c.value" :class="['w-8 h-8 rounded-full border-2 transition-all', selectedColor === c.value ? 'border-[var(--border-blue)] scale-110 shadow-[var(--shadow-S)]' : 'border-transparent hover:scale-105']" :style="{ backgroundColor: c.hex }" :title="c.label"></button>
									</div>
								</div> 
								-->
							</div>

							<div class="mt-8 flex flex-col sm:flex-row-reverse gap-3">
								<button type="button" class="inline-flex w-full justify-center rounded-[10px] bg-[var(--Button-primary-black)] px-6 py-2.5 text-sm font-bold text-[var(--text-onblack)] shadow-[var(--shadow-S)] hover:opacity-90 transition-all disabled:opacity-50" :disabled="!projectName.trim() || isLoading" @click="handleSubmit">
									{{ isLoading ? (editingProject ? 'Saving...' : 'Creating...') : editingProject ? 'Save' : 'Create' }}
								</button>
								<button type="button" class="inline-flex w-full justify-center rounded-[10px] bg-[var(--background-white-main)] px-6 py-2.5 text-sm font-bold text-[var(--text-primary)] shadow-[var(--shadow-S)] ring-1 ring-inset ring-[var(--border-main)] hover:bg-[var(--fill-tsp-white-main)] transition-all sm:mt-0" @click="handleClose">Cancel</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useProjectStore } from '../stores/projects'
import type { ProjectGroup } from '../utils/api'

const props = defineProps<{
	show: boolean
	editingProject?: ProjectGroup | null
}>()

const emit = defineEmits(['close', 'success'])

const projectName = ref('')
const projectDesc = ref('')
const selectedColor = ref('blue')
const isLoading = ref(false)
const projectStore = useProjectStore()

watch(
	() => props.show,
	(newVal) => {
		if (newVal && props.editingProject) {
			projectName.value = props.editingProject.name
			projectDesc.value = props.editingProject.description || ''
			selectedColor.value = props.editingProject.color || 'blue'
		} else if (newVal) {
			projectName.value = ''
			projectDesc.value = ''
			selectedColor.value = 'blue'
		}
	},
)

const colorPresets = [
	{ label: 'Blue', value: 'blue', hex: '#3b82f6' },
	{ label: 'Green', value: 'green', hex: '#22c55e' },
	{ label: 'Red', value: 'red', hex: '#ef4444' },
	{ label: 'Purple', value: 'purple', hex: '#a855f7' },
	{ label: 'Orange', value: 'orange', hex: '#f97316' },
	{ label: 'Cyan', value: 'cyan', hex: '#06b6d4' },
]

const handleClose = () => {
	emit('close')
}

const handleSubmit = async () => {
	if (!projectName.value.trim()) return

	isLoading.value = true
	try {
		if (props.editingProject) {
			await projectStore.updateProject(props.editingProject.id, {
				name: projectName.value,
				description: projectDesc.value,
				color: selectedColor.value,
			})
		} else {
			await projectStore.createProject({
				name: projectName.value,
				description: projectDesc.value,
				color: selectedColor.value,
			})
		}
		emit('success')
		handleClose()
	} catch (e) {
		console.error('Failed to submit project:', e)
	} finally {
		isLoading.value = false
	}
}
</script>
