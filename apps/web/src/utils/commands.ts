import { ClipProvider } from '@cq/providers'

import * as m from '@/paraglide/messages'
import { useProviders } from '@/stores/providers'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'

export enum Command {
  OPEN = 'open',
  CLOSE = 'close',
  CLEAR = 'clear',
  SET_LIMIT = 'setlimit',
  REMOVE_LIMIT = 'removelimit',
  PREV = 'prev',
  NEXT = 'next',
  REMOVE_BY_SUBMITTER = 'removebysubmitter',
  REMOVE_BY_PROVIDER = 'removebyprovider',
  ENABLE_PROVIDER = 'enableprovider',
  DISABLE_PROVIDER = 'disableprovider',
  ENABLE_AUTO_MODERATION = 'enableautomod',
  DISABLE_AUTO_MODERATION = 'disableautomod',
  PURGE_CACHE = 'purgecache',
  PURGE_HISTORY = 'purgehistory'
}

export interface CommandHelp {
  description: string
  args?: string[]
}

const help: Record<Command, CommandHelp> = {
  [Command.OPEN]: { description: m.command_open() },
  [Command.CLOSE]: { description: m.command_close() },
  [Command.CLEAR]: { description: m.command_clear() },
  [Command.SET_LIMIT]: {
    args: ['number'],
    description: m.command_set_limit()
  },
  [Command.REMOVE_LIMIT]: { description: m.command_remove_limit() },
  [Command.PREV]: { description: m.command_previous() },
  [Command.NEXT]: { description: m.command_next() },
  [Command.REMOVE_BY_SUBMITTER]: {
    args: ['submitter'],
    description: m.command_remove_by_submitter()
  },
  [Command.REMOVE_BY_PROVIDER]: {
    args: ['provider'],
    description: m.command_remove_by_provider()
  },
  [Command.ENABLE_PROVIDER]: {
    args: ['provider'],
    description: m.command_enable_provider()
  },
  [Command.DISABLE_PROVIDER]: {
    args: ['provider'],
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
}

export function handleCommand(command: string, ...args: string[]) {
  const queue = useQueue()
  const settings = useSettings()
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
      const queue = useQueue()
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
