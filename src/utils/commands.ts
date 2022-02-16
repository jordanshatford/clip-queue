import { useQueue } from "@/stores/queue"

export enum Command {
  OPEN = "open",
  CLOSE = "close",
  PREV = "prev",
  NEXT = "next",
}

export const help: Record<Command, string> = {
  [Command.OPEN]: "Open the queue, allowing clips to be submitted.",
  [Command.CLOSE]: "Close the queue, preventing clips from being submitted.",
  [Command.PREV]: "Switch to the previous queue clip.",
  [Command.NEXT]: "Switch to the next queue clip.",
}

/* eslint-disable @typescript-eslint/no-unused-vars*/
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
    default: {
      break
    }
  }
}

export default {
  help,
  handleCommand,
}
