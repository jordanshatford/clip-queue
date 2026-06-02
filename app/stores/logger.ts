import type { BadgeProps } from '@nuxt/ui'

import { useStorage } from '@vueuse/core'

import { m } from '#paraglide/messages'
import { datetime } from '#paraglide/registry'

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
 * Log level mappings to NuxtUI severities.
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

export const DEFAULT_LOGGER_SETTINGS: LoggerSettings = {
  level: 'WARN',
  limit: 100,
}

export const useLogger = defineStore('logger', () => {
  const preferences = usePreferences()
  /**
   * Settings related to the logger.
   */
  const settings = usePeristedSettings<LoggerSettings>('logger', DEFAULT_LOGGER_SETTINGS)
  /**
   * Logs current available.
   */
  const logs = useStorage<Log[]>('__cq_logger_logs', [])
  /**
   * Logs as a text string available for copying.
   */
  const text = computed<string>(() => {
    return logs.value.map((log) => format(log)).join('\n')
  })

  /**
   * Format the timestamp of a log.
   * @param timestamp - The timestamp to format.
   * @param locale - The locale to use when formatting.
   * @param options - The format options to apply.
   * @returns String representing the formatted timestamp.
   */
  function formatTimestamp(
    timestamp: string,
    locale = preferences.locale,
    options: Intl.DateTimeFormatOptions = {
      dateStyle: 'short',
      timeStyle: 'medium',
      hour12: false,
    },
  ): string {
    return datetime(locale, timestamp, options)
  }

  /**
   * Format a log to a string for printing in the console or copying to the clipboard.
   * @param log - The log to format.
   * @returns String representing the formatted log.
   */
  function format(log: Log): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }
    return `[${log.level.padEnd(5, ' ')}] (${formatTimestamp(log.timestamp, 'en', options)}): ${log.message}`
  }

  /**
   * Handle a logged message.
   * @param level - The level of the log.
   * @param message - The message for the log.
   */
  function handle(level: LogLevel, message: string): void {
    const log = { level, message, timestamp: new Date().toISOString() }
    const logIndex = availableLogLevels.indexOf(level)
    const settingsIndex = availableLogLevels.indexOf(settings.state.value.level)
    const warnIndex = availableLogLevels.indexOf('WARN')
    // Log the message to the console if configured to do so, or if the log level is WARN or higher.
    if (logIndex <= settingsIndex || logIndex <= warnIndex) {
      logLevelConsole[level](format(log))
    }
    // Store the log if required based on the configured settings.
    if (logIndex <= settingsIndex) {
      logs.value.unshift(log)
      // Remove the oldest item if the array is too long.
      while (logs.value.length > settings.state.value.limit) {
        logs.value.pop()
      }
    }
  }

  /**
   * Reset all tracked logs.
   */
  function reset(): void {
    logs.value = []
  }

  return {
    settings,
    logs,
    text,
    debug: (message: string) => handle('DEBUG', message),
    info: (message: string) => handle('INFO', message),
    warn: (message: string) => handle('WARN', message),
    error: (message: string) => handle('ERROR', message),
    formatTimestamp,
    reset,
  }
})
