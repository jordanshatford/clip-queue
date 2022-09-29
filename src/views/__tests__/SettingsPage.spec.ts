import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import SettingsPage from "../SettingsPage.vue"

describe("SettingsPage.vue", () => {
  const wrapper = shallowMount(SettingsPage, {})

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
