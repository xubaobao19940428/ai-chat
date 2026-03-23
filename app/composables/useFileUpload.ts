import { ref, type Ref } from 'vue'
import { uploadFile } from '~/api/helpers'

export interface UploadedFile {
	id: string
	name: string
	key: string
	url: string
	type: string
	uploading: boolean
	localUrl?: string
}

/**
 * File upload logic with blob preview + async upload.
 * Eliminates duplicated upload code across pages.
 */
export function useFileUpload(options?: {
	/** Upload purpose passed to uploadFile API */
	purpose?: string
}) {
	const purpose = options?.purpose || 'general'
	const fileInputRef = ref<HTMLInputElement | null>(null)
	const isUploading = ref(false)
	const uploadedFiles = ref<UploadedFile[]>([])

	function triggerFileUpload(accept?: string, multiple?: boolean) {
		if (!fileInputRef.value) return
		if (accept) fileInputRef.value.accept = accept
		fileInputRef.value.multiple = multiple ?? false
		fileInputRef.value.click()
	}

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement
		const files = target.files
		if (!files || files.length === 0) return
		await uploadFiles(Array.from(files))
		if (target) target.value = ''
	}

	async function uploadFiles(files: File[], maxFiles?: number) {
		if (files.length === 0) return

		// Apply limit
		let filesToUpload = files
		if (maxFiles !== undefined && maxFiles !== Infinity) {
			const remaining = maxFiles - uploadedFiles.value.length
			if (remaining <= 0) return
			filesToUpload = files.slice(0, remaining)
		}

		isUploading.value = true
		const startIndex = uploadedFiles.value.length

		// Create local previews
		const previews: UploadedFile[] = filesToUpload.map((file) => ({
			id: Math.random().toString(36).slice(2),
			name: file.name,
			key: '',
			url: URL.createObjectURL(file),
			type: file.type,
			uploading: true,
			localUrl: URL.createObjectURL(file),
		}))
		uploadedFiles.value.push(...previews)

		// Upload each file
		for (let i = 0; i < filesToUpload.length; i++) {
			try {
				const res = await uploadFile(filesToUpload[i]!, purpose)
				const item = uploadedFiles.value[startIndex + i]
				if (res && item) {
					if (item.localUrl) URL.revokeObjectURL(item.localUrl)
					uploadedFiles.value[startIndex + i] = {
						...item,
						key: res.key,
						url: res.url,
						uploading: false,
						localUrl: undefined,
					}
				}
			} catch (error) {
				console.error('Failed to upload file:', error)
				// Remove failed upload
				const idx = uploadedFiles.value.findIndex((f) => f.id === previews[i]?.id)
				if (idx !== -1) {
					const item = uploadedFiles.value[idx]
					if (item?.localUrl) URL.revokeObjectURL(item.localUrl)
					uploadedFiles.value.splice(idx, 1)
				}
			}
		}

		isUploading.value = false
	}

	function removeFile(id: string) {
		const idx = uploadedFiles.value.findIndex((f) => f.id === id)
		if (idx !== -1) {
			const file = uploadedFiles.value[idx]
			if (file?.localUrl) URL.revokeObjectURL(file.localUrl)
			uploadedFiles.value.splice(idx, 1)
		}
	}

	function removeFileByIndex(index: number) {
		const file = uploadedFiles.value[index]
		if (file?.localUrl) URL.revokeObjectURL(file.localUrl)
		uploadedFiles.value.splice(index, 1)
	}

	function clearFiles() {
		uploadedFiles.value.forEach((f) => {
			if (f.localUrl) URL.revokeObjectURL(f.localUrl)
		})
		uploadedFiles.value = []
	}

	function addFromAssets(assets: Array<{ key: string; url: string }>) {
		assets.forEach((asset) => {
			uploadedFiles.value.push({
				id: Math.random().toString(36).slice(2),
				name: 'Asset',
				key: asset.key,
				url: asset.url,
				type: 'image/png',
				uploading: false,
			})
		})
	}

	/** Get only image files */
	function getImageFiles() {
		return uploadedFiles.value.filter((f) => f.type?.startsWith('image/'))
	}

	/** Get ready (non-uploading) files */
	function getReadyFiles() {
		return uploadedFiles.value.filter((f) => !f.uploading)
	}

	return {
		fileInputRef,
		isUploading,
		uploadedFiles,
		triggerFileUpload,
		handleFileChange,
		uploadFiles,
		removeFile,
		removeFileByIndex,
		clearFiles,
		addFromAssets,
		getImageFiles,
		getReadyFiles,
	}
}
