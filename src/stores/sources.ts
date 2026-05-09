import type { ToastMessageOptions } from 'primevue'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { IntegrationSource } from '@/integrations/core'

import { chat } from '@/integrations/twitch'
import { m } from '@/paraglide/messages'
import { useProviders } from '@/stores/providers'
import { useUser } from '@/stores/user'
import commands, { Command } from '@/utils/commands'

import { useLogger } from './logger'
import { useQueue } from './queue'
import { useSettings } from './settings'

export const useSources = defineStore('sources', () => {
  const toast = ref<(o: ToastMessageOptions) => void>(() => {})
  const queue = useQueue()
  const settings = useSettings()
  const logger = useLogger()

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
    // Check if message is a command and perform command if proper permission to do so
    if (event.data.text.startsWith(settings.application.prefix)) {
      // Ensure the user is allowed to use commands.
      if (!event.data.isAllowedCommands) {
        logger.debug(
          `[${event.source}]: User ${event.data.username} is not allowed to use commands.`,
        )
        return
      }
      const [command, ...args] = event.data.text
        .substring(settings.application.prefix.length)
        .split(' ')
      if (!settings.application.allowed.includes(command as Command)) {
        logger.debug(`[${event.source}]: Command ${command} is not enabled or does not exist.`)
        return
      }
      commands.handleCommand(event, command!, ...args)
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
    if (!settings.application.hasAutoModerationEnabled) {
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
    const username = event.data.username
    if (!settings.application.hasAutoModerationEnabled) {
      return
    }
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

  return { onToast, connect, disconnect }
})
