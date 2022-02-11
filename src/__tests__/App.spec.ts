import { shallowMount } from "@vue/test-utils"
import App from "@/App.vue"
import { createTestingPinia } from "@pinia/testing"

describe("App.vue", () => {
  const wrapper = shallowMount(App, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
