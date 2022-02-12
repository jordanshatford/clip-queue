import { shallowMount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import Queue from "@/views/Queue.vue"

describe("Queue.vue", () => {
  const wrapper = shallowMount(Queue, {
    global: {
      plugins: [createTestingPinia()],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
