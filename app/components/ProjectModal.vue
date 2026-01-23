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
                            class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1a] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-gray-100 dark:border-gray-800">
                            <div class="absolute right-0 top-0 pr-4 pt-4">
                                <button type="button"
                                    class="rounded-lg bg-gray-50 dark:bg-gray-800 p-2 text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                                    @click="handleClose">
                                    <span class="sr-only">Close</span>
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div>
                                <div
                                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 mb-4">
                                    <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none"
                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div class="text-center sm:text-left">
                                    <DialogTitle as="h3"
                                        class="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                                        新建项目
                                    </DialogTitle>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500 dark:text-gray-400">
                                            创建一个项目来整理你的对话和资源。
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6 space-y-4">
                                <div>
                                    <label for="projectName"
                                        class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">项目名称</label>
                                    <input type="text" id="projectName" v-model="projectName"
                                        placeholder="输入项目名称，例如：投资分析"
                                        class="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all" />
                                </div>

                                <div>
                                    <label for="projectDesc"
                                        class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">项目描述</label>
                                    <textarea id="projectDesc" v-model="projectDesc" rows="3" placeholder="简要描述项目用途..."
                                        class="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all resize-none"></textarea>
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">项目颜色</label>
                                    <div class="flex gap-3">
                                        <button v-for="c in colorPresets" :key="c.value" type="button"
                                            @click="selectedColor = c.value" :class="[
                                                'w-8 h-8 rounded-full border-2 transition-all',
                                                selectedColor === c.value ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                                            ]" :style="{ backgroundColor: c.hex }" :title="c.label"></button>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                                <button type="button"
                                    class="inline-flex w-full justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none transition-all disabled:opacity-50"
                                    :disabled="!projectName.trim() || isLoading" @click="handleCreate">
                                    {{ isLoading ? '创建中...' : '创建项目' }}
                                </button>
                                <button type="button"
                                    class="inline-flex w-full justify-center rounded-xl bg-white dark:bg-transparent px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all sm:mt-0"
                                    @click="handleClose">
                                    取消
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
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps<{
    show: boolean
}>()

const emit = defineEmits(['close', 'create'])

const projectName = ref('')
const projectDesc = ref('')
const selectedColor = ref('blue')
const isLoading = ref(false)
const projectStore = useProjectStore()

const colorPresets = [
    { label: '蓝色', value: 'blue', hex: '#3b82f6' },
    { label: '绿色', value: 'green', hex: '#22c55e' },
    { label: '红色', value: 'red', hex: '#ef4444' },
    { label: '紫色', value: 'purple', hex: '#a855f7' },
    { label: '橘色', value: 'orange', hex: '#f97316' },
    { label: '淡蓝', value: 'cyan', hex: '#06b6d4' },
]

const handleClose = () => {
    projectName.value = ''
    projectDesc.value = ''
    selectedColor.value = 'blue'
    emit('close')
}

const handleCreate = async () => {
    if (!projectName.value.trim()) return

    isLoading.value = true
    try {
        await projectStore.createProject({
            name: projectName.value,
            description: projectDesc.value,
            color: selectedColor.value
        })
        handleClose()
        emit('create')
    } catch (e) {
        console.error('Failed to create project:', e)
    } finally {
        isLoading.value = false
    }
}
</script>
