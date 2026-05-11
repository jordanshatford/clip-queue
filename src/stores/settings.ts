import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { m } from '@/paraglide/messages'
import { useCommands } from '@/stores/commands'

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
  allowed: string[]
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

export const DEFAULT_APPLICATION_SETTINGS: ApplicationSettings = {
  // TODO(jordan): move to commands.
  prefix: '!cq',
  allowed: [],
  // TODO(jordan): move to sources.
  hasAutoModerationEnabled: true,
  // TODO(jordan): move to queue.
  limit: null,
}

export const useSettings = defineStore(
  'settings',
  () => {
    const application = ref<ApplicationSettings>({ ...DEFAULT_APPLICATION_SETTINGS })

    const isApplicationSettingsModified = computed(() => {
      return (s: ApplicationSettings) => {
        return (
          application.value.prefix !== s.prefix ||
          Object.keys(useCommands().commands).some(
            (cmd) => application.value.allowed.includes(cmd) !== s.allowed.includes(cmd),
          ) ||
          application.value.hasAutoModerationEnabled !== s.hasAutoModerationEnabled ||
          application.value.limit !== s.limit
        )
      }
    })

    const isModified = computed(() => {
      return isApplicationSettingsModified.value(DEFAULT_APPLICATION_SETTINGS)
    })

    function reset(): void {
      application.value = DEFAULT_APPLICATION_SETTINGS
    }

    /**
     * Register commands for the settings.
     */
    useCommands().register(
      {
        id: 'setlimit',
        aliases: ['limit'],
        help: {
          args: [m.number],
          description: m.command_set_limit,
        },
        execute: ({ args }) => {
          if (args[0]) {
            const limit = Number.parseInt(args[0])
            if (Number.isNaN(limit) || limit < 1) {
              return
            }
            application.value.limit = limit
          }
        },
      },
      {
        id: 'removelimit',
        aliases: ['rmlimit'],
        help: {
          description: m.command_remove_limit,
        },
        execute: () => {
          application.value.limit = null
        },
      },
      {
        id: 'enableautomod',
        aliases: ['enableautomoderation', 'automod'],
        help: {
          description: m.command_enable_auto_mod,
        },
        execute: () => {
          application.value.hasAutoModerationEnabled = true
        },
      },
      {
        id: 'disableautomod',
        aliases: ['disableautomoderation', 'dautomod'],
        help: {
          description: m.command_disable_auto_mod,
        },
        execute: () => {
          application.value.hasAutoModerationEnabled = false
        },
      },
    )

    return {
      application,
      isModified,
      isApplicationSettingsModified,
      reset,
    }
  },
  {
    persist: {
      key: 'cq-settings',
    },
  },
)
