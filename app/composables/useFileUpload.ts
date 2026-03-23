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
	/** Which API parameter this file belongs to, e.g. 'image', 'init_image', 'end_image' */
	paramKey?: string
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

	/** Replace or insert a file at a specific slot index */
	async function uploadFileToSlot(file: File, slot: number) {
		isUploading.value = true

		const preview: UploadedFile = {
			id: Math.random().toString(36).slice(2),
			name: file.name,
			key: '',
			url: URL.createObjectURL(file),
			type: file.type,
			uploading: true,
			localUrl: URL.createObjectURL(file),
		}

		// Replace existing file at slot, or pad array to reach slot
		if (uploadedFiles.value[slot]) {
			const old = uploadedFiles.value[slot]
			if (old?.localUrl) URL.revokeObjectURL(old.localUrl)
			uploadedFiles.value[slot] = preview
		} else {
			// Pad with nulls if needed, then set
			while (uploadedFiles.value.length < slot) {
				uploadedFiles.value.push(null as any)
			}
			if (uploadedFiles.value.length === slot) {
				uploadedFiles.value.push(preview)
			} else {
				uploadedFiles.value[slot] = preview
			}
		}

		try {
			const res = await uploadFile(file, purpose)
			// Find by id in case indices shifted
			const idx = uploadedFiles.value.findIndex((f) => f?.id === preview.id)
			if (res && idx !== -1) {
				if (preview.localUrl) URL.revokeObjectURL(preview.localUrl)
				uploadedFiles.value[idx] = {
					...preview,
					key: res.key,
					url: res.url,
					uploading: false,
					localUrl: undefined,
				}
			}
		} catch (error) {
			console.error('Failed to upload file:', error)
			const idx = uploadedFiles.value.findIndex((f) => f?.id === preview.id)
			if (idx !== -1) {
				if (preview.localUrl) URL.revokeObjectURL(preview.localUrl)
				uploadedFiles.value.splice(idx, 1)
			}
		}

		isUploading.value = false
	}

	/** Add asset at a specific slot */
	function addAssetAtSlot(asset: { key: string; url: string }, slot: number) {
		const entry: UploadedFile = {
			id: Math.random().toString(36).slice(2),
			name: 'Asset',
			key: asset.key,
			url: asset.url,
			type: 'image/png',
			uploading: false,
		}
		if (uploadedFiles.value[slot]) {
			const old = uploadedFiles.value[slot]
			if (old?.localUrl) URL.revokeObjectURL(old.localUrl)
			uploadedFiles.value[slot] = entry
		} else {
			while (uploadedFiles.value.length < slot) {
				uploadedFiles.value.push(null as any)
			}
			if (uploadedFiles.value.length === slot) {
				uploadedFiles.value.push(entry)
			} else {
				uploadedFiles.value[slot] = entry
			}
		}
	}

	/** Upload a file tagged with a specific API parameter key */
	async function uploadFileForParam(file: File, paramKey: string) {
		isUploading.value = true

		// Remove any existing file for this param (replace behavior)
		const existingIdx = uploadedFiles.value.findIndex((f) => f?.paramKey === paramKey)
		if (existingIdx !== -1) {
			const old = uploadedFiles.value[existingIdx]
			if (old?.localUrl) URL.revokeObjectURL(old.localUrl)
			uploadedFiles.value.splice(existingIdx, 1)
		}

		const preview: UploadedFile = {
			id: Math.random().toString(36).slice(2),
			name: file.name,
			key: '',
			url: URL.createObjectURL(file),
			type: file.type,
			uploading: true,
			localUrl: URL.createObjectURL(file),
			paramKey,
		}
		uploadedFiles.value.push(preview)

		try {
			const res = await uploadFile(file, purpose)
			const idx = uploadedFiles.value.findIndex((f) => f?.id === preview.id)
			if (res && idx !== -1) {
				if (preview.localUrl) URL.revokeObjectURL(preview.localUrl)
				uploadedFiles.value[idx] = {
					...preview,
					key: res.key,
					url: res.url,
					uploading: false,
					localUrl: undefined,
				}
			}
		} catch (error) {
			console.error('Failed to upload file:', error)
			const idx = uploadedFiles.value.findIndex((f) => f?.id === preview.id)
			if (idx !== -1) {
				if (preview.localUrl) URL.revokeObjectURL(preview.localUrl)
				uploadedFiles.value.splice(idx, 1)
			}
		}

		isUploading.value = false
	}

	/** Upload multiple files tagged with a specific API parameter key (for array params like input_images) */
	async function uploadFilesForParam(files: File[], paramKey: string, maxFiles?: number) {
		if (files.length === 0) return

		const existing = uploadedFiles.value.filter((f) => f?.paramKey === paramKey)
		let filesToUpload = files
		if (maxFiles !== undefined) {
			const remaining = maxFiles - existing.length
			if (remaining <= 0) return
			filesToUpload = files.slice(0, remaining)
		}

		isUploading.value = true

		const previews: UploadedFile[] = filesToUpload.map((file) => ({
			id: Math.random().toString(36).slice(2),
			name: file.name,
			key: '',
			url: URL.createObjectURL(file),
			type: file.type,
			uploading: true,
			localUrl: URL.createObjectURL(file),
			paramKey,
		}))
		uploadedFiles.value.push(...previews)

		for (let i = 0; i < filesToUpload.length; i++) {
			try {
				const res = await uploadFile(filesToUpload[i]!, purpose)
				const idx = uploadedFiles.value.findIndex((f) => f?.id === previews[i]?.id)
				if (res && idx !== -1) {
					if (previews[i]?.localUrl) URL.revokeObjectURL(previews[i]!.localUrl!)
					uploadedFiles.value[idx] = {
						...previews[i]!,
						key: res.key,
						url: res.url,
						uploading: false,
						localUrl: undefined,
					}
				}
			} catch (error) {
				console.error('Failed to upload file:', error)
				const idx = uploadedFiles.value.findIndex((f) => f?.id === previews[i]?.id)
				if (idx !== -1) {
					if (previews[i]?.localUrl) URL.revokeObjectURL(previews[i]!.localUrl!)
					uploadedFiles.value.splice(idx, 1)
				}
			}
		}

		isUploading.value = false
	}

	/** Add asset tagged with a parameter key (replaces existing for single params) */
	function addAssetForParam(asset: { key: string; url: string }, paramKey: string, replace = true) {
		if (replace) {
			const existingIdx = uploadedFiles.value.findIndex((f) => f?.paramKey === paramKey)
			if (existingIdx !== -1) {
				const old = uploadedFiles.value[existingIdx]
				if (old?.localUrl) URL.revokeObjectURL(old.localUrl)
				uploadedFiles.value.splice(existingIdx, 1)
			}
		}
		uploadedFiles.value.push({
			id: Math.random().toString(36).slice(2),
			name: 'Asset',
			key: asset.key,
			url: asset.url,
			type: 'image/png',
			uploading: false,
			paramKey,
		})
	}

	/** Remove all files for a specific parameter key */
	function removeFileByParam(paramKey: string) {
		for (let i = uploadedFiles.value.length - 1; i >= 0; i--) {
			const f = uploadedFiles.value[i]
			if (f?.paramKey === paramKey) {
				if (f.localUrl) URL.revokeObjectURL(f.localUrl)
				uploadedFiles.value.splice(i, 1)
			}
		}
	}

	/** Remove a single file by ID within a param group */
	function removeFileByIdInParam(fileId: string) {
		const idx = uploadedFiles.value.findIndex((f) => f?.id === fileId)
		if (idx !== -1) {
			const file = uploadedFiles.value[idx]
			if (file?.localUrl) URL.revokeObjectURL(file.localUrl)
			uploadedFiles.value.splice(idx, 1)
		}
	}

	/** Get files for a specific parameter key */
	function getFilesByParam(paramKey: string) {
		return uploadedFiles.value.filter((f) => f?.paramKey === paramKey)
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
		uploadFileToSlot,
		addAssetAtSlot,
		uploadFileForParam,
		uploadFilesForParam,
		addAssetForParam,
		removeFileByParam,
		removeFileByIdInParam,
		getFilesByParam,
		getImageFiles,
		getReadyFiles,
	}
}
