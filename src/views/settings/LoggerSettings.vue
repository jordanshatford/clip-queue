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
          :to="{ name: RouteNameConstants.LOGS }"
        >
        </Button>
      </div>
      <Divider />
      <form ref="formElement" @submit.prevent="onSubmit" @reset="onReset">
        <div class="flex flex-col gap-2 text-left">
          <label for="loggerLevel">{{ m.level_colon() }}</label>
          <Select
            v-model="formSettings.level"
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
            v-model="formSettings.limit"
            input-id="loggerLimit"
            :allow-empty="false"
            :locale="preferences.preferences.language"
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
        <div class="mt-3">
          <Button
            :label="m.save()"
            size="small"
            class="mr-2"
            type="submit"
            severity="secondary"
            :disabled="!settings.isLoggerSettingsModified(formSettings)"
          ></Button>
          <Button
            type="reset"
            :label="m.cancel()"
            size="small"
            severity="danger"
            :disabled="!settings.isLoggerSettingsModified(formSettings)"
          ></Button>
        </div>
      </form>
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
import { useToast } from 'primevue/usetoast'
import { ref, toRaw, useTemplateRef } from 'vue'

import type { LogLevel } from '@/stores/logger'

import { m } from '@/paraglide/messages'
import { RouteNameConstants } from '@/router'
import { availableLogLevels, logLevelTranslations } from '@/stores/logger'
import { usePreferences } from '@/stores/preferences'
import { useSettings } from '@/stores/settings'

const toast = useToast()
const preferences = usePreferences()
const settings = useSettings()

const formElement = useTemplateRef<HTMLFormElement>('formElement')
const formSettings = ref(structuredClone(toRaw(settings.logger)))

function onReset() {
  formSettings.value = structuredClone(toRaw(settings.logger))
  formElement.value?.reset()
}

function onSubmit() {
  settings.logger = formSettings.value
  toast.add({
    severity: 'success',
    summary: m.success(),
    detail: m.logger_settings_saved(),
    life: 3000,
  })
  onReset()
}
</script>
