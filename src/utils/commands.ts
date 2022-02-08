import { clips } from "@/stores/clips"

export const commands: Record<string, () => void> = {
  queueprev: () => clips.previous(),
  queuenext: () => clips.next(),
  queueopen: () => clips.open(),
  queueclose: () => clips.close(),
}
