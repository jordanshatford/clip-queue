<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex flex-col gap-4 text-left">
      <UFormField :label="m.logs()">
        <UFieldGroup class="w-full">
          <UButton
            icon="lucide:book-text"
            to="/logs"
            color="neutral"
            variant="outline"
            class="w-full justify-center"
          >
            {{ m.view() }}
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            :icon="copied ? 'lucide:check' : 'lucide:copy'"
            @click="copyLogs()"
          />
        </UFieldGroup>
      </UFormField>
      <USeparator />
      <UFormField :label="m.level()" :help="m.logger_level_description()">
        <USelect
          id="logger-level"
          v-model="logger.settings.level"
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
          v-model="logger.settings.limit"
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
  return await copy(logger.text)
}
</script>
