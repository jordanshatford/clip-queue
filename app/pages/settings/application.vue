<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-2">
    <UCard class="text-left" variant="subtle">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2 align-middle">
          <span class="font-medium">{{ m.queue() }}</span>
          <UDropdownMenu :items="items2">
            <UButton icon="lucide:ellipsis-vertical" size="sm" color="neutral" variant="ghost" />
          </UDropdownMenu>
        </div>
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
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2 align-middle">
          <span class="font-medium">{{ m.commands() }}</span>
          <UDropdownMenu :items="items3">
            <UButton icon="lucide:ellipsis-vertical" size="sm" color="neutral" variant="ghost" />
          </UDropdownMenu>
        </div>
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
import type { DropdownMenuItem } from '@nuxt/ui'

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

const items2 = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: m.reset_settings(),
        color: 'error',
        icon: 'lucide:rotate-ccw',
        disabled: !(queue.settings.isModified || integrations.settings.isModified),
        onSelect: () => {
          queue.settings.reset()
          integrations.settings.reset()
        },
      },
    ],
  ]
})

const items3 = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: m.reset_settings(),
        color: 'error',
        icon: 'lucide:rotate-ccw',
        disabled: !commands.settings.isModified,
        onSelect: () => {
          commands.settings.reset()
        },
      },
    ],
  ]
})
</script>
