<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-2">
    <UCard class="text-left" variant="subtle">
      <div class="flex flex-col gap-4">
        <UFormField
          :label="m.auto_mod()"
          :description="m.auto_mod_description()"
          class="flex items-center justify-between"
        >
          <USwitch id="autoModeration" v-model="integrations.settings.state.automod" class="ml-3" />
        </UFormField>
        <USeparator />
        <UFormField
          :label="m.allow_duplicates()"
          :description="m.allow_duplicates_description()"
          class="flex items-center justify-between"
        >
          <USwitch id="queue-duplicates" v-model="queue.settings.state.duplicates" class="ml-3" />
        </UFormField>
        <USeparator />
        <UFormField :label="m.size_limit()" :help="m.size_limit_description()">
          <UInputNumber
            id="queue-limit"
            v-model="queue.settings.state.limit"
            :min="1"
            :step="1"
            class="w-full"
          />
        </UFormField>
      </div>
    </UCard>
    <UCard class="text-left" variant="subtle">
      <div class="mt-4 flex flex-col gap-4">
        <UFormField :label="m.command_prefix()" :help="m.command_prefix_description()">
          <UInput
            id="commandPrefix"
            v-model="commands.settings.state.prefix"
            type="text"
            required
            maxlength="8"
            class="w-full"
            @keydown.space.prevent
          />
        </UFormField>
        <UFormField :label="m.allowed_commands()">
          <UCheckboxGroup
            id="allowedCommands"
            v-model="commands.settings.state.enabled"
            color="primary"
            variant="table"
            :items="items"
          />
        </UFormField>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:settings-2',
  order: 1,
})

const commands = useCommands()
const integrations = useIntegrations()
const queue = useQueue()

const items = computed(() => {
  return Object.keys(commands.commands).map((command) => ({
    id: command,
    value: command,
    label: commands.toCallHelp(command),
    description: commands.toDescription(command),
  }))
})
</script>
