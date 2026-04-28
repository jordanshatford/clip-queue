import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { LogLevel } from '@/stores/logger'

import { Command } from '@/utils/commands'

/**
 * Settings for the application.
 */
export interface ApplicationSettings {
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

export const DEFAULT_APPLICATION_SETTINGS: ApplicationSettings = {
  prefix: '!cq',
  allowed: Object.values(Command),
  hasAutoModerationEnabled: true,
  limit: null,
}

export const DEFAULT_LOGGER_SETTINGS: LoggerSettings = {
  level: 'WARN',
  limit: 100,
}

export const useSettings = defineStore(
  'settings',
  () => {
    const application = ref<ApplicationSettings>({ ...DEFAULT_APPLICATION_SETTINGS })
    const logger = ref<LoggerSettings>({ ...DEFAULT_LOGGER_SETTINGS })

    const isApplicationSettingsModified = computed(() => {
      return (s: ApplicationSettings) => {
        return (
          application.value.prefix !== s.prefix ||
          Object.values(Command).some(
            (cmd) => application.value.allowed.includes(cmd) !== s.allowed.includes(cmd),
          ) ||
          application.value.hasAutoModerationEnabled !== s.hasAutoModerationEnabled ||
          application.value.limit !== s.limit
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
        isApplicationSettingsModified.value(DEFAULT_APPLICATION_SETTINGS) ||
        isLoggerSettingsModified.value(DEFAULT_LOGGER_SETTINGS)
      )
    })

    function $reset(): void {
      application.value = DEFAULT_APPLICATION_SETTINGS
      logger.value = DEFAULT_LOGGER_SETTINGS
    }

    return {
      application,
      logger,
      isModified,
      isApplicationSettingsModified,
      isLoggerSettingsModified,
      $reset,
    }
  },
  {
    persist: {
      key: 'cq-settings',
      afterHydrate(context) {
        // Ensure that the commands allowed are valid.
        const commands = context.store.application.allowed
        const availableCommands = Object.values(Command)
        context.store.application.allowed = commands.filter((c: Command) => {
          return availableCommands.includes(c)
        })
      },
    },
  },
)
