import { StorageSerializers, useStorage } from '@vueuse/core'

import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'

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
  const settings = usePeristedSettings<QueueSettings>('queue', DEFAULT_QUEUE_SETTINGS)
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
    if (!settings.state.value.open) {
      return
    }
    // Ignore when we have previously watched it
    const hasBeenWatched =
      (current.value && useClip(current.value).value.equals(clip)) || history.includes(clip)
    if (hasBeenWatched && !settings.state.value.duplicates) {
      return
    }
    // Queue is full based on limit
    if (settings.state.value.limit && upcoming.length >= settings.state.value.limit) {
      // If the clip is already in the queue add it so submitters is updated
      if (!upcoming.includes(clip)) {
        return
      }
    }
    upcoming.add(clip)
  }

  function remove(clip: Clip, force: boolean = false) {
    upcoming.remove(clip, force)
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
    settings.state.value.open = true
  }

  function close() {
    settings.state.value.open = false
  }

  function previous() {
    if (current.value?.id) {
      // Add the current value back to the queue.
      upcoming.add(current.value)
    }
    const last = history.shift()
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
   * Register commands for the queue.
   */
  useCommands().register(
    {
      id: 'open',
      help: {
        description: m.command_open,
      },
      execute: () => {
        open()
      },
    },
    {
      id: 'close',
      help: {
        description: m.command_close,
      },
      execute: () => {
        close()
      },
    },
    {
      id: 'previous',
      help: {
        description: m.command_previous,
      },
      execute: () => {
        previous()
      },
    },
    {
      id: 'next',
      help: {
        description: m.command_next,
      },
      execute: () => {
        next()
      },
    },
    {
      id: 'allowduplicates',
      help: {
        args: [booleanish_arg],
        description: m.allow_duplicates_description,
      },
      execute: ({ args }) => {
        const value = booleanish(args[0])
        if (value !== undefined) {
          settings.state.value.duplicates = value
        }
      },
    },
    {
      id: 'sizelimit',
      help: {
        args: [optional_arg(m.number)],
        description: m.size_limit_description,
      },
      execute: ({ args }) => {
        const value = args[0]?.toLowerCase()
        if (value !== undefined) {
          const v = booleanish(value)
          if (v !== undefined && v === false) {
            settings.state.value.limit = null
            return
          }
          const limit = Number.parseInt(value)
          if (Number.isNaN(limit) || limit < 1) {
            return
          }
          settings.state.value.limit = limit
        }
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
  }
})
