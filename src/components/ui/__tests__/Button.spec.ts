import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import Button from "../v-button.vue"

describe("Button.vue", () => {
  const wrapper = shallowMount(Button)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has a default variant of primary with the correct colors", () => {
    expect(wrapper.vm.variant).toEqual("primary")
    expect(wrapper.classes()).toContain("cq-btn")
    expect(wrapper.classes()).toContain("cq-btn-primary")
  })

  it("has the correct colors when primary variant is specified", async () => {
    wrapper.setProps({ variant: "primary" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("primary")
    expect(wrapper.classes()).toContain("cq-btn")
    expect(wrapper.classes()).toContain("cq-btn-primary")
  })

  it("has the correct colors when brand variant is specified", async () => {
    wrapper.setProps({ variant: "brand" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("brand")
    expect(wrapper.classes()).toContain("cq-btn")
    expect(wrapper.classes()).toContain("cq-btn-brand")
  })

  it("has the correct colors when danger variant is specified", async () => {
    wrapper.setProps({ variant: "danger" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("danger")
    expect(wrapper.classes()).toContain("cq-btn")
    expect(wrapper.classes()).toContain("cq-btn-danger")
  })

  it("emits a click event when clicked", async () => {
    await wrapper.trigger("click")
    expect(wrapper.emitted("click")).toBeTruthy()
  })
})
