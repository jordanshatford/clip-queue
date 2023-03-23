import { useQueue } from '@/stores/queue'
import { useModeration } from '@/stores/moderation'

export enum Command {
  OPEN = 'open',
  CLOSE = 'close',
  CLEAR = 'clear',
  SET_LIMIT = 'setlimit',
  REMOVE_LIMIT = 'removelimit',
  PREV = 'prev',
  NEXT = 'next',
  BLOCK_CHANNEL = 'blockchannel',
  UNBLOCK_CHANNEL = 'unblockchannel'
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
    default: {
      break
    }
  }
}

export default {
  help,
  handleCommand
}
