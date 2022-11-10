import { defineStore } from "pinia"
import { deepEqual } from "@/utils"

export interface Settings {
  allowCommands: boolean
  commandPrefix: string
  sendMsgsInChat: boolean
  sendQueueOpenMsg: boolean
  queueOpenMsg: string
  sendQueueCloseMsg: boolean
  queueCloseMsg: string
  sendCurrentClipMsg: boolean
  currentClipMsg: string
}

export const DEFAULTS: Settings = {
  allowCommands: true,
  commandPrefix: "!cq",
  sendMsgsInChat: false,
  sendQueueOpenMsg: false,
  queueOpenMsg: "The queue is open, send twitch clip links in chat to have them added to the queue.",
  sendQueueCloseMsg: false,
  queueCloseMsg: "The queue is closed, twitch clip links in chat will be ignored.",
  sendCurrentClipMsg: false,
  currentClipMsg: "The current clip is: {url}",
}

export const useSettings = defineStore("settings", {
  persist: {
    key: "settings",
  },
  state: (): Settings => ({ ...DEFAULTS }),
  getters: {
    isModified: (state) => {
      return (settings: Settings) => {
        /* eslint-disable @typescript-eslint/no-explicit-any*/
        return !deepEqual((state as any).$state, settings)
      }
    },
  },
  actions: {
    update(settings: Settings) {
      this.$patch(settings)
    },
  },
})
