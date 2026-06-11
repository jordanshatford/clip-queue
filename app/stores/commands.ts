import type { IntegrationSourceMessageEvent } from '~/integrations/core'

/**
 * An event that causes a command to execute.
 */
interface CommandExecuteEvent {
  /**
   * The origin of the event. Available when the command is coming from an integration.
   */
  origin?: IntegrationSourceMessageEvent
  /**
   * The command that was triggered.
   */
  command: string
  /**
   * The arguments supplied to the command.
   */
  args: string[]
}

/**
 * A command that is registered and can be triggered via a integrations source.
 */
export interface Command {
  /**
   * ID of the command, used to trigger in chat (using prefix + command id).
   */
  id: string
  /**
   * Details used to provider help information to the user via the website.
   */
  help: {
    /**
     * Names of the arguments for the command, in order. These are translations
     * that are displayed as an example command call in the settings.
     */
    args?: (() => string)[]
    /**
     * Description of what the command does. This is also a translation.
     */
    description: () => string
  }
  /**
   * Handler used when executing a command.
   */
  execute: (event: CommandExecuteEvent) => Awaited<void>
}

export const useCommands = defineStore('commands', () => {
  /**
   * Settings related to commands.
   */
  const settings = usePeristedSettings<{
    /**
     * The prefix for commands. All command calls require being prefixed by this value to
     * be properly detected by the application.
     *
     * @example !cq
     */
    prefix: string
    /**
     * The commands that are able to be triggered.
     */
    enabled: string[]
  }>('commands', { prefix: '!cq', enabled: [] })
  /**
   * Command details by command ID.
   */
  const commands = ref<Record<string, Command>>({})
  /**
   * Commands as a computed list of details.
   */
  const list = computed<{ value: string; label: string; description: string; args?: string[] }[]>(
    () => {
      return Object.values(commands.value)
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((command) => ({
          value: command.id,
          label: command.id,
          description: command.help.description(),
          args: command.help?.args?.map((arg) => arg()),
        }))
    },
  )

  /**
   * Filter out commands that not longer exist, i.e. commands that have been removed.
   */
  function initialize(): void {
    const available = Object.keys(commands.value)
    settings.state.value.enabled = settings.state.value.enabled.filter((command) =>
      available.includes(command),
    )
  }

  /**
   * Register commands in the command system.
   * @param cmds - The commands to register.
   * @throws When a duplicate command attempting to be registered. This should not happen at
   *         runtime as commands are not dynamic, and should only be registered once. This
   *         is for errors in development.
   */
  function register(...cmds: Command[]): void {
    for (const command of cmds) {
      // Prevent duplicate command registration by throwing.
      if (commands.value[command.id]) {
        throw new Error(`Duplicate command registration "${command.id}".`)
      }
      // Register the command in the system.
      commands.value[command.id] = command
    }
  }

  /**
   * Unregister commands by there ids.
   * @param id - The ids of the commands.
   */
  function unregister(...ids: string[]): void {
    const idSet = new Set(ids)
    commands.value = Object.fromEntries(
      Object.entries(commands.value).filter(([id]) => !idSet.has(id)),
    )
  }

  /**
   * Execute a command if that commands exists. Otherwise do nothing.
   * @param event - The event that triggered the command.
   */
  function execute(event: CommandExecuteEvent): void {
    const cmd = commands.value[event.command]
    if (cmd) {
      cmd.execute(event)
    }
  }

  /**
   * Boolean representing if all commands are enabled.
   */
  const isAllEnabled = computed<boolean>(() => {
    return Object.keys(commands.value).every((command) => isEnabled(command))
  })

  /**
   * Set all commands to the enabled value.
   * @param enabled - If the commands should be enabled.
   */
  function setAllEnabled(enabled: boolean): void {
    for (const command of Object.keys(commands.value)) {
      setEnabled(command, enabled)
    }
  }

  /**
   * Check if a command is enabled by its ID.
   * @param command - The command ID.
   * @returns true if the command exists and is enabled, false otherwise.
   */
  function isEnabled(command: string): boolean {
    return settings.state.value.enabled.includes(command)
  }

  /**
   * Set if a command is enabled using its ID.
   * @param command - The command ID.
   * @param enabled - If the command should be enabled.
   */
  function setEnabled(command: string, enabled: boolean): void {
    const current = settings.state.value.enabled
    if (enabled) {
      settings.state.value.enabled = [...new Set([...current, command])]
    } else {
      settings.state.value.enabled = current.filter((c) => c !== command)
    }
  }

  /**
   * Reset commands to its default state.
   */
  function reset(): void {
    commands.value = {}
  }

  return {
    settings,
    commands,
    list,
    initialize,
    register,
    unregister,
    execute,
    isAllEnabled,
    setAllEnabled,
    isEnabled,
    setEnabled,
    reset,
  }
})
