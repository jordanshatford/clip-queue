import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCommands, type Command } from '@/stores/commands'

describe('commands', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function createCommand(overrides: Partial<Command> = {}): Command {
    return {
      id: 'test',
      aliases: ['t'],
      help: {
        args: [() => 'User'],
        description: () => 'Test command',
      },
      execute: vi.fn<Command['execute']>(),
      ...overrides,
    }
  }

  it('can register a command', () => {
    const commands = useCommands()
    const cmd = createCommand()
    commands.register(cmd)
    expect(commands.commands.test).toEqual(cmd)
  })

  it('can register a command with aliases', () => {
    const commands = useCommands()
    const cmd = createCommand()
    commands.register(cmd)
    expect(commands.aliases.t).toEqual('test')
  })

  it('resolves command ids directly', () => {
    const commands = useCommands()
    expect(commands.resolve('ping')).toEqual('ping')
  })

  it('resolves aliases to command ids', () => {
    const commands = useCommands()
    commands.register(
      createCommand({
        id: 'test',
        aliases: ['alias'],
      }),
    )
    expect(commands.resolve('alias')).toEqual('test')
  })

  it('throws on duplicate command registration', () => {
    const commands = useCommands()
    const cmd = createCommand()
    commands.register(cmd)
    expect(() => commands.register(cmd)).toThrow('Duplicate command registration "test".')
  })

  it('throws on duplicate alias registration', () => {
    const commands = useCommands()
    commands.register(
      createCommand({
        id: 'first',
        aliases: ['shared'],
      }),
    )
    expect(() =>
      commands.register(
        createCommand({
          id: 'second',
          aliases: ['shared'],
        }),
      ),
    ).toThrow('Duplicate command alias registration "shared", already used for "first".')
  })

  it('can unregister commands', () => {
    const commands = useCommands()
    commands.register(createCommand())
    expect(commands.commands.test).toBeDefined()
    commands.unregister('test')
    expect(commands.commands.test).toBeUndefined()
  })

  it('removes aliases when unregistering', () => {
    const commands = useCommands()
    commands.register(createCommand())
    commands.unregister('test')
    expect(commands.aliases.t).toBeUndefined()
  })

  it('silently ignores unregistering unknown commands', () => {
    const commands = useCommands()
    expect(() => commands.unregister('missing')).not.toThrow()
  })

  it('executes commands by id', () => {
    const commands = useCommands()
    const execute = vi.fn<Command['execute']>()
    commands.register(
      createCommand({
        execute,
      }),
    )
    const event = {
      command: 'test',
      args: ['one'],
    }
    commands.execute(event)
    expect(execute).toHaveBeenCalledExactlyOnceWith(event)
  })

  it('executes commands by alias', () => {
    const commands = useCommands()
    const execute = vi.fn<Command['execute']>()
    commands.register(
      createCommand({
        execute,
      }),
    )
    commands.execute({
      command: 't',
      args: [],
    })
    expect(execute).toHaveBeenCalledOnce()
  })

  it('does nothing when executing an unknown command', () => {
    const commands = useCommands()
    expect(() =>
      commands.execute({
        command: 'missing',
        args: [],
      }),
    ).not.toThrow()
  })

  it('creates command call help', () => {
    const commands = useCommands()
    commands.register(createCommand())
    expect(commands.toCallHelp('test')).toEqual('test <user>')
  })

  it('creates command call help without args', () => {
    const commands = useCommands()
    commands.register(
      createCommand({
        help: {
          args: [],
          description: () => 'No args',
        },
      }),
    )
    expect(commands.toCallHelp('test')).toEqual('test')
  })

  it('returns empty call help for unknown commands', () => {
    const commands = useCommands()
    expect(commands.toCallHelp('missing')).toEqual('')
  })

  it('gets command descriptions', () => {
    const commands = useCommands()
    commands.register(createCommand())
    expect(commands.toDescription('test')).toEqual('Test command')
  })

  it('returns empty description for unknown commands', () => {
    const commands = useCommands()
    expect(commands.toDescription('missing')).toEqual('')
  })

  it('can be reset to its initial values', () => {
    const commands = useCommands()
    commands.register(createCommand())
    expect(Object.keys(commands.commands)).toHaveLength(1)
    expect(Object.keys(commands.aliases)).toHaveLength(1)
    commands.reset()
    expect(commands.commands).toEqual({})
    expect(commands.aliases).toEqual({})
  })
})
