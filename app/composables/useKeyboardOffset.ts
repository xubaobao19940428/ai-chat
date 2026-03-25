import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Tracks mobile virtual keyboard height via visualViewport API.
 * Returns a reactive `keyboardHeight` (px) that represents the space
 * the keyboard occupies at the bottom of the viewport.
 */
export function useKeyboardOffset() {
  const keyboardHeight = ref(0)

  let initialHeight = 0

  const onResize = () => {
    if (!window.visualViewport) return
    const currentHeight = window.visualViewport.height
    const offset = initialHeight - currentHeight
    // Only treat as keyboard if offset > 100px (avoid toolbar changes)
    keyboardHeight.value = offset > 100 ? offset : 0
  }

  onMounted(() => {
    if (!window.visualViewport) return
    initialHeight = window.visualViewport.height
    window.visualViewport.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    if (!window.visualViewport) return
    window.visualViewport.removeEventListener('resize', onResize)
  })

  return { keyboardHeight }
}
