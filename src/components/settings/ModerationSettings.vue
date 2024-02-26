<template>
  <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey" class="cq-form">
    <div>
      <div class="cq-toggle-form-group">
        <label class="cq-form-group-label">Auto remove clips on moderation?</label>
        <BaseSwitch id="autoRemoveClips" v-model="formSettings.hasAutoRemoveClipsEnabled" />
      </div>
      <div class="cq-text-subtle mb-2 pl-1 text-left">
        <label>
          When a user has their chat message deleted, is timed out, or banned, then the clips they
          submitted will be removed.
        </label>
      </div>
    </div>
    <div class="cq-form-group">
      <label class="cq-form-group-label">Channels not allowed:</label>
      <BaseMultiTagSelect v-model="formSettings.blockedChannels" itemName="channel" />
      <div class="cq-text-subtle my-2 pl-1 text-left">
        <label>Clips of these channels will not be added to the queue.</label>
      </div>
    </div>
    <div class="cq-form-group">
      <label class="cq-form-group-label">Submitters not allowed:</label>
      <BaseMultiTagSelect v-model="formSettings.blockedSubmitters" itemName="submitter" />
      <div class="cq-text-subtle my-2 pl-1 text-left">
        <label>Clips submitted by these users will not be added to the queue.</label>
      </div>
    </div>
    <div class="mt-3">
      <BaseButton class="mr-2" type="submit" :disabled="!moderation.isModified(formSettings)"
        >Save</BaseButton
      >
      <BaseButton type="reset" variant="danger" :disabled="!moderation.isModified(formSettings)"
        >Cancel</BaseButton
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useModeration, type Moderation } from '@/stores/moderation'
import { clone } from '@/utils'

const toast = useToast()
const moderation = useModeration()

const formKey = ref(1)
const formSettings = ref<Moderation>(clone<Moderation>(moderation.$state, true))

function onReset() {
  formSettings.value = clone<Moderation>(moderation.$state, true)
  formKey.value += 1
}

function onSubmit() {
  moderation.update(formSettings.value)
  toast.success('Moderation settings saved')
  onReset()
}
</script>
