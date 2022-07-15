import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import AppThemeToggle from "../AppThemeToggle.vue"

describe("AppThemeToggle.vue", () => {
  const wrapper = shallowMount(AppThemeToggle, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
