import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import commands from '../commands'
import { useQueue } from '../../stores/queue'
import { useModeration } from '../../stores/moderation'

describe('commands.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  it.each([
    ['prev', 'previous'],
    ['next', 'next'],
    ['open', 'open'],
    ['close', 'close'],
    ['clear', 'clear'],
    ['removelimit', 'removeLimit']
  ])(
    'calls the proper clip queue function when a command is issued (%s, %s)',
    (commandName: string, expectedFunctionCall: any) => {
      const queue = useQueue()
      const randomNumber = Math.floor(Math.random() * 25)
      const spy = vi.spyOn(queue, expectedFunctionCall)
      for (let i = 1; i <= randomNumber; i++) {
        commands.handleCommand(commandName)
      }
      expect(spy).toHaveBeenCalledTimes(randomNumber)
    }
  )

  it.each([
    ['setlimit', ['100'], 'setLimit', [100]],
    ['setlimit', ['somethinginvalid'], 'setLimit', [NaN]]
  ])(
    'calls the proper clip queue function with params when issued (%s, %s)',
    (
      commandName: string,
      args: string[],
      expectedFunctionCall: any,
      expectedFunctionArgs: any[]
    ) => {
      const queue = useQueue()
      const randomNumber = Math.floor(Math.random() * 25)
      const spy = vi.spyOn(queue, expectedFunctionCall)
      for (let i = 1; i <= randomNumber; i++) {
        commands.handleCommand(commandName, ...args)
      }
      expect(spy).toHaveBeenCalledTimes(randomNumber)
      expect(spy).toHaveBeenCalledWith(...expectedFunctionArgs)
    }
  )

  it.each([
    ['blockchannel', ['test'], 'addBlockedChannel'],
    ['unblockchannel', ['test'], 'removeBlockedChannel']
  ])(
    'calls the proper clip queue moderation function with params when issued (%s, %s)',
    (commandName: string, args: string[], expectedFunctionCall: any) => {
      const moderation = useModeration()
      const randomNumber = Math.floor(Math.random() * 25)
      const spy = vi.spyOn(moderation, expectedFunctionCall)
      for (let i = 1; i <= randomNumber; i++) {
        commands.handleCommand(commandName, ...args)
      }
      expect(spy).toHaveBeenCalledTimes(randomNumber)
      expect(spy).toHaveBeenCalledWith(args[0])
    }
  )

  it.each([['unknown'], ['']])(
    'calls nothing when an invalid command is issued (%s, %s)',
    (commandName: string) => {
      const queue = useQueue()
      const queueCommandFunctions = [
        'previous',
        'next',
        'open',
        'close',
        'clear',
        'setLimit',
        'removeLimit'
      ]
      const moderation = useModeration()
      const moderationCommandFunctions = ['addBlockedChannel', 'removeBlockedChannel']
      commands.handleCommand(commandName)
      for (const f of queueCommandFunctions) {
        /* eslint-disable @typescript-eslint/no-explicit-any*/
        expect(vi.spyOn(queue, f as any)).toHaveBeenCalledTimes(0)
      }
      for (const f of moderationCommandFunctions) {
        /* eslint-disable @typescript-eslint/no-explicit-any*/
        expect(vi.spyOn(moderation, f as any)).toHaveBeenCalledTimes(0)
      }
    }
  )

  it('returns help information for commands', () => {
    expect(commands.help).toBeDefined()
  })
})
