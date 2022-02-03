import { reactive } from "vue";
import config from "@/assets/config";
import type { Settings } from "@/interfaces/settings";

const { localStorageKey, defaultValue } = config.App.Settings;

const current = reactive<Settings>(defaultValue);

function init(): void {
  const localStorageSettings = localStorage.getItem(localStorageKey);
  if (localStorageSettings) {
    const savedSettings: Settings = JSON.parse(localStorageSettings);
    updateCurrentValues(savedSettings);
  }
  localStorage.setItem(localStorageKey, JSON.stringify(current));
}

function update(settings: Settings): void {
  updateCurrentValues(settings);
  localStorage.setItem(localStorageKey, JSON.stringify(current));
}

function updateCurrentValues(settings: Settings): void {
  if ("chatCommandPrefix" in settings) {
    current.chatCommandPrefix = settings.chatCommandPrefix;
  }
  if ("sendMessagesInChat" in settings) {
    current.sendMessagesInChat = settings.sendMessagesInChat;
  }
  if ("queueOpenMessage" in settings) {
    current.queueOpenMessage = settings.queueOpenMessage;
  }
  if ("queueCloseMessage" in settings) {
    current.queueCloseMessage = settings.queueCloseMessage;
  }
}

export const settings = {
  current,
  init,
  update,
};
