import { shallowMount } from "@vue/test-utils"
import ThemeChangeButton from "@/components/ThemeChangeButton.vue"
import { createTestingPinia } from "@pinia/testing"

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
