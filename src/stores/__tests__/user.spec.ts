import { setActivePinia, createPinia } from "pinia"
import { userStore } from "@/stores/user"

describe("user.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("redirects to twitch auth login", () => {
    userStore.login()
  })

  it("can uses twitch information to login", () => {
    expect(userStore.user.isLoggedIn).toEqual(false)
    expect(userStore.user.accessToken).toEqual(null)
    expect(userStore.user.idToken).toEqual(null)
    expect(userStore.user.username).toEqual(null)
    userStore.loginWithTwitchAuth("aToken", "idToken", "username")
    expect(userStore.user.isLoggedIn).toEqual(true)
    expect(userStore.user.accessToken).toEqual("aToken")
    expect(userStore.user.idToken).toEqual("idToken")
    expect(userStore.user.username).toEqual("username")
  })

  it("updates the login info if the username changes", () => {
    userStore.loginWithTwitchAuth("aToken", "idToken", "username")
    expect(userStore.user.isLoggedIn).toEqual(true)
    expect(userStore.user.accessToken).toEqual("aToken")
    expect(userStore.user.idToken).toEqual("idToken")
    expect(userStore.user.username).toEqual("username")
    userStore.loginWithTwitchAuth("aToken", "idToken", "username2")
    expect(userStore.user.isLoggedIn).toEqual(true)
    expect(userStore.user.accessToken).toEqual("aToken")
    expect(userStore.user.idToken).toEqual("idToken")
    expect(userStore.user.username).toEqual("username2")
  })

  it("logs out the user", async () => {
    userStore.loginWithTwitchAuth("aToken", "idToken", "username")
    expect(userStore.user.isLoggedIn).toEqual(true)
    expect(userStore.user.accessToken).toEqual("aToken")
    expect(userStore.user.idToken).toEqual("idToken")
    expect(userStore.user.username).toEqual("username")
    await userStore.logout()
    expect(userStore.user.isLoggedIn).toEqual(false)
    expect(userStore.user.accessToken).toEqual(null)
    expect(userStore.user.idToken).toEqual(null)
    expect(userStore.user.username).toEqual(null)
  })
})
