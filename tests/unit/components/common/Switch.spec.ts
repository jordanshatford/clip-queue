import { shallowMount } from "@vue/test-utils";
import Switch from "@/components/common/Switch.vue";

describe("Switch.vue", () => {
  const wrapper = shallowMount(Switch, {
    props: {
      id: "test",
      modelValue: false,
    },
  });

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });
});
