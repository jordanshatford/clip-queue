import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useModeration } from '../moderation'

describe('moderation.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has ability to enable if chat moderation effects queue', () => {
    const moderation = useModeration()
    expect(moderation.hasAutoRemoveClipsEnabled).toBe(true)
  })
})
