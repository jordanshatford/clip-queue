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

  const source = ref<IBaseClipSource>(new TwitchChatSource())
  const status = ref<ClipSourceStatus>(ClipSourceStatus.UNKNOWN)
  const logo = computed(() => source.value?.svg)

  async function connect(): Promise<void> {
    await source.value?.disconnect()
    status.value = source.value.status
    // setup watching chat
    source.value.on('status', (event) => {
      status.value = event.data
    })
    source.value.on('connected', (event) =>
      console.info('Connected to', event.source, 'channel', event.channel, 'at', event.timestamp)
    )
    source.value.on('disconnected', (event) =>
      console.info(
        'Disconnected from',
        event.source,
        'channel',
        event.channel,
        'at',
        event.timestamp
      )
    )
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
        commands.handleCommand(event.source, command, ...args)
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
          console.error('Failed to get clip: ', e)
        }
      }
    })
    source.value.on('user-timeout', (event) => {
      const username = event.data
      if (!settings.queue.hasAutoModerationEnabled) {
        return
      }
      queue.removeSubmitterClips(username)
    })
    source.value.on('error', (event) => {
      console.error('Clip source error: ', event.data)
    })

    const ctx = () => {
      const user = useUser()
      return user.ctx
    }

    const username = ctx().username
    if (username) {
      await source.value.connect(username)
    }
  }

  async function disconnect(): Promise<void> {
    await source.value?.disconnect()
  }

  return { logo, status, connect, disconnect }
})
