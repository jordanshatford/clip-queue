import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import AppNavBar from "../AppNavBar.vue"
import config from "../../assets/config"

describe("AppNavBar.vue", () => {
  const wrapper = shallowMount(AppNavBar, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the proper title from config", () => {
    // @ts-ignore
    expect(wrapper.vm.title).toEqual(config.about.title)
  })
})
