import { shallowMount } from "@vue/test-utils";
import Reddit from "@/views/Reddit.vue";
import { Clip } from "@/interfaces/clips";
import { clipQueue } from "@/stores/queue";

jest.mock("@/services/clip-finder", () => {
  const mockFunction = jest.fn((subreddit: string, callback?: (clip: Clip, done: boolean) => void) => {
    const clip = {
      submitter: "jordan",
      title: "Test title",
      channel: "testchannel",
      game: "testgame",
      timestamp: new Date("December 17, 1995 03:24:00").toDateString(),
      url: "https://www.twitch.tv/test",
      thumbnailUrl: "test",
    } as Clip;
    let clips: Clip[] = [];
    for (let i = 1; i <= 10; i++) {
      callback?.({ ...clip, id: `clip${i}` }, false);
      clips = [...clips, { ...clip, id: `clip${i}` }];
    }
    callback?.({}, true);
    return clips;
  });
  return {
    getClipsFromSubreddit: mockFunction,
  };
});

describe("Reddit.vue", () => {
  const wrapper = shallowMount(Reddit);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true);
  });

  it("queues clips for a subreddit", () => {
    const spy = jest.spyOn(clipQueue, "addClip");
    wrapper.vm.queueClipsForSubreddit("test");
    expect(spy).toHaveBeenCalledTimes(10);
  });
});
