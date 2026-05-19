import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { clipFromKick, clipFromTwitch } from '../../mocks'

describe('history.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with the expected values', () => {
    const history = useHistory()
    expect(history.items).toEqual([])
    expect(history.length).toEqual(0)
  })

  it('can be reset back to its defaults', () => {
    const history = useHistory()
    history.add(clipFromTwitch)
    history.add(clipFromKick)
    expect(history.length).toEqual(2)
    history.reset()
    expect(history.length).toEqual(0)
  })

  it('does not add duplicate clips', () => {
    const history = useHistory()
    history.add(clipFromTwitch)
    expect(history.length).toEqual(1)
    history.add(clipFromTwitch)
    expect(history.length).toEqual(1)
    history.add(clipFromKick)
    expect(history.length).toEqual(2)
  })

  it('can remove a specific clip', () => {
    const history = useHistory()
    history.add(clipFromTwitch)
    history.add(clipFromKick)
    expect(history.length).toEqual(2)
    history.remove(clipFromKick)
    expect(history.length).toEqual(1)
    expect(history.items).toContainEqual(clipFromTwitch)
    expect(history.items).not.toContainEqual(clipFromKick)
  })

  it('registers commands for interacting with the history', () => {
    const commands = useCommands()
    useHistory()
    const cmd = commands.commands['purgehistory']
    expect(cmd).toBeDefined()
    expect(cmd?.id).toEqual('purgehistory')
    expect(cmd?.aliases).toEqual(['rmhistory'])
  })
})
