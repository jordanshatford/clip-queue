import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ChatUserstate } from 'tmi.js'
import { env, config } from '@/assets/config'
import twitch, { TwitchChat, type AuthInfo, type TwitchUserCtx } from '@/services/twitch'
import { useSettings } from '@/stores/settings'
import commands from '@/utils/commands'
import { getAllURLsFromText } from '@/utils'
import { useQueue } from '@/stores/queue'
import { useProviders } from '@/stores/providers'

const { CLIENT_ID, REDIRECT_URI } = env
const { scopes } = config.twitch

export interface User {
  hasValidatedToken: boolean
  isLoggedIn: boolean
  ctx: TwitchUserCtx
  chat?: TwitchChat
}

export const useUser = defineStore(
  'user',
  () => {
    const hasValidatedToken = ref<boolean>(false)
    const isLoggedIn = ref<boolean>(false)
    const ctx = ref<TwitchUserCtx>({ id: CLIENT_ID, token: undefined, username: undefined })
    const chat = ref<TwitchChat | undefined>(undefined)

    function redirect(): void {
      twitch.redirect(ctx.value, REDIRECT_URI, scopes)
    }

    async function autoLoginIfPossible() {
      if (hasValidatedToken.value) {
        return
      }
      if (ctx.value.token && (await twitch.isLoginValid(ctx.value))) {
        isLoggedIn.value = true
        connectToChat()
      } else {
        logout()
      }
      hasValidatedToken.value = true
    }

    function login(authInfo: AuthInfo): void {
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
        connectToChat()
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
      chat.value?.disconnect()
      chat.value = undefined
      if (originalCtx.id && originalCtx.token) {
        twitch.logout(originalCtx).catch()
      }
    }

    function connectToChat() {
      chat.value?.disconnect?.()
      const currentCtx = ctx.value
      if (currentCtx.username && currentCtx.token) {
        const c = new TwitchChat(currentCtx)
        // setup watching chat
        c.on('message', onMessage)
        c.on('messagedeleted', onMessageDeleted)
        c.on('timeout', onTimeout)
        c.on('ban', onTimeout)
        chat.value = c
      }
    }

    function onMessage(c: string, userstate: ChatUserstate, message: string, self: boolean) {
      if (self) {
        return
      }
      const settings = useSettings()
      // Check if message is a command and perform command if proper permission to do so
      if (settings.commands.enabled && message.startsWith(settings.commands.prefix)) {
        if (!twitch.isModerator(userstate)) {
          return
        }
        const [command, ...args] = message.substring(settings.commands.prefix.length).split(' ')
        commands.handleCommand(command, ...args)
        return
      }

      const urls = getAllURLsFromText(message)
      for (const url of urls) {
        const providers = useProviders()
        providers.getClip(url).then((clip) => {
          if (clip && userstate.username) {
            const queue = useQueue()
            queue.add({
              ...clip,
              submitters: [userstate.username]
            })
          }
        })
      }
    }

    function onMessageDeleted(c: string, username: string, deletedMessage: string) {
      const settings = useSettings()
      if (!settings.queue.hasAutoModerationEnabled) {
        return
      }
      const urls = getAllURLsFromText(deletedMessage)
      for (const url of urls) {
        const providers = useProviders()
        providers.getClip(url).then((clip) => {
          if (clip) {
            const queue = useQueue()
            queue.remove({
              ...clip,
              submitters: [username]
            })
          }
        })
      }
    }

    function onTimeout(c: string, username: string) {
      const settings = useSettings()
      if (!settings.queue.hasAutoModerationEnabled) {
        return
      }
      const queue = useQueue()
      queue.removeSubmitterClips(username)
    }

    return {
      hasValidatedToken,
      isLoggedIn,
      ctx,
      autoLoginIfPossible,
      redirect,
      login,
      logout
    }
  },
  {
    persist: {
      key: 'cq-user',
      paths: ['ctx.token', 'ctx.username']
    }
  }
)
