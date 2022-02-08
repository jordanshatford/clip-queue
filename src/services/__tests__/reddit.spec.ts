import type { MockedObject } from "vitest"
import axios from "axios"
import type { Subreddit } from "@/interfaces/reddit"
import Reddit from "@/services/reddit"

vi.mock("axios")
const mockedAxios = axios as MockedObject<typeof axios>

describe.skip("reddit.ts", () => {
  const testSubreddit = {
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
  } as Subreddit

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("gets subreddit posts from reddit", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: testSubreddit },
    })
    const subredditInfo = await Reddit.getSubredditPosts("test")
    expect(subredditInfo).toHaveLength(2)
    expect(subredditInfo[0].data).toEqual({
      author: "test1",
      url: "/test/1",
      stickied: false,
    })
  })
})
