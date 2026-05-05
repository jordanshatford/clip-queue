import { describe, it, expect } from 'vitest'

import { IntegrationID } from '@/integrations/indentify'

import { kick, clips, vods } from '..'

const integration = kick
const providers = [clips, vods]

describe('integrations/kick', () => {
  it('exports an integration object', () => {
    expect(integration).toBeDefined()
    expect(integration.id).toBe(IntegrationID.KICK)
    expect(integration.name).toBe('Kick')
    expect(integration.url).toBe('https://kick.com/')
  })

  it('contains svg icon', () => {
    expect(integration.icon).toContain('<svg')
    expect(integration.icon).toContain('</svg>')
  })

  it('initializes providers', () => {
    for (const p of providers) {
      expect(integration.providers).toContain(p)
    }
  })

  it('returns default enabled state', () => {
    expect(integration.isEnabled).toBe(true)
  })

  it('updates enabled state via setter', () => {
    integration.isEnabled = false
    expect(integration.isEnabled).toBe(false)
    integration.isEnabled = true
    expect(integration.isEnabled).toBe(true)
  })

  it('matches Integration contract shape', () => {
    expect(integration).toMatchObject({
      id: IntegrationID.KICK,
      name: 'Kick',
      url: expect.any(String),
      icon: expect.any(String),
      isExperimental: false,
      providers: expect.any(Array),
    })
    expect(typeof integration.isEnabled).toBe('boolean')
  })
})
