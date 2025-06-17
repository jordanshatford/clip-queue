import { beforeAll, describe, expect, it } from 'vitest'

import { EventEmitter } from '../emitter'

type TestEvents = {
  test: () => void
  test2: (t: string) => void
  test3: (t: string, t2: string) => void
}

describe('emitter.ts', () => {
  let emitter: EventEmitter<TestEvents> | undefined

  beforeAll(() => {
    emitter = new EventEmitter<TestEvents>()
  })

  it('is defined', () => {
    expect(emitter).toBeDefined()
  })

  it('can listen and emit events without arguments', () => {
    let hasBeenCalled = false
    emitter?.on('test', () => {
      hasBeenCalled = true
    })
    emitter?.emit('test')
    expect(hasBeenCalled).toEqual(true)
  })

  it('can listen and emit events with a single argument', () => {
    let hasBeenCalled = false
    emitter?.on('test2', (t) => {
      hasBeenCalled = true
      expect(t).toEqual('value')
    })
    emitter?.emit('test2', 'value')
    expect(hasBeenCalled).toEqual(true)
  })

  it('can listen and emit events with a multiple arguments', () => {
    let hasBeenCalled = false
    emitter?.on('test3', (t, t2) => {
      hasBeenCalled = true
      expect(t).toEqual('value')
      expect(t2).toEqual('value2')
    })
    emitter?.emit('test3', 'value', 'value2')
    expect(hasBeenCalled).toEqual(true)
  })

  it('can listen for multiple calls to the same event', () => {
    let totalCalls = 0
    emitter?.on('test', () => {
      totalCalls++
    })
    const n = 5
    for (let i = 0; i < n; i++) {
      emitter?.emit('test')
    }
    expect(totalCalls).toEqual(n)
  })

  it('can listen with multiple listeners', () => {
    let hasBeenCalled = false
    let hasBeenCalled2 = false
    emitter?.on('test', () => {
      hasBeenCalled = true
    })
    emitter?.on('test', () => {
      hasBeenCalled2 = true
    })
    emitter?.emit('test')
    expect(hasBeenCalled).toEqual(true)
    expect(hasBeenCalled2).toEqual(true)
  })
})
