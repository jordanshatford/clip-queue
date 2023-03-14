import { defineStore } from 'pinia'
import type { ChatUserstate } from 'tmi.js'
import { env } from '@/assets/config'
import twitch, { TwitchChat, type AuthInfo, type RequestCtx } from '@/services/twitch'
import { useSettings } from '@/stores/settings'
import commands from '@/utils/commands'
import { getUrlFromMessage } from '@/utils'
import { useQueue } from '@/stores/queue'
import { useModeration } from '@/stores/moderation'
import { useClipFinder } from '@/stores/clip-finder'
import { ClipSource } from '@/interfaces/clips'

const { CLIENT_ID, REDIRECT_URI } = env
const SCOPES = ['openid', 'chat:read']

export interface User {
  isLoggedIn: boolean
  accessToken: string | null
  idToken: string | null
  username: string | null
  chat?: TwitchChat
}

export const useUser = defineStore('user', {
  persist: {
    key: 'user',
    paths: ['accessToken', 'idToken', 'username'],
    afterRestore: async (ctx) => {
      await ctx.store.autoLoginIfPossible()
    }
  },
  state: (): User => {
    return {
      isLoggedIn: false,
      accessToken: null,
      idToken: null,
      username: null,
      chat: undefined
    }
  },
  getters: {
    ctx(): RequestCtx {
      return { id: CLIENT_ID, token: this.accessToken ?? '' }
    }
  },
  actions: {
    async autoLoginIfPossible() {
      if (this?.accessToken && (await twitch.isTokenStillValid(this.accessToken))) {
        this.isLoggedIn = true
        this.connectToChat()
      } else {
        this.logout()
      }
    },
    redirect(): void {
      twitch.redirect(CLIENT_ID, REDIRECT_URI, SCOPES)
    },
    login(authInfo: AuthInfo): void {
      const { access_token, id_token, decodedIdToken } = authInfo
      if (
        this.accessToken !== access_token ||
        this.username !== decodedIdToken?.preferred_username
      ) {
        this.accessToken = access_token
        this.idToken = id_token
        this.username = decodedIdToken?.preferred_username ?? ''
        this.isLoggedIn = true
        this.connectToChat()
      }
    },
    async logout(): Promise<void> {
      const token = this.accessToken
      this.idToken = null
      this.accessToken = null
      this.username = null
      this.isLoggedIn = false
      this.chat?.disconnect()
      this.chat = undefined
      if (token) {
        twitch.logout(CLIENT_ID, token).catch()
      }
    },
    connectToChat() {
      this.chat?.disconnect?.()
      if (this.username && this.accessToken) {
        this.chat = new TwitchChat(this.username, this.accessToken)
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
