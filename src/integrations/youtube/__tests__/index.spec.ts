import { describe, it, expect } from 'vitest'

import { IntegrationID } from '@/integrations/indentify'

import { youtube, shorts, videos } from '..'

const integration = youtube
const providers = [shorts, videos]

describe('integrations/youtube', () => {
  it('exports an integration object', () => {
    expect(integration).toBeDefined()
    expect(integration.id).toBe(IntegrationID.YOUTUBE)
    expect(integration.name).toBe('YouTube')
    expect(integration.url).toBe('https://www.youtube.com/')
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
      id: IntegrationID.YOUTUBE,
      name: 'YouTube',
      url: expect.any(String),
      icon: expect.any(String),
      isExperimental: false,
      providers: expect.any(Array),
    })
    expect(typeof integration.isEnabled).toBe('boolean')
  })
})
