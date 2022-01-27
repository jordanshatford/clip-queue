import axios from "axios";
import { Subreddit } from "@/interfaces/reddit";
import Reddit from "@/services/reddit";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("reddit.ts", () => {
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
  } as Subreddit;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets subreddit posts from reddit", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: testSubreddit },
    });
    const subredditInfo = await Reddit.getSubredditPosts("test");
    expect(subredditInfo).toHaveLength(2);
    expect(subredditInfo[0].data).toEqual({
      author: "test1",
      url: "/test/1",
      stickied: false,
    });
  });
});
