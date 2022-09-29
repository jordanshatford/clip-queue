import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import LandingPage from "../LandingPage.vue"
import config from "../../assets/config"

describe("LandingPage.vue", () => {
  const wrapper = shallowMount(LandingPage)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the proper title, description, and features from config", () => {
    // @ts-ignore
    expect(wrapper.vm.title).toEqual(config.App.title)
    // @ts-ignore
    expect(wrapper.vm.description).toEqual(config.App.description)
    // @ts-ignore
    expect(wrapper.vm.features.length).toEqual(config.App.features.length)
    // @ts-ignore
    expect(wrapper.vm.features).toEqual(config.App.features)
  })
})
