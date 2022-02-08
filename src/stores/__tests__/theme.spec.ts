import config from "@/assets/config"
import { theme } from "@/stores/theme"

describe("theme.ts", () => {
  it("gets the default value from localstorage if possible", () => {
    localStorage.setItem(config.App.Theme.localStorageKey, "light")
    theme.getDefault()
    expect(theme.current.value).toEqual("light")
    localStorage.setItem(config.App.Theme.localStorageKey, "dark")
    theme.getDefault()
    expect(theme.current.value).toEqual("dark")
    expect(document?.querySelector("html")?.classList.contains("dark")).toBeTruthy()
  })

  it("gets the default value from config when no value is in local storage", () => {
    theme.getDefault()
    expect(theme.current.value).toEqual(config.App.Theme.defaultValue)
  })

  it("can toggle the theme", () => {
    theme.getDefault()
    expect(theme.current.value).toEqual("dark")
    expect(document?.querySelector("html")?.classList.contains("dark")).toBeTruthy()
    theme.toggle()
    expect(theme.current.value).toEqual("light")
    expect(document?.querySelector("html")?.classList.contains("dark")).toBeFalsy()
    theme.toggle()
    expect(theme.current.value).toEqual("dark")
    expect(document?.querySelector("html")?.classList.contains("dark")).toBeTruthy()
  })
})
