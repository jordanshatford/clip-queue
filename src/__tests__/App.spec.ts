import { shallowMount } from "@vue/test-utils"
import App from "@/App.vue"

describe("App.vue", () => {
  const wrapper = shallowMount(App)

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
