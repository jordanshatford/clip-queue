<template>
  <AppSettingsCard :title="m.commands()" :actions>
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
    <UFormField>
      <template #label>
        <div class="flex items-center gap-2">
          <span>{{ m.enabled() }}</span>
          <UKbd>{{ commands.settings.state.enabled.length }} / {{ items.length }}</UKbd>
        </div>
      </template>
      <UFormField
        v-for="item of items"
        :key="item.id"
        :label="item.label"
        :description="item.description"
        size="sm"
        class="flex items-center justify-between py-2"
      >
        <template #label>
          <div class="mb-1 flex items-center gap-2">
            <span class="font-mono">{{ item.label }}</span>
            <div v-if="item.args" class="flex gap-1">
              <UBadge
                v-for="arg in item.args"
                :key="arg"
                size="sm"
                class="font-mono"
                color="neutral"
                variant="outline"
                >{{ `<${arg.toLocaleLowerCase()}>` }}</UBadge
              >
            </div>
          </div>
        </template>
        <USwitch
          :id="`command-${item.id}`"
          class="ml-2"
          :model-value="commands.isEnabled(item.value)"
          @update:model-value="(value) => commands.setEnabled(item.value, value)"
        />
      </UFormField>
    </UFormField>
  </AppSettingsCard>
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
  return Object.keys(commands.commands).map((command) => {
    const cmd = commands.commands[command]
    return {
      id: command,
      value: command,
      label: cmd?.id,
      description: cmd?.help.description(),
      args: cmd?.help.args?.map((arg) => arg()),
    }
  })
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
