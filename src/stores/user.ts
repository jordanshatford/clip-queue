import { defineStore } from 'pinia'
import type { ChatUserstate } from 'tmi.js'
import { env, config } from '@/assets/config'
import twitch, { TwitchChat, type AuthInfo, type TwitchUserCtx } from '@/services/twitch'
import { useSettings } from '@/stores/settings'
import commands from '@/utils/commands'
import { getUrlFromMessage } from '@/utils'
import { useQueue } from '@/stores/queue'
import { useModeration } from '@/stores/moderation'
import { useClipFinder } from '@/stores/clip-finder'
import { ClipSource } from '@/interfaces/clips'

const { CLIENT_ID, REDIRECT_URI } = env
const { scopes } = config.twitch

export interface User {
  isLoggedIn: boolean
  ctx: TwitchUserCtx
  chat?: TwitchChat
}

export const useUser = defineStore('user', {
  persist: {
    key: 'user',
    paths: ['ctx.token', 'ctx.username'],
    afterRestore: async (ctx) => {
      await ctx.store.autoLoginIfPossible()
    }
  },
  state: (): User => {
    return {
      isLoggedIn: false,
      ctx: {
        id: CLIENT_ID,
        token: undefined,
        username: undefined
      },
      chat: undefined
    }
  },
  actions: {
    async autoLoginIfPossible() {
      if (this.ctx.token && (await twitch.isLoginValid(this.ctx))) {
        this.isLoggedIn = true
        this.connectToChat()
      } else {
        this.logout()
      }
    },
    redirect(): void {
      twitch.redirect(this.ctx, REDIRECT_URI, scopes)
    },
    login(authInfo: AuthInfo): void {
      const { access_token, decodedIdToken } = authInfo
      if (
        this.ctx.token !== access_token ||
        this.ctx.username !== decodedIdToken.preferred_username
      ) {
        this.ctx = {
          ...this.ctx,
          token: access_token,
          username: decodedIdToken.preferred_username
        }
        this.isLoggedIn = true
        this.connectToChat()
      }
    },
    async logout(): Promise<void> {
      const ctx = this.ctx
      this.ctx = {
        ...this.ctx,
        token: undefined,
        username: undefined
      }
      this.isLoggedIn = false
      this.chat?.disconnect()
      this.chat = undefined
      if (ctx.id && ctx.token) {
        twitch.logout(ctx).catch()
      }
    },
    connectToChat() {
      this.chat?.disconnect?.()
      if (this.ctx.username && this.ctx.token) {
        this.chat = new TwitchChat(this.ctx)
        // setup watching chat
        this.chat.on('message', this.onMessage)
        this.chat.on('messagedeleted', this.onMessageDeleted)
        this.chat.on('timeout', this.onTimeout)
        this.chat.on('ban', this.onTimeout)
      }
    },
    onMessage(c: string, userstate: ChatUserstate, message: string, self: boolean) {
      if (self) return
      const settings = useSettings()
      // Check if message is a command and perform command if proper permission to do so
      if (settings.allowCommands && message.startsWith(settings.commandPrefix)) {
        if (!twitch.isModerator(userstate)) {
          return
        }
        const [command, ...args] = message.substring(settings.commandPrefix.length).split(' ')
        commands.handleCommand(command, ...args)
        return
      }

      const url = getUrlFromMessage(message)
      if (url) {
        const clipFinder = useClipFinder()
        clipFinder.getTwitchClip(url).then((clip) => {
          if (clip) {
            const queue = useQueue()
            const submitter = userstate.username
            queue.add({
              ...clip,
              submitter,
              source: ClipSource.TwitchChat
            })
          }
        })
      }
    },
    onMessageDeleted(c: string, username: string, deletedMessage: string) {
      const moderation = useModeration()
      if (!moderation.hasAutoRemoveClipsEnabled) {
        return
      }
      const url = getUrlFromMessage(deletedMessage)
      if (url) {
        const clipFinder = useClipFinder()
        clipFinder.getTwitchClip(url).then((clip) => {
          if (clip) {
            const queue = useQueue()
            const submitter = username
            queue.remove({
              ...clip,
              submitter
            })
          }
        })
      }
    },
    onTimeout(c: string, username: string) {
      const moderation = useModeration()
      if (!moderation.hasAutoRemoveClipsEnabled) {
        return
      }
      const queue = useQueue()
      queue.removeSubmitterClips(username)
    }
  }
})
