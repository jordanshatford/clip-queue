import { ClipProvider } from '@cq/providers'

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
  [Command.OPEN]: { description: 'Open the queue.' },
  [Command.CLOSE]: { description: 'Close the queue.' },
  [Command.CLEAR]: { description: 'Remove all clips in the queue.' },
  [Command.SET_LIMIT]: {
    args: ['number'],
    description: 'Set queue size limit.'
  },
  [Command.REMOVE_LIMIT]: { description: 'Remove the queue size limit.' },
  [Command.PREV]: { description: 'Switch to the previous clip.' },
  [Command.NEXT]: { description: 'Switch to the next clip.' },
  [Command.REMOVE_BY_SUBMITTER]: {
    args: ['submitter'],
    description: 'Remove clips sent by the submitter.'
  },
  [Command.REMOVE_BY_PROVIDER]: {
    args: ['provider'],
    description: 'Remove clips from the provider.'
  },
  [Command.ENABLE_PROVIDER]: {
    args: ['provider'],
    description: 'Enable the specified provider.'
  },
  [Command.DISABLE_PROVIDER]: {
    args: ['provider'],
    description: 'Disable the specified provider.'
  },
  [Command.ENABLE_AUTO_MODERATION]: {
    description: 'Enable auto moderation.'
  },
  [Command.DISABLE_AUTO_MODERATION]: {
    description: 'Disable auto moderation.'
  },
  [Command.PURGE_CACHE]: {
    description: 'Purge all cached clips.'
  },
  [Command.PURGE_HISTORY]: {
    description: 'Purge all historically watched clips.'
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
