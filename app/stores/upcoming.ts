import { useStorage } from '@vueuse/core'

import type { Clip, IntegrationID } from '~/integrations'

import { m } from '#paraglide/messages'
import { toSubmitterUUID } from '~/integrations/core'

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
   * Display for count of upcoming items. If the value is greater than 999 it will
   * simplify and display as 999+.
   */
  const display = computed<string>(() => {
    return length.value > 999 ? '999+' : `${length.value}`
  })

  /**
   * Check if the upcoming includes a item.
   * @param clip - The clip to check for.
   * @returns True if the clip is present, false otherwise.
   */
  function includes(clip: Clip): boolean {
    return items.value.some((c) => useClip(c).value.equals(clip))
  }

  /**
   * Add an item to the upcoming list. If not present, we add it directly, otherwise we modify the existing
   * value to include the submitter to the list of the submitters.
   * @param clip - The clip to add to the upcoming list.
   */
  function add(clip: Clip): void {
    if (includes(clip)) {
      const index = items.value.findIndex((c) => useClip(c).value.equals(clip))
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
   * Get the first element in the upcoming list.
   * @returns The first clip.
   */
  function shift(): Clip | undefined {
    return items.value.shift()
  }

  /**
   * Remove a clip from the upcoming list.
   * @param clip - The clip to remove.
   * @param force - If the clip should be forcefully removed.
   */
  function remove(clip: Clip, force: boolean = false): void {
    if (force) {
      items.value = items.value.filter((c) => !useClip(c).value.equals(clip))
      return
    }
    const index = items.value.findIndex((c) => useClip(c).value.equals(clip))
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
      id: 'clearupcoming',
      help: {
        description: m.command_clear,
      },
      execute: () => reset(),
    },
    {
      id: 'removebysubmitter',
      help: {
        args: [m.submitter],
        description: m.command_remove_by_submitter,
      },
      execute: ({ origin, args }) => {
        const username = args[0]
        if (origin && username) {
          removeBySubmitter(toSubmitterUUID(origin.source, username))
        }
      },
    },
  )

  return {
    items,
    length,
    display,
    includes,
    add,
    shift,
    remove,
    removeBySubmitter,
    reset,
  }
})
