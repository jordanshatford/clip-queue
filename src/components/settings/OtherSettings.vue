<template>
  <div class="cq-form mb-2">
    <BaseButton
      class="w-full"
      variant="danger"
      :disabled="!isSettingsModified"
      @click="resetSettingsToDefault()"
    >
      Reset Settings
    </BaseButton>
    <label class="cq-text-subtle">Reset settings back to their initial values.</label>
  </div>
  <div class="cq-form mt-2">
    <BaseButton
      class="w-full"
      variant="danger"
      :disabled="queue.history.empty()"
      @click="purgeHistory()"
    >
      Purge History
    </BaseButton>
    <label class="cq-text-subtle"
      >Purge all clips previously viewed allowing them to be resubmitted.</label
    >
  </div>
  <div class="cq-form mt-2">
    <BaseButton
      class="w-full"
      variant="danger"
      :disabled="clipFinder.cacheEmpty"
      @click="purgeCache()"
    >
      Purge Cache
    </BaseButton>
    <label class="cq-text-subtle">
      Twitch clips submitted are cached for future use, this clears all cached clip information.
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useSettings, DEFAULTS as DEFAULT_SETTINGS } from '@/stores/settings'
import { useModeration, DEFAULTS as DEFAULT_MODERATION } from '@/stores/moderation'
import { useQueue, DEFAULT_SETTINGS as DEFAULT_QUEUE_SETTINGS } from '@/stores/queue'
import { useClipFinder } from '@/stores/clip-finder'
import type { ConfirmDialog } from '@/plugins/confirm'

const queue = useQueue()
const settings = useSettings()
const moderation = useModeration()
const clipFinder = useClipFinder()

const confirm = inject<ConfirmDialog>('confirm')!

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
  }
}

async function purgeHistory() {
  const isConfirmed = await confirm({
    title: 'Purge History',
    description: 'Are you sure you want to purge all clips from the history?'
  })
  if (isConfirmed) {
    queue.purge()
  }
}

async function purgeCache() {
  const isConfirmed = await confirm({
    title: 'Purge Cache',
    description: 'Are you sure you want to purge all clips cached locally?'
  })
  if (isConfirmed) {
    clipFinder.$reset()
  }
}
</script>
