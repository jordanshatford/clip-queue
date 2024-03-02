import { useQueue } from '@/stores/queue'
import { useModeration } from '@/stores/moderation'
import { useProviders } from '@/stores/providers'
import { ClipProvider } from '@/providers'

export enum Command {
  OPEN = 'open',
  CLOSE = 'close',
  CLEAR = 'clear',
  SET_LIMIT = 'setlimit',
  REMOVE_LIMIT = 'removelimit',
  PREV = 'prev',
  NEXT = 'next',
  BLOCK_CHANNEL = 'blockchannel',
  UNBLOCK_CHANNEL = 'unblockchannel',
  BLOCK_SUBMITTER = 'blocksubmitter',
  UNBLOCK_SUBMITTER = 'unblocksubmitter',
  REMOVE_BY_SUBMITTER = 'removebysubmitter',
  REMOVE_BY_CHANNEL = 'removebychannel',
  REMOVE_BY_PROVIDER = 'removebyprovider',
  PURGE_CACHE = 'purgecache',
  PURGE_HISTORY = 'purgehistory'
}

interface CommandHelp {
  description: string
  args?: string[]
}

const help: Record<Command, CommandHelp> = {
  [Command.OPEN]: { description: 'Open the queue, allowing clips to be submitted.' },
  [Command.CLOSE]: { description: 'Close the queue, preventing clips from being submitted.' },
  [Command.CLEAR]: { description: 'Clear all clips in the queue.' },
  [Command.SET_LIMIT]: {
    args: ['number'],
    description: 'Set the limit of clips allowed in the queue.'
  },
  [Command.REMOVE_LIMIT]: { description: 'Remove the clip limit for the queue.' },
  [Command.PREV]: { description: 'Switch to the previous queue clip.' },
  [Command.NEXT]: { description: 'Switch to the next queue clip.' },
  [Command.BLOCK_CHANNEL]: {
    args: ['channel'],
    description: 'Block clips from specified channel.'
  },
  [Command.UNBLOCK_CHANNEL]: {
    args: ['channel'],
    description: 'Unblock clips from specified channel.'
  },
  [Command.BLOCK_SUBMITTER]: {
    args: ['submitter'],
    description: 'Block clips submitted from specified user.'
  },
  [Command.UNBLOCK_SUBMITTER]: {
    args: ['submitter'],
    description: 'Unblock clips submitted from specified user.'
  },
  [Command.REMOVE_BY_SUBMITTER]: {
    args: ['submitter'],
    description:
      'Remove any clips that are in the queue and have been submitted by the given submitter.'
  },
  [Command.REMOVE_BY_CHANNEL]: {
    args: ['channel'],
    description: 'Remove any clips in the queue that are of the given channel.'
  },
  [Command.REMOVE_BY_PROVIDER]: {
    args: ['provider'],
    description: 'Remove any clips in the queue that are from a given provider.'
  },
  [Command.PURGE_CACHE]: {
    description: 'Purge all cached clips.'
  },
  [Command.PURGE_HISTORY]: {
    description: 'Purge all clips previously viewed allowing them to be resubmitted.'
  }
}

export function handleCommand(command: string, ...args: string[]) {
  const queue = useQueue()
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
        queue.setLimit(Number.parseFloat(args[0]))
      }
      break
    }
    case Command.REMOVE_LIMIT: {
      queue.removeLimit()
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
    case Command.BLOCK_CHANNEL: {
      if (args[0]) {
        const moderation = useModeration()
        moderation.addBlockedChannel(args[0])
      }
      break
    }
    case Command.UNBLOCK_CHANNEL: {
      if (args[0]) {
        const moderation = useModeration()
        moderation.removeBlockedChannel(args[0])
      }
      break
    }
    case Command.BLOCK_SUBMITTER: {
      if (args[0]) {
        const moderation = useModeration()
        moderation.addBlockedSubmitter(args[0])
      }
      break
    }
    case Command.UNBLOCK_SUBMITTER: {
      if (args[0]) {
        const moderation = useModeration()
        moderation.removeBlockedSubmitter(args[0])
      }
      break
    }
    case Command.REMOVE_BY_SUBMITTER: {
      if (args[0]) {
        queue.removeSubmitterClips(args[0])
        return
      }
      break
    }
    case Command.REMOVE_BY_CHANNEL: {
      if (args[0]) {
        queue.removeChannelClips(args[0])
        return
      }
      break
    }
    case Command.REMOVE_BY_PROVIDER: {
      if (args[0]) {
        queue.removeProviderClips(args[0] as ClipProvider)
        return
      }
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
