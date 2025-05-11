import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  DEFAULT_COMMAND_SETTINGS,
  DEFAULT_LOGGER_SETTINGS,
  DEFAULT_QUEUE_SETTINGS,
  useSettings
} from '../settings'

describe('settings.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inits the settings with default value', () => {
    const settings = useSettings()
    expect(settings.isCommandsSettingsModified(DEFAULT_COMMAND_SETTINGS)).toEqual(false)
    expect(settings.isQueueSettingsModified(DEFAULT_QUEUE_SETTINGS)).toEqual(false)
    expect(settings.isLoggerSettingsModified(DEFAULT_LOGGER_SETTINGS)).toEqual(false)
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
        ...DEFAULT_COMMAND_SETTINGS,
        prefix: '~dsa'
      })
    ).toEqual(true)
    expect(settings.isCommandsSettingsModified(settings.$state.commands)).toEqual(false)
    expect(
      settings.isQueueSettingsModified({
        ...DEFAULT_QUEUE_SETTINGS,
        limit: 1000
      })
    ).toEqual(true)
    expect(settings.isQueueSettingsModified(settings.$state.queue)).toEqual(false)
    expect(
      settings.isLoggerSettingsModified({
        ...DEFAULT_LOGGER_SETTINGS,
        limit: -100
      })
    ).toEqual(true)
    expect(settings.isLoggerSettingsModified(settings.$state.logger)).toEqual(false)
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
    expect(settings.queue).toEqual(DEFAULT_QUEUE_SETTINGS)
    expect(settings.commands).toEqual(DEFAULT_COMMAND_SETTINGS)
    expect(settings.logger).toEqual(DEFAULT_LOGGER_SETTINGS)
  })
})
