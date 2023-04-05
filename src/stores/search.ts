import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { config } from '@/assets/config'
import { useClipFinder } from '@/stores/clip-finder'
import { ClipSource, type Clip } from '@/interfaces/clips'

const { resultsSize } = config.search

export interface Search {
  term: string
  loading: boolean
  results: Clip[]
}

export const useSearch = defineStore('search', {
  state: (): Search => ({
    term: '',
    loading: false,
    results: []
  }),
  actions: {
    async getFromSubreddit() {
      this.loading = true
      const toast = useToast()
      const clipFinder = useClipFinder()
      const subreddit = this.term
      try {
        const clips = await clipFinder.getClipsFromSubreddit(subreddit, resultsSize)
        if (clips.length === 0) {
          this.results = []
          toast.error(`Could not find any clips on r/${subreddit}`)
        } else {
          this.results = clips.map((c) => ({ ...c, source: ClipSource.REDDIT }))
          toast.success(`Found ${clips.length} clip(s) on r/${subreddit}`)
        }
      } catch (e) {
        this.results = []
        toast.error(`Failed to get clips from r/${subreddit}`)
      }
      this.loading = false
    }
  }
})
