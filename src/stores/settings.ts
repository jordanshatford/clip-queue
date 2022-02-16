import { defineStore } from "pinia"
import { deepEqual } from "@/utils"

export interface Settings {
  allowCommands: boolean
  commandPrefix: string
  autoRemoveClips: boolean
  sendMsgsInChat: boolean
  sendQueueOpenMsg: boolean
  queueOpenMsg: string
  sendQueueCloseMsg: boolean
  queueCloseMsg: string
  sendCurrentClipMsg: boolean
  currentClipMsg: string
}

const LOCAL_STORAGE_KEY = "settings"

export const useSettings = defineStore("settings", {
  state: (): Settings => ({
    allowCommands: true,
    commandPrefix: "!cq",
    autoRemoveClips: true,
    sendMsgsInChat: false,
    sendQueueOpenMsg: false,
    queueOpenMsg: "The queue is open, send twitch clip links in chat to have them added to the queue.",
    sendQueueCloseMsg: false,
    queueCloseMsg: "The queue is closed, twitch clip links in chat will be ignored.",
    sendCurrentClipMsg: false,
    currentClipMsg: "The current clip is: {url}",
  }),
  getters: {
    isModified: (state) => {
      return (settings: Settings) => {
        /* eslint-disable @typescript-eslint/no-explicit-any*/
        return !deepEqual((state as any).$state, settings)
      }
    },
  },
  actions: {
    init() {
      const localStorageSettings = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (localStorageSettings) {
        const savedSettings: Settings = JSON.parse(localStorageSettings)
        this.$patch(savedSettings)
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state))
    },
    update(settings: Settings) {
      this.$patch(settings)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state))
    },
  },
})
