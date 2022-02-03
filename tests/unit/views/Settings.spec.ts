import { shallowMount } from "@vue/test-utils";
import Settings from "@/views/Settings.vue";
import config from "@/assets/config";

const { defaultValue } = config.App.Settings;

describe("Settings.vue", () => {
  const wrapper = shallowMount(Settings);

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("has the same settings values as previous", () => {
    expect(wrapper.vm.formSettings).toEqual(defaultValue);
    expect(wrapper.vm.formNotChanged).toEqual(true);
  });

  it("resets the form to the settings when not saved", async () => {
    wrapper.vm.formSettings.chatCommandPrefix = "~";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formNotChanged).toEqual(false);
    wrapper.vm.onReset();
    expect(wrapper.vm.formNotChanged).toEqual(true);
    expect(wrapper.vm.formSettings).toEqual(defaultValue);
  });

  it("saves the form to the settings", async () => {
    wrapper.vm.formSettings.chatCommandPrefix = "~";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formNotChanged).toEqual(false);
    wrapper.vm.onSubmit();
    expect(wrapper.vm.showSaveMsg).toEqual(true);
    expect(wrapper.vm.formNotChanged).toEqual(true);
    expect(wrapper.vm.formSettings).toEqual({ ...defaultValue, chatCommandPrefix: "~" });
  });

  it("hides the save message", () => {
    wrapper.vm.showSaveMsg = true;
    wrapper.vm.hideMsg();
    expect(wrapper.vm.showSaveMsg).toEqual(false);
  });
});
