import { Clip } from "@/interfaces/clips";
import ClipFinder from "@/services/clip-finder";
import { TwitchClip, TwitchGame } from "@/interfaces/twitch";
import { SubredditPost } from "@/interfaces/reddit";

jest.mock("@/services/twitch-api", () => {
  const mockFunction = jest.fn((id: string) => {
    return {
      id,
      game_id: "testgame",
      title: "Test title",
      broadcaster_name: "testbroadcast",
      created_at: "",
      thumbnail_url: "",
      url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
    } as TwitchClip;
  });
  const mockFunction2 = jest.fn((id: string) => {
    return { id, name: "Test Game" } as TwitchGame;
  });
  return {
    getClip: mockFunction,
    getGame: mockFunction2,
  };
});

jest.mock("@/services/reddit", () => {
  const mockFunction = jest.fn((subreddit: string) => {
    const testPost: SubredditPost[] = [
      {
        data: {
          author: `${subreddit}0`,
          url: "https://clips.twitch.tv/0",
          stickied: false,
        },
      },
      {
        data: {
          author: `${subreddit}1`,
          url: "https://clips.twitch.tv/1",
          stickied: true,
        },
      },
    ];
    return testPost;
  });
  return {
    getSubredditPosts: mockFunction,
  };
});

describe("clip-finder.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["", undefined],
    ["abc", undefined],
    ["https://developer.mozilla.org/en-US/docs/Web/API/URL/URL", undefined],
  ])("returns undefined for invalid input values", async (input: string, expected: Clip | undefined) => {
    expect(await ClipFinder.getTwitchClip(input)).toEqual(expected);
  });

  it("returns a clip for valid links", async () => {
    const clipId = "CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j";
    const clipLink = `https://clips.twitch.tv/${clipId}`;
    const result = await ClipFinder.getTwitchClip(clipLink);
    expect(result).toEqual({
      channel: "testbroadcast",
      game: "Test Game",
      id: clipId,
      timestamp: "",
      title: "Test title",
      url: clipLink,
      thumbnailUrl: "",
    });
  });

  it("returns clips from a subreddit", async () => {
    let i = 0;
    const result = await ClipFinder.getClipsFromSubreddit("testReddit", (clip, done) => {
      if (!done) {
        expect(clip.id).toEqual(`${i}`);
        expect(clip.submitter).toEqual(`testReddit${i}`);
        i++;
      }
    });
    expect(result).toHaveLength(i);
  });
});