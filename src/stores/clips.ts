import TwitchChat from "@/services/twitch-chat"
import type { Clip, ClipQueue } from "@/interfaces/clips"
import { reactive } from "vue"
import { ClipList } from "@/utils/clip-list"
import { settings } from "@/stores/settings"
import { formatTemplateString } from "@/utils/formatter"

const queue = reactive<ClipQueue>({
  open: true,
  history: new ClipList(),
  current: undefined,
  upcoming: new ClipList(),
})

function reset(): void {
  queue.open = true
  queue.history = new ClipList()
  queue.current = undefined
  queue.upcoming = new ClipList()
}

function addClip(clip: Clip, force = false): void {
  const duplicateClip = queue?.current?.id === clip.id || queue.history.includes(clip) || queue.upcoming.includes(clip)
  if (duplicateClip || (!queue.open && !force)) {
    return
  }
  queue.upcoming.add(clip)
}

function playNow(clip: Clip): void {
  if (!queue.upcoming.includes(clip)) {
    return
  }
  if (queue?.current?.id) {
    queue.history.add(queue.current)
  }
  queue.upcoming.remove(clip)
  queue.current = clip
  sendCurrentClipInfoMessageIfNeeded()
}

function removeClip(clip: Clip): void {
  queue.upcoming.remove(clip)
}

function removeUserClips(submitter: string): void {
  queue.upcoming.removeBySubmitter(submitter)
}

function open(): void {
  /* istanbul ignore next */
  if (settings.current.sendQueueOpenMsg) {
    TwitchChat.sendMessage(settings.current.queueOpenMsg)
  }
  queue.open = true
}

function close(): void {
  /* istanbul ignore next */
  if (settings.current.sendQueueCloseMsg) {
    TwitchChat.sendMessage(settings.current.queueCloseMsg)
  }
  queue.open = false
}

function previous(): void {
  if (queue?.current?.id) {
    queue.upcoming.unshift(queue.current)
  }
  queue.current = queue.history.pop()
}

function next(): void {
  if (queue?.current?.id) {
    queue.history.add(queue.current)
  }
  queue.current = queue.upcoming.shift()
  sendCurrentClipInfoMessageIfNeeded()
}

/* istanbul ignore next */
function sendCurrentClipInfoMessageIfNeeded() {
  if (queue.current?.id && settings.current.sendMsgsInChat && settings.current.sendCurrentClipMsg) {
    const valueMappings = {
      title: queue.current?.title ?? "",
      url: queue.current?.url ?? "",
      channel: queue.current?.channel ?? "",
      game: queue.current?.game ?? "",
      submitter: queue.current?.submitter ?? "",
    }
    TwitchChat.sendMessage(formatTemplateString(settings.current.currentClipMsg, valueMappings))
  }
}

export const clips = {
  queue,
  reset,
  addClip,
  playNow,
  removeClip,
  removeUserClips,
  open,
  close,
  previous,
  next,
}
