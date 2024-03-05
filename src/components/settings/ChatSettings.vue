<template>
  <div>
    <div class="cq-form mb-2">
      <div class="flex flex-col gap-2 text-left">
        <label for="username" class="cq-text">Currently in chat of:</label>
        <InputText id="username" disabled v-model="user.ctx.username" />
      </div>
    </div>
    <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
      <div class="cq-toggle-form-group">
        <label for="allowCommands" class="cq-text">Allow chat commands?</label>
        <InputSwitch inputId="allowCommands" v-model="formSettings.allowCommands" />
      </div>
      <div class="flex flex-col gap-2 text-left">
        <label for="commandPrefix" class="cq-text">Chat command prefix:</label>
        <InputText
          id="commandPrefix"
          @keydown.space.prevent
          required
          maxlength="8"
          :disabled="!formSettings.allowCommands"
          v-model="formSettings.commandPrefix"
        />
        <div class="cq-text-subtle my-2 pl-1 text-left">
          <label>The following commands are available to mods: </label>
          <ul class="list-disc pl-8">
            <li v-for="(help, command) in commands.help" :key="command">
              <code class="cq-text-subtle-semibold">{{ toCommandCall(command, help) }}</code
              >: {{ help.description }}
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-3">
        <BButton
          severity="info"
          size="small"
          class="mr-2"
          type="submit"
          :disabled="!settings.isModified(formSettings)"
          >Save</BButton
        >
        <BButton
          type="reset"
          severity="danger"
          size="small"
          :disabled="!settings.isModified(formSettings)"
          >Cancel</BButton
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useSettings, type Settings } from '@/stores/settings'
import { useUser } from '@/stores/user'
import commands, { Command, type CommandHelp } from '@/utils/commands'
import { clone } from '@/utils'

const toast = useToast()
const user = useUser()
const settings = useSettings()

const formKey = ref(1)
const formSettings = ref<Settings>(clone<Settings>(settings.$state))

function toCommandCall(command: Command, help: CommandHelp) {
  let cmd = settings.commandPrefix + command.toString()
  if (help.args && help.args.length > 0) {
    cmd += ' '
    cmd += help.args.map((arg) => `<${arg}>`).join(' ')
  }
  return cmd
}

function onReset() {
  formSettings.value = clone<Settings>(settings.$state)
  formKey.value += 1
}

function onSubmit() {
  settings.update(formSettings.value)
  toast.add({
    severity: 'success',
    summary: 'Chat settings saved',
    life: 3000
  })
  onReset()
}
</script>
