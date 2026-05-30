import { describe, it, expect } from 'vitest'

import { IntegrationID } from '~/integrations/indentify'
import { kick, clips, vods } from '~/integrations/kick'

const integration = kick
const providers = [clips, vods]

describe('integrations/kick', () => {
  it('exports an integration object', () => {
    expect(integration).toBeDefined()
    expect(integration.id).toBe(IntegrationID.KICK)
    expect(integration.name).toBe('Kick')
    expect(integration.url).toBe('https://kick.com/')
  })

  it('contains branding details', () => {
    expect(integration.branding.icon).toBe('simple-icons:kick')
    expect(integration.branding.primary).toBe('#00E701')
    expect(integration.branding.secondary).toBe('#0B0E0F')
  })

  it('initializes providers', () => {
    for (const p of providers) {
      expect(integration.providers).toContain(p)
    }
  })

  it('returns default enabled state', () => {
    expect(integration.isEnabled).toBe(undefined)
  })

  it('matches Integration contract shape', () => {
    expect(integration).toMatchObject({
      id: IntegrationID.KICK,
      name: 'Kick',
      url: expect.any(String),
      branding: expect.any(Object),
      providers: expect.any(Array),
    })
    expect(typeof integration.isEnabled).toBe('boolean')
  })
})
