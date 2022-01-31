import { shallowMount } from "@vue/test-utils";
import Queue from "@/views/Queue.vue";
import { Clip } from "@/interfaces/clips";
import { ClipList } from "@/utils/clip-list";
import { clipQueue } from "@/stores/queue";

describe("Queue.vue", () => {
  const wrapper = shallowMount(Queue);

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("returns the current progress of the queue", () => {
    expect(wrapper.vm.queueProgress).toEqual(0);
    clipQueue.reset();
    wrapper.vm.clipQueue.queue.current = {} as Clip;
    wrapper.vm.clipQueue.queue.history = new ClipList({} as Clip);
    wrapper.vm.clipQueue.queue.upcoming = new ClipList({} as Clip);
    expect(wrapper.vm.clipQueue.queue.history.size()).toEqual(1);
    expect(wrapper.vm.clipQueue.queue.upcoming.size()).toEqual(1);
    expect(wrapper.vm.queueProgress).toEqual(50);
    clipQueue.reset();
    wrapper.vm.clipQueue.queue.current = {} as Clip;
    wrapper.vm.clipQueue.queue.history = new ClipList({} as Clip);
    wrapper.vm.clipQueue.queue.upcoming = new ClipList({} as Clip, { id: "2" } as Clip);
    expect(wrapper.vm.clipQueue.queue.history.size()).toEqual(1);
    expect(wrapper.vm.clipQueue.queue.upcoming.size()).toEqual(2);
    expect(wrapper.vm.queueProgress).toEqual(33);
    clipQueue.reset();
    wrapper.vm.clipQueue.queue.current = { id: "test" } as Clip;
    wrapper.vm.clipQueue.queue.history = new ClipList({} as Clip);
    wrapper.vm.clipQueue.queue.upcoming = new ClipList({} as Clip, { id: "2" } as Clip);
    expect(wrapper.vm.queueProgress).toEqual(50);
  });
});
