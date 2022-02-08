import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import FormGroup from "@/components/common/FormGroup.vue"

describe("FormGroup.vue", () => {
  const wrapper = shallowMount(FormGroup)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has a default label", () => {
    expect(wrapper.vm.label).toEqual("")
  })

  it("has a label set by props", async () => {
    wrapper.setProps({ label: "test" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.label).toEqual("test")
  })
})
