import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('commands', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function createCommand(overrides: Partial<Command> = {}): Command {
    return {
      id: 'test',
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

  it('throws on duplicate command registration', () => {
    const commands = useCommands()
    const cmd = createCommand()
    commands.register(cmd)
    expect(() => commands.register(cmd)).toThrow('Duplicate command registration "test".')
  })

  it('can unregister commands', () => {
    const commands = useCommands()
    commands.register(createCommand())
    expect(commands.commands.test).toBeDefined()
    commands.unregister('test')
    expect(commands.commands.test).toBeUndefined()
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

  it('does nothing when executing an unknown command', () => {
    const commands = useCommands()
    expect(() =>
      commands.execute({
        command: 'missing',
        args: [],
      }),
    ).not.toThrow()
  })

  it('can be reset to its initial values', () => {
    const commands = useCommands()
    commands.register(createCommand())
    expect(Object.keys(commands.commands)).toHaveLength(1)
    commands.reset()
    expect(commands.commands).toEqual({})
  })

  it('can have its settings reset', () => {
    const commands = useCommands()
    commands.settings.reset()
    expect(commands.settings.isModified).toEqual(false)
    commands.settings.state.prefix = '~cq'
    expect(commands.settings.isModified).toEqual(true)
    commands.settings.reset()
    expect(commands.settings.isModified).toEqual(false)
    expect(commands.settings.state.prefix).toEqual('!cq')
    commands.register(createCommand({ id: 'test' }))
    commands.settings.state.enabled = ['test']
    expect(commands.settings.isModified).toEqual(true)
    commands.settings.reset()
    expect(commands.settings.isModified).toEqual(false)
    expect(commands.settings.state.enabled).toEqual([])
  })
})
