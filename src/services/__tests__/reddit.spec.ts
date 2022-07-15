import { describe, it, expect, vi, beforeEach } from "vitest"
import type { Subreddit } from "../reddit"
import reddit from "../reddit"

vi.mock("axios", () => {
  return {
    default: {
      get: vi.fn().mockResolvedValue({
        data: {
          data: {
            children: [
              {
                data: {
                  author: "test1",
                  url: "/test/1",
                  stickied: false,
                },
              },
              {
                data: {
                  author: "test2",
                  url: "/test/2",
                  stickied: true,
                },
              },
            ],
          } as Subreddit,
        },
      }),
    },
  }
})

describe("reddit.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("gets subreddit posts from reddit", async () => {
    const subredditInfo = await reddit.getSubredditPosts("test")
    expect(subredditInfo).toHaveLength(2)
    expect(subredditInfo[0].data).toEqual({
      author: "test1",
      url: "/test/1",
      stickied: false,
    })
  })
})
