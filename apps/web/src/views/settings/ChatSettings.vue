<template>
  <div>
    <Card class="mx-auto mb-2 max-w-lg">
      <template #content>
        <div class="m-0 flex flex-col gap-2 p-0 text-left">
          <label for="username">{{ m.connected_chat_colon() }}</label>
          <IconField class="w-full">
            <InputIcon>
              <svg class="h-5 w-5" v-html="logo"></svg>
            </InputIcon>
            <InputText id="username" v-model="user.ctx.username" class="w-full" disabled />
          </IconField>
        </div>
      </template>
    </Card>
    <Card class="mx-auto max-w-lg">
      <template #content>
        <form :key="formKey" @submit.prevent="onSubmit" @reset="onReset">
          <div class="flex flex-col gap-2 text-left">
            <label for="commandPrefix">{{ m.command_prefix() }}</label>
            <InputText
              id="commandPrefix"
              v-model="formSettings.prefix"
              required
              maxlength="8"
              @keydown.space.prevent
            />
            <small id="commandPrefix-help" class="pb-2 text-sm text-surface-400">{{
              m.command_prefix_description()
            }}</small>
            <label for="allowedCommands">{{ m.allowed_commands() }}</label>
            <MultiSelect
              v-model="formSettings.allowed"
              input-id="allowedCommands"
              :options="Object.values(Command)"
              :placeholder="m.none()"
              display="chip"
              aria-describedby="allowedCommands-help"
            >
              <template #option="{ option }: { option: Command }">
                <div class="flex flex-col gap-1">
                  <p>{{ toCommandCall(option) }}</p>
                  <small>{{ commands.help.value[option].description }}</small>
                </div>
              </template>
            </MultiSelect>
            <small id="allowedCommands-help" class="pb-2 text-sm text-surface-400">{{
              m.allowed_commands_description()
            }}</small>
          </div>
          <div class="mt-3">
            <Button
              severity="info"
              :label="m.save()"
              size="small"
              class="mr-2"
              type="submit"
              :disabled="!settings.isCommandsSettingsModified(formSettings)"
            ></Button>
            <Button
              type="reset"
              severity="danger"
              :label="m.cancel()"
              size="small"
              :disabled="!settings.isCommandsSettingsModified(formSettings)"
            ></Button>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'

import { logo } from '@cq/services/twitch'
import { Button, Card, IconField, InputIcon, InputText, MultiSelect, useToast } from '@cq/ui'

import * as m from '@/paraglide/messages'
import { useSettings } from '@/stores/settings'
import { useUser } from '@/stores/user'
import commands, { Command } from '@/utils/commands'

const toast = useToast()
const user = useUser()
const settings = useSettings()

const formKey = ref(1)
const formSettings = ref(structuredClone(toRaw(settings.commands)))

function toCommandCall(command: Command) {
  const help = commands.help.value[command]
  let cmd = command.toString()
  if (help.args && help.args.length > 0) {
    cmd += ' '
    cmd += help.args.map((arg) => `<${arg}>`).join(' ')
  }
  return cmd
}

function onReset() {
  formSettings.value = structuredClone(toRaw(settings.commands))
  formKey.value += 1
}

function onSubmit() {
  settings.commands = formSettings.value
  toast.add({
    severity: 'success',
    summary: m.success(),
    detail: m.chat_settings_saved(),
    life: 3000
  })
  onReset()
}
</script>
