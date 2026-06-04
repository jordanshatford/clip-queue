<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-4 text-left">
      <div class="flex items-center gap-2 align-middle">
        <span class="font-medium">{{ m.commands() }}</span>
        <UDropdownMenu :items="actions">
          <UButton icon="lucide:ellipsis-vertical" size="sm" color="neutral" variant="ghost" />
        </UDropdownMenu>
      </div>
      <UFormField :label="m.prefix()" :help="m.prefix_description()">
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
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import { m } from '#paraglide/messages'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:command',
  order: 2,
})

const commands = useCommands()

const items = computed(() => {
  return Object.keys(commands.commands).map((command) => ({
    id: command,
    value: command,
    label: commands.toCallHelp(command),
    description: commands.toDescription(command),
  }))
})

const actions = computed<DropdownMenuItem[][]>(() => {
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
