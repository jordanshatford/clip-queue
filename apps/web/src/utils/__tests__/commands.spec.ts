import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ClipSourceEvent, ClipSourceMessage } from '@cq/sources'
import { ClipProvider } from '@cq/providers'
import { ClipSource } from '@cq/sources'

import { useProviders } from '@/stores/providers'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'
import commands, { Command } from '../commands'

const MOCK_EVENT: ClipSourceEvent<ClipSourceMessage> = {
  source: ClipSource.TWITCH,
  timestamp: '2021-01-01T00:00:00Z',
  data: {
    channel: 'testchannel',
    username: 'testuser',
    text: 'testtext',
    urls: []
  }
}

describe('commands.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it.each([
    [Command.PREV, 'previous'],
    [Command.NEXT, 'next'],
    [Command.OPEN, 'open'],
    [Command.CLOSE, 'close'],
    [Command.CLEAR, 'clear'],
    [Command.PURGE_HISTORY, 'purge']
  ])(
    'calls the proper clip queue function when a command is issued (%s, %s)',
    (commandName: Command, expectedFunctionCall: unknown) => {
      const queue = useQueue()
      // @ts-expect-error function with unknown type
      const spy = vi.spyOn(queue, expectedFunctionCall)
      commands.handleCommand(MOCK_EVENT, commandName.toString())
      expect(spy).toHaveBeenCalledTimes(1)
    }
  )

  it.each([[Command.PURGE_CACHE, 'purge']])(
    'calls the proper clip queue function when a command is issued (%s, %s)',
    (commandName: Command, expectedFunctionCall: unknown) => {
      const providers = useProviders()
      // @ts-expect-error function with unknown type
      const spy = vi.spyOn(providers, expectedFunctionCall)
      commands.handleCommand(MOCK_EVENT, commandName.toString())
      expect(spy).toHaveBeenCalledTimes(1)
    }
  )

  it.each([
    [Command.REMOVE_BY_SUBMITTER, ['testsubmitter'], 'removeSubmitterClips', ['testsubmitter']],
    [Command.REMOVE_BY_PROVIDER, ['testprovider'], 'removeProviderClips', ['testprovider']]
  ])(
    'calls the proper clip queue function with params when issued (%s, %s)',
    (
      commandName: Command,
      args: string[],
      expectedFunctionCall: unknown,
      expectedFunctionArgs: unknown[]
    ) => {
      const queue = useQueue()
      // @ts-expect-error function with unknown type
      const spy = vi.spyOn(queue, expectedFunctionCall)
      commands.handleCommand(MOCK_EVENT, commandName.toString(), ...args)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(...expectedFunctionArgs)
    }
  )

  it.each([['unknown'], ['']])(
    'calls nothing when an invalid command is issued (%s, %s)',
    (commandName: string) => {
      const queue = useQueue()
      const queueCommandFunctions = ['previous', 'next', 'open', 'close', 'clear']
      commands.handleCommand(MOCK_EVENT, commandName)
      for (const f of queueCommandFunctions) {
        // @ts-expect-error function with unknown type
        expect(vi.spyOn(queue, f)).toHaveBeenCalledTimes(0)
      }
    }
  )

  it('can set the queue limit and clear it', () => {
    const settings = useSettings()
    expect(settings.queue.limit).toEqual(null)
    commands.handleCommand(MOCK_EVENT, Command.SET_LIMIT.toString(), '0') // Invalid
    expect(settings.queue.limit).toEqual(null)
    commands.handleCommand(MOCK_EVENT, Command.SET_LIMIT.toString(), '100')
    expect(settings.queue.limit).toEqual(100)
    commands.handleCommand(MOCK_EVENT, Command.SET_LIMIT.toString(), 'some_non_number') // Invalid
    expect(settings.queue.limit).toEqual(100)
    commands.handleCommand(MOCK_EVENT, Command.REMOVE_LIMIT.toString())
    expect(settings.queue.limit).toEqual(null)
  })

  it('can enable and disable providers', () => {
    const settings = useSettings()
    expect(settings.queue.providers).toEqual(Object.values(ClipProvider))
    commands.handleCommand(MOCK_EVENT, Command.DISABLE_PROVIDER.toString(), 'test') // Invalid provider
    expect(settings.queue.providers).toEqual(Object.values(ClipProvider))
    commands.handleCommand(MOCK_EVENT, Command.DISABLE_PROVIDER.toString(), 'kick')
    expect(settings.queue.providers).not.toContain(ClipProvider.KICK)
    commands.handleCommand(MOCK_EVENT, Command.ENABLE_PROVIDER.toString(), 'test') // Invalid provider
    expect(settings.queue.providers).not.toContain(ClipProvider.KICK)
    commands.handleCommand(MOCK_EVENT, Command.ENABLE_PROVIDER.toString(), 'kick')
    expect(settings.queue.providers).toContain(ClipProvider.KICK)
    for (const p of Object.values(ClipProvider)) {
      expect(settings.queue.providers).toContain(p)
    }
  })

  it('can enable and disable auto moderation', () => {
    const settings = useSettings()
    expect(settings.queue.hasAutoModerationEnabled).toEqual(true)
    commands.handleCommand(MOCK_EVENT, Command.DISABLE_AUTO_MODERATION)
    expect(settings.queue.hasAutoModerationEnabled).toEqual(false)
    commands.handleCommand(MOCK_EVENT, Command.ENABLE_AUTO_MODERATION)
    expect(settings.queue.hasAutoModerationEnabled).toEqual(true)
  })

  it('returns help information for commands', () => {
    expect(commands.help.value).toBeDefined()
  })
})
