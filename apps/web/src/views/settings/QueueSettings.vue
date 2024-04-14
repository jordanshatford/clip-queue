<template>
  <Card class="mx-auto max-w-lg">
    <template #content>
      <form :key="formKey" @submit.prevent="onSubmit" @reset="onReset">
        <div class="flex flex-col gap-2 text-left">
          <div class="flex justify-between">
            <label for="autoModeration" class="cq-text">Auto Moderation:</label>
            <InputSwitch
              v-model="formSettings.hasAutoModerationEnabled"
              input-id="autoModeration"
              aria-describedby="autoModeration-help"
            />
          </div>
          <small id="autoModeration-help" class="cq-text-subtle pb-2">
            When a user has their chat message deleted, is timed out, or banned, the clips they
            submitted will be removed.
          </small>
        </div>
        <div class="flex flex-col gap-2 text-left">
          <label for="limit" class="cq-text">Size Limit:</label>
          <InputNumber
            v-model="formSettings.limit"
            input-id="limit"
            allow-empty
            :min="1"
            :step="1"
            show-buttons
            aria-describedby="limit-help"
          />
          <small id="limit-help" class="cq-text-subtle pb-2"
            >The number of clips allowed in the queue. Leave empty for no limit.</small
          >
        </div>
        <div class="flex flex-col gap-2 text-left">
          <label for="allowedProviders" class="cq-text">Allowed Providers:</label>
          <MultiSelect
            v-model="formSettings.providers"
            input-id="allowedProviders"
            :options="Object.values(ClipProvider)"
            placeholder="None"
            display="chip"
            aria-describedby="allowedProviders-help"
          >
            <template #option="{ option }: { option: ClipProvider }">
              <ProviderName :provider="option" />
            </template>
            <template #chip="{ value }: { value: ClipProvider }">
              <ProviderName :provider="value" />
            </template>
          </MultiSelect>
          <small id="allowedProviders-help" class="cq-text-subtle pb-2"
            >Clips from these providers will be allowed in the queue.</small
          >
          <Message
            v-if="selectedExperimentalProviders.length > 0"
            severity="warn"
            :closable="false"
            class="mt-0"
          >
            Experimental providers selected: {{ selectedExperimentalProviders.join(', ') }}
          </Message>
        </div>
        <div class="mt-3">
          <Button
            label="Save"
            class="mr-2"
            type="submit"
            severity="info"
            size="small"
            :disabled="!settings.isQueueSettingsModified(formSettings)"
          ></Button>
          <Button
            label="Cancel"
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
import { Button, Card, InputNumber, InputSwitch, Message, MultiSelect, useToast } from '@cq/ui'
import { useSettings } from '@/stores/settings'
import { useProviders } from '@/stores/providers'
import ProviderName from '@/components/ProviderName.vue'

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
    summary: 'Success',
    detail: 'Queue settings saved',
    life: 3000
  })
  onReset()
}
</script>
