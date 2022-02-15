import { shallowMount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import Reddit from "@/views/Reddit.vue"

describe("Reddit.vue", () => {
  const wrapper = shallowMount(Reddit, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
