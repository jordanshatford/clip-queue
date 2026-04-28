import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ClipSourceEvent, ClipSourceMessage } from '@/integrations/common'

import { IntegrationID } from '@/integrations'
import { useProviders } from '@/stores/providers'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'

import commands, { Command } from '../commands'

const MOCK_EVENT: ClipSourceEvent<ClipSourceMessage> = {
  source: IntegrationID.TWITCH,
  timestamp: '2021-01-01T00:00:00Z',
  data: {
    channel: 'testchannel',
    username: 'testuser',
    text: 'testtext',
    urls: [],
  },
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
    [Command.PURGE_HISTORY, 'purge'],
  ])(
    'calls the proper clip queue function when a command is issued: (command: %s) -> %s',
    (commandName: Command, expectedFunctionCall: unknown) => {
      const queue = useQueue()
      // @ts-expect-error function with unknown type
      const spy = vi.spyOn(queue, expectedFunctionCall)
      commands.handleCommand(MOCK_EVENT, commandName.toString())
      expect(spy).toHaveBeenCalledTimes(1)
    },
  )

  it.each([[Command.PURGE_CACHE, 'purge']])(
    'calls the proper clip queue function when a command is issued: (command: %s) -> %s',
    (commandName: Command, expectedFunctionCall: unknown) => {
      const providers = useProviders()
      // @ts-expect-error function with unknown type
      const spy = vi.spyOn(providers, expectedFunctionCall)
      commands.handleCommand(MOCK_EVENT, commandName.toString())
      expect(spy).toHaveBeenCalledTimes(1)
    },
  )

  it.each([
    [Command.REMOVE_BY_SUBMITTER, ['testsubmitter'], 'removeSubmitterClips', ['testsubmitter']],
    [Command.REMOVE_BY_PROVIDER, ['testprovider'], 'removeProviderClips', ['testprovider']],
  ])(
    'calls the proper clip queue function with params when issued: (command: %s, args: %o) -> %s(%o)',
    (
      commandName: Command,
      args: string[],
      expectedFunctionCall: unknown,
      expectedFunctionArgs: unknown[],
    ) => {
      const queue = useQueue()
      // @ts-expect-error function with unknown type
      const spy = vi.spyOn(queue, expectedFunctionCall)
      commands.handleCommand(MOCK_EVENT, commandName.toString(), ...args)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(...expectedFunctionArgs)
    },
  )

  it.each([['unknown'], ['']])(
    'calls nothing when an invalid command is issued: (%s) -> %s',
    (commandName: string) => {
      const queue = useQueue()
      const queueCommandFunctions = ['previous', 'next', 'open', 'close', 'clear']
      commands.handleCommand(MOCK_EVENT, commandName)
      for (const f of queueCommandFunctions) {
        // @ts-expect-error function with unknown type
        expect(vi.spyOn(queue, f)).toHaveBeenCalledTimes(0)
      }
    },
  )

  it('can set the queue limit and clear it', () => {
    const settings = useSettings()
    expect(settings.application.limit).toEqual(null)
    commands.handleCommand(MOCK_EVENT, Command.SET_LIMIT.toString(), '0') // Invalid
    expect(settings.application.limit).toEqual(null)
    commands.handleCommand(MOCK_EVENT, Command.SET_LIMIT.toString(), '100')
    expect(settings.application.limit).toEqual(100)
    commands.handleCommand(MOCK_EVENT, Command.SET_LIMIT.toString(), 'some_non_number') // Invalid
    expect(settings.application.limit).toEqual(100)
    commands.handleCommand(MOCK_EVENT, Command.REMOVE_LIMIT.toString())
    expect(settings.application.limit).toEqual(null)
  })

  it('can enable and disable providers', () => {
    const providers = useProviders()
    expect(providers.provider(IntegrationID.KICK_CLIPS)?.isEnabled).toEqual(true)
    expect(providers.provider(IntegrationID.TWITCH_CLIPS)?.isEnabled).toEqual(true)
    // Attempt using an invalid provider.
    commands.handleCommand(MOCK_EVENT, Command.DISABLE_PROVIDER.toString(), 'test')
    expect(providers.provider(IntegrationID.KICK_CLIPS)?.isEnabled).toEqual(true)
    expect(providers.provider(IntegrationID.TWITCH_CLIPS)?.isEnabled).toEqual(true)
    commands.handleCommand(MOCK_EVENT, Command.DISABLE_PROVIDER.toString(), 'kick-clips')
    expect(providers.provider(IntegrationID.KICK_CLIPS)?.isEnabled).toEqual(false)
    expect(providers.provider(IntegrationID.TWITCH_CLIPS)?.isEnabled).toEqual(true)
    // Attempt using an invalid provider.
    commands.handleCommand(MOCK_EVENT, Command.ENABLE_PROVIDER.toString(), 'test')
    expect(providers.provider(IntegrationID.KICK_CLIPS)?.isEnabled).toEqual(false)
    expect(providers.provider(IntegrationID.TWITCH_CLIPS)?.isEnabled).toEqual(true)
    commands.handleCommand(MOCK_EVENT, Command.ENABLE_PROVIDER.toString(), 'kick-clips')
    expect(providers.provider(IntegrationID.KICK_CLIPS)?.isEnabled).toEqual(true)
    expect(providers.provider(IntegrationID.TWITCH_CLIPS)?.isEnabled).toEqual(true)
  })

  it('can enable and disable auto moderation', () => {
    const settings = useSettings()
    expect(settings.application.hasAutoModerationEnabled).toEqual(true)
    commands.handleCommand(MOCK_EVENT, Command.DISABLE_AUTO_MODERATION)
    expect(settings.application.hasAutoModerationEnabled).toEqual(false)
    commands.handleCommand(MOCK_EVENT, Command.ENABLE_AUTO_MODERATION)
    expect(settings.application.hasAutoModerationEnabled).toEqual(true)
  })

  it('returns help information for commands', () => {
    expect(commands.help.value).toBeDefined()
  })
})
