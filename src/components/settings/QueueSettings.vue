<template>
  <div>
    <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
      <div class="cq-toggle-form-group">
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
          v-model="formProviders"
          :options="[ClipProvider.KICK, ClipProvider.TWITCH]"
          placeholder="None"
          display="chip"
          aria-describedby="allowedProviders-help"
        />
        <small id="allowedProviders-help" class="cq-text-subtle pb-2"
          >Clips from these providers will be allowed in the queue.</small
        >
      </div>
      <div class="mt-3">
        <BButton class="mr-2" type="submit" severity="info" size="small" :disabled="!isFormModified"
          >Save</BButton
        >
        <BButton type="reset" severity="danger" size="small" :disabled="!isFormModified"
          >Cancel</BButton
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useQueue, type QueueSettings } from '@/stores/queue'
import { clone, deepEqual } from '@/utils'
import { ClipProvider } from '@/providers'
import { useProviders } from '@/stores/providers'

const providers = useProviders()
const toast = useToast()
const queue = useQueue()

const formKey = ref(1)
const formQueueSettings = ref<QueueSettings>(clone<QueueSettings>(queue.settings))
const formProviders = ref<ClipProvider[]>([...providers.enabledProviders])

const isFormModified = computed(() => {
  return (
    queue.isSettingsModified(formQueueSettings.value) ||
    !deepEqual(formProviders.value, providers.enabledProviders)
  )
})

function onReset() {
  formQueueSettings.value = clone<QueueSettings>(queue.settings)
  formProviders.value = [...providers.enabledProviders]
  formKey.value += 1
}

function onSubmit() {
  queue.updateSettings(formQueueSettings.value)
  providers.enabledProviders = formProviders.value
  toast.add({
    severity: 'success',
    summary: 'Queue settings saved',
    life: 3000
  })
  onReset()
}
</script>
