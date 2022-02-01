import { shallowMount } from "@vue/test-utils";
import Queue from "@/views/Queue.vue";
import { Clip } from "@/interfaces/clips";
import { ClipList } from "@/utils/clip-list";
import { clips } from "@/stores/clips";

describe("Queue.vue", () => {
  const wrapper = shallowMount(Queue);

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("returns the current progress of the queue", () => {
    expect(wrapper.vm.queueProgress).toEqual(0);
    clips.reset();
    wrapper.vm.clips.queue.current = {} as Clip;
    wrapper.vm.clips.queue.history = new ClipList({} as Clip);
    wrapper.vm.clips.queue.upcoming = new ClipList({} as Clip);
    expect(wrapper.vm.clips.queue.history.size()).toEqual(1);
    expect(wrapper.vm.clips.queue.upcoming.size()).toEqual(1);
    expect(wrapper.vm.queueProgress).toEqual(50);
    clips.reset();
    wrapper.vm.clips.queue.current = {} as Clip;
    wrapper.vm.clips.queue.history = new ClipList({} as Clip);
    wrapper.vm.clips.queue.upcoming = new ClipList({} as Clip, { id: "2" } as Clip);
    expect(wrapper.vm.clips.queue.history.size()).toEqual(1);
    expect(wrapper.vm.clips.queue.upcoming.size()).toEqual(2);
    expect(wrapper.vm.queueProgress).toEqual(33);
    clips.reset();
    wrapper.vm.clips.queue.current = { id: "test" } as Clip;
    wrapper.vm.clips.queue.history = new ClipList({} as Clip);
    wrapper.vm.clips.queue.upcoming = new ClipList({} as Clip, { id: "2" } as Clip);
    expect(wrapper.vm.queueProgress).toEqual(50);
  });
});
