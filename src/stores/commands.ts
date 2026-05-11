import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { IntegrationSourceMessageEvent } from '@/integrations/core'

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
   * Aliases for the command. These can be used in place of the ID.
   */
  aliases?: string[]
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

/**
 * Settings related to commands store.
 */
export interface CommandsSettings {
  /**
   * The prefix for commands.
   *
   * @example !cq
   */
  prefix: string
  /**
   * The commands that are able to be triggered.
   */
  enabled: string[]
}

export const DEFAULT_SETTINGS: CommandsSettings = {
  prefix: '!cq',
  enabled: [],
}

export const useCommands = defineStore('commands', () => {
  /**
   * Settings related to commands.
   */
  const settings = useStorage<CommandsSettings>(
    '__cq_commands_settings',
    structuredClone(DEFAULT_SETTINGS),
    undefined,
    { mergeDefaults: true },
  )
  /**
   * Command details by command ID.
   */
  const commands = ref<Record<string, Command>>({})
  /**
   * Command alias to command tracking.
   */
  const aliases = ref<Record<string, string>>({})

  /**
   * Resolve an "idlike" (id or alias) of a command to the command id.
   * @param idlike - The id or alias.
   * @returns The id mapped from the alias, or the id.
   */
  function resolve(idlike: string): string {
    return aliases.value[idlike] ?? idlike
  }

  /**
   * Register commands in the command system.
   * @param cmds - The commands to register.
   * @throws When a duplicate command or alias is attempting to be registered.
   *         This should not happen at runtime as commands are not dynamic, and
   *         should only be registered once. This is for errors in development.
   */
  function register(...cmds: Command[]): void {
    for (const command of cmds) {
      // Prevent duplicate command registration by throwing.
      if (commands.value[command.id]) {
        throw new Error(`Duplicate command registration "${command.id}".`)
      }
      // Register the command in the system.
      commands.value[command.id] = command
      // Register any aliases for the command.
      if (command.aliases) {
        for (const alias of command.aliases) {
          // Prevent duplicate alias registration aswell.
          if (aliases.value[alias]) {
            const existing = aliases.value[alias]
            throw new Error(
              `Duplicate command alias registration "${alias}", already used for "${existing}".`,
            )
          }
          aliases.value[alias] = command.id
        }
      }
    }
  }

  /**
   * Unregister commands by there ids.
   * @param id - The ids of the commands.
   */
  function unregister(...ids: string[]): void {
    for (const id of ids) {
      const cmd = commands.value[id]
      // Silently ignore any commands that do not actually exist.
      if (!cmd) {
        return
      }
      // Cleanup and remove all command aliases, and information. If it is present
      // in the disabled list, remove it from there too.
      if (cmd.aliases) {
        for (const alias of cmd.aliases) {
          delete aliases.value[alias]
        }
      }
      delete commands.value[id]
    }
  }

  /**
   * Execute a command if that commands exists. Otherwise do nothing.
   * @param event - The event that triggered the command.
   */
  function execute(event: CommandExecuteEvent): void {
    const cmd = commands.value[resolve(event.command)]
    if (cmd) {
      cmd.execute(event)
    }
  }

  /**
   * Get a string to represent what calling the command could look like (without prefix).
   * @param idlike - The command id or alias.
   * @returns String representing the command call.
   */
  function toCallHelp(idlike: string): string {
    const cmd = commands.value[resolve(idlike)]
    if (!cmd) {
      return ''
    }

    // Display any arguments the command should be supplied.
    let result = cmd.id
    if (cmd.help.args && cmd.help.args.length > 0) {
      result += ' '
      result += cmd.help.args.map((arg) => `<${arg().toLocaleLowerCase()}>`).join(' ')
    }
    return result
  }

  /**
   * Get a string with the description of a command.
   * @param idlike - The command id or alias.
   * @returns String representing the command description.
   */
  function toDescription(idlike: string): string {
    const cmd = commands.value[resolve(idlike)]
    if (!cmd) {
      return ''
    }
    return cmd.help.description()
  }

  /**
   * Reset commands to its default state.
   */
  function reset(): void {
    commands.value = {}
    aliases.value = {}
  }

  /**
   * Determine if the settings are modified.
   */
  const isSettingsModified = computed(() => {
    return (
      settings.value.prefix !== DEFAULT_SETTINGS.prefix ||
      Object.keys(commands.value).some(
        (cmd) => settings.value.enabled.includes(cmd) !== DEFAULT_SETTINGS.enabled.includes(cmd),
      )
    )
  })

  /**
   * Reset settings related to this store.
   */
  function resetSettings(): void {
    settings.value = structuredClone(DEFAULT_SETTINGS)
  }

  return {
    settings,
    commands,
    aliases,
    resolve,
    register,
    unregister,
    execute,
    toCallHelp,
    toDescription,
    reset,
    isSettingsModified,
    resetSettings,
  }
})
