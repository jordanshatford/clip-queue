import type { Reactive } from 'vue'

import { useStorage } from '@vueuse/core'

import { m } from '#paraglide/messages'
import {
  IntegrationID,
  type IntegrationProvider,
  integrations,
  type Clip,
  type Integration,
} from '~/integrations'
import {
  IntegrationStatus,
  toSubmitterUUID,
  type IntegrationSource,
  type IntegrationSourceEvent,
  type IntegrationSourceMessageEvent,
  type IntegrationSourceModerationEvent,
} from '~/integrations/core'

/**
 * Settings related to the integrations store.
 */
export interface IntegrationSettings {
  /**
   * Whether auto moderation is enabled.
   *
   * @note This will remove clips when the submitter has their message deleted, or is timed out / banned.
   */
  automod: boolean
}

export const DEFAULT_INTEGRATION_SETTINGS: IntegrationSettings = {
  automod: true,
}

/**
 * Composable for unifying all interactions with integrations.
 */
export const useIntegrations = defineStore('integrations', () => {
  const toast = useToast()
  const logger = useLogger()

  /**
   * Settings related to integrations.
   */
  const settings = useStorage<IntegrationSettings>(
    '__cq_integrations_settings',
    structuredClone(DEFAULT_INTEGRATION_SETTINGS),
    undefined,
    { mergeDefaults: true },
  )

  /**
   * Determine if the integrations are currently loading.
   */
  const isLoading = computed<boolean>(() => {
    return integrations.some((integration) => {
      if (!integration.isEnabled) {
        return false
      }
      if (integration.source && integration.source.isEnabled) {
        return integration.source.status !== IntegrationStatus.HEALTHY
      }
      return false
    })
  })

  /**
   * Get an integration based on an integration ID. If authentication, source, or a provider in an
   * integration matches that ID, it will return the parent integration.
   * @param id - The integration ID.
   * @returns A integration if one exists related to the ID, undefined otherwise.
   */
  function integration(id: IntegrationID): Reactive<Integration> | undefined {
    return integrations.find(
      (integration) =>
        integration.id === id ||
        integration.authentication?.id === id ||
        integration.source?.id === id ||
        integration.providers.some((provider) => provider.id === id),
    )
  }

  /**
   * Get an integration provider using its ID.
   * @param id - The integration ID of the provider.
   * @returns A provider if one exists with that ID, undefined otherwise.
   */
  function provider(id: IntegrationID): Reactive<IntegrationProvider> | undefined {
    for (const integration of integrations) {
      const provider = integration.providers.find((p) => p.id === id)
      if (provider) {
        return provider
      }
    }
  }

  /**
   * Get an integration source using its ID.
   * @param id - The integration ID of the source or parent integration.
   * @returns A source if one exists with that ID, undefined otherwise.
   */
  function source(id: IntegrationID): Reactive<IntegrationSource> | undefined {
    for (const integration of integrations) {
      if (integration.source && (integration.id === id || integration.source.id === id)) {
        return integration.source
      }
    }
  }

  /**
   * Check if any integrations have cached data.
   * @returns true if there is cached data, false otherwise.
   */
  const hasCachedData = computed<boolean>(() => {
    return integrations.some((integration) =>
      integration.providers.some((provider) => provider.hasCachedData),
    )
  })

  /**
   * Clear all integrations cache.
   */
  function clearCache(): void {
    for (const integration of integrations) {
      logger.info(`[Integrations]: clearing cache for ${integration.name}.`)
      for (const provider of integration.providers) {
        provider.clearCache()
      }
    }
  }

  /**
   * Attempt to resolve a URL to a clip.
   * @param url - The URL of a potential clip.
   * @returns A Clip if one was found, undefined otherwise.
   */
  async function resolve(url: string): Promise<Clip | undefined> {
    for (const integration of integrations) {
      if (!integration.isEnabled) {
        continue
      }
      for (const provider of integration.providers) {
        if (!provider.isEnabled || !provider.hasClipSupport(url)) {
          continue
        }
        try {
          const clip = await provider.getClip(url)
          return clip
        } catch (error) {
          logger.error(`${error}`)
          continue
        }
      }
    }
  }

  /**
   * Handle an integration source connected event.
   * @param event - The integration source connected event.
   */
  function handleIntegrationSourceConnected(event: IntegrationSourceEvent<string>): void {
    logger.info(`[${event.source}]: Connected to ${event.data}.`)
    toast.add({
      icon: 'lucide:circle-check',
      color: 'success',
      title: m.success(),
      description: m.connected_to_source_name({
        source: source(event.source)?.name ?? event.source,
        name: event.data,
      }),
    })
  }

  /**
   * Handle an integration source disconnected event.
   * @param event - The integration source disconnected event.
   */
  function handleIntegrationSourceDisconnected(
    event: IntegrationSourceEvent<string | undefined>,
  ): void {
    if (event.data) {
      logger.info(`[${event.source}]: Disconnected due to ${event.data}.`)
    } else {
      logger.info(`[${event.source}]: Disconnected.`)
    }
    toast.add({
      icon: 'lucide:circle-alert',
      color: 'error',
      title: m.error(),
      description: m.disconnected_from_source({
        source: source(event.source)?.name ?? event.source,
      }),
    })
  }

  /**
   * Handle an integration source message event.
   * @param event - The integration source message event.
   */
  async function handleIntegrationSourceMessage(
    event: IntegrationSourceMessageEvent,
  ): Promise<void> {
    const queue = useQueue()
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
        if (!commands.isEnabled(command)) {
          logger.debug(`[${event.source}]: Command ${command} is not enabled or does not exist.`)
          return
        }
        commands.execute({ origin: event, command, args })
      }
      return
    }
    for (const url of event.data.urls) {
      try {
        const clip = await resolve(url)
        const submitter = toSubmitterUUID(event.source, event.data.username)
        if (clip) {
          queue.add({
            ...clip,
            submitters: [submitter],
          })
        }
      } catch (e) {
        logger.error(`[${event.source}]: Failed to get clip: ${e}.`)
      }
    }
  }

  /**
   * Handle an integration source message deleted event.
   * @param event - The integration source message deleted event.
   */
  async function handleIntegrationSourceMessageDeleted(
    event: IntegrationSourceMessageEvent,
  ): Promise<void> {
    const queue = useQueue()
    if (!settings.value.automod) {
      return
    }
    for (const url of event.data.urls) {
      try {
        const clip = await resolve(url)
        const submitter = toSubmitterUUID(event.source, event.data.username)
        if (clip) {
          queue.remove({
            ...clip,
            submitters: [submitter],
          })
        }
      } catch (e) {
        logger.error(`[${event.source}]: Failed to get clip: ${e}.`)
      }
    }
  }

  /**
   * Handle an integration source moderation event.
   * @param event - The integration source moderation event.
   */
  function handleIntegrationSourceModeration(event: IntegrationSourceModerationEvent): void {
    if (!settings.value.automod) {
      return
    }
    const username = event.data.username
    const queue = useQueue()
    queue.upcoming.removeBySubmitter(username)
  }

  /**
   * Handle an integration source error event by logging it in our application logs.
   * @param event - The integration source error event.
   */
  function handleIntegrationSourceError(event: IntegrationSourceEvent<string>): void {
    logger.error(`[${event.source}]: ${event.data}.`)
  }

  /**
   * Configure all sources related to integrations.
   */
  async function configureSources(): Promise<void> {
    for (const integration of integrations) {
      if (integration.source) {
        // Configure listeners for all relevant events from each source.
        integration.source.on('connected', handleIntegrationSourceConnected)
        integration.source.on('disconnected', handleIntegrationSourceDisconnected)
        integration.source.on('message', handleIntegrationSourceMessage)
        integration.source.on('message-deleted', handleIntegrationSourceMessageDeleted)
        integration.source.on('moderation', handleIntegrationSourceModeration)
        integration.source.on('error', handleIntegrationSourceError)
      }
    }
  }

  /**
   * Connect all sources related to integrations.
   */
  async function connectSources(): Promise<void> {
    logger.debug(`[Integrations]: Connecting to integration sources.`)
    for (const integration of integrations) {
      if (!integration.isEnabled) {
        continue
      }
      if (integration.source && integration.authentication?.isLoggedIn) {
        logger.debug(`[Integrations]: Connecting to ${integration.source.name}.`)
        await integration.source.connect()
      }
    }
  }

  /**
   * Disconnect all sources related to integrations.
   */
  async function disconnectSources(): Promise<void> {
    logger.debug(`[Integrations]: Disconnecting from integration sources.`)
    for (const integration of integrations) {
      if (!integration.isEnabled) {
        continue
      }
      if (integration.source) {
        logger.debug(`[Integrations]: Disconnecting from ${integration.source.name} source.`)
        await integration.source.disconnect()
      }
    }
  }

  /**
   * Determine if the settings are modified.
   */
  const isSettingsModified = computed(() => {
    return settings.value.automod !== DEFAULT_INTEGRATION_SETTINGS.automod
  })

  /**
   * Reset settings related to this store.
   */
  function resetSettings(): void {
    settings.value = structuredClone(DEFAULT_INTEGRATION_SETTINGS)
  }

  /**
   * Handle updating an integration enabled state based on a command.
   * @param args - The arguments passed with the command.
   * @param enabled - The enabled state to set.
   */
  function handleEnableCommand(args: string[], enabled: boolean): void {
    // Ensure the ID passed to the command is a valid integration ID.
    const id = Object.values(IntegrationID).find(
      (int) => int.toLowerCase() === args[0]?.toLowerCase(),
    )
    if (!id) {
      return
    }

    // Find the integration, source, or provider that matches the ID and set
    // its enabled state appropriately.
    for (const integration of integrations) {
      if (integration.id === id) {
        integration.isEnabled = enabled
        return
      }
      if (integration.source?.id === id) {
        integration.source.isEnabled = enabled
        return
      }
      for (const provider of integration.providers) {
        if (provider.id === id) {
          provider.isEnabled = enabled
          return
        }
      }
    }
  }

  /**
   * Register commands for handling integrations.
   */
  useCommands().register(
    {
      id: 'enableintegration',
      aliases: ['enableint'],
      help: {
        args: [m.integration],
        description: m.command_enable_integration,
      },
      execute: ({ args }) => {
        handleEnableCommand(args, true)
      },
    },
    {
      id: 'disableintegration',
      aliases: ['disableint'],
      help: {
        args: [m.integration],
        description: m.command_disable_integration,
      },
      execute: ({ args }) => {
        handleEnableCommand(args, false)
      },
    },
    {
      id: 'resetcache',
      aliases: ['rmcache'],
      help: {
        description: m.command_reset_cache,
      },
      execute: () => {
        clearCache()
      },
    },
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

  return {
    integrations,
    isLoading,
    integration,
    source,
    provider,
    configureSources,
    connectSources,
    disconnectSources,
    resolve,
    hasCachedData,
    clearCache,
    settings,
    isSettingsModified,
    resetSettings,
  }
})
