<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-2 text-left">
      <UFormField :label="m.command_prefix()" :help="m.command_prefix_description()">
        <UInput
          id="commandPrefix"
          v-model="commands.settings.prefix"
          type="text"
          required
          maxlength="8"
          class="w-full"
          @keydown.space.prevent
        />
      </UFormField>
      <UFormField :label="m.allowed_commands()" :help="m.allowed_commands_description()">
        <USelectMenu
          id="allowedCommands"
          v-model="commands.settings.enabled"
          :items="Object.keys(commands.commands)"
          :placeholder="m.none()"
          multiple
          class="w-full"
        >
          <template #item-label="{ item }: { item: string }">
            <div class="flex flex-col gap-1">
              <p>{{ commands.toCallHelp(item) }}</p>
              <small>{{ commands.toDescription(item) }}</small>
            </div>
          </template>
        </USelectMenu>
      </UFormField>
      <USeparator />
      <UFormField
        :label="m.auto_mod()"
        :description="m.auto_mod_description()"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <USwitch id="autoModeration" v-model="integrations.settings.automod" class="ml-auto" />
      </UFormField>
      <USeparator />
      <UFormField :label="m.size_limit()" :help="m.size_limit_description()">
        <UInputNumber
          id="queue-limit"
          v-model="queue.settings.limit"
          :min="1"
          :step="1"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="m.allow_duplicates()"
        :description="m.allow_duplicates_description()"
        class="flex items-center justify-between gap-2 not-last:pb-4"
      >
        <USwitch id="queue-duplicates" v-model="queue.settings.duplicates" class="ml-auto" />
      </UFormField>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { m } from '@/paraglide/messages'
import { useCommands } from '@/stores/commands'
import { useIntegrations } from '@/stores/integrations'
import { useQueue } from '@/stores/queue'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:settings-2',
  order: 1,
})

const commands = useCommands()
const integrations = useIntegrations()
const queue = useQueue()
</script>
