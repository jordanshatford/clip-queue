<template>
  <div>
    <CCard class="mx-auto mb-2 max-w-lg">
      <template #content>
        <div class="m-0 flex flex-col gap-2 p-0 text-left">
          <label for="username" class="cq-text">Connected Chat:</label>
          <InputText id="username" disabled v-model="user.ctx.username" />
        </div>
      </template>
    </CCard>
    <CCard class="mx-auto max-w-lg">
      <template #content>
        <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey">
          <div class="flex flex-col gap-2 text-left">
            <label for="commandPrefix" class="cq-text">Commands Prefix:</label>
            <InputText
              id="commandPrefix"
              @keydown.space.prevent
              required
              maxlength="8"
              v-model="formSettings.prefix"
            />
            <small id="commandPrefix-help" class="cq-text-subtle pb-2"
              >Commands in chat must be prefixed by this value.</small
            >
            <label for="allowedCommands" class="cq-text">Allowed Commands:</label>
            <MultiSelect
              inputId="allowedCommands"
              v-model="formSettings.allowed"
              :options="Object.values(Command)"
              placeholder="None"
              display="chip"
              aria-describedby="allowedCommands-help"
            >
              <template #option="{ option }: { option: Command }">
                <div class="flex flex-col gap-1">
                  <p>{{ toCommandCall(option) }}</p>
                  <small>{{ commands.help[option].description }}</small>
                </div>
              </template>
            </MultiSelect>
            <small id="allowedCommands-help" class="cq-text-subtle pb-2"
              >Commands allowed to be used in chat.</small
            >
          </div>
          <div class="mt-3">
            <BButton
              severity="info"
              size="small"
              class="mr-2"
              type="submit"
              :disabled="!settings.isCommandsSettingsModified(formSettings)"
              >Save</BButton
            >
            <BButton
              type="reset"
              severity="danger"
              size="small"
              :disabled="!settings.isCommandsSettingsModified(formSettings)"
              >Cancel</BButton
            >
          </div>
        </form>
      </template>
    </CCard>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useSettings } from '@/stores/settings'
import { useUser } from '@/stores/user'
import commands, { Command } from '@/utils/commands'

const toast = useToast()
const user = useUser()
const settings = useSettings()

const formKey = ref(1)
const formSettings = ref(structuredClone(toRaw(settings.commands)))

function toCommandCall(command: Command) {
  const help = commands.help[command]
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
    summary: 'Success',
    detail: 'Chat settings saved',
    life: 3000
  })
  onReset()
}
</script>
