<template>
  <CCard class="mx-auto max-w-lg">
    <template #content>
      <form @submit.prevent="onSubmit" @reset="onReset" :key="formKey">
        <div>
          <div class="flex justify-between pb-1">
            <label for="autoRemoveClips" class="cq-text">Auto remove clips on moderation?</label>
            <InputSwitch
              inputId="autoRemoveClips"
              v-model="formSettings.hasAutoRemoveClipsEnabled"
            />
          </div>
          <div class="cq-text-subtle mb-2 text-left">
            <label>
              When a user has their chat message deleted, is timed out, or banned, then the clips
              they submitted will be removed.
            </label>
          </div>
        </div>
        <div class="flex flex-col gap-2 text-left">
          <label for="blockedChannels" class="cq-text">Channels not allowed:</label>
          <InputChips
            inputId="blockedChannels"
            v-model="formSettings.blockedChannels"
            separator=" "
          />
          <div class="cq-text-subtle pb-2">
            <label>Clips of these channels will not be added to the queue.</label>
          </div>
        </div>
        <div class="flex flex-col gap-2 text-left">
          <label for="blockedSubmitter" class="cq-text">Submitters not allowed:</label>
          <InputChips
            inputId="blockedSubmitters"
            v-model="formSettings.blockedSubmitters"
            separator=" "
          />
          <div class="cq-text-subtle pb-2">
            <label>Clips submitted by these users will not be added to the queue.</label>
          </div>
        </div>
        <div class="mt-3">
          <BButton
            class="mr-2"
            severity="info"
            size="small"
            type="submit"
            :disabled="!moderation.isModified(formSettings)"
            >Save</BButton
          >
          <BButton
            type="reset"
            severity="danger"
            size="small"
            :disabled="!moderation.isModified(formSettings)"
            >Cancel</BButton
          >
        </div>
      </form>
    </template>
  </CCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
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
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Moderation settings saved',
    life: 3000
  })
  onReset()
}
</script>
