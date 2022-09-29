<template>
  <div>
    <div class="cq-form mb-2">
      <BaseButton
        class="w-full"
        variant="danger"
        :disabled="!settings.isModified(DEFAULT_SETTING)"
        @click="resetSettingsToDefault()"
      >
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
  </div>
</template>

<script setup lang="ts">
import { useSettings, DEFAULT_SETTING } from "@/stores/settings"
import { useQueue } from "@/stores/queue"
import { useClipFinder } from "@/stores/clip-finder"

const queue = useQueue()
const settings = useSettings()
const clipFinder = useClipFinder()

function resetSettingsToDefault() {
  settings.update(DEFAULT_SETTING)
}
</script>
