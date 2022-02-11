import { reactive } from "vue"
import twitch from "@/services/twitch"
import config from "@/assets/config"
import { TwitchChat } from "@/services/twitch"
import type { User } from "@/interfaces/users"
import type { Userstate } from "tmi.js"
import { useSettings } from "@/stores/settings"
import { commands } from "@/utils/commands"
import { getUrlFromMessage } from "@/utils/url"
import ClipFinder from "@/services/clip-finder"
import { clips } from "@/stores/clips"

const { clientId, redirectUri, scopes } = config.Twitch.Auth

const user = reactive<User>({
  isLoggedIn: false,
  accessToken: null,
  idToken: null,
  username: null,
  chat: null,
})

function login(): void {
  twitch.redirect(clientId, redirectUri, scopes)
}

function loginWithTwitchAuth(aToken: string, idToken: string, preferredUsername: string | null): void {
  if (user.accessToken != aToken || user.username != preferredUsername) {
    user.chat?.disconnect()
    user.accessToken = aToken
    user.idToken = idToken
    user.username = preferredUsername
    user.isLoggedIn = true
    user.chat = new TwitchChat(user?.username ?? "", user.accessToken)

    user.chat.on("message", onMessage)
    user.chat.on("messagedeleted", onMessageDeleted)
    user.chat.on("timeout", onTimeout)
    user.chat.on("ban", onTimeout)
  }
}

async function logout(): Promise<void> {
  user.chat?.disconnect()
  user.chat = null
  const token = user.accessToken
  user.idToken = null
  user.accessToken = null
  user.username = null
  user.isLoggedIn = false

  if (token) {
    twitch.logout(clientId, token)
  }
}

function onMessage(channel: string, userstate: Userstate, message: string, self: boolean) {
  if (self) {
    return
  }

  const settings = useSettings()
  // Check if message is a command and perform command if proper permission to do so
  if (message.startsWith(settings.commandPrefix)) {
    const isMod = userstate.mod
    const isBroadcaster = userstate.badges?.["broadcaster"] === "1"
    if (!isMod && !isBroadcaster) {
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
}

function onMessageDeleted(channel: string, username: string, deletedMessage: string) {
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
}

function onTimeout(channel: string, username: string) {
  console.debug("Removing all clips submitter by: ", username)
  clips.removeUserClips(username)
}

export const userStore = {
  user,
  login,
  loginWithTwitchAuth,
  logout,
}
