import { shallowMount } from "@vue/test-utils";
import ThemeChangeButton from "@/components/ThemeChangeButton.vue";

describe("ThemeChangeButton.vue", () => {
  const wrapper = shallowMount(ThemeChangeButton);

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("toggles the theme when clicked", () => {
    const theme = wrapper.vm.theme.state.theme;
    wrapper.vm.theme.toggle();
    expect(wrapper.vm.theme.state.theme).not.toEqual(theme);
  });
});
