import { onMounted, onUnmounted } from 'vue'

/**
 * Custom Vue composable to handle keydown events globally.
 * This composable adds an event listener for the 'keydown' event when the component is mounted
 * and removes it when the component is unmounted.
 * @param callback Function to be called on keydown event
 */
export function useKeydown(callback: (event: KeyboardEvent) => void): void {
  const handleKeydown = (event: KeyboardEvent) => {
    callback(event)
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
