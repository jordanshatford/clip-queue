import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useClip } from '~/composables/useClip'
import { IntegrationID, type Clip } from '~/integrations'

const sourceMock = vi.fn((id: string) => ({ id }))
const providerMock = vi.fn(() => ({
  getPlayerConfig: vi.fn((clip: Clip) => ({ provider: clip.provider })),
}))

vi.mock('~/composables/useIntegrations', () => ({
  useIntegrations: () => ({
    source: sourceMock,
    provider: providerMock,
  }),
}))

function createClip(overrides: Partial<Clip> = {}): Clip {
  return {
    id: 'test',
    title: 'Test Clip',
    category: 'Test Category',
    channel: 'Test Channel',
    url: '',
    embedUrl: '',
    thumbnailUrl: '',
    submitters: ['ttv-chat:test-submitter'],
    provider: IntegrationID.TWITCH_CLIPS,
    ...overrides,
  }
}

describe('useClip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns uuid from toClipUUID', () => {
    const clip = createClip({ id: 'someclipid', provider: IntegrationID.TWITCH_CLIPS })
    const { uuid } = useClip(clip)
    expect(uuid).toBe('ttv-clips:someclipid')
  })

  it('builds subtitle with category', () => {
    const clip = createClip({
      channel: 'Test Channel',
      category: 'Test Category',
    })
    const { subtitle } = useClip(clip)
    expect(subtitle).toBe('Test Channel - Test Category')
  })

  it('builds subtitle without category', () => {
    const clip = createClip({
      channel: 'Test Channel',
      category: undefined,
    })
    const { subtitle } = useClip(clip)
    expect(subtitle).toBe('Test Channel')
  })

  it('returns undefined count when only 1 submitter', () => {
    const clip = createClip({
      submitters: ['only-one'],
    })
    const { count } = useClip(clip)
    expect(count).toBeUndefined()
  })

  it('returns count when multiple submitters', () => {
    const clip = createClip({
      submitters: ['a', 'b', 'c'],
    })
    const { count } = useClip(clip)
    expect(count).toBe('3')
  })

  it('caps count at MAX_COUNT', () => {
    const clip = createClip({
      submitters: Array.from({ length: 10000 }, (_, i) => `s${i}`),
    })
    const { count } = useClip(clip)
    expect(count).toBe('9999+')
  })

  it('resolves source when submitter exists', () => {
    const clip = createClip({
      submitters: ['ttv-chat:123'],
    })
    const { source } = useClip(clip)
    expect(source?.id).toEqual('ttv-chat')
  })

  it('returns undefined source when submitter is unknown', () => {
    const clip = createClip({
      submitters: ['unknown'],
    })
    const { source } = useClip(clip)
    expect(source).toBeUndefined()
  })

  it('returns provider and player config', () => {
    const clip = createClip({ embedUrl: 'test-url' })
    const { provider, playerConfig } = useClip(clip)
    expect(provider).toBeDefined()
    expect(playerConfig).toEqual({
      src: 'test-url&autoplay=true&parent=localhost',
      title: 'Test Clip',
      type: 'iframe',
    })
  })

  it('equals returns true for same clip UUID', () => {
    const clip = createClip({ channel: 'A' })
    const result = useClip(clip)
    expect(result.equals(clip)).toBe(true)
  })

  it('equals returns false for different clip ID', () => {
    const clipA = createClip({ id: 'A' })
    const clipB = createClip({ id: 'B' })
    const result = useClip(clipA)
    expect(result.equals(clipB)).toBe(false)
  })

  it('equals returns false for different clip provider', () => {
    const clipA = createClip({ provider: IntegrationID.TWITCH_CLIPS })
    const clipB = createClip({ provider: IntegrationID.KICK_CLIPS })
    const result = useClip(clipA)
    expect(result.equals(clipB)).toBe(false)
  })
})
