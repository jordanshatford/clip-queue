import { defineStore } from "pinia"

export interface Settings {
  commandPrefix: string
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
    commandPrefix: "!",
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
        return !(
          state.commandPrefix === settings.commandPrefix &&
          state.sendMsgsInChat === settings.sendMsgsInChat &&
          state.sendQueueOpenMsg === settings.sendQueueOpenMsg &&
          state.queueOpenMsg === settings.queueOpenMsg &&
          state.sendQueueCloseMsg === settings.sendQueueCloseMsg &&
          state.queueCloseMsg === settings.queueCloseMsg &&
          state.sendCurrentClipMsg === settings.sendCurrentClipMsg &&
          state.currentClipMsg === settings.currentClipMsg
        )
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
