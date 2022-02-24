import { shallowMount } from "@vue/test-utils"
import Input from "@/components/ui/Input.vue"

describe("Input.vue", () => {
  const wrapper = shallowMount(Input, {
    props: {
      modelValue: "test",
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("emits a update model value event when inputted", async () => {
    await wrapper.trigger("input")
    expect(wrapper.emitted("update:modelValue")).toBeTruthy()
  })
})
