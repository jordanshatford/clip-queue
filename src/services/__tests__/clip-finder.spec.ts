import type { Clip } from "@/interfaces/clips"
import ClipFinder from "@/services/clip-finder"
import type { TwitchClip, TwitchGame } from "@/interfaces/twitch"
import type { SubredditPost } from "@/services/reddit"

vi.mock("@/services/twitch-api", () => {
  const mockFunction = vi.fn((id: string) => {
    return {
      id,
      game_id: "testgame",
      title: "Test title",
      broadcaster_name: "testbroadcast",
      created_at: "",
      thumbnail_url: "",
      url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
      embed_url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
    } as TwitchClip
  })
  const mockFunction2 = vi.fn((id: string) => {
    return { id, name: "Test Game" } as TwitchGame
  })
  return {
    default: {
      getClip: mockFunction,
      getGame: mockFunction2,
    },
  }
})

vi.mock("@/services/reddit", () => {
  const mockFunction = vi.fn((subreddit: string) => {
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
    ]
    return testPost
  })
  return {
    default: {
      getSubredditPosts: mockFunction,
    },
  }
})

describe("clip-finder.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    ["", undefined],
    ["abc", undefined],
    ["https://developer.mozilla.org/en-US/docs/Web/API/URL/URL", undefined],
  ])("returns undefined for invalid input values", async (input: string, expected: Clip | undefined) => {
    expect(await ClipFinder.getTwitchClip(input)).toEqual(expected)
  })

  it("returns a clip for valid links", async () => {
    const clipId = "CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j"
    const clipLink = `https://clips.twitch.tv/${clipId}`
    const result = await ClipFinder.getTwitchClip(clipLink)
    expect(result).toEqual({
      channel: "testbroadcast",
      game: "Test Game",
      id: clipId,
      timestamp: "",
      title: "Test title",
      url: clipLink,
      embedUrl: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
      thumbnailUrl: "",
    })
  })

  it("returns clips from a subreddit", async () => {
    let i = 0
    const result = await ClipFinder.getClipsFromSubreddit("testReddit", (clip, done) => {
      if (!done) {
        expect(clip.id).toEqual(`${i}`)
        expect(clip.submitter).toEqual(`testReddit${i}`)
        i++
      }
    })
    expect(result).toHaveLength(i)
  })
})
