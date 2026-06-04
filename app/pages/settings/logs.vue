<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-4 text-left">
      <div class="flex items-center gap-2 align-middle">
        <span class="font-medium">{{ m.logs() }}</span>
        <UDropdownMenu :items="items">
          <UButton icon="lucide:ellipsis-vertical" size="sm" color="neutral" variant="ghost" />
        </UDropdownMenu>
      </div>
      <UFieldGroup class="w-full">
        <UButton
          icon="lucide:book-text"
          to="/logs"
          color="neutral"
          variant="outline"
          class="w-full justify-center"
        >
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
          :disabled="!(logger.logs.length > 0)"
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
    </div>
  </UCard>
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

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: m.copy_logs(),
        icon: 'lucide:copy',
        disabled: !(logger.logs.length > 0),
        onSelect: async () => {
          await copyLogs()
        },
      },
      {
        label: m.clear_logs(),
        icon: 'lucide:trash',
        disabled: !(logger.logs.length > 0),
        onSelect: () => {
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
          logger.settings.reset()
        },
      },
    ],
  ]
})
</script>
