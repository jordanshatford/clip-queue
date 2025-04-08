<template>
  <div>
    <Card class="mx-auto mb-2 max-w-lg">
      <template #content>
        <div class="m-0 flex flex-col gap-2 p-0 text-left">
          <label for="username">{{ m.connected_chat_colon() }}</label>
          <div class="flex w-full items-stretch">
            <span
              class="border-surface-300 dark:border-surface-700 bg-surface-0 dark:bg-surface-950 text-surface-400 flex min-w-10 items-center justify-center rounded-s-md border-y border-s"
            >
              <svg class="h-5 w-5" v-html="sources.logo"></svg>
            </span>
            <InputText
              id="username"
              v-model="user.ctx.username"
              readonly
              fluid
              pt:root="flex-1 rounded-none"
            />
            <span
              class="border-surface-300 dark:border-surface-700 bg-surface-0 dark:bg-surface-950 text-surface-400 flex min-w-10 items-center justify-center gap-2 rounded-none border-y border-e px-2"
            >
              <SourceIndicator :status="sources.status" />
            </span>
            <span
              class="border-surface-300 dark:border-surface-700 bg-surface-0 dark:bg-surface-950 text-surface-400 flex min-w-10 items-center justify-center gap-2 rounded-e-md border-y border-e px-2"
            >
              <i
                v-tooltip="m.reconnect()"
                class="pi pi-refresh hover:cursor-pointer"
                @click="sources.reconnect()"
              ></i>
            </span>
          </div>
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
              aria-describedby="commandPrefix-help"
              @keydown.space.prevent
            />
            <Message id="commandPrefix-help" size="small" severity="secondary" variant="simple">{{
              m.command_prefix_description()
            }}</Message>
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
            <Message id="allowedCommands-help" size="small" severity="secondary" variant="simple">{{
              m.allowed_commands_description()
            }}</Message>
          </div>
          <div class="mt-3">
            <SecondaryButton
              :label="m.save()"
              size="small"
              class="mr-2"
              type="submit"
              :disabled="!settings.isCommandsSettingsModified(formSettings)"
            ></SecondaryButton>
            <DangerButton
              type="reset"
              :label="m.cancel()"
              size="small"
              :disabled="!settings.isCommandsSettingsModified(formSettings)"
            ></DangerButton>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'

import {
  Card,
  DangerButton,
  InputText,
  Message,
  MultiSelect,
  SecondaryButton,
  useToast
} from '@cq/ui'

import SourceIndicator from '@/components/SourceIndicator.vue'
import * as m from '@/paraglide/messages'
import { useSettings } from '@/stores/settings'
import { useSources } from '@/stores/sources'
import { useUser } from '@/stores/user'
import commands, { Command } from '@/utils/commands'

const toast = useToast()
const user = useUser()
const settings = useSettings()
const sources = useSources()

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
