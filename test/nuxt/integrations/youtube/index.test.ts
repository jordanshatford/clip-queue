import { describe, it, expect } from 'vitest'

import { IntegrationID } from '~/integrations/indentify'
import { youtube, shorts, videos } from '~/integrations/youtube'

const integration = youtube
const providers = [shorts, videos]

describe('integrations/youtube', () => {
  it('exports an integration object', () => {
    expect(integration).toBeDefined()
    expect(integration.id).toBe(IntegrationID.YOUTUBE)
    expect(integration.name).toBe('YouTube')
    expect(integration.url).toBe('https://www.youtube.com/')
  })

  it('contains branding details', () => {
    expect(integration.branding.icon).toBe('simple-icons:youtube')
    expect(integration.branding.primary).toBe('#FF0000')
    expect(integration.branding.secondary).toBe('#FFFFFF')
  })

  it('initializes providers', () => {
    for (const p of providers) {
      expect(integration.providers).toContain(p)
    }
  })

  it('returns default enabled state', () => {
    expect(integration.isEnabled).toBe(false)
  })

  it('updates enabled state via setter', () => {
    integration.isEnabled = false
    expect(integration.isEnabled).toBe(false)
    integration.isEnabled = true
    expect(integration.isEnabled).toBe(true)
  })

  it('matches Integration contract shape', () => {
    expect(integration).toMatchObject({
      id: IntegrationID.YOUTUBE,
      name: 'YouTube',
      url: expect.any(String),
      branding: expect.any(Object),
      providers: expect.any(Array),
    })
    expect(typeof integration.isEnabled).toBe('boolean')
  })
})
