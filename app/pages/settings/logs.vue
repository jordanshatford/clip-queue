<template>
  <AppSettingsCard :title="m.logs()" :actions>
    <UFieldGroup class="w-full">
      <UButton to="/logs" color="neutral" variant="outline" class="w-full justify-center">
        {{ m.view() }}
        <template #trailing>
          <UKbd>
            {{ logger.logs.length }}
          </UKbd>
        </template>
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        :disabled="logger.empty"
        :icon="copied ? 'lucide:check' : 'lucide:copy'"
        @click="copyLogs()"
      />
    </UFieldGroup>
    <USeparator />
    <UFormField :label="m.level()" :help="m.logger_level_description()">
      <USelect
        id="logger-level"
        v-model="logger.settings.state.level"
        :items="availableLogLevels"
        class="w-full"
      >
        <template #default="{ modelValue }: { modelValue: LogLevel }">
          {{ logLevelTranslations[modelValue]() }}
        </template>
        <template #item-label="{ item }: { item: LogLevel }">
          {{ logLevelTranslations[item]() }}
        </template>
      </USelect>
    </UFormField>
    <UFormField :label="m.size_limit()" :help="m.logger_size_limit_description()">
      <UInputNumber
        id="logger-limit"
        v-model="logger.settings.state.limit"
        :min="1"
        :max="100000"
        :step="1"
        class="w-full"
      />
    </UFormField>
  </AppSettingsCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import type { LogLevel } from '~/stores/logger'

import { m } from '#paraglide/messages'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:book-text',
  order: 4,
})

const { copy, copied } = useClipboard()
const logger = useLogger()

async function copyLogs(): Promise<void> {
  logger.debug('[Logs]: Copying all logs to clipboard.')
  return await copy(logger.text)
}

const actions = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: m.copy(),
        icon: 'lucide:copy',
        disabled: logger.empty,
        onSelect: async () => {
          await copyLogs()
        },
      },
      {
        label: m.clear(),
        color: 'error',
        icon: 'lucide:trash',
        disabled: logger.empty,
        onSelect: () => {
          logger.debug('[Logs]: Clearing all logs.')
          logger.reset()
        },
      },
    ],
    [
      {
        label: m.reset_settings(),
        color: 'error',
        icon: 'lucide:rotate-ccw',
        disabled: !logger.settings.isModified,
        onSelect: () => {
          logger.debug('[Logs]: Resetting logger settings.')
          logger.settings.reset()
        },
      },
    ],
  ]
})
</script>
