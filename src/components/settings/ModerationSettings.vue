<template>
  <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
    <div class="cq-form-group mb-1">
      <label class="cq-form-group-label">Channels not allowed:</label>
      <BaseMultiTagSelect v-model="formBlockedChannels" itemName="channel" />
      <div class="cq-text-subtle text-left pl-1 my-2">
        <label>Clips of these channels will not be added to the queue.</label>
      </div>
    </div>
    <div class="mt-2">
      <BaseButton class="mr-2" type="submit" :disabled="!isModified">Save</BaseButton>
      <BaseButton type="reset" variant="danger" :disabled="!isModified">Cancel</BaseButton>
    </div>
    <BaseAlert v-if="showSaveMsg" variant="success" class="mt-2">Save successful</BaseAlert>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useQueue } from "@/stores/queue"

const queue = useQueue()

const formBlockedChannels = ref<string[]>([...queue.blockedChannels])

const showSaveMsg = ref(false)
const formKey = ref(1)

const isModified = computed(() => {
  // If the length has changed they are modified
  if (formBlockedChannels.value.length !== queue.blockedChannels.length) {
    return true
  }
  // Check that values match, if not they have changed
  return formBlockedChannels.value.some((v) => {
    return !queue.blockedChannels.some((c) => c.toLowerCase() === v.toLowerCase())
  })
})

function hideMsg() {
  showSaveMsg.value = false
}

function onReset() {
  formBlockedChannels.value = [...queue.blockedChannels]
  formKey.value += 1
}

function onSubmit() {
  showSaveMsg.value = true
  setTimeout(hideMsg, 2000)
  queue.blockedChannels = formBlockedChannels.value
  onReset()
}
</script>
