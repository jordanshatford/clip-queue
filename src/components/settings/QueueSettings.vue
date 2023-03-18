<template>
  <div>
    <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Limit Queue Size?</label>
        <BaseSwitch id="allowCommands" v-model="formSettings.isLimited" />
      </div>
      <div>
        <label class="cq-form-group-label">Limit:</label>
        <BaseInput
          type="number"
          required
          :min="1"
          v-model="formSettings.limit"
          :disabled="!formSettings.isLimited"
        />
        <div class="cq-text-subtle text-left pl-1 my-2">
          <label>Clips will be ignored when queue limit is reached.</label>
        </div>
      </div>
      <div class="mt-3">
        <BaseButton class="mr-2" type="submit" :disabled="!queue.isSettingsModified(formSettings)"
          >Save</BaseButton
        >
        <BaseButton
          type="reset"
          variant="danger"
          :disabled="!queue.isSettingsModified(formSettings)"
          >Cancel</BaseButton
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
