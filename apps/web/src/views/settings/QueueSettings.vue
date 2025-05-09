<template>
  <Card class="mx-auto max-w-xl">
    <template #content>
      <form :key="formKey" @submit.prevent="onSubmit" @reset="onReset">
        <div class="flex flex-col gap-2 text-left">
          <div class="flex justify-between">
            <label for="autoModeration">{{ m.auto_mod() }}</label>
            <ToggleSwitch
              v-model="formSettings.hasAutoModerationEnabled"
              input-id="autoModeration"
              aria-describedby="autoModeration-help"
            />
          </div>
          <Message id="autoModeration-help" size="small" severity="secondary" variant="simple">{{
            m.auto_mod_description()
          }}</Message>
          <label for="limit">{{ m.size_limit() }}</label>
          <InputNumber
            v-model="formSettings.limit"
            input-id="limit"
            allow-empty
            :locale="preferences.preferences.language"
            :min="1"
            :step="1"
            show-buttons
            aria-describedby="limit-help"
          />
          <Message id="limit-help" size="small" severity="secondary" variant="simple">{{
            m.size_limit_description()
          }}</Message>
          <label for="allowedProviders">{{ m.allowed_providers() }}</label>
          <MultiSelect
            v-model="formSettings.providers"
            input-id="allowedProviders"
            :options="Object.values(ClipProvider)"
            :placeholder="m.none()"
            display="chip"
            aria-describedby="allowedProviders-help"
          >
            <template #option="{ option }: { option: ClipProvider }">
              <ProviderName :provider="option" />
            </template>
            <template #chip="{ value }: { value: ClipProvider }">
              <Chip>
                <ProviderName :provider="value" />
              </Chip>
            </template>
          </MultiSelect>
          <Message id="allowedProviders-help" size="small" severity="secondary" variant="simple">{{
            m.allowed_providers_description()
          }}</Message>
        </div>
        <div class="mt-3">
          <SecondaryButton
            :label="m.save()"
            class="mr-2"
            type="submit"
            size="small"
            :disabled="!settings.isQueueSettingsModified(formSettings)"
          ></SecondaryButton>
          <DangerButton
            :label="m.cancel()"
            type="reset"
            size="small"
            :disabled="!settings.isQueueSettingsModified(formSettings)"
          ></DangerButton>
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'

import { ClipProvider } from '@cq/providers'
import {
  Card,
  Chip,
  DangerButton,
  InputNumber,
  Message,
  MultiSelect,
  SecondaryButton,
  ToggleSwitch,
  useToast
} from '@cq/ui'

import ProviderName from '@/components/ProviderName.vue'
import * as m from '@/paraglide/messages'
import { usePreferences } from '@/stores/preferences'
import { useSettings } from '@/stores/settings'

const toast = useToast()
const settings = useSettings()
const preferences = usePreferences()

const formKey = ref(1)
const formSettings = ref(structuredClone(toRaw(settings.queue)))

function onReset() {
  formSettings.value = structuredClone(toRaw(settings.queue))
  formKey.value += 1
}

function onSubmit() {
  settings.queue = formSettings.value
  toast.add({
    severity: 'success',
    summary: m.success(),
    detail: m.queue_settings_saved(),
    life: 3000
  })
  onReset()
}
</script>
