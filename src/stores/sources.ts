import type { ToastMessageOptions } from 'primevue'

import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { IntegrationSource } from '@/integrations/core'

import { chat } from '@/integrations/twitch'
import { m } from '@/paraglide/messages'
import { useProviders } from '@/stores/providers'
import { useUser } from '@/stores/user'

import { useCommands } from './commands'
import { useLogger } from './logger'
import { useQueue } from './queue'

const DEFAULT_AUTOMOD: boolean = true

export const useSources = defineStore('sources', () => {
  const toast = ref<(o: ToastMessageOptions) => void>(() => {})
  const queue = useQueue()
  const logger = useLogger()

  /**
   * Whether auto moderation is enabled.
   *
   * @note This will remove clips when the submitter has their message deleted, or is timed out / banned.
   */
  const hasAutoModEnabled = useStorage<boolean>('__cq_sources_automod', DEFAULT_AUTOMOD)
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
    if (event.data.text.startsWith(commands.prefix)) {
      // Ensure the user is allowed to use commands.
      if (!event.data.isAllowedCommands) {
        logger.debug(
          `[${event.source}]: User ${event.data.username} is not allowed to use commands.`,
        )
        return
      }
      const [command, ...args] = event.data.text.substring(commands.prefix.length).split(' ')
      if (command) {
        if (!commands.enabled.includes(command)) {
          logger.debug(`[${event.source}]: Command ${command} is not enabled or does not exist.`)
          return
        }
        commands.execute({ origin: event, command, args })
      }
      return
    }
    for (const url of event.data.urls) {
      const providers = useProviders()
      try {
        const clip = await providers.getClip(url)
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
    if (!hasAutoModEnabled.value) {
      return
    }
    for (const url of event.data.urls) {
      const providers = useProviders()
      try {
        const clip = await providers.getClip(url)
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
    if (!hasAutoModEnabled.value) {
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
    return hasAutoModEnabled.value !== DEFAULT_AUTOMOD
  })

  /**
   * Reset settings related to this store.
   */
  function resetSettings(): void {
    hasAutoModEnabled.value = DEFAULT_AUTOMOD
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
        hasAutoModEnabled.value = true
      },
    },
    {
      id: 'disableautomod',
      aliases: ['disableautomoderation', 'dautomod'],
      help: {
        description: m.command_disable_auto_mod,
      },
      execute: () => {
        hasAutoModEnabled.value = false
      },
    },
  )

  return { hasAutoModEnabled, onToast, connect, disconnect, isSettingsModified, resetSettings }
})
