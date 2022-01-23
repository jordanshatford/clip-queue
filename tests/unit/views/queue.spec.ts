import { shallowMount } from "@vue/test-utils";
import Queue from "@/views/Queue.vue";
import { Clip } from "@/interfaces/clips";

describe("Queue.vue", () => {
  const wrapper = shallowMount(Queue);

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("returns the current progress of the queue", () => {
    expect(wrapper.vm.queueProgress).toEqual(0);
    wrapper.vm.clipQueue.state.allClips = [{} as Clip, {} as Clip];
    wrapper.vm.clipQueue.state.queue = [{} as Clip];
    expect(wrapper.vm.queueProgress).toEqual(50);
    wrapper.vm.clipQueue.state.allClips = [{} as Clip, {} as Clip, {} as Clip];
    wrapper.vm.clipQueue.state.queue = [{} as Clip, {} as Clip];
    expect(wrapper.vm.queueProgress).toEqual(33);
  });
});
