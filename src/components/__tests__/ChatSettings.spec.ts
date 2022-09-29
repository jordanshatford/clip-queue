import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import ChatSettings from "../ChatSettings.vue"

describe("ChatSettings.vue", () => {
  const wrapper = shallowMount(ChatSettings, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the same settings values as previous", () => {
    // @ts-ignore
    expect(wrapper.vm.formSettings.commandPrefix).toEqual("!cq")
  })

  it("resets the form to the settings when not saved", async () => {
    // @ts-ignore
    wrapper.vm.formSettings.commandPrefix = "~"
    await wrapper.vm.$nextTick()
    // @ts-ignore
    wrapper.vm.onReset()
    // @ts-ignore
    expect(wrapper.vm.formSettings.commandPrefix).toEqual("!cq")
  })

  it("saves the form to the settings", async () => {
    // @ts-ignore
    wrapper.vm.formSettings.commandPrefix = "~"
    await wrapper.vm.$nextTick()
    // @ts-ignore
    wrapper.vm.onSubmit()
    // @ts-ignore
    expect(wrapper.vm.showSaveMsg).toEqual(true)
  })

  it("hides the save message", () => {
    // @ts-ignore
    wrapper.vm.showSaveMsg = true
    // @ts-ignore
    wrapper.vm.hideMsg()
    // @ts-ignore
    expect(wrapper.vm.showSaveMsg).toEqual(false)
  })
})
