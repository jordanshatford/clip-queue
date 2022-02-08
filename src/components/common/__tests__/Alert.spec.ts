import { shallowMount } from "@vue/test-utils"
import Alert from "@/components/common/Alert.vue"

describe("Alert.vue", () => {
  const wrapper = shallowMount(Alert)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has a default variant of info with correct classes and icon", () => {
    expect(wrapper.vm.variant).toEqual("info")
    expect(wrapper.vm.classNames).toEqual(expect.stringContaining("bg-blue-100 dark:bg-blue-200 text-blue-700"))
    expect(wrapper.vm.icon).toEqual("info-circle")
  })

  it("has the correct classes and icon for info variant", async () => {
    wrapper.setProps({ variant: "info" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("info")
    expect(wrapper.vm.classNames).toEqual(expect.stringContaining("bg-blue-100 dark:bg-blue-200 text-blue-700"))
    expect(wrapper.vm.icon).toEqual("info-circle")
  })

  it("has the correct classes and icon for success variant", async () => {
    wrapper.setProps({ variant: "success" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("success")
    expect(wrapper.vm.classNames).toEqual(expect.stringContaining("bg-green-100 dark:bg-green-200 text-green-700"))
    expect(wrapper.vm.icon).toEqual("check-circle")
  })

  it("has the correct classes and icon for warning variant", async () => {
    wrapper.setProps({ variant: "warning" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("warning")
    expect(wrapper.vm.classNames).toEqual(expect.stringContaining("bg-yellow-100 dark:bg-yellow-200 text-yellow-700"))
    expect(wrapper.vm.icon).toEqual("exclamation-triangle")
  })

  it("has the correct classes and icon for danger variant", async () => {
    wrapper.setProps({ variant: "danger" })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.variant).toEqual("danger")
    expect(wrapper.vm.classNames).toEqual(expect.stringContaining("bg-red-100 dark:bg-red-200 text-red-700"))
    expect(wrapper.vm.icon).toEqual("times-circle")
  })
})
