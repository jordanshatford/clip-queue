<template>
  <Card class="mx-auto max-w-lg">
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
          <small id="autoModeration-help" class="pb-2 text-sm text-surface-400">
            {{ m.auto_mod_description() }}
          </small>
        </div>
        <div class="flex flex-col gap-2 text-left">
          <label for="limit">{{ m.size_limit() }}</label>
          <InputNumber
            v-model="formSettings.limit"
            input-id="limit"
            allow-empty
            :min="1"
            :step="1"
            show-buttons
            aria-describedby="limit-help"
          />
          <small id="limit-help" class="pb-2 text-sm text-surface-400">{{
            m.size_limit_description()
          }}</small>
        </div>
        <div class="flex flex-col gap-2 text-left">
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
          <small id="allowedProviders-help" class="pb-2 text-sm text-surface-400">{{
            m.allowed_providers_description()
          }}</small>
          <Message
            v-if="selectedExperimentalProviders.length > 0"
            severity="warn"
            :closable="false"
            class="mt-0"
          >
            <template #icon>
              <i class="pi pi-exclamation-triangle"></i>
            </template>
            <span>{{
              m.experimental_providers_selected({ names: selectedExperimentalProviders.join(', ') })
            }}</span>
          </Message>
        </div>
        <div class="mt-3">
          <Button
            :label="m.save()"
            class="mr-2"
            type="submit"
            severity="info"
            size="small"
            :disabled="!settings.isQueueSettingsModified(formSettings)"
          ></Button>
          <Button
            :label="m.cancel()"
            type="reset"
            severity="danger"
            size="small"
            :disabled="!settings.isQueueSettingsModified(formSettings)"
          ></Button>
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, toRaw } from 'vue'

import { ClipProvider } from '@cq/providers'
import {
  Button,
  Card,
  Chip,
  InputNumber,
  Message,
  MultiSelect,
  ToggleSwitch,
  useToast
} from '@cq/ui'

import ProviderName from '@/components/ProviderName.vue'
import * as m from '@/paraglide/messages'
import { useProviders } from '@/stores/providers'
import { useSettings } from '@/stores/settings'

const toast = useToast()
const settings = useSettings()
const providers = useProviders()

const formKey = ref(1)
const formSettings = ref(structuredClone(toRaw(settings.queue)))

const selectedExperimentalProviders = computed(() => {
  return formSettings.value.providers.filter((p) => providers.providers[p]?.isExperimental)
})

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
