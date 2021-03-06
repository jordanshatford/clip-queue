import { describe, it, expect, beforeEach, vi } from "vitest"
import { createPinia, setActivePinia } from "pinia"
import type { Clip } from "../../interfaces/clips"
import type { TwitchClip, TwitchGame } from "../../services/twitch"
import type { SubredditPost } from "../../services/reddit"
import { useClipFinder } from "../clip-finder"

const testGame = { id: "testgame", name: "Test Game" } as TwitchGame

const testClip = {
  id: "testclip",
  game_id: "testgame",
  title: "Test title",
  broadcaster_name: "testbroadcast",
  created_at: "",
  thumbnail_url: "",
  url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
  embed_url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
} as TwitchClip

vi.mock("@/services/twitch", () => {
  const mockFunction = vi.fn((ids: string[]) => {
    return ids.map((id) => {
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
  })
  const mockFunction2 = vi.fn((ids: string[]) => {
    return ids.map((id) => {
      return { id, name: "Test Game" } as TwitchGame
    })
  })
  return {
    default: {
      getClips: mockFunction,
      getGames: mockFunction2,
      getClipIdFromUrl: vi.fn((url: string) => {
        if (!url.includes("twitch")) {
          return undefined
        }
        try {
          const uri = new URL(url)
          const idStart = uri.pathname.lastIndexOf("/")
          return uri.pathname.slice(idStart).split("?")[0].slice(1)
        } catch {
          return undefined
        }
      }),
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
    setActivePinia(createPinia())
  })

  it("inits when values are already in localstorage", async () => {
    localStorage.setItem(
      "twitch-cache",
      JSON.stringify({ games: { [testGame.id]: testGame }, clips: { [testClip.id]: testClip } })
    )
    const clipFinder = useClipFinder()
    clipFinder.init()
    const cachedClip = await clipFinder.getTwitchClip(testClip.url)
    expect(cachedClip?.title).toEqual(testClip.title)
    expect(cachedClip?.game).toEqual(testGame.name)
  })

  it.each([
    ["", undefined],
    ["abc", undefined],
    ["https://developer.mozilla.org/en-US/docs/Web/API/URL/URL", undefined],
  ])("returns undefined for invalid input values", async (input: string, expected: Clip | undefined) => {
    const clipFinder = useClipFinder()
    expect(await clipFinder.getTwitchClip(input)).toEqual(expected)
  })

  it("returns a clip for valid links", async () => {
    const clipId = "CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j"
    const clipLink = `https://clips.twitch.tv/${clipId}`
    const clipFinder = useClipFinder()
    const result = await clipFinder.getTwitchClip(clipLink)
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
    const clipFinder = useClipFinder()
    const result = await clipFinder.getClipsFromSubreddit("testReddit")
    expect(result).toHaveLength(1)
    expect(result[0].id).toEqual("0")
    expect(result[0].submitter).toEqual("testReddit0")
  })
})
