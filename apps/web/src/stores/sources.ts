import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { IBaseClipSource } from '@cq/sources'
import { ClipSourceStatus, TwitchChatSource } from '@cq/sources'

import { useProviders } from '@/stores/providers'
import { useUser } from '@/stores/user'
import commands, { Command } from '@/utils/commands'
import { useQueue } from './queue'
import { useSettings } from './settings'

export const useSources = defineStore('sources', () => {
  const queue = useQueue()
  const settings = useSettings()

  const source = ref<IBaseClipSource | undefined>(undefined)
  const status = ref<ClipSourceStatus>(ClipSourceStatus.UNKNOWN)
  const logo = computed(() => source.value?.svg)

  async function connect(): Promise<void> {
    await source.value?.disconnect()
    const ctx = () => {
      const user = useUser()
      return user.ctx
    }
    const s = new TwitchChatSource(ctx)
    status.value = s.status
    // setup watching chat
    s.on('status', (event) => {
      status.value = event.data
    })
    s.on('connected', (event) => console.info('Connected to Twitch Chat at: ', event.timestamp))
    s.on('disconnected', (event) =>
      console.info('Disconnected from Twitch chat at: ', event.timestamp, ' ', event?.data)
    )
    s.on('message', async (event) => {
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
        commands.handleCommand(s.name, command, ...args)
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
          console.error('Failed to get clip: ', e)
        }
      }
    })
    s.on('message-deleted', async (event) => {
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
          console.error('Failed to get clip: ', e)
        }
      }
    })
    s.on('user-timeout', (event) => {
      const username = event.data
      if (!settings.queue.hasAutoModerationEnabled) {
        return
      }
      queue.removeSubmitterClips(username)
    })
    s.on('error', (event) => {
      console.error('Clip source error: ', event.data)
    })
    try {
      await s.connect()
      console.info('Connect to Twitch chat of channel: ', ctx().username)
      source.value = s
    } catch (e) {
      console.error('Failed to connect to Twitch chat: ', e)
    }
  }

  async function disconnect(): Promise<void> {
    try {
      await source.value?.disconnect()
      source.value = undefined
    } catch (e) {
      console.error('Failed to disconnect from ', source.value?.name, ': ', e)
    }
  }

  return { logo, status, connect, disconnect }
})
