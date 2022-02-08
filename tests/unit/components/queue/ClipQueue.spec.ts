import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import ClipQueue from "@/components/queue/ClipQueue.vue"

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
