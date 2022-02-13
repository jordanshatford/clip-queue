import { defineStore } from "pinia"

export const DEFAULT_SUBREDDITS = ["LivestreamFail", "TwitchClips", "RPClipsGTA", "NoPixel"]

const loadingState = DEFAULT_SUBREDDITS.reduce((ac, a) => ({ ...ac, [a]: false }), {})

export const useReddit = defineStore("reddit", {
  state: () => ({
    postsToCheck: 25,
    custom: "",
    loading: {
      ...loadingState,
      custom: false,
    } as Record<string, boolean>,
  }),
  getters: {
    isLoading: (state) => {
      return (subreddit: string) => {
        if (subreddit === state.custom) {
          subreddit = "custom"
        }
        return state.loading?.[subreddit] ?? false
      }
    },
  },
  actions: {
    setLoading(subreddit: string, value: boolean) {
      if (subreddit === this.custom) {
        subreddit = "custom"
      }
      this.loading[subreddit] = value
    },
  },
})
