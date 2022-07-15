import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import SettingsPage from "../SettingsPage.vue"

describe("Settings.vue", () => {
  const wrapper = shallowMount(SettingsPage, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the same settings values as previous", () => {
    expect(wrapper.vm.formSettings.commandPrefix).toEqual("!cq")
  })

  it("resets the form to the settings when not saved", async () => {
    wrapper.vm.formSettings.commandPrefix = "~"
    await wrapper.vm.$nextTick()
    wrapper.vm.onReset()
    expect(wrapper.vm.formSettings.commandPrefix).toEqual("!cq")
  })

  it("saves the form to the settings", async () => {
    wrapper.vm.formSettings.commandPrefix = "~"
    await wrapper.vm.$nextTick()
    wrapper.vm.onSubmit()
    expect(wrapper.vm.showSaveMsg).toEqual(true)
  })

  it("hides the save message", () => {
    wrapper.vm.showSaveMsg = true
    wrapper.vm.hideMsg()
    expect(wrapper.vm.showSaveMsg).toEqual(false)
  })
})
