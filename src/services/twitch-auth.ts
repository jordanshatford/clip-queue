import axios from "axios"
import config from "@/assets/config"
import type { AuthInfo, IDToken } from "@/interfaces/twitch"
import { parseJWT } from "@/utils/jwt"

const { baseURL, clientId, redirectUri, scopes } = config.Twitch.Auth

export default class TwitchAuth {
  public static login(hash: string): AuthInfo | null {
    const authInfo = this.processAuthHash(hash)
    if (authInfo.access_token && authInfo.id_token) {
      authInfo.decodedIdToken = parseJWT(authInfo.id_token) as IDToken
      return authInfo
    }
    return null
  }

  public static async logout(token: string): Promise<void> {
    this.revokeToken(token)
  }

  public static redirectToLogin(): void {
    const loginUrl = this.getLoginUrl()
    window.location.assign(loginUrl)
  }

  private static getLoginUrl(): string {
    return encodeURI(
      `${baseURL}/authorize?client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=token id_token` +
        `&scope=${scopes.join(" ")}` +
        `&claims={"id_token":{"preferred_username":null}}`
    )
  }

  private static processAuthHash(hash: string): AuthInfo {
    const authInfo = hash
      .substring(1)
      .split("&")
      .reduce((authInfo, s) => {
        const parts = s.split("=")
        authInfo[parts[0]] = decodeURIComponent(decodeURIComponent(parts[1]))
        return authInfo
        /* eslint-disable @typescript-eslint/no-explicit-any*/
      }, {} as Record<string, any>) as AuthInfo
    return authInfo
  }

  private static async revokeToken(token: string): Promise<void> {
    await axios.post(`${baseURL}/revoke?client_id=${clientId}&token=${token}`)
  }
}
