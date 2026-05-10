import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import { type Clip, toClipUUID, type IntegrationID } from '@/integrations'
import { m } from '@/paraglide/messages'

import { useCommands } from './commands'

export const useUpcoming = defineStore('upcoming', () => {
  /**
   * List of items upcoming.
   */
  const items = useStorage<Clip[]>('__cq_upcoming_items', [])

  /**
   * Current length of upcoming items.
   */
  const length = computed<number>(() => {
    return items.value.length
  })

  /**
   * Check if the upcoming includes a item.
   * @param clip - The clip to check for.
   * @returns True if the clip is present, false otherwise.
   */
  function includes(clip: Clip): boolean {
    return items.value.some((c) => toClipUUID(c) === toClipUUID(clip))
  }

  /**
   * Add an item to the upcoming list. If not present, we add it directly, otherwise we modify the existing
   * value to include the submitter to the list of the submitters.
   * @param clip - The clip to add to the upcoming list.
   */
  function add(clip: Clip): void {
    if (includes(clip)) {
      const index = items.value.findIndex((c) => toClipUUID(c) === toClipUUID(clip))
      const submitters = items.value[index]?.submitters ?? []
      const submitter = clip.submitters[0]?.toLowerCase()
      const existing = items.value[index]
      if (submitter && !submitters.includes(submitter) && existing !== undefined) {
        existing.submitters = [...submitters, submitter]
        items.value[index] = existing
      }
    } else {
      items.value.push(clip)
    }
    sort()
  }

  /**
   * Unshift an item into the upcoming list.
   * @param clip - The clip to add.
   * @returns The new length of the upcoming list.
   */
  function unshift(clip: Clip): number {
    return items.value.unshift(clip)
  }

  /**
   * Get the first element in the upcoming list.
   * @returns The first clip.
   */
  function shift(): Clip | undefined {
    return items.value.shift()
  }

  /**
   * Remove a clip from the upcoming list.
   * @param clip - The clip to remove.
   */
  function remove(clip: Clip): void {
    const index = items.value.findIndex((c) => toClipUUID(c) === toClipUUID(clip))
    const submitter = clip.submitters[0]?.toLowerCase()
    if (index > -1 && submitter) {
      removeSubmitterFromClip(submitter, index)
      sort()
    }
  }

  /**
   * Remove all items in the upcoming list that where submitted by a given submitter.
   * @param submitter - The submitter to remove.
   */
  function removeBySubmitter(submitter: string): void {
    for (let i = items.value.length - 1; i >= 0; i--) {
      removeSubmitterFromClip(submitter.toLowerCase(), i)
    }
    sort()
  }

  /**
   * Remove all items in the upcoming list that are linked to a given provider.
   * @param provider - The provider to remove.
   */
  function removeByProvider(provider: IntegrationID): void {
    items.value = items.value.filter((c) => c.provider.toLowerCase() !== provider.toLowerCase())
  }

  /**
   * Internal function to sort the upcoming items. Whenever changes are made to the
   * upcoming list, this should be called. All items in the upcoming list will be
   * sorted from most submitters to least.
   */
  function sort(): void {
    items.value = items.value.sort((a, b) => {
      return b.submitters.length - a.submitters.length
    })
  }

  /**
   * Remove a submitter from an item. If this was the last submitter for the item, remove
   * that item completely.
   * @param submitter - The submitter to remove.
   * @param index - The index of the item.
   */
  function removeSubmitterFromClip(submitter: string, index: number): void {
    const existing = items.value[index]
    if (existing?.submitters.includes(submitter)) {
      if (existing.submitters.length === 1) {
        // Remove the clip from the list.
        items.value.splice(index, 1)
      } else if (existing.submitters.length > 1) {
        // Remove only the submitter.
        const submitters = existing.submitters.filter((s) => !(s === submitter))
        existing.submitters = submitters
        items.value[index] = existing
      }
    }
  }

  /**
   * Reset upcoming to its default state.
   */
  function reset(): void {
    items.value = []
  }

  /**
   * Register commands for the upcoming items.
   */
  useCommands().register(
    {
      id: 'clear',
      aliases: ['clr'],
      help: {
        description: m.command_clear,
      },
      execute: () => {
        reset()
      },
    },
    {
      id: 'removebysubmitter',
      aliases: ['rmsubmitter', 'rmsub'],
      help: {
        args: [m.submitter],
        description: m.command_remove_by_submitter,
      },
      execute: ({ args }) => {
        if (args[0]) {
          removeBySubmitter(args[0])
        }
      },
    },
    // TODO(jordan): rename to integration.
    {
      id: 'removebyprovider',
      aliases: ['rmprovider', 'rmp'],
      help: {
        args: [m.provider],
        description: m.command_remove_by_provider,
      },
      execute: ({ args }) => {
        if (args[0]) {
          removeByProvider(args[0] as IntegrationID)
        }
      },
    },
  )

  return {
    items,
    length,
    includes,
    add,
    unshift,
    shift,
    remove,
    removeBySubmitter,
    removeByProvider,
    reset,
  }
})
