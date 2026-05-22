import { useStorage } from '@vueuse/core'

import { m } from '#paraglide/messages'
import { toClipUUID, type Clip } from '~/integrations'

/**
 * Only track this many items in the history at any given time.
 */
const MAX_HISTORY_LIMIT: number = 100
/**
 * Number of elements to remove when the max history limit is hit. This helps
 * limit the number of add and removals with quick history usage.
 */
const HISTORY_LIMIT_REMOVE: number = 5

/**
 * Store used for tracking history. Contains information about items previously watched.
 */
export const useHistory = defineStore('history', () => {
  /**
   * List of items in the history.
   */
  const items = useStorage<Clip[]>('__cq_history_items', [])

  /**
   * Current length of the history.
   */
  const length = computed<number>(() => {
    return items.value.length
  })

  /**
   * Check if the history includes a item.
   * @param clip - The clip to check for.
   * @returns True if the clip is in the history, false otherwise.
   */
  function includes(clip: Clip): boolean {
    return items.value.some((c) => toClipUUID(c) === toClipUUID(clip))
  }

  /**
   * Add an item to the history if not already present.
   * @param clip - The clip to add to the history.
   */
  function add(clip: Clip): void {
    if (includes(clip)) {
      return
    }
    items.value.unshift(clip)
    // Cleanup some of the history
    if (items.value.length > MAX_HISTORY_LIMIT) {
      items.value.splice(-HISTORY_LIMIT_REMOVE)
    }
  }

  /**
   * Remove an item from the history.
   */
  function remove(clip: Clip): void {
    items.value = items.value.filter((c) => toClipUUID(c) !== toClipUUID(clip))
  }

  /**
   * Shift an item from the history. I.e used to get the most recent item in history.
   * @returns A clip if one is in the history, undefined otherwise.
   */
  function shift(): Clip | undefined {
    return items.value.shift()
  }

  /**
   * Reset the history to its default state.
   */
  function reset(): void {
    items.value = []
  }

  /**
   * Register commands for the history.
   */
  useCommands().register({
    id: 'purgehistory',
    aliases: ['rmhistory'],
    help: {
      description: m.command_purge_history,
    },
    execute: () => {
      reset()
    },
  })

  return {
    items,
    length,
    includes,
    add,
    remove,
    shift,
    reset,
  }
})
