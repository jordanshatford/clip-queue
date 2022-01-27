import { loading } from "@/stores/loading";
import config from "@/assets/config";

describe("loading.ts", () => {
  it("has keys for each available subreddit from the config", () => {
    const { availableSubreddits } = config.Reddit;
    const loadingKeys = Object.keys(loading.state);
    for (const key of loadingKeys) {
      expect(availableSubreddits).toContain(key);
    }
  });

  it("can set the loading value of state", () => {
    const { availableSubreddits } = config.Reddit;
    const testName = availableSubreddits[0];
    loading.setLoading(testName, true);
    expect(loading.state[testName]).toEqual(true);
    loading.setLoading(testName, false);
    expect(loading.state[testName]).toEqual(false);
  });
});
