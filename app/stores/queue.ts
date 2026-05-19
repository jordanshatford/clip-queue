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

/**
 * Settings related to queue store.
 */
export interface QueueSettings {
  /**
   * If the queue is open.
   */
  open: boolean
  /**
   * The limit of clips in the queue.
   *
   * @example 10
   * @note null means no limit.
   */
  limit: number | null
  /**
   * If the queue should block duplicate clips from being added to the queue.
   */
  duplicates: boolean
}

export const DEFAULT_QUEUE_SETTINGS: QueueSettings = {
  open: true,
  limit: null,
  duplicates: false,
}

export const useQueue = defineStore('queue', () => {
  const logger = useLogger()
  const history = useHistory()
  const upcoming = useUpcoming()

  /**
   * Settings related to the queue.
   */
  const settings = useStorage<QueueSettings>(
    '__cq_queue_settings',
    structuredClone(DEFAULT_QUEUE_SETTINGS),
    undefined,
    { mergeDefaults: true },
  )
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
    if (!settings.value.open) {
      return
    }
    // Ignore when we have previously watched it
    const hasBeenWatched =
      (current.value && toClipUUID(current.value) === toClipUUID(clip)) || history.includes(clip)
    if (hasBeenWatched && !settings.value.duplicates) {
      return
    }
    // Queue is full based on limit
    if (settings.value.limit && upcoming.length >= settings.value.limit) {
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
    settings.value.open = true
  }

  function close() {
    settings.value.open = false
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
    current.value = null
  }

  /**
   * Determine if the settings are modified.
   */
  const isSettingsModified = computed(() => {
    return (
      settings.value.open !== DEFAULT_QUEUE_SETTINGS.open ||
      settings.value.limit !== DEFAULT_QUEUE_SETTINGS.limit
    )
  })

  /**
   * Reset settings related to this store.
   */
  function resetSettings(): void {
    settings.value = structuredClone(DEFAULT_QUEUE_SETTINGS)
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
          const limit = Number.parseInt(args[0])
          if (Number.isNaN(limit) || limit < 1) {
            return
          }
          settings.value.limit = limit
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
        settings.value.limit = null
      },
    },
  )

  return {
    settings,
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
