import { describe, it, expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { DEFAULT_SETTING, useSettings, type Settings } from "../settings"

describe("settings.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("inits the settings with default value", () => {
    const settings = useSettings()
    expect(settings.commandPrefix).toEqual("!cq")
    expect(settings.isModified(DEFAULT_SETTING)).toEqual(false)
  })

  it("updates the settings in local storage", () => {
    const settings = useSettings()
    localStorage.clear()
    expect(settings.commandPrefix).toEqual("!cq")
    settings.update({
      commandPrefix: "~",
      sendMsgsInChat: true,
    } as Settings)
    expect(settings.commandPrefix).toEqual("~")
    expect(settings.sendMsgsInChat).toBeTruthy()
  })

  it("returns if the settings are different", () => {
    const settings = useSettings()
    expect(
      settings.isModified({
        commandPrefix: "~dsa",
        sendMsgsInChat: true,
        sendCurrentClipMsg: true,
        currentClipMsg: "",
        sendQueueOpenMsg: true,
        queueOpenMsg: "",
        sendQueueCloseMsg: true,
        queueCloseMsg: "",
      } as Settings)
    ).toEqual(true)
    expect(settings.isModified(settings.$state)).toEqual(false)
  })
})
