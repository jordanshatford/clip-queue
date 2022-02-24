import { shallowMount } from "@vue/test-utils"
import AppFooter from "@/components/AppFooter.vue"
import config from "@/assets/config"

describe("AppFooter.vue", () => {
  const wrapper = shallowMount(AppFooter)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("has the proper creator, year, and github from config", () => {
    expect(wrapper.vm.creator).toEqual(config.App.creator)
    expect(wrapper.vm.year).toEqual(config.App.year)
    expect(wrapper.vm.github).toEqual(config.App.github)
  })
})
