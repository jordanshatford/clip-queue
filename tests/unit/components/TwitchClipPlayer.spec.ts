import { shallowMount } from "@vue/test-utils";
import TwitchClipPlayer from "@/components/TwitchClipPlayer.vue";
import { Clip } from "@/interfaces/clips";

describe("TwitchClipPlayer.vue", () => {
  const wrapper = shallowMount(TwitchClipPlayer, {
    props: {
      clip: {
        id: "test",
        title: "Test title",
        channel: "testchannel",
        game: "testgame",
        timestamp: new Date("December 17, 1995 03:24:00").toISOString(),
        url: "https://www.twitch.tv/test",
        thumbnailUrl: "test",
      } as Clip,
    },
  });

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("successfully shows the time ago for the clip", async () => {
    expect(wrapper.vm.timeAgo).not.toEqual("");
  });

  it("returns no time ago when it doesnt have a clip timestamp", async () => {
    wrapper.setProps({ clip: {} as Clip });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.timeAgo).toEqual("");
  });
});
