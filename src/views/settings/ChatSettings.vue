<template>
  <div>
    <CCard class="mx-auto mb-2 max-w-lg">
      <template #content>
        <div class="m-0 flex flex-col gap-2 p-0 text-left">
          <label for="username" class="cq-text">Currently in chat of:</label>
          <InputText id="username" disabled v-model="user.ctx.username" />
        </div>
      </template>
    </CCard>
    <CCard class="mx-auto max-w-lg">
      <template #content>
        <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey">
          <div class="flex justify-between">
            <label for="allowCommands" class="cq-text">Allow chat commands?</label>
            <InputSwitch inputId="allowCommands" v-model="formSettings.enabled" />
          </div>
          <div class="flex flex-col gap-2 text-left">
            <label for="commandPrefix" class="cq-text">Chat command prefix:</label>
            <InputText
              id="commandPrefix"
              @keydown.space.prevent
              required
              maxlength="8"
              v-model="formSettings.prefix"
            />
            <PPanel
              class="cq-text-subtle"
              header="Commands available to mods:"
              toggleable
              :collapsed="true"
            >
              <div class="cq-text-subtle px-3 text-left">
                <ul class="list-disc">
                  <li v-for="(help, command) in commands.help" :key="command">
                    <code class="cq-text-subtle-semibold">{{ toCommandCall(command, help) }}</code
                    >: {{ help.description }}
                  </li>
                </ul>
              </div>
            </PPanel>
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
import commands, { Command, type CommandHelp } from '@/utils/commands'

const toast = useToast()
const user = useUser()
const settings = useSettings()

const formKey = ref(1)
const formSettings = ref(structuredClone(toRaw(settings.commands)))

function toCommandCall(command: Command, help: CommandHelp) {
  let cmd = settings.commands.prefix + command.toString()
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
