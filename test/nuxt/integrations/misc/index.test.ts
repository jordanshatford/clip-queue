import { describe, it, expect } from 'vitest'

import { IntegrationID } from '~/integrations/indentify'
import { misc, soop, streamable, vimeo } from '~/integrations/misc'

const integration = misc
const providers = [soop, streamable, vimeo]

describe('integrations/misc', () => {
  it('exports an integration object', () => {
    expect(integration).toBeDefined()
    expect(integration.id).toBe(IntegrationID.MISCELLANEOUS)
    expect(integration.name).toBe('Miscellaneous')
    expect(integration.url).toBe('')
  })

  it('contains branding details', () => {
    expect(integration.branding.icon).toBe('lucide:folder')
    expect(integration.branding.primary).toBe('')
    expect(integration.branding.secondary).toBe(undefined)
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
      id: IntegrationID.MISCELLANEOUS,
      name: 'Miscellaneous',
      url: expect.any(String),
      branding: expect.any(Object),
      isExperimental: true,
      providers: expect.any(Array),
    })
    expect(typeof integration.isEnabled).toBe('boolean')
  })
})
