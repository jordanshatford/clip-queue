import type { Clip, ClipQueue } from "@/interfaces/clips"
import { useUser } from "@/stores/user"
import { reactive } from "vue"
import { ClipList } from "@/utils/clip-list"
import { useSettings } from "@/stores/settings"
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
  const settings = useSettings()
  /* istanbul ignore next */
  if (settings.sendQueueOpenMsg) {
    const user = useUser()
    user.chat?.sendMessage(settings.queueOpenMsg)
  }
  queue.open = true
}

function close(): void {
  const settings = useSettings()
  /* istanbul ignore next */
  if (settings.sendQueueCloseMsg) {
    const user = useUser()
    user.chat?.sendMessage(settings.queueCloseMsg)
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
  const settings = useSettings()
  if (queue.current?.id && settings.sendMsgsInChat && settings.sendCurrentClipMsg) {
    const valueMappings = {
      title: queue.current?.title ?? "",
      url: queue.current?.url ?? "",
      channel: queue.current?.channel ?? "",
      game: queue.current?.game ?? "",
      submitter: queue.current?.submitter ?? "",
    }
    const user = useUser()
    user.chat?.sendMessage(formatTemplateString(settings.currentClipMsg, valueMappings))
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
