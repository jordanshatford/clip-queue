import { reactive } from "vue"
import config from "@/assets/config"
import type { Settings } from "@/interfaces/settings"

const { localStorageKey, defaultValue } = config.App.Settings

const current = reactive<Settings>(defaultValue)

function init(): void {
  const localStorageSettings = localStorage.getItem(localStorageKey)
  if (localStorageSettings) {
    const savedSettings: Settings = JSON.parse(localStorageSettings)
    updateCurrentValues(savedSettings)
  }
  localStorage.setItem(localStorageKey, JSON.stringify(current))
}

function update(settings: Settings): void {
  updateCurrentValues(settings)
  localStorage.setItem(localStorageKey, JSON.stringify(current))
}

function updateCurrentValues(settings: Settings): void {
  current.commandPrefix = settings.commandPrefix
  current.sendMsgsInChat = settings.sendMsgsInChat
  current.sendQueueOpenMsg = settings.sendQueueOpenMsg
  current.queueOpenMsg = settings.queueOpenMsg
  current.sendQueueCloseMsg = settings.sendQueueCloseMsg
  current.queueCloseMsg = settings.queueCloseMsg
  current.sendCurrentClipMsg = settings.sendCurrentClipMsg
}

export const settings = {
  current,
  init,
  update,
}
