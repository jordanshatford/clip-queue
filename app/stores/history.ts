import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import { toClipUUID, type Clip } from '@/integrations'
import { m } from '@/paraglide/messages'

import { useCommands } from './commands'

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
    items.value.push(clip)
  }

  /**
   * Remove an item from the history.
   */
  function remove(clip: Clip): void {
    items.value = items.value.filter((c) => toClipUUID(c) !== toClipUUID(clip))
  }

  /**
   * Pop an item from the history. I.e used to get the most recent item in history.
   * @returns A clip if one is in the history, undefined otherwise.
   */
  function pop(): Clip | undefined {
    return items.value.pop()
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
    pop,
    reset,
  }
})
