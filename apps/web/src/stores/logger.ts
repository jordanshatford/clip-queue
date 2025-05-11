import { defineStore } from 'pinia'
import { ref } from 'vue'

import { m } from '@/paraglide/messages'
import { useSettings } from './settings'

/**
 * Log levels.
 */
export type LogLevel = 'OFF' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

/**
 * The available log levels ordered from lowest to highest severity.
 */
export const availableLogLevels: LogLevel[] = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG'] as const

/**
 * Log level mappings to PrimeVue icons.
 * @see https://primefaces.org/primeicons/
 */
export const logLevelIcons: Record<LogLevel, string> = {
  OFF: '',
  DEBUG: 'pi pi-code',
  INFO: 'pi pi-info-circle',
  WARN: 'pi pi-exclamation-triangle',
  ERROR: 'pi pi-times-circle'
}

/**
 * Log level mappings to PrimeVue severities.
 */
export const logLevelSeverities: Record<LogLevel, string> = {
  OFF: 'secondary',
  DEBUG: 'secondary',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'danger'
}

/**
 * Log level mappings to translations.
 */
export const logLevelTranslations: Record<LogLevel, () => string> = {
  OFF: m.off,
  DEBUG: m.debug,
  INFO: m.info,
  WARN: m.warning,
  ERROR: m.error
}

/**
 * Log level mappings to console methods.
 */
export const logLevelConsole: Record<LogLevel, (message: string) => void> = {
  OFF: () => {},
  DEBUG: console.debug,
  INFO: console.info,
  WARN: console.warn,
  ERROR: console.error
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

export const useLogger = defineStore(
  'logger',
  () => {
    const settings = useSettings()
    const logs = ref<Log[]>([])

    function timestamp() {
      return new Date().toISOString()
    }

    function handle(level: LogLevel, message: string) {
      const log = { level, message, timestamp: timestamp() }
      const logIndex = availableLogLevels.indexOf(level)
      const settingsIndex = availableLogLevels.indexOf(settings.logger.level)
      const warnIndex = availableLogLevels.indexOf('WARN')
      // Log the message to the console if configured to do so, or if the log level is WARN or higher.
      if (logIndex <= settingsIndex || logIndex <= warnIndex) {
        logLevelConsole[level](`[${log.level}] (${log.timestamp}): ${log.message}`)
      }
      // Store the log if required based on the users settings.
      if (logIndex <= settingsIndex) {
        logs.value.unshift(log)
        // Remove the oldest item if the array is too long.
        if (logs.value.length > settings.logger.limit) {
          logs.value.pop()
        }
      }
    }

    function $reset() {
      logs.value = []
    }

    return {
      logs,
      debug: (message: string) => handle('DEBUG', message),
      info: (message: string) => handle('INFO', message),
      warn: (message: string) => handle('WARN', message),
      error: (message: string) => handle('ERROR', message),
      $reset
    }
  },
  {
    persist: {
      key: 'cq-logger'
    }
  }
)
