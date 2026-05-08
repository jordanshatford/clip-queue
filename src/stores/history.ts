import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import { toClipUUID, type Clip } from '@/integrations'

/**
 * Store used for tracking clip history. Contains information about clips previously watched.
 */
export const useHistory = defineStore('history', () => {
  /**
   * List of items in the history.
   */
  const items = useStorage<Clip[]>('__cq_history_values', [], localStorage, { deep: true })

  /**
   * Current length of the history.
   */
  const length = computed<number>(() => {
    return items.value.length
  })

  /**
   * Add a clip to the history if not already present.
   * @param clip - The clip to add to the history.
   */
  function add(clip: Clip): void {
    if (includes(clip)) {
      return
    }
    items.value.push(clip)
  }

  /**
   * Remove a clip from the history.
   */
  function remove(clip: Clip): void {
    items.value = items.value.filter((c) => toClipUUID(c) !== toClipUUID(clip))
  }

  /**
   * Pop a clip from the history. I.e used to get the most recent clip in history.
   * @returns A clip if one is in the history, undefined otherwise.
   */
  function pop(): Clip | undefined {
    return items.value.pop()
  }

  /**
   * Check if the history includes a clip.
   * @param clip - The clip to check for.
   * @returns True if the clip is in the history, false otherwise.
   */
  function includes(clip: Clip): boolean {
    return items.value.some((c) => toClipUUID(c) === toClipUUID(clip))
  }

  /**
   * Reset the clip history to its default state.
   */
  function reset(): void {
    items.value = []
  }

  return {
    items,
    length,
    includes,
    add,
    remove,
    pop,
    reset,
  }
})
