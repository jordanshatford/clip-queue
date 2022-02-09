import { shallowMount } from "@vue/test-utils"
import ProgressBar from "@/components/common/ProgressBar.vue"

describe("ProgressBar.vue", () => {
  const wrapper = shallowMount(ProgressBar, {
    props: {
      value: 50,
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has a default variant of primary with the correct colors", () => {
    expect(wrapper.vm.variant).toEqual("primary")
    const progressBar = wrapper.find("#progressBar")
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.classes()).toContain("bg-blue-500")
  })

  it("has the correct colors when primary variant is specified", async () => {
    wrapper.setProps({ variant: "primary" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("primary")
    const progressBar = wrapper.find("#progressBar")
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.classes()).toContain("bg-blue-500")
  })

  it("has the correct colors when brand variant is specified", async () => {
    wrapper.setProps({ variant: "brand" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("brand")
    const progressBar = wrapper.find("#progressBar")
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.classes()).toContain("bg-violet-500")
  })

  it("has the correct colors when danger variant is specified", async () => {
    wrapper.setProps({ variant: "danger" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("danger")
    const progressBar = wrapper.find("#progressBar")
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.classes()).toContain("bg-red-500")
  })
})
