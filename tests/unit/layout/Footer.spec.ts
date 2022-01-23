import { shallowMount } from "@vue/test-utils";
import Footer from "@/layout/Footer.vue";
import config from "@/assets/config";

describe("Footer.vue", () => {
  const wrapper = shallowMount(Footer);

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("has the proper creator, year, and github from config", () => {
    expect(wrapper.vm.creator).toEqual(config.App.creator);
    expect(wrapper.vm.year).toEqual(config.App.year);
    expect(wrapper.vm.github).toEqual(config.App.github);
  });
});
