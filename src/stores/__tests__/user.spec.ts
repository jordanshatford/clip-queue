import { describe, it, expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useUser } from "../user"
import type { AuthInfo } from "../../services/twitch"

describe("user.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("redirects to twitch auth login", () => {
    const user = useUser()
    user.redirect()
  })

  it("can uses twitch information to login", () => {
    const user = useUser()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.accessToken).toEqual(null)
    expect(user.idToken).toEqual(null)
    expect(user.username).toEqual(null)
    user.login({
      access_token: "aToken",
      id_token: "idToken",
      decodedIdToken: { preferred_username: "username" },
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.accessToken).toEqual("aToken")
    expect(user.idToken).toEqual("idToken")
    expect(user.username).toEqual("username")
  })

  it("updates the login info if the username changes", () => {
    const user = useUser()
    user.login({
      access_token: "aToken",
      id_token: "idToken",
      decodedIdToken: { preferred_username: "username" },
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.accessToken).toEqual("aToken")
    expect(user.idToken).toEqual("idToken")
    expect(user.username).toEqual("username")
    user.login({
      access_token: "aToken",
      id_token: "idToken",
      decodedIdToken: { preferred_username: "username2" },
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.accessToken).toEqual("aToken")
    expect(user.idToken).toEqual("idToken")
    expect(user.username).toEqual("username2")
  })

  it("logs out the user", async () => {
    const user = useUser()
    user.login({
      access_token: "aToken",
      id_token: "idToken",
      decodedIdToken: { preferred_username: "username" },
    } as AuthInfo)
    expect(user.isLoggedIn).toEqual(true)
    expect(user.accessToken).toEqual("aToken")
    expect(user.idToken).toEqual("idToken")
    expect(user.username).toEqual("username")
    await user.logout()
    expect(user.isLoggedIn).toEqual(false)
    expect(user.accessToken).toEqual(null)
    expect(user.idToken).toEqual(null)
    expect(user.username).toEqual(null)
  })
})
