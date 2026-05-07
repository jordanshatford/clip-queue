<template>
  <Card class="mx-auto max-w-2xl">
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
          <Divider />
          <div class="flex justify-between">
            <label for="autoModeration">{{ m.auto_mod_colon() }}</label>
            <ToggleSwitch
              v-model="formSettings.hasAutoModerationEnabled"
              input-id="autoModeration"
              size="small"
              aria-describedby="autoModeration-help"
            />
          </div>
          <Message id="autoModeration-help" size="small" severity="secondary" variant="simple">{{
            m.auto_mod_description()
          }}</Message>
          <label for="limit">{{ m.size_limit() }}</label>
          <InputNumber
            v-model="formSettings.limit"
            input-id="limit"
            allow-empty
            :locale="preferences.preferences.language"
            :min="1"
            :step="1"
            size="small"
            show-buttons
            aria-describedby="limit-help"
          />
          <Message id="limit-help" size="small" severity="secondary" variant="simple">{{
            m.size_limit_description()
          }}</Message>
        </div>
        <div class="mt-3">
          <Button
            :label="m.save()"
            size="small"
            class="mr-2"
            type="submit"
            severity="secondary"
            :disabled="!settings.isApplicationSettingsModified(formSettings)"
          ></Button>
          <Button
            type="reset"
            :label="m.cancel()"
            size="small"
            severity="danger"
            :disabled="!settings.isApplicationSettingsModified(formSettings)"
          ></Button>
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import ToggleSwitch from 'primevue/toggleswitch'

import { useSettingsForm } from '@/composables/use-settings-form'
import { m } from '@/paraglide/messages'
import { usePreferences } from '@/stores/preferences'
import { useSettings } from '@/stores/settings'
import commands, { Command } from '@/utils/commands'

definePage({
  meta: {
    requiresAuth: true,
    icon: 'pi pi-sliders-h',
    title: m.application,
    order: 1,
  },
})

const settings = useSettings()
const preferences = usePreferences()

const { formSettings, onReset, onSubmit } = useSettingsForm(
  'formElement',
  () => settings.application,
  (v) => (settings.application = v),
  m.application_settings_saved(),
)

function toCommandCall(command: Command) {
  const help = commands.help.value[command]
  let cmd = command.toString()
  if (help.args && help.args.length > 0) {
    cmd += ' '
    cmd += help.args.map((arg) => `<${arg}>`).join(' ')
  }
  return cmd
}
</script>
