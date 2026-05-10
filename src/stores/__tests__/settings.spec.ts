import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCommands } from '../commands'
import { DEFAULT_APPLICATION_SETTINGS, DEFAULT_LOGGER_SETTINGS, useSettings } from '../settings'

describe('settings.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inits the settings with default value', () => {
    const settings = useSettings()
    expect(settings.isApplicationSettingsModified(DEFAULT_APPLICATION_SETTINGS)).toEqual(false)
    expect(settings.isLoggerSettingsModified(DEFAULT_LOGGER_SETTINGS)).toEqual(false)
  })

  it('updates the settings in local storage', () => {
    const settings = useSettings()
    localStorage?.clear()
    expect(settings.application.prefix).toEqual('!cq')
    settings.application.prefix = '~'
    expect(settings.application.prefix).toEqual('~')
  })

  it('returns if the settings are different', () => {
    const settings = useSettings()
    expect(
      settings.isApplicationSettingsModified({
        ...DEFAULT_APPLICATION_SETTINGS,
        prefix: '~dsa',
      }),
    ).toEqual(true)
    expect(settings.isApplicationSettingsModified(settings.$state.application)).toEqual(false)
    expect(
      settings.isApplicationSettingsModified({
        ...DEFAULT_APPLICATION_SETTINGS,
        limit: 1000,
      }),
    ).toEqual(true)
    expect(settings.isApplicationSettingsModified(settings.$state.application)).toEqual(false)
    expect(
      settings.isLoggerSettingsModified({
        ...DEFAULT_LOGGER_SETTINGS,
        limit: -100,
      }),
    ).toEqual(true)
    expect(settings.isLoggerSettingsModified(settings.$state.logger)).toEqual(false)
  })

  it('detects when it has been modified', () => {
    const settings = useSettings()
    expect(settings.isModified).toEqual(false)
    settings.application.limit = 100
    expect(settings.isModified).toEqual(true)
  })

  it('can reset itself to the defaults', () => {
    const settings = useSettings()
    settings.application.limit = 100
    expect(settings.application.limit).toEqual(100)
    settings.reset()
    expect(settings.application).toEqual(DEFAULT_APPLICATION_SETTINGS)
    expect(settings.logger).toEqual(DEFAULT_LOGGER_SETTINGS)
  })

  it('registers commands for interacting with the queue', () => {
    const commands = useCommands()
    useSettings()
    const cmd = commands.commands['setlimit']
    expect(cmd).toBeDefined()
    expect(cmd?.id).toEqual('setlimit')
    expect(cmd?.aliases).toEqual(['limit'])
    const cmd2 = commands.commands['removelimit']
    expect(cmd2).toBeDefined()
    expect(cmd2?.id).toEqual('removelimit')
    expect(cmd2?.aliases).toEqual(['rmlimit'])
    const cmd3 = commands.commands['enableautomod']
    expect(cmd3).toBeDefined()
    expect(cmd3?.id).toEqual('enableautomod')
    expect(cmd3?.aliases).toEqual(['enableautomoderation', 'automod'])
    const cmd4 = commands.commands['disableautomod']
    expect(cmd4).toBeDefined()
    expect(cmd4?.id).toEqual('disableautomod')
    expect(cmd4?.aliases).toEqual(['disableautomoderation', 'dautomod'])
  })
})
