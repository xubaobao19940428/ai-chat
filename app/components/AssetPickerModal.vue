<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
        @mousedown.self="$emit('close')">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <Transition enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0">
          <div v-if="show"
            class="relative w-full max-w-2xl bg-[var(--bg-main)] rounded-3xl shadow-2xl border border-[var(--border-main)] flex flex-col overflow-hidden max-h-[80vh]"
            style="background-color: var(--bg-main);">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--border-main)] shrink-0">
              <div>
                <h3 class="text-[15px] font-bold text-[var(--text-primary)]">Select asset</h3>
                <p class="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                  {{ multiple ? 'Select one or more images' : 'Select an image' }}
                </p>
              </div>
              <button @click="$emit('close')"
                class="size-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X :size="16" />
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <!-- Loading -->
              <div v-if="isLoading" class="flex items-center justify-center py-20">
                <Loader2 :size="28" class="animate-spin text-[var(--text-tertiary)]" />
              </div>

              <!-- Empty -->
              <div v-else-if="files.length === 0" class="flex flex-col items-center justify-center py-20 gap-3">
                <div class="size-16 rounded-2xl bg-[var(--fill-tsp-gray-main)] flex items-center justify-center">
                  <ImageIcon :size="28" class="text-[var(--text-tertiary)]" />
                </div>
                <p class="text-[14px] font-medium text-[var(--text-primary)]">No images yet</p>
                <p class="text-[12px] text-[var(--text-tertiary)]">Upload images first to use them here</p>
              </div>

              <!-- Grid -->
              <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <button v-for="file in files" :key="file.id"
                  @click="toggleSelect(file)"
                  class="relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-150 group"
                  :class="isSelected(file)
                    ? 'border-[var(--text-primary)] shadow-md scale-[0.97]'
                    : 'border-transparent hover:border-[var(--border-main)] hover:scale-[0.98]'">
                  <img :src="file.file_url" :alt="file.file_name"
                    class="w-full h-full object-cover" />
                  <!-- Overlay on hover / selected -->
                  <div class="absolute inset-0 transition-opacity duration-150"
                    :class="isSelected(file) ? 'bg-black/30 opacity-100' : 'bg-black/20 opacity-0 group-hover:opacity-100'">
                  </div>
                  <!-- Check mark -->
                  <div v-if="isSelected(file)"
                    class="absolute top-2 right-2 size-6 rounded-full bg-[var(--text-primary)] flex items-center justify-center shadow-md">
                    <Check :size="13" class="text-[var(--bg-main)]" stroke-width="3" />
                  </div>
                  <!-- Selection index for multiple -->
                  <div v-if="multiple && isSelected(file)"
                    class="absolute bottom-2 left-2 min-w-[20px] h-5 px-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center justify-center">
                    {{ getSelectionIndex(file) + 1 }}
                  </div>
                </button>
              </div>

              <!-- Load more -->
              <div v-if="hasMore && !isLoading" class="flex justify-center mt-4">
                <button @click="loadMore"
                  class="px-5 py-2 rounded-full border border-[var(--border-main)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all">
                  Load more
                </button>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-[var(--border-main)] flex items-center justify-between shrink-0">
              <span class="text-[13px] text-[var(--text-tertiary)]">
                <template v-if="selectedFiles.length > 0">
                  {{ selectedFiles.length }} selected
                </template>
                <template v-else>No selection</template>
              </span>
              <div class="flex items-center gap-2">
                <button @click="$emit('close')"
                  class="px-5 py-2 rounded-full border border-[var(--border-main)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all">
                  Cancel
                </button>
                <button @click="confirm" :disabled="selectedFiles.length === 0"
                  class="px-5 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] text-[13px] font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:pointer-events-none">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Loader2, Check, Image as ImageIcon } from 'lucide-vue-next'
import { getFiles, type UserFile } from '@/utils/api'

const props = withDefaults(defineProps<{
  show: boolean
  multiple?: boolean
  fileType?: 'image' | 'video'
}>(), {
  multiple: false,
  fileType: 'image',
})

const emit = defineEmits<{
  close: []
  select: [files: Array<{ key: string, url: string }>]
}>()

const files = ref<UserFile[]>([])
const isLoading = ref(false)
const page = ref(1)
const hasMore = ref(false)
const selectedFiles = ref<UserFile[]>([])

const fetchFiles = async (reset = false) => {
  if (reset) {
    page.value = 1
    files.value = []
    selectedFiles.value = []
  }
  isLoading.value = true
  try {
    const res: any = await getFiles({ file_type: props.fileType, page: page.value, page_size: 24 })
    if (res.data?.list) {
      files.value = reset ? res.data.list : [...files.value, ...res.data.list]
      hasMore.value = files.value.length < res.data.total
    }
  } catch (e) {
    console.error('Failed to fetch files:', e)
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  page.value++
  await fetchFiles()
}

const isSelected = (file: UserFile) => selectedFiles.value.some(f => f.id === file.id)
const getSelectionIndex = (file: UserFile) => selectedFiles.value.findIndex(f => f.id === file.id)

const toggleSelect = (file: UserFile) => {
  if (isSelected(file)) {
    selectedFiles.value = selectedFiles.value.filter(f => f.id !== file.id)
  } else {
    if (!props.multiple) {
      selectedFiles.value = [file]
    } else {
      selectedFiles.value.push(file)
    }
  }
}

const confirm = () => {
  emit('select', selectedFiles.value.map(f => ({ key: f.file_key, url: f.file_url })))
  emit('close')
}

watch(() => props.show, (val) => {
  if (val) fetchFiles(true)
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--border-light) transparent;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 10px;
}
</style>
