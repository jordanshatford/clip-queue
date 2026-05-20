import { describe, expect, it, vi } from 'vitest'

import { EventEmitter } from '~/integrations/core/event-emitter'

type TestEvents = {
  connected: [id: string]
  message: [channel: string, body: string]
  empty: []
}

describe('EventEmitter', () => {
  it('registers and emits events', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn<(...args: TestEvents['connected']) => void>()
    emitter.on('connected', listener)
    const emitted = emitter.emit('connected', 'abc123')
    expect(emitted).toBe(true)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith('abc123')
  })

  it('passes multiple arguments to listeners', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn<(...args: TestEvents['message']) => void>()
    emitter.on('message', listener)
    emitter.emit('message', 'general', 'hello world')
    expect(listener).toHaveBeenCalledWith('general', 'hello world')
  })

  it('returns false when emitting without listeners', () => {
    const emitter = new EventEmitter<TestEvents>()
    const emitted = emitter.emit('connected', 'abc123')
    expect(emitted).toBe(false)
  })

  it('supports events with no arguments', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn<(...args: TestEvents['empty']) => void>()
    emitter.on('empty', listener)
    emitter.emit('empty')
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith()
  })

  it('removes listeners with off()', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn<(...args: TestEvents['connected']) => void>()
    emitter.on('connected', listener)
    emitter.off('connected', listener)
    const emitted = emitter.emit('connected', 'abc123')
    expect(emitted).toBe(false)
    expect(listener).not.toHaveBeenCalled()
  })

  it('removes listeners using the unsubscribe function returned by on()', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn<(...args: TestEvents['connected']) => void>()
    const unsubscribe = emitter.on('connected', listener)
    unsubscribe()
    emitter.emit('connected', 'abc123')
    expect(listener).not.toHaveBeenCalled()
  })

  it('supports multiple listeners for the same event', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listenerA = vi.fn<(...args: TestEvents['connected']) => void>()
    const listenerB = vi.fn<(...args: TestEvents['connected']) => void>()
    emitter.on('connected', listenerA)
    emitter.on('connected', listenerB)
    emitter.emit('connected', 'abc123')
    expect(listenerA).toHaveBeenCalledWith('abc123')
    expect(listenerB).toHaveBeenCalledWith('abc123')
  })

  it('clears all listeners', () => {
    const emitter = new EventEmitter<TestEvents>()
    const connectedListener = vi.fn<(...args: TestEvents['connected']) => void>()
    const messageListener = vi.fn<(...args: TestEvents['message']) => void>()
    emitter.on('connected', connectedListener)
    emitter.on('message', messageListener)
    emitter.clear()
    expect(emitter.emit('connected', 'abc123')).toBe(false)
    expect(emitter.emit('message', 'general', 'hello')).toBe(false)
    expect(connectedListener).not.toHaveBeenCalled()
    expect(messageListener).not.toHaveBeenCalled()
  })

  it('supports async listeners', async () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn<(...args: TestEvents['connected']) => Promise<void>>(async () => {
      await Promise.resolve()
    })
    emitter.on('connected', listener)
    const emitted = emitter.emit('connected', 'abc123')
    expect(emitted).toBe(true)
    await Promise.resolve()
    expect(listener).toHaveBeenCalledWith('abc123')
  })

  it('does not fail when removing a listener that does not exist', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn<(...args: TestEvents['connected']) => void>()
    expect(() => {
      emitter.off('connected', listener)
    }).not.toThrow()
  })

  it('does not fail when unsubscribing multiple times', () => {
    const emitter = new EventEmitter<TestEvents>()
    const listener = vi.fn<(...args: TestEvents['connected']) => void>()
    const unsubscribe = emitter.on('connected', listener)
    unsubscribe()
    unsubscribe()
    emitter.emit('connected', 'abc123')
    expect(listener).not.toHaveBeenCalled()
  })
})
