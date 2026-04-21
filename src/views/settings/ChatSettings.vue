<template>
  <div>
    <Card class="mx-auto mb-2 max-w-xl">
      <template #content>
        <div class="m-0 flex flex-col gap-2 p-0 text-left">
          <label for="username">{{ m.connected_chat_colon() }}</label>
          <InputGroup>
            <InputGroupAddon>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <svg class="h-5 w-5" v-html="sources.logo"></svg>
            </InputGroupAddon>
            <InputText
              id="username"
              v-model="user.ctx.username"
              readonly
              fluid
              size="small"
              pt:root="flex-1 rounded-none"
            />
            <InputGroupAddon>
              <SourceIndicator :status="sources.status" />
            </InputGroupAddon>
            <InputGroupAddon>
              <i
                v-tooltip="m.reconnect()"
                class="pi pi-refresh hover:cursor-pointer"
                @click="sources.reconnect()"
              ></i
            ></InputGroupAddon>
          </InputGroup>
        </div>
      </template>
    </Card>
    <Card class="mx-auto max-w-xl">
      <template #content>
        <form ref="formElement" @submit.prevent="onSubmit" @reset="onReset">
          <div class="flex flex-col gap-2 text-left">
            <label for="commandPrefix">{{ m.command_prefix() }}</label>
            <InputText
              id="commandPrefix"
              v-model="formSettings.prefix"
              required
              maxlength="8"
              size="small"
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
              size="small"
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
            <Button
              :label="m.save()"
              size="small"
              class="mr-2"
              type="submit"
              severity="secondary"
              :disabled="!settings.isCommandsSettingsModified(formSettings)"
            ></Button>
            <Button
              type="reset"
              :label="m.cancel()"
              size="small"
              severity="danger"
              :disabled="!settings.isCommandsSettingsModified(formSettings)"
            ></Button>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import { useToast } from 'primevue/usetoast'
import { ref, toRaw, useTemplateRef } from 'vue'

import SourceIndicator from '@/components/SourceIndicator.vue'
import { m } from '@/paraglide/messages'
import { useSettings } from '@/stores/settings'
import { useSources } from '@/stores/sources'
import { useUser } from '@/stores/user'
import commands, { Command } from '@/utils/commands'

const toast = useToast()
const user = useUser()
const settings = useSettings()
const sources = useSources()

const formElement = useTemplateRef<HTMLFormElement>('formElement')
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
  formElement.value?.reset()
}

function onSubmit() {
  settings.commands = formSettings.value
  toast.add({
    severity: 'success',
    summary: m.success(),
    detail: m.chat_settings_saved(),
    life: 3000,
  })
  onReset()
}
</script>
