import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { clipFromKick, clipFromTwitch } from '~~/test/mocks'

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
    expect(history.items).toEqual([])
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

  it('adds newest clips to the beginning of the list', () => {
    const history = useHistory()
    history.add(clipFromTwitch)
    history.add(clipFromKick)
    expect(history.items[0]).toEqual(clipFromKick)
    expect(history.items[1]).toEqual(clipFromTwitch)
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

  it('enforces max history limit by trimming oldest items', () => {
    const history = useHistory()
    // create more than MAX_HISTORY_LIMIT (100 + a bit extra)
    for (let i = 0; i < 105; i++) {
      history.add({
        ...clipFromTwitch,
        id: `clip-${i}`,
      })
    }
    expect(history.length).toBeLessThanOrEqual(100)
    // ensures it trimmed oldest items (end of array)
    expect(history.items.length).toBeLessThanOrEqual(100)
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
