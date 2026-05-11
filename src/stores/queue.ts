import { StorageSerializers, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import type { Clip } from '@/integrations'

import { toClipUUID } from '@/integrations/core'
import { m } from '@/paraglide/messages'
import { useCommands } from '@/stores/commands'
import { useHistory } from '@/stores/history'
import { useLogger } from '@/stores/logger'
import { useUpcoming } from '@/stores/upcoming'

const DEFAULT_LIMIT: number | null = null

export const useQueue = defineStore('queue', () => {
  const logger = useLogger()

  const history = useHistory()
  const upcoming = useUpcoming()

  /**
   * The limit of clips in the queue.
   *
   * @example 10
   * @note null means no limit.
   */
  const limit = useStorage<number | null>('__cq_queue_limit', DEFAULT_LIMIT)
  const isOpen = useStorage<boolean>('__cq_queue_isopen', true)
  const current = useStorage<Clip | null>('__cq_queue_current', null, undefined, {
    serializer: StorageSerializers.object,
  })

  function clear() {
    logger.info('[Queue]: Clearing upcoming queue.')
    upcoming.reset()
  }

  function purge() {
    logger.info('[Queue]: Purging queue history.')
    history.reset()
  }

  function add(clip: Clip, force = false) {
    // Force add the clip
    if (force) {
      upcoming.add(clip)
      return
    }
    // Ignore clip when queue isnt open
    if (!isOpen.value) {
      return
    }
    // Ignore when we have previously watched it
    const hasBeenWatched =
      (current.value && toClipUUID(current.value) === toClipUUID(clip)) || history.includes(clip)
    if (hasBeenWatched) {
      return
    }
    // Queue is full based on limit
    if (limit.value && upcoming.length >= limit.value) {
      // If the clip is already in the queue add it so submitters is updated
      if (!upcoming.includes(clip)) {
        return
      }
    }
    upcoming.add(clip)
  }

  function remove(clip: Clip) {
    upcoming.remove(clip)
  }

  function play(clip: Clip) {
    if (!upcoming.includes(clip)) {
      return
    }
    if (current.value?.id) {
      history.add(current.value)
    }
    upcoming.remove(clip)
    current.value = clip
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function previous() {
    if (current.value?.id) {
      upcoming.unshift(current.value)
    }
    const last = history.pop()
    if (last) {
      current.value = last
    } else {
      current.value = null
    }
  }

  function next() {
    if (current.value?.id) {
      history.add(current.value)
    }
    const next = upcoming.shift()
    if (next) {
      current.value = next
    } else {
      current.value = null
    }
  }

  /**
   * Reset queue to its default state.
   */
  function reset(): void {
    isOpen.value = true
    current.value = null
  }

  /**
   * Determine if the settings are modified.
   */
  const isSettingsModified = computed(() => {
    return limit.value !== DEFAULT_LIMIT
  })

  /**
   * Reset settings related to this store.
   */
  function resetSettings(): void {
    limit.value = DEFAULT_LIMIT
  }

  /**
   * Register commands for the queue.
   */
  useCommands().register(
    {
      id: 'open',
      aliases: ['o'],
      help: {
        description: m.command_open,
      },
      execute: () => {
        open()
      },
    },
    {
      id: 'close',
      aliases: ['c'],
      help: {
        description: m.command_close,
      },
      execute: () => {
        close()
      },
    },
    {
      id: 'previous',
      aliases: ['back', 'prev', 'last'],
      help: {
        description: m.command_previous,
      },
      execute: () => {
        previous()
      },
    },
    {
      id: 'next',
      aliases: ['forward'],
      help: {
        description: m.command_next,
      },
      execute: () => {
        next()
      },
    },
    {
      id: 'setlimit',
      aliases: ['limit'],
      help: {
        args: [m.number],
        description: m.command_set_limit,
      },
      execute: ({ args }) => {
        if (args[0]) {
          const l = Number.parseInt(args[0])
          if (Number.isNaN(l) || l < 1) {
            return
          }
          limit.value = l
        }
      },
    },
    {
      id: 'removelimit',
      aliases: ['rmlimit'],
      help: {
        description: m.command_remove_limit,
      },
      execute: () => {
        limit.value = null
      },
    },
  )

  return {
    limit,
    isOpen,
    history,
    current,
    upcoming,
    clear,
    purge,
    add,
    remove,
    play,
    open,
    close,
    previous,
    next,
    reset,
    isSettingsModified,
    resetSettings,
  }
})
