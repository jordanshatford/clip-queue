import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { DEFAULTS, useSettings, type Settings } from '../settings'

describe('settings.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inits the settings with default value', () => {
    const settings = useSettings()
    expect(settings.commandPrefix).toEqual('!cq')
    expect(settings.isModified(DEFAULTS)).toEqual(false)
  })

  it('updates the settings in local storage', () => {
    const settings = useSettings()
    localStorage.clear()
    expect(settings.commandPrefix).toEqual('!cq')
    settings.update({
      commandPrefix: '~'
    } as Settings)
    expect(settings.commandPrefix).toEqual('~')
  })

  it('returns if the settings are different', () => {
    const settings = useSettings()
    expect(
      settings.isModified({
        commandPrefix: '~dsa'
      } as Settings)
    ).toEqual(true)
    expect(settings.isModified(settings.$state)).toEqual(false)
  })
})
