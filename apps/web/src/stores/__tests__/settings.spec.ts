import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { DEFAULTS, useSettings } from '../settings'

describe('settings.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inits the settings with default value', () => {
    const settings = useSettings()
    expect(settings.isCommandsSettingsModified(DEFAULTS.commands)).toEqual(false)
    expect(settings.isQueueSettingsModified(DEFAULTS.queue)).toEqual(false)
  })

  it('updates the settings in local storage', () => {
    const settings = useSettings()
    localStorage.clear()
    expect(settings.commands.prefix).toEqual('!cq')
    settings.commands.prefix = '~'
    expect(settings.commands.prefix).toEqual('~')
  })

  it('returns if the settings are different', () => {
    const settings = useSettings()
    expect(
      settings.isCommandsSettingsModified({
        ...DEFAULTS.commands,
        prefix: '~dsa'
      })
    ).toEqual(true)
    expect(settings.isCommandsSettingsModified(settings.$state.commands)).toEqual(false)
    expect(
      settings.isQueueSettingsModified({
        ...DEFAULTS.queue,
        limit: 1000
      })
    ).toEqual(true)
    expect(settings.isQueueSettingsModified(settings.$state.queue)).toEqual(false)
  })

  it('detects when it has been modified', () => {
    const settings = useSettings()
    expect(settings.isModified).toEqual(false)
    settings.queue.limit = 100
    expect(settings.isModified).toEqual(true)
  })

  it('can reset itself to the defaults', () => {
    const settings = useSettings()
    settings.queue.limit = 100
    expect(settings.queue.limit).toEqual(100)
    settings.$reset()
    expect(settings.queue.limit).toEqual(null)
  })
})
