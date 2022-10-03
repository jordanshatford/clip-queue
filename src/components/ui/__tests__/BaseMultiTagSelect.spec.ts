import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import BaseMultiTagSelect from "../BaseMultiTagSelect.vue"

describe("BaseMultiTagSelect.vue", () => {
  const wrapper = shallowMount(BaseMultiTagSelect, {
    props: {
      modelValue: []
    }
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
