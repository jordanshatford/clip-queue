import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import type { ClipSourceEvent, ClipSourceMessage } from '@cq/sources'
import { ClipProvider } from '@cq/providers'

import * as m from '@/paraglide/messages'
import { useLogger } from '@/stores/logger'
import { useProviders } from '@/stores/providers'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'

/**
 * Enumeration of commands.
 */
export enum Command {
  /**
   * Open the queue.
   */
  OPEN = 'open',
  /**
   * Close the queue.
   */
  CLOSE = 'close',
  /**
   * Clear the queue.
   */
  CLEAR = 'clear',
  /**
   * Set the queue limit.
   */
  SET_LIMIT = 'setlimit',
  /**
   * Remove the queue limit.
   */
  REMOVE_LIMIT = 'removelimit',
  /**
   * Go to the previous clip.
   */
  PREV = 'prev',
  /**
   * Go to the next clip.
   */
  NEXT = 'next',
  /**
   * Remove clips in the queue by submitter.
   */
  REMOVE_BY_SUBMITTER = 'removebysubmitter',
  /**
   * Remove clips in the queue by provider.
   */
  REMOVE_BY_PROVIDER = 'removebyprovider',
  /**
   * Enable a provider.
   */
  ENABLE_PROVIDER = 'enableprovider',
  /**
   * Disable a provider.
   */
  DISABLE_PROVIDER = 'disableprovider',
  /**
   * Enable auto moderation.
   */
  ENABLE_AUTO_MODERATION = 'enableautomod',
  /**
   * Disable auto moderation.
   */
  DISABLE_AUTO_MODERATION = 'disableautomod',
  /**
   * Purge the cache.
   */
  PURGE_CACHE = 'purgecache',
  /**
   * Purge the history.
   */
  PURGE_HISTORY = 'purgehistory'
}

/**
 * Help information for a command.
 */
export interface CommandHelp {
  /**
   * The description of the command.
   */
  description: string
  /**
   * The arguments of the command.
   */
  args?: string[]
}

const help: ComputedRef<Record<Command, CommandHelp>> = computed(() => ({
  [Command.OPEN]: { description: m.command_open() },
  [Command.CLOSE]: { description: m.command_close() },
  [Command.CLEAR]: { description: m.command_clear() },
  [Command.SET_LIMIT]: {
    args: [m.number().toLocaleLowerCase()],
    description: m.command_set_limit()
  },
  [Command.REMOVE_LIMIT]: { description: m.command_remove_limit() },
  [Command.PREV]: { description: m.command_previous() },
  [Command.NEXT]: { description: m.command_next() },
  [Command.REMOVE_BY_SUBMITTER]: {
    args: [m.submitter().toLocaleLowerCase()],
    description: m.command_remove_by_submitter()
  },
  [Command.REMOVE_BY_PROVIDER]: {
    args: [m.provider().toLocaleLowerCase()],
    description: m.command_remove_by_provider()
  },
  [Command.ENABLE_PROVIDER]: {
    args: [m.provider().toLocaleLowerCase()],
    description: m.command_enable_provider()
  },
  [Command.DISABLE_PROVIDER]: {
    args: [m.provider().toLocaleLowerCase()],
    description: m.command_disable_provider()
  },
  [Command.ENABLE_AUTO_MODERATION]: {
    description: m.command_enable_auto_mod()
  },
  [Command.DISABLE_AUTO_MODERATION]: {
    description: m.command_disable_auto_mod()
  },
  [Command.PURGE_CACHE]: {
    description: m.command_purge_cache()
  },
  [Command.PURGE_HISTORY]: {
    description: m.command_purge_history()
  }
}))

/**
 * Handles a command.
 * @param event - The event.
 * @param command - The command.
 * @param args - The command arguments.
 */
export function handleCommand(
  event: ClipSourceEvent<ClipSourceMessage>,
  command: string,
  ...args: string[]
): void {
  const logger = useLogger()
  const queue = useQueue()
  const settings = useSettings()

  logger.info(
    `[${event.source}]: ${event.data.username} executed command: ${command} ${args.join(' ')}`
  )

  switch (command as Command) {
    case Command.OPEN: {
      queue.open()
      break
    }
    case Command.CLOSE: {
      queue.close()
      break
    }
    case Command.CLEAR: {
      queue.clear()
      break
    }
    case Command.SET_LIMIT: {
      if (args[0]) {
        const limit = Number.parseInt(args[0])
        if (Number.isNaN(limit) || limit < 1) {
          return
        }
        settings.queue.limit = limit
      }
      break
    }
    case Command.REMOVE_LIMIT: {
      settings.queue.limit = null
      break
    }
    case Command.PREV: {
      queue.previous()
      break
    }
    case Command.NEXT: {
      queue.next()
      break
    }
    case Command.REMOVE_BY_SUBMITTER: {
      if (args[0]) {
        queue.removeSubmitterClips(args[0])
      }
      break
    }
    case Command.REMOVE_BY_PROVIDER: {
      if (args[0]) {
        queue.removeProviderClips(args[0] as ClipProvider)
      }
      break
    }
    case Command.ENABLE_PROVIDER: {
      if (args[0]) {
        const provider = Object.values(ClipProvider).find(
          (p) => p.toLowerCase() === args[0].toLowerCase()
        )
        if (provider && !settings.queue.providers.includes(provider)) {
          settings.queue.providers = [...settings.queue.providers, provider]
        }
      }
      break
    }
    case Command.DISABLE_PROVIDER: {
      if (args[0]) {
        const provider = Object.values(ClipProvider).find(
          (p) => p.toLowerCase() === args[0].toLowerCase()
        )
        if (provider && settings.queue.providers.includes(provider)) {
          settings.queue.providers = settings.queue.providers.filter((p) => p !== provider)
        }
      }
      break
    }
    case Command.ENABLE_AUTO_MODERATION: {
      settings.queue.hasAutoModerationEnabled = true
      break
    }
    case Command.DISABLE_AUTO_MODERATION: {
      settings.queue.hasAutoModerationEnabled = false
      break
    }
    case Command.PURGE_CACHE: {
      const providers = useProviders()
      providers.purge()
      break
    }
    case Command.PURGE_HISTORY: {
      queue.purge()
      break
    }
    default: {
      break
    }
  }
}

export default {
  help,
  handleCommand
}
