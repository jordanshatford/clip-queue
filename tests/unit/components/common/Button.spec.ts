import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import Button from "@/components/common/Button.vue"

describe("Button.vue", () => {
  const wrapper = shallowMount(Button)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has a default variant of primary with the correct colors", () => {
    expect(wrapper.vm.variant).toEqual("primary")
    expect(wrapper.vm.classNames).toEqual(
      expect.stringContaining("bg-blue-500 border-blue-700 hover:bg-blue-400 hover:border-blue-500")
    )
  })

  it("has the correct colors when primary variant is specified", async () => {
    wrapper.setProps({ variant: "primary" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("primary")
    expect(wrapper.vm.classNames).toEqual(
      expect.stringContaining("bg-blue-500 border-blue-700 hover:bg-blue-400 hover:border-blue-500")
    )
  })

  it("has the correct colors when brand variant is specified", async () => {
    wrapper.setProps({ variant: "brand" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("brand")
    expect(wrapper.vm.classNames).toEqual(
      expect.stringContaining("bg-violet-500 border-violet-700 hover:bg-violet-400 hover:border-violet-500")
    )
  })

  it("has the correct colors when danger variant is specified", async () => {
    wrapper.setProps({ variant: "danger" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("danger")
    expect(wrapper.vm.classNames).toEqual(
      expect.stringContaining("bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500")
    )
  })

  it("emits a click event when clicked", async () => {
    await wrapper.trigger("click")
    expect(wrapper.emitted("click")).toBeTruthy()
  })
})
