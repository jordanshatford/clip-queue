import { describe, it, expect, vi } from "vitest"
import { shallowMount } from "@vue/test-utils"
import AuthButton from "@/components/AuthButton.vue"
import Button from "@/components/common/Button.vue"

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe("AuthButton.vue", () => {
  const mockLogin = vi.fn()
  const mockLogout = vi.fn()

  const wrapper = shallowMount(AuthButton, {
    global: {
      components: {
        "v-button": Button,
      },
    },
    props: {
      isLoggedIn: false,
      login: mockLogin,
      logout: mockLogout,
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("calls the login function if the user is not logged in", async () => {
    wrapper.setProps({ isLoggedIn: false })
    await wrapper.vm.$nextTick()
    const vButton = wrapper.findComponent({ name: "v-button" })
    vButton.trigger("click")
    expect(mockLogin).toHaveBeenCalledTimes(1)
  })

  it("calls the logout function if the user is logged in", async () => {
    wrapper.setProps({ isLoggedIn: true })
    await wrapper.vm.$nextTick()
    const vButton = wrapper.findComponent({ name: "v-button" })
    vButton.trigger("click")
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })
})
