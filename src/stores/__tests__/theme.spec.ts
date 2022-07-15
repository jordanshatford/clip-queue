import { describe, it, expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useTheme } from "../theme"

describe("theme.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("gets the default value from localstorage if possible", () => {
    const theme = useTheme()
    localStorage.setItem("theme", "light")
    theme.getDefault()
    expect(theme.value).toEqual("light")
    expect(theme.isDark).toEqual(false)
    localStorage.setItem("theme", "dark")
    theme.getDefault()
    expect(theme.value).toEqual("dark")
    expect(theme.isDark).toEqual(true)
    expect(document?.querySelector("html")?.classList.contains("dark")).toBeTruthy()
  })

  it("gets the default value from config when no value is in local storage", () => {
    const theme = useTheme()
    theme.getDefault()
    expect(theme.value).toEqual("dark")
    expect(theme.isDark).toEqual(true)
  })

  it("can toggle the theme", () => {
    const theme = useTheme()
    theme.getDefault()
    expect(theme.value).toEqual("dark")
    expect(theme.isDark).toEqual(true)
    expect(document?.querySelector("html")?.classList.contains("dark")).toBeTruthy()
    theme.toggle()
    expect(theme.value).toEqual("light")
    expect(theme.isDark).toEqual(false)
    expect(document?.querySelector("html")?.classList.contains("dark")).toBeFalsy()
    theme.toggle()
    expect(theme.value).toEqual("dark")
    expect(theme.isDark).toEqual(true)
    expect(document?.querySelector("html")?.classList.contains("dark")).toBeTruthy()
  })
})
