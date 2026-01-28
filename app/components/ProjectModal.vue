<template>
	<TransitionRoot :show="show" as="template">
		<Dialog as="div" class="relative z-[60]" @close="handleClose">
			<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
					<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel class="relative transform overflow-hidden rounded-2xl bg-[var(--background-white-main)] px-4 pb-4 pt-5 text-left shadow-[var(--shadow-XL)] transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-[var(--border-main)]">
							<div class="absolute right-0 top-0 pr-4 pt-4">
								<button type="button" class="rounded-lg bg-[var(--fill-tsp-white-main)] p-2 text-[var(--icon-disable)] hover:text-[var(--icon-primary)] focus:outline-none transition-colors" @click="handleClose">
									<span class="sr-only">Close</span>
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							<div>
								<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--fill-blue)] mb-4">
									<svg class="h-6 w-6 text-[var(--text-blue)]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
									</svg>
								</div>
								<div class="text-center sm:text-left">
									<DialogTitle as="h3" class="text-xl font-black leading-6 text-[var(--text-primary)] tracking-tight">
										{{ editingProject ? '编辑项目' : '新建项目' }}
									</DialogTitle>
									<div class="mt-2">
										<p class="text-sm text-[var(--text-secondary)] font-bold tracking-tight">
											{{ editingProject ? '修改项目信息以更好地管理你的对话。' : '创建一个项目来整理你的对话和资源。' }}
										</p>
									</div>
								</div>
							</div>

							<div class="mt-6 space-y-4">
								<div>
									<label for="projectName" class="block text-sm font-bold text-[var(--text-primary)] mb-1">项目名称</label>
									<input type="text" id="projectName" v-model="projectName" placeholder="输入项目名称，例如：投资分析" class="block w-full rounded-xl border border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-disable)] focus:border-[var(--border-blue)] outline-none sm:text-sm transition-all font-bold tracking-tight" />
								</div>

								<div>
									<label for="projectDesc" class="block text-sm font-bold text-[var(--text-primary)] mb-1">项目描述</label>
									<textarea id="projectDesc" v-model="projectDesc" rows="3" placeholder="简要描述项目用途..." class="block w-full rounded-xl border border-[var(--border-main)] bg-[var(--fill-tsp-white-main)] py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-disable)] focus:border-[var(--border-blue)] outline-none sm:text-sm transition-all resize-none font-bold tracking-tight"></textarea>
								</div>

								<div>
									<label class="block text-sm font-bold text-[var(--text-primary)] mb-2">项目颜色</label>
									<div class="flex gap-3">
										<button v-for="c in colorPresets" :key="c.value" type="button" @click="selectedColor = c.value" :class="['w-8 h-8 rounded-full border-2 transition-all', selectedColor === c.value ? 'border-[var(--border-blue)] scale-110 shadow-[var(--shadow-S)]' : 'border-transparent hover:scale-105']" :style="{ backgroundColor: c.hex }" :title="c.label"></button>
									</div>
								</div>
							</div>

							<div class="mt-8 flex flex-col sm:flex-row-reverse gap-3">
								<button type="button" class="inline-flex w-full justify-center rounded-xl bg-[var(--Button-primary-black)] px-6 py-3 text-sm font-bold text-[var(--text-onblack)] shadow-[var(--shadow-S)] hover:opacity-90 transition-all disabled:opacity-50" :disabled="!projectName.trim() || isLoading" @click="handleSubmit">
									{{ isLoading ? (editingProject ? '保存中...' : '创建中...') : editingProject ? '保存修改' : '创建项目' }}
								</button>
								<button type="button" class="inline-flex w-full justify-center rounded-xl bg-[var(--background-white-main)] px-6 py-3 text-sm font-bold text-[var(--text-primary)] shadow-[var(--shadow-S)] ring-1 ring-inset ring-[var(--border-main)] hover:bg-[var(--fill-tsp-white-main)] transition-all sm:mt-0" @click="handleClose">取消</button>
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
	{ label: '蓝色', value: 'blue', hex: '#3b82f6' },
	{ label: '绿色', value: 'green', hex: '#22c55e' },
	{ label: '红色', value: 'red', hex: '#ef4444' },
	{ label: '紫色', value: 'purple', hex: '#a855f7' },
	{ label: '橘色', value: 'orange', hex: '#f97316' },
	{ label: '淡蓝', value: 'cyan', hex: '#06b6d4' },
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
