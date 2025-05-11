<template>
  <div>
    <Card class="mx-auto mb-2 max-w-xl">
      <template #content>
        <div class="m-0 flex flex-col gap-2 p-0 text-left">
          <p>{{ m.logs_colon() }}</p>
          <SecondaryButton
            :label="m.view()"
            icon="pi pi-book"
            size="small"
            fluid
            as="router-link"
            :to="{ name: RouteNameConstants.LOGS }"
          >
          </SecondaryButton>
        </div>
      </template>
    </Card>
    <Card class="mx-auto max-w-xl">
      <template #content>
        <form :key="formKey" @submit.prevent="onSubmit" @reset="onReset">
          <div class="flex flex-col gap-2 text-left">
            <label for="loggerLevel">{{ m.level_colon() }}</label>
            <Select
              v-model="formSettings.level"
              :options="availableLogLevels"
              label-id="loggerLevel"
              :option-label="(value: LogLevel) => logLevelTranslations[value]()"
              aria-describedby="loggerLevel-help"
            >
            </Select>
            <Message id="loggerLevel-help" size="small" severity="secondary" variant="simple">{{
              m.logger_level_description()
            }}</Message>
            <label for="loggerLimit">{{ m.size_limit() }}</label>
            <InputNumber
              v-model="formSettings.limit"
              input-id="loggerLimit"
              :allow-empty="false"
              :locale="preferences.preferences.language"
              :min="1"
              :max="100000"
              :step="1"
              show-buttons
              aria-describedby="loggerLimit-help"
            />
            <Message id="loggerLimit-help" size="small" severity="secondary" variant="simple">{{
              m.logger_size_limit_description()
            }}</Message>
          </div>
          <div class="mt-3">
            <SecondaryButton
              :label="m.save()"
              size="small"
              class="mr-2"
              type="submit"
              :disabled="!settings.isLoggerSettingsModified(formSettings)"
            ></SecondaryButton>
            <DangerButton
              type="reset"
              :label="m.cancel()"
              size="small"
              :disabled="!settings.isLoggerSettingsModified(formSettings)"
            ></DangerButton>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'

import { Card, DangerButton, InputNumber, Message, SecondaryButton, Select, useToast } from '@cq/ui'

import type { LogLevel } from '@/stores/logger'
import * as m from '@/paraglide/messages'
import { RouteNameConstants } from '@/router'
import { availableLogLevels, logLevelTranslations } from '@/stores/logger'
import { usePreferences } from '@/stores/preferences'
import { useSettings } from '@/stores/settings'

// TODO: do I need to make sure when limit/level is updated, we update current logs? Probably not. Add note in description.

const toast = useToast()
const preferences = usePreferences()
const settings = useSettings()

const formKey = ref(1)
const formSettings = ref(structuredClone(toRaw(settings.logger)))

function onReset() {
  formSettings.value = structuredClone(toRaw(settings.logger))
  formKey.value += 1
}

function onSubmit() {
  settings.logger = formSettings.value
  toast.add({
    severity: 'success',
    summary: m.success(),
    detail: m.logger_settings_saved(),
    life: 3000
  })
  onReset()
}
</script>
