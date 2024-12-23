import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { ClipProvider } from '@cq/providers'

import { Command } from '@/utils/commands'

/**
 * Settings for commands.
 */
export interface CommandSettings {
  /**
   * The prefix for commands.
   *
   * @example !cq
   */
  prefix: string
  /**
   * The commands allowed to be used.
   */
  allowed: Command[]
}

/**
 * Settings for the queue.
 */
export interface QueueSettings {
  /**
   * Whether auto moderation is enabled.
   *
   * @note This will remove clips when the submitter has their message deleted, or is timed out / banned.
   */
  hasAutoModerationEnabled: boolean
  /**
   * The limit of clips in the queue.
   *
   * @example 10
   * @note null means no limit.
   */
  limit: number | null
  /**
   * The providers allowed to be used for clips.
   */
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
