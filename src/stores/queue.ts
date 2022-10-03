import { defineStore } from "pinia"
import { ClipList } from "@/utils/clip-list"
import type { Clip } from "@/interfaces/clips"
import { useSettings } from "@/stores/settings"
import { useUser } from "@/stores/user"
import { formatTemplateString } from "@/utils"

export interface ClipQueue {
  isOpen: boolean
  history: ClipList
  current: Clip | undefined
  upcoming: ClipList
  blockedChannels: string[]
}

export const LOCAL_STORAGE_KEY = "queue"

export const useQueue = defineStore("queue", {
  state: (): ClipQueue => ({
    isOpen: true,
    history: new ClipList(),
    current: undefined,
    upcoming: new ClipList(),
    blockedChannels: [],
  }),
  actions: {
    init() {
      const localStorageState = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (localStorageState) {
        const savedState: ClipQueue = JSON.parse(localStorageState)
        this.$patch({ ...savedState, current: undefined })
      }
    },
    clear() {
      const limit = this.upcoming.limit
      this.upcoming = new ClipList()
      this.upcoming.limit = limit
    },
    purge() {
      this.history = new ClipList()
    },
    add(clip: Clip, force = false) {
      // Ignore clip when queue isnt open
      if (!this.open && !force) {
        return
      }
      // Ignore when the submitter is blocked from adding to the queue
      if (this.blockedChannels.some((c) => c.toLowerCase() === clip.channel?.toLowerCase())) {
        return
      }
      // Ignore when we have previously watched it
      const hasBeenWatched = this.current?.id === clip.id || this.history.includes(clip)
      if (hasBeenWatched) {
        return
      }
      this.upcoming.add(clip)
    },
    remove(clip: Clip) {
      this.upcoming.remove(clip)
    },
    removeSubmitterClips(submitter: string) {
      this.upcoming.removeBySubmitter(submitter)
    },
    play(clip: Clip) {
      if (!this.upcoming.includes(clip)) {
        return
      }
      if (this.current?.id) {
        this.history.add(this.current)
      }
      this.upcoming.remove(clip)
      this.current = clip
      this.sendCurrentClipInfoMessageIfNeeded()
    },
    open() {
      const settings = useSettings()
      /* istanbul ignore next */
      if (settings.sendQueueOpenMsg) {
        const user = useUser()
        user.chat?.sendMessage(settings.queueOpenMsg)
      }
      this.isOpen = true
    },
    close() {
      const settings = useSettings()
      /* istanbul ignore next */
      if (settings.sendQueueCloseMsg) {
        const user = useUser()
        user.chat?.sendMessage(settings.queueCloseMsg)
      }
      this.isOpen = false
    },
    previous() {
      if (this.current?.id) {
        this.upcoming.unshift(this.current)
      }
      this.current = this.history.pop()
    },
    next() {
      if (this.current?.id) {
        this.history.add(this.current)
      }
      this.current = this.upcoming.shift()
      this.sendCurrentClipInfoMessageIfNeeded()
    },
    sendCurrentClipInfoMessageIfNeeded() {
      const settings = useSettings()
      if (this.current?.id && settings.sendMsgsInChat && settings.sendCurrentClipMsg) {
        const valueMappings = {
          title: this.current?.title ?? "",
          url: this.current?.url ?? "",
          channel: this.current?.channel ?? "",
          game: this.current?.game ?? "",
          submitter: this.current?.submitter ?? "",
        }
        const user = useUser()
        user.chat?.sendMessage(formatTemplateString(settings.currentClipMsg, valueMappings))
      }
    },
  },
})
