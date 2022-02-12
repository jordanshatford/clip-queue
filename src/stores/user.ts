import { defineStore } from "pinia"
import { env } from "@/assets/config"
import twitch, { TwitchChat, type AuthInfo } from "@/services/twitch"
import type { Userstate } from "tmi.js"
import { useSettings } from "@/stores/settings"
import { commands } from "@/utils/commands"
import { getUrlFromMessage } from "@/utils/url"
import ClipFinder from "@/services/clip-finder"
import { clips } from "@/stores/clips"

const { CLIENT_ID, REDIRECT_URI } = env
const scopes = ["openid", "chat:read", "chat:edit"]

interface User {
  isLoggedIn: boolean
  accessToken: string | null
  idToken: string | null
  username: string | null
  chat: TwitchChat | null
}

export const useUser = defineStore("user", {
  state: (): User => {
    return {
      isLoggedIn: false,
      accessToken: null,
      idToken: null,
      username: null,
      chat: null,
    }
  },
  actions: {
    redirect(): void {
      twitch.redirect(CLIENT_ID, REDIRECT_URI, scopes)
    },
    login(authInfo: AuthInfo): void {
      const { access_token, id_token, decodedIdToken } = authInfo
      if (this.accessToken !== access_token || this.username !== decodedIdToken?.preferred_username) {
        this.accessToken = access_token
        this.idToken = id_token
        this.username = decodedIdToken?.preferred_username ?? ""
        this.isLoggedIn = true
        this.chat?.disconnect()
        this.chat = new TwitchChat(this.username, this.accessToken)
        // setup watching chat
        this.chat.on("message", this.onMessage)
        this.chat.on("messagedeleted", this.onMessageDeleted)
        this.chat.on("timeout", this.onTimeout)
        this.chat.on("ban", this.onTimeout)
      }
    },
    async logout(): Promise<void> {
      const token = this.accessToken
      this.idToken = null
      this.accessToken = null
      this.username = null
      this.isLoggedIn = false
      this.chat?.disconnect()
      this.chat = null
      if (token) {
        twitch.logout(CLIENT_ID, token)
      }
    },
    onMessage(_, userstate: Userstate, message: string, self: boolean) {
      if (self) return
      const settings = useSettings()
      // Check if message is a command and perform command if proper permission to do so
      if (message.startsWith(settings.commandPrefix)) {
        if (!twitch.isModerator(userstate)) {
          return
        }
        const commandName = message.substring(settings.commandPrefix.length).split(" ")[0]
        const command = commands[commandName]
        if (!command) {
          return
        }
        command()
      }

      const url = getUrlFromMessage(message)
      if (url) {
        ClipFinder.getTwitchClip(url).then((clip) => {
          if (clip) {
            console.debug("Adding clip to queue: ", clip)
            const submitter = userstate.username
            clips.addClip({
              ...clip,
              submitter,
            })
          }
        })
      }
    },
    onMessageDeleted(_, username: string, deletedMessage: string) {
      const url = getUrlFromMessage(deletedMessage)
      if (url) {
        ClipFinder.getTwitchClip(url).then((clip) => {
          if (clip) {
            console.debug("Removing clip from queue: ", clip)
            const submitter = username
            clips.removeClip({
              ...clip,
              submitter,
            })
          }
        })
      }
    },
    onTimeout(_, username: string) {
      console.debug("Removing all clips submitter by: ", username)
      clips.removeUserClips(username)
    },
  },
})
