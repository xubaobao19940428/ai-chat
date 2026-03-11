<template>
	<TransitionRoot :show="show" as="template">
		<Dialog as="div" class="relative z-[60]" @close="handleClose">
			<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
				leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
					<TransitionChild as="template" enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel
							class="relative transform rounded-[16px] bg-[var(--background-white-main)] px-4 pb-4 pt-5 text-left shadow-[var(--shadow-XL)] transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-8 border border-[var(--border-main)]">
							<div class="absolute right-0 top-0 pr-4 pt-4">
								<button type="button"
									class="rounded-full bg-[var(--fill-tsp-white-main)] p-2 text-[var(--icon-disable)] hover:text-[var(--icon-primary)] focus:outline-none transition-colors border border-transparent hover:border-[var(--border-main)]"
									@click="handleClose">
									<span class="sr-only">Close</span>
									<X :size="20" />
								</button>
							</div>

							<div>
								<div
									class="mx-auto flex h-16 w-16 items-center justify-center rounded-[16px] bg-[var(--fill-tsp-gray-main)] mb-6 transition-colors shadow-sm border border-[var(--border-main)]">
									<component :is="iconMap[selectedIcon] || Folder" :size="32"
										:style="{ color: selectedHexColor }" />
								</div>

								<div class="text-center">
									<DialogTitle as="h3"
										class="text-xl font-bold leading-6 text-[var(--text-primary)] text-center">
										{{ editingProject ? $t('project.edit_project') : $t('project.create_project') }}
									</DialogTitle>
								</div>
							</div>

							<div class="mt-6 space-y-4">
								<div>
									<label for="projectName"
										class="block text-sm font-bold text-[var(--text-primary)] mb-2">{{ $t('project.project_name') }}</label>
									<input type="text" id="projectName" v-model="projectName"
										:placeholder="$t('project.enter_name')"
										class="block w-full rounded-[10px] border border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] py-2 px-3 text-[var(--text-primary)] placeholder:text-[var(--text-disable)] focus:border-[var(--border-blue)] outline-none sm:text-sm transition-all font-medium" />
								</div>

								<div>
									<label class="block text-sm font-bold text-[var(--text-primary)] mb-2">{{ $t('project.color') }}</label>
									<div class="flex gap-2 flex-wrap">
										<button v-for="c in colorPresets" :key="c.name" type="button"
											@click="selectedColor = c.name"
											:class="['w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center', selectedColor === c.name ? 'scale-110 shadow-sm' : 'border-transparent hover:scale-105']"
											:style="{ backgroundColor: c.hex, borderColor: selectedColor === c.name ? c.hex : 'transparent' }">
											<div v-show="selectedColor === c.name"
												class="w-6 h-6 rounded-full border-2 border-white"></div>
										</button>
									</div>
								</div>

								<div>
									<label class="block text-sm font-bold text-[var(--text-primary)] mb-2">{{ $t('project.icon') }}</label>
									<div
										class="h-max max-h-40 overflow-y-auto custom-scrollbar p-1 pb-2 border border-[var(--border-main)] rounded-[10px] bg-[var(--fill-tsp-white-main)]">
										<div class="grid grid-cols-6 gap-2 sm:grid-cols-8">
											<button v-for="i in iconPresets" :key="i" type="button"
												@click="selectedIcon = i"
												:class="['flex h-10 w-10 items-center justify-center rounded-lg transition-colors', selectedIcon === i ? 'bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] shadow-sm' : 'border border-transparent hover:bg-[var(--fill-tsp-gray-main)]']">
												<component :is="iconMap[i]" :size="20"
													:class="selectedIcon === i ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'" />
											</button>
										</div>
									</div>
								</div>

								<div>
									<label for="projectDesc"
										class="block text-sm font-bold text-[var(--text-primary)] mb-2">{{ $t('project.instructions') }}</label>
									<textarea id="projectDesc" v-model="projectDesc" rows="3"
										placeholder="e.g. &quot;Focus on Python best practices&quot;, &quot;Maintain a professional tone&quot;, or &quot;Always provide sources for important conclusions&quot;."
										class="block w-full rounded-[10px] border border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] py-2 px-3 text-[var(--text-primary)] placeholder:text-[var(--text-disable)] focus:border-[var(--border-blue)] outline-none sm:text-sm transition-all resize-none font-medium custom-scrollbar"></textarea>
								</div>
							</div>

							<div class="mt-8 flex flex-col sm:flex-row-reverse gap-3 cursor-default">
								<button type="button"
									class="inline-flex w-full justify-center rounded-[10px] bg-[var(--Button-primary-black)] px-6 py-2.5 text-sm font-bold text-[var(--text-onblack)] shadow-[var(--shadow-S)] hover:opacity-90 transition-all disabled:opacity-50"
									:disabled="!projectName.trim() || isLoading" @click="handleSubmit">
									{{ isLoading ? (editingProject ? $t('project.saving') : $t('project.creating')) : editingProject ?
										$t('project.save') : $t('project.create') }}
								</button>
								<button type="button"
									class="inline-flex w-full justify-center rounded-[10px] bg-[var(--background-white-main)] px-6 py-2.5 text-sm font-bold text-[var(--text-primary)] shadow-[var(--shadow-S)] ring-1 ring-inset ring-[var(--border-main)] hover:bg-[var(--fill-tsp-white-main)] transition-all sm:mt-0"
									@click="handleClose">{{ $t('common.cancel') }}</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useProjectStore } from '../stores/projects'
import type { ProjectGroup } from '../utils/api'
import {
	Folder, DollarSign, Book, GraduationCap, Pencil, PenTool,
	Code, Terminal, Music, Coffee, Paintbrush, Palette,
	Stethoscope, Asterisk, Flower, Briefcase, BarChart, CircleDot,
	Dumbbell, Notebook, Scale, Globe, Plane, Earth,
	Wrench, PawPrint, FlaskConical, Brain, Heart, Sprout,
	Cpu, Camera, Gamepad2, Headphones, Layers, Layout,
	Lightbulb, Map, Microscope, Monitor, Moon, Sun, Shield,
	Smartphone, Sparkles, Star, Target, Tv, Umbrella, Zap,
	Archive, Calendar, Cloud, Compass, Crown, Flag,
	Gift, Key, Link, Lock, Magnet, Medal, Rocket, Trophy,
	X
} from 'lucide-vue-next'

const props = defineProps<{
	show: boolean
	editingProject?: ProjectGroup | null
}>()

const emit = defineEmits(['close', 'success'])

const projectName = ref('')
const projectDesc = ref('')
const selectedColor = ref('black')
const selectedIcon = ref('Folder')
const isLoading = ref(false)
const projectStore = useProjectStore()

const colorPresets = [
	{ name: 'black', hex: '#000000' },
	{ name: 'red', hex: '#EF4444' },
	{ name: 'orange', hex: '#F97316' },
	{ name: 'yellow', hex: '#EAB308' },
	{ name: 'green', hex: '#22C55E' },
	{ name: 'blue', hex: '#3B82F6' },
	{ name: 'purple', hex: '#A855F7' },
	{ name: 'pink', hex: '#EC4899' },
]

const iconMap: Record<string, any> = {
	Folder, DollarSign, Book, GraduationCap, Pencil, PenTool,
	Code, Terminal, Music, Coffee, Paintbrush, Palette,
	Stethoscope, Asterisk, Flower, Briefcase, BarChart, CircleDot,
	Dumbbell, Notebook, Scale, Globe, Plane, Earth,
	Wrench, PawPrint, FlaskConical, Brain, Heart, Sprout,
	Cpu, Camera, Gamepad2, Headphones, Layers, Layout,
	Lightbulb, Map, Microscope, Monitor, Moon, Sun, Shield,
	Smartphone, Sparkles, Star, Target, Tv, Umbrella, Zap,
	Archive, Calendar, Cloud, Compass, Crown, Flag,
	Gift, Key, Link, Lock, Magnet, Medal, Rocket, Trophy
}
const iconPresets = Object.keys(iconMap)

const selectedHexColor = computed(() => {
	return colorPresets.find(c => c.name === selectedColor.value)?.hex || '#000000'
})

watch(
	() => props.show,
	(newVal) => {
		if (newVal && props.editingProject) {
			projectName.value = props.editingProject.name
			projectDesc.value = props.editingProject.description || ''
			selectedColor.value = props.editingProject.color || 'black'
			selectedIcon.value = props.editingProject.icon || 'Folder'
		} else if (newVal) {
			projectName.value = ''
			projectDesc.value = ''
			selectedColor.value = 'black'
			selectedIcon.value = 'Folder'
		}
	},
)

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
				icon: selectedIcon.value,
			})
		} else {
			await projectStore.createProject({
				name: projectName.value,
				description: projectDesc.value,
				color: selectedColor.value,
				icon: selectedIcon.value,
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
