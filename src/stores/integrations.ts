import { defineStore } from 'pinia'
import { computed, type Reactive } from 'vue'

import {
  IntegrationID,
  type IntegrationProvider,
  integrations,
  type Clip,
  type Integration,
} from '@/integrations'
import { m } from '@/paraglide/messages'
import { useLogger } from '@/stores/logger'

import { useCommands } from './commands'

/**
 * Composable for unifying all interactions with integrations.
 */
export const useIntegrations = defineStore('integrations', () => {
  const logger = useLogger()

  /**
   * Get an integration based on an integration ID. If authentication, source, or a provider in an
   * integration matches that ID, it will return the parent integration.
   * @param id - The integration ID.
   * @returns A integration if one exists related to the ID, undefined otherwise.
   */
  const integration = computed<(id: IntegrationID) => Reactive<Integration> | undefined>(() => {
    return (id: IntegrationID) => {
      for (const integration of integrations) {
        if (
          integration.id === id ||
          integration.authentication?.id === id ||
          integration.source?.id === id
        ) {
          return integration
        }
        for (const provider of integration.providers) {
          if (provider.id === id) {
            return integration
          }
        }
      }
    }
  })

  /**
   * Get an integration provider using its ID.
   * @param id - The integration ID of the provider.
   * @returns A provider if one exists with that ID, undefined otherwise.
   */
  const provider = computed<(id: IntegrationID) => Reactive<IntegrationProvider> | undefined>(
    () => {
      return (id: IntegrationID) => {
        for (const integration of integrations) {
          for (const provider of integration.providers) {
            if (provider.id === id) {
              return provider
            }
          }
        }
      }
    },
  )

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
        description: () => 'TODO(jordan)',
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
        description: () => 'TODO(jordan)',
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
  )

  return {
    integration,
    provider,
    resolve,
    hasCachedData,
    clearCache,
  }
})
