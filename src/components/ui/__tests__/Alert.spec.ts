import { describe, it, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import Alert from "../v-alert.vue"

describe("Alert.vue", () => {
  const wrapper = shallowMount(Alert)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has a default variant of info with correct classes and icon", () => {
    expect(wrapper.vm.variant).toEqual("info")
    expect(wrapper.classes()).toContain("cq-alert-info")
  })

  it("has the correct classes and icon for info variant", async () => {
    wrapper.setProps({ variant: "info" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("info")
    expect(wrapper.classes()).toContain("cq-alert-info")
  })

  it("has the correct classes and icon for success variant", async () => {
    wrapper.setProps({ variant: "success" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("success")
    expect(wrapper.classes()).toContain("cq-alert-success")
  })

  it("has the correct classes and icon for warning variant", async () => {
    wrapper.setProps({ variant: "warning" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("warning")
    expect(wrapper.classes()).toContain("cq-alert-warning")
  })

  it("has the correct classes and icon for danger variant", async () => {
    wrapper.setProps({ variant: "danger" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("danger")
    expect(wrapper.classes()).toContain("cq-alert-danger")
  })
})
