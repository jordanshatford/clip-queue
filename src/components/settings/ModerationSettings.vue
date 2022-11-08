<template>
  <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
    <div>
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Auto remove clips on moderation?</label>
        <BaseSwitch id="autoRemoveClips" v-model="formAutoRemoveClips" />
      </div>
      <div class="text-left pl-1 cq-text-subtle mb-2">
        <label>
          When a user has their chat message deleted, is timed out, or banned, then the clips they submitted will be
          removed.
        </label>
      </div>
    </div>
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

const formAutoRemoveClips = ref<boolean>(queue.autoRemoveClipsOnModeration)
const formBlockedChannels = ref<string[]>([...queue.blockedChannels])

const showSaveMsg = ref(false)
const formKey = ref(1)

const isModified = computed(() => {
  // If auto remove clips has changed
  if (formAutoRemoveClips.value !== queue.autoRemoveClipsOnModeration) {
    return true
  }

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
  formAutoRemoveClips.value = queue.autoRemoveClipsOnModeration
  formBlockedChannels.value = [...queue.blockedChannels]
  formKey.value += 1
}

function onSubmit() {
  showSaveMsg.value = true
  setTimeout(hideMsg, 2000)
  queue.autoRemoveClipsOnModeration = formAutoRemoveClips.value
  queue.blockedChannels = formBlockedChannels.value
  onReset()
}
</script>
