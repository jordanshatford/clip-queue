import { defineStore } from 'pinia'
import { computed, type Reactive } from 'vue'

import type { PlayerConfig } from '@/integrations/core'

import { type Clip, IntegrationID, type IntegrationProvider, integrations } from '@/integrations'
import { m } from '@/paraglide/messages'
import { useLogger } from '@/stores/logger'

import { useCommands } from './commands'

export const useProviders = defineStore('providers', () => {
  const logger = useLogger()

  const providers = computed((): Reactive<IntegrationProvider>[] =>
    integrations.filter((i) => i.isEnabled).flatMap((i) => i.providers),
  )

  const provider = computed(() => {
    return (id: IntegrationID) => {
      return providers.value.find((p) => p.id === id)
    }
  })

  const name = computed(() => {
    return (id: IntegrationID) => {
      return provider.value(id)?.name
    }
  })

  const icon = computed(() => {
    return (id: IntegrationID) => {
      for (const integration of integrations) {
        for (const provider of integration.providers) {
          if (provider.id === id) {
            return integration.icon
          }
        }
      }
    }
  })

  const isExperimental = computed(() => {
    return (id: IntegrationID) => {
      return provider.value(id)?.isExperimental
    }
  })

  const hasCachedData = computed(() => {
    return providers.value.some((p) => p.hasCachedData)
  })

  function purge(): void {
    for (const provider of providers.value) {
      logger.info(`[Providers]: Purging cache for provider: ${provider.name}.`)
      provider.clearCache()
    }
  }

  async function getClip(url: string): Promise<Clip | undefined> {
    for (const provider of providers.value) {
      if (!provider.isEnabled) {
        continue
      }
      if (!provider.hasClipSupport(url)) {
        continue
      }
      try {
        const clip = await provider.getClip(url)
        logger.debug(`[${provider.name}]: Successfully retrieved clip for URL: ${url}.`)
        return clip
      } catch (error) {
        logger.error(`${error}`)
        continue
      }
    }
  }

  function getPlayerConfig(clip: Clip): PlayerConfig | undefined {
    const p = provider.value(clip.provider)
    if (!p?.isEnabled) {
      logger.warn(
        `[Providers]: Attempted to get player format for clip from disabled provider: ${clip.provider}.`,
      )
      return
    }
    return p?.getPlayerConfig(clip)
  }

  /**
   * Register commands for the providers.
   */
  useCommands().register(
    {
      id: 'enableprovider',
      aliases: ['enablep'],
      help: {
        args: [m.provider],
        description: m.command_enable_provider,
      },
      execute: ({ args }) => {
        if (args[0]) {
          const integration = Object.values(IntegrationID).find(
            (p) => p.toLowerCase() === args[0]?.toLowerCase(),
          )
          if (integration) {
            const p = provider.value(integration)
            if (p) {
              p.isEnabled = true
            }
          }
        }
      },
    },
    {
      id: 'disableprovider',
      aliases: ['disablep'],
      help: {
        args: [m.provider],
        description: m.command_disable_provider,
      },
      execute: ({ args }) => {
        if (args[0]) {
          const integration = Object.values(IntegrationID).find(
            (p) => p.toLowerCase() === args[0]?.toLowerCase(),
          )
          if (integration) {
            const p = provider.value(integration)
            if (p) {
              p.isEnabled = false
            }
          }
        }
      },
    },
    {
      id: 'resetcache',
      aliases: ['rmcache'],
      help: {
        description: m.command_reset_cache,
      },
      execute: () => {
        purge()
      },
    },
  )

  return {
    provider,
    name,
    icon,
    isExperimental,
    hasCachedData,
    purge,
    getClip,
    getPlayerConfig,
  }
})
