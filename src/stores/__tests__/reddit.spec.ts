import { setActivePinia, createPinia } from "pinia"
import { useReddit, DEFAULT_SUBREDDITS } from "@/stores/reddit"

describe("reddit.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("has keys for each available subreddit from the config", () => {
    const reddit = useReddit()
    const loadingKeys = Object.keys(reddit.loading)
    for (const key of DEFAULT_SUBREDDITS) {
      expect(loadingKeys).toContain(key)
    }
    expect(loadingKeys).toContain("custom")
  })

  it("can set the loading value of state", () => {
    const reddit = useReddit()
    const testName = DEFAULT_SUBREDDITS[0]
    reddit.setLoading(testName, true)
    expect(reddit.isLoading(testName)).toEqual(true)
    reddit.setLoading(testName, false)
    expect(reddit.isLoading(testName)).toEqual(false)
  })

  it("can set the loading value of the custom reddit input", () => {
    const reddit = useReddit()
    const testName = "test"
    reddit.custom = testName
    reddit.setLoading(testName, true)
    expect(reddit.isLoading(testName)).toEqual(true)
    expect(reddit.loading["custom"]).toEqual(true)
    reddit.setLoading(testName, false)
    expect(reddit.isLoading(testName)).toEqual(false)
    expect(reddit.loading["custom"]).toEqual(false)
  })
})
