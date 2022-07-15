import { describe, it, expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useSettings, type Settings } from "../settings"

describe("settings.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("inits the settings with default value", () => {
    const settings = useSettings()
    settings.init()
    expect(settings.commandPrefix).toEqual("!cq")
  })

  it("inits the settings with values from local storage", () => {
    const settings = useSettings()
    localStorage.setItem("settings", JSON.stringify({ commandPrefix: "~" }))
    settings.init()
    expect(settings.commandPrefix).toEqual("~")
  })

  it("updates the settings in local storage", () => {
    const settings = useSettings()
    localStorage.clear()
    settings.init()
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
