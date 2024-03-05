<template>
  <div>
    <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
      <div class="cq-toggle-form-group">
        <label for="limitQueueSize" class="cq-text">Limit Queue Size?</label>
        <InputSwitch inputId="limitQueueSize" v-model="formSettings.isLimited" />
      </div>
      <div class="flex flex-col gap-2 text-left">
        <label for="limit" class="cq-text">Limit:</label>
        <InputNumber
          id="limit"
          v-model="formSettings.limit"
          :allow-empty="false"
          :min="1"
          :step="1"
          show-buttons
          :disabled="!formSettings.isLimited"
          aria-describedby="limit-help"
        />
        <small id="limit-help" class="cq-text-subtle"
          >Clips will be ignored when queue limit is reached.</small
        >
      </div>
      <div class="mt-3">
        <BButton
          class="mr-2"
          type="submit"
          severity="info"
          size="small"
          :disabled="!queue.isSettingsModified(formSettings)"
          >Save</BButton
        >
        <BButton
          type="reset"
          severity="danger"
          size="small"
          :disabled="!queue.isSettingsModified(formSettings)"
          >Cancel</BButton
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useQueue, type QueueSettings } from '@/stores/queue'
import { clone } from '@/utils'

const toast = useToast()
const queue = useQueue()

const formKey = ref(1)
const formSettings = ref<QueueSettings>(clone<QueueSettings>(queue.settings))

function onReset() {
  formSettings.value = clone<QueueSettings>(queue.settings)
  formKey.value += 1
}

function onSubmit() {
  queue.updateSettings(formSettings.value)
  toast.success('Queue settings saved')
  onReset()
}
</script>
