import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useReddit } from '../reddit'

describe('reddit.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('is created in a none loading state', () => {
    const reddit = useReddit()
    expect(reddit.subreddit).toEqual('')
    expect(reddit.loading).toEqual(false)
  })
})
