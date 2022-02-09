import { shallowMount } from "@vue/test-utils"
import Nav from "@/components/nav/Nav.vue"
import config from "@/assets/config"

describe("Nav.vue", () => {
  const wrapper = shallowMount(Nav)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the proper title from config", () => {
    expect(wrapper.vm.title).toEqual(config.App.title)
  })
})
