import { describe, expect, it } from 'vitest'

import { EventEmitter } from '../event-emitter'

type TestEvents = {
  test: () => void
  test2: (t: string) => void
  test3: (t: string, t2: string) => void
}

describe('integrations/core/event-emitter', () => {
  it('can be defined', () => {
    const emitter = new EventEmitter<TestEvents>()
    expect(emitter).toBeDefined()
  })

  it('can listen and emit events without arguments', () => {
    const emitter = new EventEmitter<TestEvents>()
    let hasBeenCalled = false
    emitter?.on('test', () => {
      hasBeenCalled = true
    })
    emitter?.emit('test')
    expect(hasBeenCalled).toEqual(true)
  })

  it('can listen and emit events with a single argument', () => {
    const emitter = new EventEmitter<TestEvents>()
    let hasBeenCalled = false
    emitter?.on('test2', (t) => {
      hasBeenCalled = true
      expect(t).toEqual('value')
    })
    emitter?.emit('test2', 'value')
    expect(hasBeenCalled).toEqual(true)
  })

  it('can listen and emit events with a multiple arguments', () => {
    const emitter = new EventEmitter<TestEvents>()
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
    const emitter = new EventEmitter<TestEvents>()
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
    const emitter = new EventEmitter<TestEvents>()
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

  it('does not cause issues when emitting an event without listeners', () => {
    const emitter = new EventEmitter<TestEvents>()
    expect(() => {
      const r = emitter?.emit('test')
      expect(r).toBeFalsy()
    }).not.toThrow()
  })
})
