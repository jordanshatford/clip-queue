import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import SettingsTabs from "../SettingsTabs.vue"

describe("SettingsTabs.vue", () => {
  const wrapper = shallowMount(SettingsTabs, {
    props: {
      modelValue: "test",
      options: [{ label: "test" }, { label: "test2" }],
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
