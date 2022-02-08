import type { ClipList } from "@/utils/clip-list"

export interface Clip {
  id?: string
  title?: string
  channel?: string
  game?: string
  timestamp?: string
  submitter?: string
  url?: string
  thumbnailUrl?: string
}

export interface ClipQueue {
  open: boolean
  history: ClipList
  current: Clip | undefined
  upcoming: ClipList
}
