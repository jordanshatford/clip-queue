import { defineStore } from 'pinia'

export const useReddit = defineStore('reddit', {
  state: () => ({
    postsToCheck: 25,
    subreddit: '',
    loading: false
  })
})
