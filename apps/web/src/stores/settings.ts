import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { ClipProvider } from '@cq/providers'

import type { LogLevel } from '@/stores/logger'
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

/**
 * Settings for the logger.
 */
export interface LoggerSettings {
  /**
   * The log level of the application.
   */
  level: LogLevel
  /**
   * The maximum number of logs to keep.
   */
  limit: number
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

export const DEFAULT_LOGGER_SETTINGS: LoggerSettings = {
  level: 'WARN',
  limit: 100
}

export const useSettings = defineStore(
  'settings',
  () => {
    const commands = ref<CommandSettings>({ ...DEFAULT_COMMAND_SETTINGS })
    const queue = ref<QueueSettings>({ ...DEFAULT_QUEUE_SETTINGS })
    const logger = ref<LoggerSettings>({ ...DEFAULT_LOGGER_SETTINGS })

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

    const isLoggerSettingsModified = computed(() => {
      return (l: LoggerSettings) => {
        return logger.value.level !== l.level || logger.value.limit !== l.limit
      }
    })

    const isModified = computed(() => {
      return (
        isCommandsSettingsModified.value(DEFAULT_COMMAND_SETTINGS) ||
        isQueueSettingsModified.value(DEFAULT_QUEUE_SETTINGS) ||
        isLoggerSettingsModified.value(DEFAULT_LOGGER_SETTINGS)
      )
    })

    function $reset(): void {
      commands.value = DEFAULT_COMMAND_SETTINGS
      queue.value = DEFAULT_QUEUE_SETTINGS
      logger.value = DEFAULT_LOGGER_SETTINGS
    }

    return {
      commands,
      queue,
      logger,
      isModified,
      isCommandsSettingsModified,
      isQueueSettingsModified,
      isLoggerSettingsModified,
      $reset
    }
  },
  {
    persist: {
      key: 'cq-settings',
      afterHydrate(context) {
        // Ensure that the providers in the settings are valid.
        const providers = context.store.queue.providers
        const availableProviders = Object.values(ClipProvider)
        context.store.queue.providers = providers.filter((p: ClipProvider) => {
          return availableProviders.includes(p)
        })
        // Ensure that the commands allowed are valid.
        const commands = context.store.commands.allowed
        const availableCommands = Object.values(Command)
        context.store.commands.allowed = commands.filter((c: Command) => {
          return availableCommands.includes(c)
        })
      }
    }
  }
)
