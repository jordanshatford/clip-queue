import type { ToastMessageOptions } from 'primevue'

import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { IntegrationSource } from '@/integrations/core'

import { chat } from '@/integrations/twitch'
import { m } from '@/paraglide/messages'
import { useUser } from '@/stores/user'

import { useCommands } from './commands'
import { useIntegrations } from './integrations'
import { useLogger } from './logger'
import { useQueue } from './queue'

/**
 * Settings related to sources store.
 */
export interface SourcesSettings {
  /**
   * Whether auto moderation is enabled.
   *
   * @note This will remove clips when the submitter has their message deleted, or is timed out / banned.
   */
  automod: boolean
}

export const DEFAULT_SETTINGS: SourcesSettings = {
  automod: true,
}

export const useSources = defineStore('sources', () => {
  const toast = ref<(o: ToastMessageOptions) => void>(() => {})
  const queue = useQueue()
  const logger = useLogger()

  /**
   * Settings related to sources.
   */
  const settings = useStorage<SourcesSettings>(
    '__cq_sources_settings',
    structuredClone(DEFAULT_SETTINGS),
    undefined,
    { mergeDefaults: true },
  )

  const source = ref<IntegrationSource>(chat)

  // Configure listeners for all source events required for the application.
  source.value.on('connected', (event) => {
    logger.debug(`[${event.source}]: Connected to ${event.data}.`)
    toast.value({
      severity: 'success',
      summary: m.success(),
      detail: m.connected_to_source_name({
        source: source.value.name,
        name: event.data,
      }),
      life: 3000,
    })
  })
  source.value.on('disconnected', (event) => {
    if (event.data) {
      logger.debug(`[${event.source}]: Disconnected due to ${event.data}.`)
    } else {
      logger.debug(`[${event.source}]: Disconnected.`)
    }
    toast.value({
      severity: 'error',
      summary: m.error(),
      detail: m.disconnected_from_source({
        source: source.value.name,
      }),
      life: 3000,
    })
  })
  source.value.on('message', async (event) => {
    const commands = useCommands()
    // Check if message is a command and perform command if proper permission to do so
    if (event.data.text.startsWith(commands.settings.prefix)) {
      // Ensure the user is allowed to use commands.
      if (!event.data.isAllowedCommands) {
        logger.debug(
          `[${event.source}]: User ${event.data.username} is not allowed to use commands.`,
        )
        return
      }
      const [command, ...args] = event.data.text
        .substring(commands.settings.prefix.length)
        .split(' ')
      if (command) {
        if (!commands.settings.enabled.includes(command)) {
          logger.debug(`[${event.source}]: Command ${command} is not enabled or does not exist.`)
          return
        }
        commands.execute({ origin: event, command, args })
      }
      return
    }
    for (const url of event.data.urls) {
      const integrations = useIntegrations()
      try {
        const clip = await integrations.resolve(url)
        if (clip) {
          queue.add({
            ...clip,
            submitters: [event.data.username],
          })
        }
      } catch (e) {
        logger.error(`[${event.source}]: Failed to get clip: ${e}.`)
      }
    }
  })
  source.value.on('message-deleted', async (event) => {
    if (!settings.value.automod) {
      return
    }
    for (const url of event.data.urls) {
      const integrations = useIntegrations()
      try {
        const clip = await integrations.resolve(url)
        if (clip) {
          queue.remove({
            ...clip,
            submitters: [event.data.username],
          })
        }
      } catch (e) {
        logger.error(`[${event.source}]: Failed to get clip: ${e}.`)
      }
    }
  })
  source.value.on('moderation', (event) => {
    if (!settings.value.automod) {
      return
    }
    const username = event.data.username
    queue.upcoming.removeBySubmitter(username)
  })
  source.value.on('error', (event) => {
    logger.error(`[${event.source}]: ${event.data}.`)
  })

  function onToast(callback: (options: ToastMessageOptions) => void): void {
    toast.value = callback
  }

  async function connect(): Promise<void> {
    const username = useUser().details?.name
    logger.debug(`[Sources]: Connecting to source for user: ${username}.`)
    if (username) {
      await source.value.connect(username)
    }
  }

  async function disconnect(): Promise<void> {
    const username = useUser().details?.name
    logger.debug(`[Sources]: Disconnecting from source for user: ${username}.`)
    await source.value.disconnect()
  }

  /**
   * Determine if the settings are modified.
   */
  const isSettingsModified = computed(() => {
    return settings.value.automod !== DEFAULT_SETTINGS.automod
  })

  /**
   * Reset settings related to this store.
   */
  function resetSettings(): void {
    settings.value = structuredClone(DEFAULT_SETTINGS)
  }

  /**
   * Register commands for the sources.
   */
  useCommands().register(
    {
      id: 'enableautomod',
      aliases: ['enableautomoderation', 'automod'],
      help: {
        description: m.command_enable_auto_mod,
      },
      execute: () => {
        settings.value.automod = true
      },
    },
    {
      id: 'disableautomod',
      aliases: ['disableautomoderation', 'dautomod'],
      help: {
        description: m.command_disable_auto_mod,
      },
      execute: () => {
        settings.value.automod = false
      },
    },
  )

  return { settings, onToast, connect, disconnect, isSettingsModified, resetSettings }
})
