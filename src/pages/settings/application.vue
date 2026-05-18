<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-2 text-left">
      <label for="commandPrefix">{{ m.command_prefix() }}</label>
      <InputText
        id="commandPrefix"
        v-model="commands.settings.prefix"
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
        v-model="commands.settings.enabled"
        input-id="allowedCommands"
        :options="Object.keys(commands.commands)"
        :placeholder="m.none()"
        display="chip"
        size="small"
        aria-describedby="allowedCommands-help"
      >
        <template #option="{ option }: { option: string }">
          <div class="flex flex-col gap-1">
            <p>{{ commands.toCallHelp(option) }}</p>
            <small>{{ commands.toDescription(option) }}</small>
          </div>
        </template>
      </MultiSelect>
      <Message id="allowedCommands-help" size="small" severity="secondary" variant="simple">{{
        m.allowed_commands_description()
      }}</Message>
      <USeparator />
      <div class="flex justify-between">
        <label for="autoModeration">{{ m.auto_mod_colon() }}</label>
        <ToggleSwitch
          v-model="integrations.settings.automod"
          input-id="autoModeration"
          size="small"
          aria-describedby="autoModeration-help"
        />
      </div>
      <Message id="autoModeration-help" size="small" severity="secondary" variant="simple">{{
        m.auto_mod_description()
      }}</Message>
      <USeparator />
      <label for="limit">{{ m.size_limit() }}</label>
      <InputNumber
        v-model="queue.settings.limit"
        input-id="limit"
        allow-empty
        :locale="preferences.locale"
        :min="1"
        :step="1"
        size="small"
        show-buttons
        aria-describedby="limit-help"
      />
      <Message id="limit-help" size="small" severity="secondary" variant="simple">{{
        m.size_limit_description()
      }}</Message>
      <div class="flex justify-between">
        <label for="duplicates">{{ m.allow_duplicates() }}</label>
        <ToggleSwitch
          v-model="queue.settings.duplicates"
          input-id="duplicates"
          size="small"
          aria-describedby="duplicates-help"
        />
      </div>
      <Message id="duplicates-help" size="small" severity="secondary" variant="simple">{{
        m.allow_duplicates_description()
      }}</Message>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import ToggleSwitch from 'primevue/toggleswitch'

import { m } from '@/paraglide/messages'
import { useCommands } from '@/stores/commands'
import { useIntegrations } from '@/stores/integrations'
import { usePreferences } from '@/stores/preferences'
import { useQueue } from '@/stores/queue'

definePage({
  meta: {
    requiresAuth: true,
    icon: 'lucide:settings-2',
    title: m.application,
    order: 1,
  },
})

const commands = useCommands()
const integrations = useIntegrations()
const preferences = usePreferences()
const queue = useQueue()
</script>
