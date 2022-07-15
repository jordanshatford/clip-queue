import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import Switch from "../v-switch.vue"

describe("Switch.vue", () => {
  const wrapper = shallowMount(Switch, {
    props: {
      id: "test",
      modelValue: false,
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
