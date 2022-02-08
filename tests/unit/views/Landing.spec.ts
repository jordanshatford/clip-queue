import { shallowMount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import Landing from "@/views/Landing.vue"
import config from "@/assets/config"

describe("Landing.vue", () => {
  const wrapper = shallowMount(Landing)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the proper title, description, and features from config", () => {
    expect(wrapper.vm.title).toEqual(config.App.title)
    expect(wrapper.vm.description).toEqual(config.App.description)
    expect(wrapper.vm.features.length).toEqual(config.App.features.length)
    expect(wrapper.vm.features).toEqual(config.App.features)
  })
})
