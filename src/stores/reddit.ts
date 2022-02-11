import { defineStore } from "pinia"
import config from "@/assets/config"

const { availableSubreddits } = config.Reddit
const loadingState = availableSubreddits.reduce((ac, a) => ({ ...ac, [a]: false }), {})

export const useReddit = defineStore("reddit", {
  state: () => ({
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
