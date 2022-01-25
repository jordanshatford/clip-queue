import { Clip } from "@/interfaces/clips";
import ClipFinder from "@/services/clip-finder";
import { TwitchClip, TwitchGame } from "@/interfaces/twitch";

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
});
