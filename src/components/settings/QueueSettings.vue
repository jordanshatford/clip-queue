<template>
  <div>
    <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Limit Queue Size?</label>
        <BaseSwitch id="allowCommands" v-model="formSettings.isLimited" />
      </div>
      <div>
        <label class="cq-form-group-label">Limit:</label>
        <BaseInput type="number" required :min="1" v-model="formSettings.limit" :disabled="!formSettings.isLimited" />
        <div class="cq-text-subtle text-left pl-1 my-2">
          <label>Clips will be ignored when queue limit is reached.</label>
        </div>
      </div>
      <div class="mt-3">
        <BaseButton class="mr-2" type="submit" :disabled="!isQueueSettingsModified">Save</BaseButton>
        <BaseButton type="reset" variant="danger" :disabled="!isQueueSettingsModified">Cancel</BaseButton>
      </div>
      <BaseAlert v-if="showSaveMsg" variant="success" class="mt-2">Save successful</BaseAlert>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useQueue } from "@/stores/queue"

const queue = useQueue()

const showSaveMsg = ref(false)
const formKey = ref(1)
const formSettings = ref({ isLimited: queue.upcoming.limit !== null, limit: queue.upcoming.limit })

const isQueueSettingsModified = computed<boolean>(() => {
  const sameLimitValue = queue.upcoming.limit === formSettings.value.limit
  const sameBeingLimited =
    (queue.upcoming.limit !== null && formSettings.value.isLimited) ||
    (queue.upcoming.limit === null && !formSettings.value.isLimited)
  if (sameLimitValue && sameBeingLimited) {
    return false
  }
  return true
})

function hideMsg() {
  showSaveMsg.value = false
}

function onReset() {
  formSettings.value = Object.assign({}, { isLimited: queue.upcoming.limit !== null, limit: queue.upcoming.limit })
  formKey.value += 1
}

function onSubmit() {
  showSaveMsg.value = true
  setTimeout(hideMsg, 2000)
  if (formSettings.value.isLimited) {
    queue.upcoming.limit = formSettings.value.limit
  } else {
    queue.upcoming.limit = null
  }
  onReset()
}
</script>
