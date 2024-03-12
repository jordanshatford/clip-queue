import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ClipProvider } from '@/providers'

export interface CommandSettings {
  // If chat commands are enabled.
  enabled: boolean
  // Prefix for chat commands.
  prefix: string
}

export interface QueueSettings {
  // Auto remove clips when the submitter has there message deleted, or is timed out / banned.
  hasAutoModerationEnabled: boolean
  // Limit of clips allowed in queue at one time.
  limit: number | null
  // Allowed clip providers (Kick, Twitch, Etc.)
  providers: ClipProvider[]
}

export const DEFAULTS: { commands: CommandSettings; queue: QueueSettings } = {
  commands: {
    enabled: true,
    prefix: '!cq'
  },
  queue: {
    hasAutoModerationEnabled: true,
    limit: null,
    providers: Object.values(ClipProvider)
  }
}

export const useSettings = defineStore(
  'settings',
  () => {
    const commands = ref<CommandSettings>({ ...DEFAULTS.commands })
    const queue = ref<QueueSettings>({ ...DEFAULTS.queue })

    const isCommandsSettingsModified = computed(() => {
      return (c: CommandSettings) => {
        return commands.value.enabled !== c.enabled || commands.value.prefix !== c.prefix
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
        isCommandsSettingsModified.value(DEFAULTS.commands) ||
        isQueueSettingsModified.value(DEFAULTS.queue)
      )
    })

    function $reset() {
      commands.value = DEFAULTS.commands
      queue.value = DEFAULTS.queue
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
