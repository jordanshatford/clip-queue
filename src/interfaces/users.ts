import type { TwitchChat } from "@/services/twitch"

export interface User {
  isLoggedIn: boolean
  accessToken: string | null
  idToken: string | null
  username: string | null
  chat: TwitchChat | null
}
