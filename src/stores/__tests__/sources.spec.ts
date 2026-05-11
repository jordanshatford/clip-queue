import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCommands } from '../commands'
import { useSources } from '../sources'

describe('sources.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('can have its settings reset', () => {
    const sources = useSources()
    sources.resetSettings()
    expect(sources.isSettingsModified).toEqual(false)
    sources.hasAutoModEnabled = false
    expect(sources.isSettingsModified).toEqual(true)
    sources.resetSettings()
    expect(sources.isSettingsModified).toEqual(false)
    expect(sources.hasAutoModEnabled).toEqual(true)
  })

  it('registers commands for interacting with the sources', () => {
    const commands = useCommands()
    useSources()
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
