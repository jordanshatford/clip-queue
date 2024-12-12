import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { AuthInfo, TwitchUserCtx } from '@cq/services/twitch'
import type { IBaseClipSource } from '@cq/sources'
import twitch from '@cq/services/twitch'
import { ClipSourceStatus, TwitchChatSource } from '@cq/sources'

import { env } from '@/config'
import { useProviders } from '@/stores/providers'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'
import commands, { Command } from '@/utils/commands'

const { CLIENT_ID, REDIRECT_URI } = env

export const useUser = defineStore(
  'user',
  () => {
    const queue = useQueue()
    const settings = useSettings()

    const hasValidatedToken = ref<boolean>(false)
    const isLoggedIn = ref<boolean>(false)
    const ctx = ref<TwitchUserCtx>({ id: CLIENT_ID, token: undefined, username: undefined })
    const source = ref<IBaseClipSource | undefined>(undefined)
    const sourceStatus = ref<ClipSourceStatus>(ClipSourceStatus.UNKNOWN)

    function redirect(): void {
      twitch.redirect(ctx.value, REDIRECT_URI, ['openid', 'chat:read'])
    }

    async function autoLoginIfPossible() {
      if (hasValidatedToken.value) {
        return
      }
      if (ctx.value.token && (await twitch.isLoginValid(ctx.value))) {
        isLoggedIn.value = true
        await connectToChat()
      } else {
        await logout()
      }
      hasValidatedToken.value = true
    }

    async function login(authInfo: AuthInfo): Promise<void> {
      const { access_token, decodedIdToken } = authInfo
      const currentCtx = ctx.value
      if (
        currentCtx.token !== access_token ||
        currentCtx.username !== decodedIdToken.preferred_username
      ) {
        ctx.value = {
          ...currentCtx,
          token: access_token,
          username: decodedIdToken.preferred_username
        }
        isLoggedIn.value = true
        await connectToChat()
      }
    }

    async function logout(): Promise<void> {
      const originalCtx = ctx.value
      ctx.value = {
        ...originalCtx,
        token: undefined,
        username: undefined
      }
      isLoggedIn.value = false
      try {
        await source.value?.disconnect()
        source.value = undefined
      } catch (e) {
        console.error('Failed to disconnect from Twitch chat: ', e)
      }
      if (originalCtx.id && originalCtx.token) {
        try {
          await twitch.logout(originalCtx)
        } catch (e) {
          console.error('Failed to logout of Twitch: ', e)
        }
      }
    }

    async function connectToChat() {
      await source.value?.disconnect()
      const currentCtx = ctx.value
      if (currentCtx.username && currentCtx.token) {
        const s = new TwitchChatSource(() => currentCtx)
        // setup watching chat
        s.on('status', (event) => {
          sourceStatus.value = event.data
        })
        s.on('connected', (event) => console.info('Connected to Twitch Chat at: ', event.timestamp))
        s.on('disconnected', (event) =>
          console.info('Disconnected from Twitch chat at: ', event.timestamp, ' ', event?.data)
        )
        s.on('message', async (event) => {
          // Check if message is a command and perform command if proper permission to do so
          if (event.data.text.startsWith(settings.commands.prefix)) {
            const [command, ...args] = event.data.text
              .substring(settings.commands.prefix.length)
              .split(' ')
            if (!settings.commands.allowed.includes(command as Command)) {
              return
            }
            if (!event.data.isAllowedCommands) {
              return
            }
            commands.handleCommand(command, ...args)
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
          console.info('Connect to Twitch chat of channel: ', currentCtx.username)
          source.value = s
        } catch (e) {
          console.error('Failed to connect to Twitch chat: ', e)
        }
      }
    }

    return {
      hasValidatedToken,
      isLoggedIn,
      ctx,
      sourceStatus,
      autoLoginIfPossible,
      redirect,
      login,
      logout
    }
  },
  {
    persist: {
      key: 'cq-user',
      pick: ['ctx.token', 'ctx.username']
    }
  }
)
