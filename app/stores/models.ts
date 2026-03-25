import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getModels, type AIModel } from '~/utils/api'

export const useModelStore = defineStore('model', () => {
  const models = ref<AIModel[]>([])
  const isLoading = ref(false)
  const fetchError = ref(false)

  // Per-capability model selection (cookie-persisted)
  const selectedModelIds = useCookie<Record<string, string>>('selected-model-ids', {
    default: () => ({})
  })

  // Current active capability (set by ModelSelector / pages)
  const activeCapability = ref<string>('chat')

  // Backward-compatible: selectedModelId reads/writes the active capability's selection
  const selectedModelId = computed({
    get: () => selectedModelIds.value[activeCapability.value] || null,
    set: (val: string | null) => {
      if (val) {
        selectedModelIds.value = { ...selectedModelIds.value, [activeCapability.value]: val }
      }
    }
  })

  const selectedModel = computed(() => {
    const id = selectedModelId.value
    if (id) {
      const found = models.value.find(m => m.model === id || `${m.provider}:${m.model}` === id)
      if (found) return found
    }
    // Fallback: find default model for current capability, or first model
    return models.value.find(m => m.is_default) ||
           models.value[0] || null
  })

  const fetchModels = async () => {
    isLoading.value = true
    fetchError.value = false
    try {
      const res: any = await getModels({})
      models.value = res.data || []
    } catch (error) {
      console.error('Fetch models failed:', error)
      fetchError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const selectModel = (modelId: string, capability?: string) => {
    const cap = capability || activeCapability.value
    selectedModelIds.value = { ...selectedModelIds.value, [cap]: modelId }
    const model = models.value.find((m: any) => `${m.provider}:${m.model}` === modelId)
    console.log('[selectModel]', { modelId, capability: cap, model })
  }

  const setActiveCapability = (cap: string) => {
    activeCapability.value = cap
  }

  return {
    models,
    isLoading,
    fetchError,
    selectedModelId,
    selectedModelIds,
    selectedModel,
    activeCapability,
    fetchModels,
    selectModel,
    setActiveCapability
  }
})
