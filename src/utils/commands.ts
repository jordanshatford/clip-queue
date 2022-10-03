import { useQueue } from "@/stores/queue"

export enum Command {
  OPEN = "open",
  CLOSE = "close",
  PREV = "prev",
  NEXT = "next",
  BLOCK_CHANNEL = "blockchannel",
  UNBLOCK_CHANNEL = "unblockchannel",
}

export const help: Record<Command, string> = {
  [Command.OPEN]: "Open the queue, allowing clips to be submitted.",
  [Command.CLOSE]: "Close the queue, preventing clips from being submitted.",
  [Command.PREV]: "Switch to the previous queue clip.",
  [Command.NEXT]: "Switch to the next queue clip.",
  [Command.BLOCK_CHANNEL]: "Block clips from specified channel.",
  [Command.UNBLOCK_CHANNEL]: "Unblock clips from specified channel.",
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
        queue.blockChannel(args[0])
      }
      break
    }
    case Command.UNBLOCK_CHANNEL: {
      if (args[0]) {
        queue.unblockChannel(args[0])
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
  handleCommand,
}
