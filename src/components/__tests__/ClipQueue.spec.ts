import { shallowMount } from "@vue/test-utils"
import ClipQueue from "@/components/ClipQueue.vue"

describe("ClipQueue.vue", () => {
  const wrapper = shallowMount(ClipQueue, {
    props: {
      clips: [],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
