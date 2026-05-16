import type { BadgeProps } from '@nuxt/ui'

import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import { m } from '@/paraglide/messages'

/**
 * Log levels.
 */
export type LogLevel = 'OFF' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

/**
 * The available log levels ordered from lowest to highest severity.
 */
export const availableLogLevels: LogLevel[] = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG'] as const

/**
 * Log level mappings to NuxtUI icon.
 * @see https://ui.nuxt.com/docs/components/icon#usage
 */
export const logLevelIcons: Record<LogLevel, BadgeProps['icon']> = {
  OFF: '',
  DEBUG: 'lucide:code',
  INFO: 'lucide:info',
  WARN: 'lucide:triangle-alert',
  ERROR: 'lucide:circle-alert',
}

/**
 * Log level mappings to PrimeVue severities.
 */
export const logLevelSeverities: Record<LogLevel, BadgeProps['color']> = {
  OFF: 'neutral',
  DEBUG: 'neutral',
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'error',
}

/**
 * Log level mappings to translations.
 */
export const logLevelTranslations: Record<LogLevel, () => string> = {
  OFF: m.off,
  DEBUG: m.debug,
  INFO: m.info,
  WARN: m.warning,
  ERROR: m.error,
}

/**
 * Log level mappings to console methods.
 */
export const logLevelConsole: Record<LogLevel, (message: string) => void> = {
  OFF: () => {},
  DEBUG: console.debug,
  INFO: console.info,
  WARN: console.warn,
  ERROR: console.error,
}

/**
 * Interface for a log.
 */
export interface Log {
  /**
   * The timestamp of the log.
   */
  timestamp: string
  /**
   * The log level.
   */
  level: LogLevel
  /**
   * The log message.
   */
  message: string
}

/**
 * Settings related to logger store.
 */
export interface LoggerSettings {
  /**
   * The minimum log level to log.
   */
  level: LogLevel
  /**
   * The number of logs stored.
   */
  limit: number
}

export const DEFAULT_SETTINGS: LoggerSettings = {
  level: 'WARN',
  limit: 100,
}

export const useLogger = defineStore('logger', () => {
  /**
   * Settings related to the logger.
   */
  const settings = useStorage<LoggerSettings>(
    '__cq_logger_settings',
    structuredClone(DEFAULT_SETTINGS),
    undefined,
    { mergeDefaults: true },
  )
  const logs = useStorage<Log[]>('__cq_logger_logs', [])

  function handle(level: LogLevel, message: string) {
    const log = { level, message, timestamp: new Date().toISOString() }
    const logIndex = availableLogLevels.indexOf(level)
    const settingsIndex = availableLogLevels.indexOf(settings.value.level)
    const warnIndex = availableLogLevels.indexOf('WARN')
    // Log the message to the console if configured to do so, or if the log level is WARN or higher.
    if (logIndex <= settingsIndex || logIndex <= warnIndex) {
      logLevelConsole[level](`[${log.level}] (${log.timestamp}): ${log.message}`)
    }
    // Store the log if required based on the configured settings.
    if (logIndex <= settingsIndex) {
      logs.value.unshift(log)
      // Remove the oldest item if the array is too long.
      while (logs.value.length > settings.value.limit) {
        logs.value.pop()
      }
    }
  }

  function reset() {
    logs.value = []
  }

  /**
   * Determine if the settings are modified.
   */
  const isSettingsModified = computed(() => {
    return (
      settings.value.level !== DEFAULT_SETTINGS.level ||
      settings.value.limit !== DEFAULT_SETTINGS.limit
    )
  })

  /**
   * Reset settings related to this store.
   */
  function resetSettings(): void {
    settings.value = structuredClone(DEFAULT_SETTINGS)
  }

  return {
    settings,
    logs,
    debug: (message: string) => handle('DEBUG', message),
    info: (message: string) => handle('INFO', message),
    warn: (message: string) => handle('WARN', message),
    error: (message: string) => handle('ERROR', message),
    reset,
    isSettingsModified,
    resetSettings,
  }
})
