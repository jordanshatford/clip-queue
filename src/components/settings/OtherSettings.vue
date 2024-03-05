<template>
  <div class="cq-form mb-2 text-left">
    <BButton
      class="w-full"
      size="small"
      severity="danger"
      :disabled="!isSettingsModified"
      @click="resetSettingsToDefault()"
    >
      Reset Settings
    </BButton>
    <label class="cq-text-subtle">Reset settings back to their initial values.</label>
  </div>
  <div class="cq-form mt-2 text-left">
    <BButton
      class="w-full"
      size="small"
      severity="danger"
      :disabled="queue.history.empty()"
      @click="purgeHistory()"
    >
      Purge History
    </BButton>
    <label class="cq-text-subtle"
      >Purge all clips previously viewed allowing them to be resubmitted.</label
    >
  </div>
  <div class="cq-form mt-2 text-left">
    <BButton
      class="w-full"
      size="small"
      severity="danger"
      :disabled="!providers.hasCachedData"
      @click="purgeCache()"
    >
      Purge Cache
    </BButton>
    <label class="cq-text-subtle">
      Twitch clips submitted are cached for future use, this clears all cached clip information.
    </label>
  </div>
  <div class="cq-form mt-2">
    <p class="cq-text-subtle">
      Application version: <span>v{{ version }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useSettings, DEFAULTS as DEFAULT_SETTINGS } from '@/stores/settings'
import { useModeration, DEFAULTS as DEFAULT_MODERATION } from '@/stores/moderation'
import { useQueue, DEFAULT_SETTINGS as DEFAULT_QUEUE_SETTINGS } from '@/stores/queue'
import { useProviders } from '@/stores/providers'
import { useConfirm } from '@/plugins/confirm'

const version = __APP_VERSION__

const toast = useToast()
const queue = useQueue()
const settings = useSettings()
const moderation = useModeration()
const providers = useProviders()
const confirm = useConfirm()

const isSettingsModified = computed(() => {
  return (
    settings.isModified(DEFAULT_SETTINGS) ||
    moderation.isModified(DEFAULT_MODERATION) ||
    queue.isSettingsModified(DEFAULT_QUEUE_SETTINGS)
  )
})

async function resetSettingsToDefault() {
  const isConfirmed = await confirm({
    title: 'Reset Settings',
    description: 'Are you sure you want to reset all settings to the default values?'
  })
  if (isConfirmed) {
    settings.update(DEFAULT_SETTINGS)
    moderation.update(DEFAULT_MODERATION)
    queue.updateSettings(DEFAULT_QUEUE_SETTINGS)
    toast.success('Settings reset to default')
  }
}

async function purgeHistory() {
  const isConfirmed = await confirm({
    title: 'Purge History',
    description: 'Are you sure you want to purge all clips from the history?'
  })
  if (isConfirmed) {
    queue.purge()
    toast.success('Clip history cleared')
  }
}

async function purgeCache() {
  const isConfirmed = await confirm({
    title: 'Purge Cache',
    description: 'Are you sure you want to purge all clips cached locally?'
  })
  if (isConfirmed) {
    providers.purge()
    toast.success('Clip cache cleared')
  }
}
</script>
