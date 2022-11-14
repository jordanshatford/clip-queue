import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import HistoryPage from "../HistoryPage.vue"

describe("HistoryPage.vue", () => {
  const wrapper = shallowMount(HistoryPage, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
