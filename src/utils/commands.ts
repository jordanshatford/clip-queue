import { useClips } from "@/stores/clips"

export const commands: Record<string, () => void> = {
  queueprev: () => {
    const clips = useClips()
    clips.previous()
  },
  queuenext: () => {
    const clips = useClips()
    clips.next()
  },
  queueopen: () => {
    const clips = useClips()
    clips.open()
  },
  queueclose: () => {
    const clips = useClips()
    clips.close()
  },
}
