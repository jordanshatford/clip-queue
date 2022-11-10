<template>
  <div class="cq-form mb-2">
    <BaseButton class="w-full" variant="danger" :disabled="!isSettingsModified" @click="resetSettingsToDefault()">
      Reset Settings
    </BaseButton>
    <label class="cq-text-subtle"> Reset settings back to their initial values. </label>
  </div>
  <div class="cq-form mt-2">
    <BaseButton class="w-full" variant="danger" :disabled="queue.history.empty()" @click="queue.purge()">
      Purge History
    </BaseButton>
    <label class="cq-text-subtle">Purge all clips previously viewed allowing them to be resubmitted.</label>
  </div>
  <div class="cq-form mt-2">
    <BaseButton class="w-full" variant="danger" :disabled="clipFinder.cacheEmpty" @click="clipFinder.$reset()">
      Purge Cache
    </BaseButton>
    <label class="cq-text-subtle">
      Twitch clips submitted are cached for future use, this clears all cached clip information.
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useSettings, DEFAULTS as DEFAULT_SETTINGS } from "@/stores/settings"
import { useModeration, DEFAULTS as DEFAULT_MODERATION } from "@/stores/moderation"
import { useQueue, DEFAULT_SETTINGS as DEFAULT_QUEUE_SETTINGS } from "@/stores/queue"
import { useClipFinder } from "@/stores/clip-finder"

const queue = useQueue()
const settings = useSettings()
const moderation = useModeration()
const clipFinder = useClipFinder()

const isSettingsModified = computed(() => {
  return (
    settings.isModified(DEFAULT_SETTINGS) ||
    moderation.isModified(DEFAULT_MODERATION) ||
    queue.isSettingsModified(DEFAULT_QUEUE_SETTINGS)
  )
})

function resetSettingsToDefault() {
  settings.update(DEFAULT_SETTINGS)
  moderation.update(DEFAULT_MODERATION)
  queue.updateSettings(DEFAULT_QUEUE_SETTINGS)
}
</script>
