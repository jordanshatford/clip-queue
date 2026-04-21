<template>
  <Card class="mx-auto max-w-xl">
    <template #content>
      <form ref="formElement" @submit.prevent="onSubmit" @reset="onReset">
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
          <Button
            :label="m.save()"
            class="mr-2"
            type="submit"
            size="small"
            severity="secondary"
            :disabled="!settings.isQueueSettingsModified(formSettings)"
          ></Button>
          <Button
            :label="m.cancel()"
            type="reset"
            size="small"
            severity="danger"
            :disabled="!settings.isQueueSettingsModified(formSettings)"
          ></Button>
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chip from 'primevue/chip'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import ToggleSwitch from 'primevue/toggleswitch'
import { useToast } from 'primevue/usetoast'
import { ref, toRaw, useTemplateRef } from 'vue'

import ProviderName from '@/components/ProviderName.vue'
import { m } from '@/paraglide/messages'
import { ClipProvider } from '@/providers'
import { usePreferences } from '@/stores/preferences'
import { useSettings } from '@/stores/settings'

const toast = useToast()
const settings = useSettings()
const preferences = usePreferences()

const formElement = useTemplateRef<HTMLFormElement>('formElement')
const formSettings = ref(structuredClone(toRaw(settings.queue)))

function onReset() {
  formSettings.value = structuredClone(toRaw(settings.queue))
  formElement.value?.reset()
}

function onSubmit() {
  settings.queue = formSettings.value
  toast.add({
    severity: 'success',
    summary: m.success(),
    detail: m.queue_settings_saved(),
    life: 3000,
  })
  onReset()
}
</script>
