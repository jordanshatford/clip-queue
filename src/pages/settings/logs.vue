<template>
  <Card class="mx-auto max-w-2xl">
    <template #content>
      <div class="m-0 flex flex-col gap-2 p-0 text-left">
        <p>{{ m.logs_colon() }}</p>
        <Button
          :label="m.view()"
          icon="pi pi-book"
          size="small"
          fluid
          severity="secondary"
          as="router-link"
          to="/logs"
        >
        </Button>
      </div>
      <Divider />
      <div class="flex flex-col gap-2 text-left">
        <label for="loggerLevel">{{ m.level_colon() }}</label>
        <Select
          v-model="logger.settings.level"
          :options="availableLogLevels"
          label-id="loggerLevel"
          size="small"
          :option-label="(value: LogLevel) => logLevelTranslations[value]()"
          aria-describedby="loggerLevel-help"
        >
        </Select>
        <Message id="loggerLevel-help" size="small" severity="secondary" variant="simple">{{
          m.logger_level_description()
        }}</Message>
        <label for="loggerLimit">{{ m.size_limit() }}</label>
        <InputNumber
          v-model="logger.settings.limit"
          input-id="loggerLimit"
          :allow-empty="false"
          :locale="preferences.locale"
          :min="1"
          :max="100000"
          :step="1"
          size="small"
          show-buttons
          aria-describedby="loggerLimit-help"
        />
        <Message id="loggerLimit-help" size="small" severity="secondary" variant="simple">{{
          m.logger_size_limit_description()
        }}</Message>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import Select from 'primevue/select'

import type { LogLevel } from '@/stores/logger'

import { m } from '@/paraglide/messages'
import { availableLogLevels, logLevelTranslations, useLogger } from '@/stores/logger'
import { usePreferences } from '@/stores/preferences'

definePage({
  meta: {
    requiresAuth: true,
    icon: 'pi pi-book',
    title: m.logs,
    order: 4,
  },
})

const preferences = usePreferences()
const logger = useLogger()
</script>
