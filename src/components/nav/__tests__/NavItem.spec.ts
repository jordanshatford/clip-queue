import type { RouteRecordRaw } from "vue-router"
import { shallowMount } from "@vue/test-utils"
import NavItem from "@/components/nav/NavItem.vue"

describe("NavItem.vue", () => {
  const wrapper = shallowMount(NavItem, {
    props: {
      isMobileMenu: false,
      route: {
        name: "Test",
        path: "/test",
      } as RouteRecordRaw,
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the correct route as a prop", () => {
    expect(wrapper.vm.route.name).toEqual("Test")
    expect(wrapper.vm.route.path).toEqual("/test")
  })

  it("does not have block visibility when not mobile", async () => {
    wrapper.setProps({ isMobileMenu: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.classNames).toEqual(expect.not.stringContaining("block"))
  })

  it("does have block visibility when on mobile", async () => {
    wrapper.setProps({ isMobileMenu: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.classNames).toEqual(expect.stringContaining("block"))
  })
})
