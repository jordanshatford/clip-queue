import { shallowMount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import ThemeChangeButton from "@/components/ThemeChangeButton.vue"

describe("ThemeChangeButton.vue", () => {
  const wrapper = shallowMount(ThemeChangeButton, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
