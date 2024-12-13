import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { ClipProvider } from '@cq/providers'

import { Command } from '@/utils/commands'

export interface CommandSettings {
  // Prefix for chat commands.
  prefix: string
  // Commands allowed to be used in chat.
  allowed: Command[]
}

export interface QueueSettings {
  // Auto remove clips when the submitter has there message deleted, or is timed out / banned.
  hasAutoModerationEnabled: boolean
  // Limit of clips allowed in queue at one time.
  limit: number | null
  // Allowed clip providers (Kick, Twitch, Etc.)
  providers: ClipProvider[]
}

export const DEFAULT_COMMAND_SETTINGS: CommandSettings = {
  prefix: '!cq',
  allowed: Object.values(Command)
}

export const DEFAULT_QUEUE_SETTINGS: QueueSettings = {
  hasAutoModerationEnabled: true,
  limit: null,
  providers: Object.values(ClipProvider)
}

export const useSettings = defineStore(
  'settings',
  () => {
    const commands = ref<CommandSettings>({ ...DEFAULT_COMMAND_SETTINGS })
    const queue = ref<QueueSettings>({ ...DEFAULT_QUEUE_SETTINGS })

    const isCommandsSettingsModified = computed(() => {
      return (c: CommandSettings) => {
        return (
          commands.value.prefix !== c.prefix ||
          Object.values(Command).some(
            (cmd) => commands.value.allowed.includes(cmd) !== c.allowed.includes(cmd)
          )
        )
      }
    })

    const isQueueSettingsModified = computed(() => {
      return (q: QueueSettings) => {
        return (
          queue.value.hasAutoModerationEnabled !== q.hasAutoModerationEnabled ||
          queue.value.limit !== q.limit ||
          Object.values(ClipProvider).some(
            (p) => queue.value.providers.includes(p) !== q.providers.includes(p)
          )
        )
      }
    })

    const isModified = computed(() => {
      return (
        isCommandsSettingsModified.value(DEFAULT_COMMAND_SETTINGS) ||
        isQueueSettingsModified.value(DEFAULT_QUEUE_SETTINGS)
      )
    })

    function $reset() {
      commands.value = DEFAULT_COMMAND_SETTINGS
      queue.value = DEFAULT_QUEUE_SETTINGS
    }

    return {
      commands,
      queue,
      isModified,
      isCommandsSettingsModified,
      isQueueSettingsModified,
      $reset
    }
  },
  {
    persist: {
      key: 'cq-settings'
    }
  }
)
