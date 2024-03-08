<template>
  <CCard class="mx-auto max-w-lg">
    <template #content>
      <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey">
        <div class="flex justify-between">
          <label for="limitQueueSize" class="cq-text">Limit Queue Size?</label>
          <InputSwitch inputId="limitQueueSize" v-model="formQueueSettings.isLimited" />
        </div>
        <div class="flex flex-col gap-2 text-left">
          <label for="limit" class="cq-text">Limit:</label>
          <InputNumber
            id="limit"
            v-model="formQueueSettings.limit"
            :allow-empty="false"
            :min="1"
            :step="1"
            show-buttons
            :disabled="!formQueueSettings.isLimited"
            aria-describedby="limit-help"
          />
          <small id="limit-help" class="cq-text-subtle pb-2"
            >Clips will be ignored when queue limit is reached.</small
          >
        </div>
        <div class="flex flex-col gap-2 text-left">
          <label for="allowedProviders" class="cq-text">Allowed Providers:</label>
          <MultiSelect
            id="allowedProviders"
            v-model="formProviders.enabled"
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
        </div>
        <div class="mt-3">
          <BButton
            class="mr-2"
            type="submit"
            severity="info"
            size="small"
            :disabled="!isFormModified"
            >Save</BButton
          >
          <BButton type="reset" severity="danger" size="small" :disabled="!isFormModified"
            >Cancel</BButton
          >
        </div>
      </form>
    </template>
  </CCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useQueue, type QueueSettings } from '@/stores/queue'
import { clone } from '@/utils'
import { ClipProvider } from '@/providers'
import { useProviders, type Providers } from '@/stores/providers'
import ProviderName from '@/components/ProviderName.vue'

const providers = useProviders()
const toast = useToast()
const queue = useQueue()

const formKey = ref(1)
const formQueueSettings = ref<QueueSettings>(clone<QueueSettings>(queue.settings))
const formProviders = ref<Providers>(clone<Providers>(providers.$state))

const isFormModified = computed(() => {
  return (
    queue.isSettingsModified(formQueueSettings.value) || providers.isModified(formProviders.value)
  )
})

function onReset() {
  formQueueSettings.value = clone<QueueSettings>(queue.settings)
  formProviders.value = clone<Providers>(providers.$state)
  formKey.value += 1
}

function onSubmit() {
  queue.updateSettings(formQueueSettings.value)
  providers.update(formProviders.value)
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Queue settings saved',
    life: 3000
  })
  onReset()
}
</script>
