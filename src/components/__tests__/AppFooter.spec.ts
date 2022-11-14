import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import AppFooter from "../AppFooter.vue"
import config from "../../assets/config"

describe("AppFooter.vue", () => {
  const wrapper = shallowMount(AppFooter)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the proper copyright and github from config", () => {
    // @ts-ignore
    expect(wrapper.vm.copyright).toEqual(config.copyright)
    // @ts-ignore
    expect(wrapper.vm.github).toEqual(config.github)
  })
})
