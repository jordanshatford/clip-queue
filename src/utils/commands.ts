import { useQueue } from "@/stores/queue"

export const commands: Record<string, () => void> = {
  queueprev: () => {
    const queue = useQueue()
    queue.previous()
  },
  queuenext: () => {
    const queue = useQueue()
    queue.next()
  },
  queueopen: () => {
    const queue = useQueue()
    queue.open()
  },
  queueclose: () => {
    const queue = useQueue()
    queue.close()
  },
}
