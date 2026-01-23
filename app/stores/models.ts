import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getModels, type AIModel } from '~/utils/api'

export const useModelStore = defineStore('model', () => {
  const models = ref<AIModel[]>([])
  const isLoading = ref(false)
  const selectedModelId = ref<string | null>(null)

  const selectedModel = computed(() => {
    return models.value.find(m => m.model === selectedModelId.value) || 
           models.value.find(m => m.is_default) || 
           models.value[0] || null
  })

  const fetchModels = async () => {
    isLoading.value = true
    try {
      const res: any = await getModels({ capability: 'chat' })
      models.value = res.data || []
      
      // Initial default model selection
      if (!selectedModelId.value && models.value.length > 0) {
        const defaultModel = models.value.find(m => m.is_default)
        selectedModelId.value = defaultModel ? defaultModel.model : models.value[0]!.model
      }
    } catch (error) {
      console.error('Fetch models failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  const selectModel = (modelId: string) => {
    selectedModelId.value = modelId
  }

  return {
    models,
    isLoading,
    selectedModelId,
    selectedModel,
    fetchModels,
    selectModel
  }
})
