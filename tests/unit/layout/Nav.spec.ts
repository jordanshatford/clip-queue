import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import Nav from "@/layout/Nav.vue"
import config from "@/assets/config"

describe("Nav.vue", () => {
  const wrapper = shallowMount(Nav)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the proper title from config", () => {
    expect(wrapper.vm.title).toEqual(config.App.title)
  })
})
