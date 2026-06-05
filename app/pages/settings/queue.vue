<template>
  <AppSettingsCard :title="m.queue()" :actions>
    <UFormField
      :label="m.auto_mod()"
      :description="m.auto_mod_description()"
      class="flex items-center justify-between"
    >
      <USwitch id="autoModeration" v-model="integrations.settings.state.automod" class="ml-2" />
    </UFormField>
    <USeparator />
    <UFormField
      :label="m.allow_duplicates()"
      :description="m.allow_duplicates_description()"
      class="flex items-center justify-between"
    >
      <USwitch id="queue-duplicates" v-model="queue.settings.state.duplicates" class="ml-2" />
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
  </AppSettingsCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import { m } from '#paraglide/messages'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:list',
  order: 1,
})

const integrations = useIntegrations()
const queue = useQueue()

const actions = computed<DropdownMenuItem[][]>(() => {
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
</script>
