import { shallowMount } from "@vue/test-utils";
import TextArea from "@/components/common/TextArea.vue";

describe("TextArea.vue", () => {
  const wrapper = shallowMount(TextArea, {
    props: {
      modelValue: "test",
    },
  });

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("emits a update model value event when inputted", async () => {
    await wrapper.trigger("input");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });
});
