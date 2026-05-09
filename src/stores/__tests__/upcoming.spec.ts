import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Clip } from '@/integrations'

import { clipFromKick, clipFromTwitch } from '@/__tests__/mocks'
import { IntegrationID } from '@/integrations'

import { useUpcoming } from '../upcoming'

describe('upcoming.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useUpcoming().reset()
  })

  it('initializes with the expected values', () => {
    const upcoming = useUpcoming()
    expect(upcoming.items).toEqual([])
    expect(upcoming.length).toEqual(0)
  })

  it('adds a clip to its list', () => {
    const upcoming = useUpcoming()
    const initialLength = upcoming.length
    upcoming.add(clipFromTwitch)
    expect(upcoming.length).toEqual(initialLength + 1)
    expect(upcoming.includes(clipFromTwitch)).toEqual(true)
    upcoming.reset()
    expect(upcoming.length).toEqual(0)
  })

  it('skips duplicate clips when adding to its list', () => {
    const upcoming = useUpcoming()
    const initialLength = upcoming.length
    upcoming.add(clipFromTwitch)
    expect(upcoming.length).toEqual(initialLength + 1)
    expect(upcoming.items).toContainEqual(clipFromTwitch)
    upcoming.add(clipFromTwitch)
    expect(upcoming.length).toEqual(initialLength + 1)
  })

  it('can remove clips that are in its list', () => {
    const upcoming = useUpcoming()
    upcoming.add(clipFromTwitch)
    upcoming.add(clipFromKick)
    const initialLength = upcoming.length
    expect(initialLength).toEqual(2)
    upcoming.remove(clipFromTwitch)
    expect(upcoming.items).not.toContainEqual(clipFromTwitch)
    expect(upcoming.length).toEqual(initialLength - 1)
    upcoming.remove({
      ...clipFromTwitch,
      id: 'not-valid',
      provider: IntegrationID.TWITCH_CLIPS,
      submitters: [],
    })
    expect(upcoming.length).toEqual(initialLength - 1)
  })

  it('removes user clips from its list based on submitter name', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromKick, submitters: ['jordan'] })
    upcoming.add({ ...clipFromKick, id: 'other', submitters: ['jordan2'] })
    upcoming.add({ ...clipFromKick, id: 'other2', submitters: ['jordan'] })
    expect(upcoming.length).toEqual(3)
    upcoming.removeBySubmitter('jordan')
    expect(upcoming.length).toEqual(1)
  })

  it('only removes the one submitter from a clip with many', () => {
    const upcoming = useUpcoming()
    upcoming.add({ ...clipFromKick, submitters: ['jordan'] })
    upcoming.add({ ...clipFromKick, submitters: ['jordan2'] })
    expect(upcoming.length).toEqual(1)
    upcoming.removeBySubmitter('jordan2')
    expect(upcoming.length).toEqual(1)
  })

  it('removes provider clips from the list based on provider ID', () => {
    const upcoming = useUpcoming()
    upcoming.add(clipFromKick)
    upcoming.add({ ...clipFromKick, id: 'other' })
    upcoming.add({ ...clipFromKick, id: 'other2' })
    upcoming.add(clipFromTwitch)
    expect(upcoming.length).toEqual(4)
    upcoming.removeByProvider(IntegrationID.KICK_CLIPS)
    expect(upcoming.length).toEqual(1)
  })
})
