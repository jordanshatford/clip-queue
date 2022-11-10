<template>
  <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
    <div>
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Auto remove clips on moderation?</label>
        <BaseSwitch id="autoRemoveClips" v-model="formSettings.hasAutoRemoveClipsEnabled" />
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
      <BaseMultiTagSelect v-model="formSettings.blockedChannels" itemName="channel" />
      <div class="cq-text-subtle text-left pl-1 my-2">
        <label>Clips of these channels will not be added to the queue.</label>
      </div>
    </div>
    <div class="mt-2">
      <BaseButton class="mr-2" type="submit" :disabled="!moderation.isModified(formSettings)">Save</BaseButton>
      <BaseButton type="reset" variant="danger" :disabled="!moderation.isModified(formSettings)">Cancel</BaseButton>
    </div>
    <BaseAlert v-if="showSaveMsg" variant="success" class="mt-2">Save successful</BaseAlert>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useModeration, type Moderation } from "@/stores/moderation"

const moderation = useModeration()

const showSaveMsg = ref(false)
const formKey = ref(1)
const formSettings = ref<Moderation>(JSON.parse(JSON.stringify(moderation.$state)))

function hideMsg() {
  showSaveMsg.value = false
}

function onReset() {
  formSettings.value = JSON.parse(JSON.stringify(moderation.$state))
  formKey.value += 1
}

function onSubmit() {
  showSaveMsg.value = true
  setTimeout(hideMsg, 2000)
  moderation.update(formSettings.value)
  onReset()
}
</script>
