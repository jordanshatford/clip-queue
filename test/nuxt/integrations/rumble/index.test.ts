import { describe, it, expect } from 'vitest'

import { IntegrationID } from '~/integrations/indentify'
import { rumble, shorts, videos } from '~/integrations/rumble'

const integration = rumble
const providers = [shorts, videos]

describe('integrations/rumble', () => {
  it('exports an integration object', () => {
    expect(integration).toBeDefined()
    expect(integration.id).toBe(IntegrationID.RUMBLE)
    expect(integration.name).toBe('Rumble')
    expect(integration.url).toBe('https://www.rumble.com/')
  })

  it('contains branding details', () => {
    expect(integration.branding.icon).toBe('simple-icons:rumble')
    expect(integration.branding.primary).toBe('#85C742')
    expect(integration.branding.secondary).toBe('#A9B8C3')
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
      id: IntegrationID.RUMBLE,
      name: 'Rumble',
      url: expect.any(String),
      branding: expect.any(Object),
      isExperimental: false,
      providers: expect.any(Array),
    })
    expect(typeof integration.isEnabled).toBe('boolean')
  })
})
