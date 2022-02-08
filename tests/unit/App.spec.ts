import { shallowMount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import App from "@/App.vue"

describe("App.vue", () => {
  const wrapper = shallowMount(App)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
