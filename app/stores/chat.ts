import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  model?: string
}

const FAKE_PROGRESS_STAGES = [
  { target: 15, duration: 800 },
  { target: 35, duration: 1500 },
  { target: 55, duration: 2500 },
  { target: 70, duration: 4000 },
  { target: 82, duration: 6000 },
  { target: 90, duration: 10000 },
  { target: 95, duration: 15000 },
]

const FAKE_STATUS_MESSAGES = [
  'Initializing...',
  'Preparing model...',
  'Generating...',
  'Rendering details...',
  'Refining output...',
  'Almost there...',
]

export const useChatStore = defineStore('chat', () => {
  const isLoading = ref(false)
  const loadingConversationId = ref<string | number | null>(null)
  const pendingMessage = ref<string | null>(null)
  const generationProgress = ref(0)
  const generationStatus = ref('')
  let fakeProgressTimer: ReturnType<typeof setTimeout> | null = null

  const clearFakeProgress = () => {
    if (fakeProgressTimer) {
      clearTimeout(fakeProgressTimer)
      fakeProgressTimer = null
    }
  }

  const runFakeProgress = () => {
    clearFakeProgress()
    generationProgress.value = 0
    generationStatus.value = FAKE_STATUS_MESSAGES[0]!
    let stageIndex = 0

    const tick = () => {
      if (stageIndex >= FAKE_PROGRESS_STAGES.length) return
      const stage = FAKE_PROGRESS_STAGES[stageIndex]!
      fakeProgressTimer = setTimeout(() => {
        // Only update if real progress hasn't overtaken
        if (generationProgress.value < stage.target) {
          generationProgress.value = stage.target
        }
        // Update status message
        const statusIdx = Math.min(stageIndex, FAKE_STATUS_MESSAGES.length - 1)
        generationStatus.value = FAKE_STATUS_MESSAGES[statusIdx]!
        stageIndex++
        tick()
      }, stage.duration)
    }
    tick()
  }

  const setLoading = (loading: boolean, conversationId?: string | number) => {
    isLoading.value = loading
    loadingConversationId.value = loading ? (conversationId || null) : null
    if (!loading) {
      clearFakeProgress()
      generationProgress.value = 0
      generationStatus.value = ''
    }
  }

  const setGenerationProgress = (percent: number, message: string) => {
    // Real progress from API always takes priority
    if (percent > generationProgress.value) {
      generationProgress.value = percent
    }
    if (message) {
      generationStatus.value = message
    }
  }

  const completeGeneration = () => {
    clearFakeProgress()
    generationProgress.value = 100
    generationStatus.value = 'Complete'
  }

  const startFakeProgress = () => {
    runFakeProgress()
  }

  const setPendingMessage = (message: string | null) => {
    pendingMessage.value = message
  }

  return {
    isLoading,
    loadingConversationId,
    pendingMessage,
    generationProgress,
    generationStatus,
    setLoading,
    setGenerationProgress,
    completeGeneration,
    startFakeProgress,
    setPendingMessage,
  }
})
