import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { IBaseClipSource } from '@cq/sources'
import { ClipSourceStatus, TwitchChatSource } from '@cq/sources'

import { useProviders } from '@/stores/providers'
import { useUser } from '@/stores/user'
import commands, { Command } from '@/utils/commands'
import { useLogger } from './logger'
import { useQueue } from './queue'
import { useSettings } from './settings'

const ctx = () => {
  const user = useUser()
  return user.ctx
}

export const useSources = defineStore('sources', () => {
  const queue = useQueue()
  const settings = useSettings()
  const logger = useLogger()

  const source = ref<IBaseClipSource>(new TwitchChatSource())
  const status = ref<ClipSourceStatus>(source.value.status)
  const logo = computed(() => source.value?.svg)

  // setup watching chat
  source.value.on('status', (event) => {
    status.value = event.data
  })
  source.value.on('connected', (event) => logger.debug(`[${event.source}]: Connected.`))
  source.value.on('disconnected', (event) => logger.debug(`[${event.source}]: Disconnected.`))
  source.value.on('join', (event) => {
    logger.info(`[${event.source}]: Joined channel ${event.data}.`)
  })
  source.value.on('leave', (event) => {
    logger.info(`[${event.source}]: Left channel ${event.data}.`)
  })
  source.value.on('message', async (event) => {
    // Check if message is a command and perform command if proper permission to do so
    if (event.data.text.startsWith(settings.commands.prefix)) {
      // Ensure the user is allowed to use commands.
      if (!event.data.isAllowedCommands) {
        return
      }
      const [command, ...args] = event.data.text
        .substring(settings.commands.prefix.length)
        .split(' ')
      if (!settings.commands.allowed.includes(command as Command)) {
        return
      }
      commands.handleCommand(event, command, ...args)
      return
    }
    for (const url of event.data.urls) {
      const providers = useProviders()
      try {
        const clip = await providers.getClip(url)
        if (clip) {
          queue.add({
            ...clip,
            submitters: [event.data.username]
          })
        }
      } catch (e) {
        logger.error(`[${event.source}]: Failed to get clip: ${e}.`)
      }
    }
  })
  source.value.on('message-deleted', async (event) => {
    if (!settings.queue.hasAutoModerationEnabled) {
      return
    }
    for (const url of event.data.urls) {
      const providers = useProviders()
      try {
        const clip = await providers.getClip(url)
        if (clip) {
          queue.remove({
            ...clip,
            submitters: [event.data.username]
          })
        }
      } catch (e) {
        logger.error(`[${event.source}]: Failed to get clip: ${e}.`)
      }
    }
  })
  source.value.on('user-timeout', (event) => {
    const username = event.data.username
    if (!settings.queue.hasAutoModerationEnabled) {
      return
    }
    queue.removeSubmitterClips(username)
  })
  source.value.on('error', (event) => {
    logger.error(`[${event.source}]: ${event.data}.`)
  })

  async function connect(): Promise<void> {
    const username = ctx().username
    logger.info(`[Sources]: Connecting to source for user: ${username}.`)
    if (username) {
      await source.value.connect()
      await source.value.join(username)
    }
  }

  async function disconnect(): Promise<void> {
    const username = ctx().username
    logger.info(`[Sources]: Disconnecting from source for user: ${username}.`)
    if (username) {
      await source.value.leave(username)
    }
    await source.value?.disconnect()
  }

  async function reconnect(): Promise<void> {
    await disconnect()
    await connect()
  }

  return { logo, status, connect, disconnect, reconnect }
})
