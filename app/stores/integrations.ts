import type { Reactive } from 'vue'

import type { IntegrationID, IntegrationProvider, Clip, Integration } from '~/integrations'
import type {
  IntegrationSource,
  IntegrationSourceEvent,
  IntegrationSourceMessageEvent,
  IntegrationSourceModerationEvent,
} from '~/integrations/core'

import { m } from '#paraglide/messages'
import { integrations } from '~/integrations'
import { toSubmitterUUID } from '~/integrations/core'

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

  const isInitialized = ref<boolean>(false)

  /**
   * Settings related to integrations.
   */
  const settings = usePeristedSettings<IntegrationSettings>(
    'integrations',
    DEFAULT_INTEGRATION_SETTINGS,
  )

  /**
   * Get an integration based on an integration ID. If authentication, source, or a provider in an
   * integration matches that ID, it will return the parent integration.
   * @param id - The integration ID.
   * @returns A integration if one exists related to the ID, undefined otherwise.
   */
  function integration(id: IntegrationID): Integration | undefined {
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
  function source(id: IntegrationID): IntegrationSource | undefined {
    for (const integration of integrations) {
      if (integration.source && (integration.id === id || integration.source.id === id)) {
        return integration.source
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
    if (event.data.text.startsWith(commands.settings.state.prefix)) {
      // Ensure the user is allowed to use commands.
      if (!event.data.isAllowedCommands) {
        logger.debug(
          `[${event.source}]: User ${event.data.username} is not allowed to use commands.`,
        )
        return
      }
      const [command, ...args] = event.data.text
        .substring(commands.settings.state.prefix.length)
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
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        logger.error(`[${event.source}]: Failed to get clip: ${message}.`)
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
    if (!settings.state.value.automod) {
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
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        logger.error(`[${event.source}]: Failed to get clip: ${message}.`)
      }
    }
  }

  /**
   * Handle an integration source moderation event.
   * @param event - The integration source moderation event.
   */
  function handleIntegrationSourceModeration(event: IntegrationSourceModerationEvent): void {
    if (!settings.state.value.automod) {
      return
    }
    const submitter = toSubmitterUUID(event.source, event.data.username)
    const queue = useQueue()
    queue.upcoming.removeBySubmitter(submitter)
  }

  /**
   * Handle an integration source error event by logging it in our application logs.
   * @param event - The integration source error event.
   */
  function handleIntegrationSourceError(event: IntegrationSourceEvent<string>): void {
    logger.error(`[${event.source}]: ${event.data}.`)
  }

  /**
   * Initialize all integrations. In most cases this is attempting to auto login them in
   * and then connect to any source they may provide.
   */
  async function initialize(): Promise<void> {
    if (isInitialized.value) {
      return
    }

    // Configure listeners for all relevant events from each source. I.e ensure that all sources
    // pipe into the main handling functions for messages, moderation, connection, and errors.
    for (const integration of integrations) {
      if (integration.source) {
        integration.source.on('connected', handleIntegrationSourceConnected)
        integration.source.on('disconnected', handleIntegrationSourceDisconnected)
        integration.source.on('message', handleIntegrationSourceMessage)
        integration.source.on('message-deleted', handleIntegrationSourceMessageDeleted)
        integration.source.on('moderation', handleIntegrationSourceModeration)
        integration.source.on('error', handleIntegrationSourceError)
      }
    }

    logger.debug('[Auth]: Attempting auto-login initialization.')
    // Attempt to auto-login to all integrations and connect to their sources if successful.
    await Promise.all(
      integrations.map(async (integration) => {
        try {
          logger.debug(`[Integrations]: Auto-logging in to ${integration.name}.`)
          await integration.authentication?.autoLogin()
          if (integration.authentication?.isLoggedIn) {
            logger.debug(`[Integrations]: Connecting to ${integration.name} source.`)
            await integration.source?.connect()
          }
        } catch {
          // Ignore per-integration failure.
        }
      }),
    )
  }

  /**
   * If the user is currently logged in to any integration.
   * @returns true if some integration is logged in, false otherwise.
   */
  const isLoggedIn = computed<boolean>(() => {
    return integrations.some((integration) => integration.authentication?.isLoggedIn)
  })

  /**
   * Logout of a given integration.
   * @param id - The ID of the integration.
   */
  async function logout(id: IntegrationID): Promise<void> {
    const int = integration(id)
    logger.debug(`[Integrations]: Disconnecting from ${int?.name} source.`)
    await int?.source?.disconnect()
    logger.debug(`[Integrations]: Logging out of ${int?.name} integration.`)
    await int?.authentication?.logout()
    if (!isLoggedIn.value) {
      navigateTo('/')
    }
  }

  /**
   * Logout of all integrations.
   */
  async function logoutAll(): Promise<void> {
    await Promise.all(
      integrations.map(async (integration) => {
        if (integration.authentication?.isLoggedIn) {
          await integration.source?.disconnect?.()
          await integration.authentication.logout()
        }
      }),
    )
    await navigateTo('/')
  }

  /**
   * Attempt to resolve a URL to a clip.
   * @param url - The URL of a potential clip.
   * @returns A Clip if one was found, undefined otherwise.
   */
  async function resolve(url: string): Promise<Clip | undefined> {
    for (const integration of integrations) {
      if (!(integration?.isEnabled ?? true)) {
        continue
      }
      for (const provider of integration.providers) {
        if (!provider.isEnabled || !provider.hasSupportForUrl(url)) {
          continue
        }
        try {
          const clip = await provider.resolveUrl(url)
          return clip
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          logger.error(`[${provider.id}]: ${message}`)
          continue
        }
      }
    }
  }

  /**
   * Register commands for handling integrations.
   */
  useCommands().register({
    id: 'automod',
    help: {
      description: m.auto_mod_description,
      args: [booleanish_arg],
    },
    execute: ({ args }) => {
      const value = booleanish(args[0])
      if (value !== undefined) {
        settings.state.value.automod = value
      }
    },
  })

  return {
    integrations,
    integration,
    source,
    provider,
    initialize,
    isLoggedIn,
    logout,
    logoutAll,
    resolve,
    settings,
  }
})
