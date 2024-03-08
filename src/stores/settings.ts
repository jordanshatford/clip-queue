import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Settings {
  allowCommands: boolean
  commandPrefix: string
}

export const DEFAULTS: Settings = {
  allowCommands: true,
  commandPrefix: '!cq'
}

export const useSettings = defineStore(
  'settings',
  () => {
    const allowCommands = ref<boolean>(DEFAULTS.allowCommands)
    const commandPrefix = ref<string>(DEFAULTS.commandPrefix)

    const isModified = computed(() => {
      return (settings: Settings) => {
        return (
          allowCommands.value !== settings.allowCommands ||
          commandPrefix.value !== settings.commandPrefix
        )
      }
    })

    function update(settings: Settings) {
      allowCommands.value = settings.allowCommands
      commandPrefix.value = settings.commandPrefix
    }

    return {
      allowCommands,
      commandPrefix,
      isModified,
      update
    }
  },
  { persist: { key: 'settings' } }
)
