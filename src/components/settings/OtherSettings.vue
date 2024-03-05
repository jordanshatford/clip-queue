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
import { useConfirm } from 'primevue/useconfirm'
import { useSettings, DEFAULTS as DEFAULT_SETTINGS } from '@/stores/settings'
import { useModeration, DEFAULTS as DEFAULT_MODERATION } from '@/stores/moderation'
import { useProviders, DEFAULTS as DEFAULT_ENABLED_PROVIDERS } from '@/stores/providers'
import { useQueue, DEFAULT_SETTINGS as DEFAULT_QUEUE_SETTINGS } from '@/stores/queue'
import { deepEqual } from '@/utils'

const version = __APP_VERSION__

const toast = useToast()
const confirm = useConfirm()
const queue = useQueue()
const settings = useSettings()
const moderation = useModeration()
const providers = useProviders()

const isSettingsModified = computed(() => {
  return (
    settings.isModified(DEFAULT_SETTINGS) ||
    moderation.isModified(DEFAULT_MODERATION) ||
    queue.isSettingsModified(DEFAULT_QUEUE_SETTINGS) ||
    !deepEqual(DEFAULT_ENABLED_PROVIDERS, providers.enabledProviders)
  )
})

async function resetSettingsToDefault() {
  confirm.require({
    header: 'Reset settings',
    message: 'Are you sure you want to reset all settings to the default values?',
    rejectLabel: 'Cancel',
    acceptLabel: 'Confirm',
    rejectClass:
      'text-white dark:text-surface-900 bg-surface-500 dark:bg-surface-400 border border-surface-500 dark:border-surface-400 hover:bg-surface-600 dark:hover:bg-surface-300 hover:border-surface-600 dark:hover:border-surface-300 focus:ring-surface-400/50 dark:focus:ring-surface-300/50',
    acceptClass:
      'text-white dark:text-surface-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-400/50 dark:focus:ring-red-300/50',
    accept: () => {
      settings.update(DEFAULT_SETTINGS)
      moderation.update(DEFAULT_MODERATION)
      queue.updateSettings(DEFAULT_QUEUE_SETTINGS)
      providers.enabledProviders = DEFAULT_ENABLED_PROVIDERS
      toast.success('Settings reset to default')
    },
    reject: () => {}
  })
}

async function purgeHistory() {
  confirm.require({
    header: 'Purge History',
    message: 'Are you sure you want to reset all settings to the default values?',
    rejectLabel: 'Cancel',
    acceptLabel: 'Confirm',
    rejectClass:
      'text-white dark:text-surface-900 bg-surface-500 dark:bg-surface-400 border border-surface-500 dark:border-surface-400 hover:bg-surface-600 dark:hover:bg-surface-300 hover:border-surface-600 dark:hover:border-surface-300 focus:ring-surface-400/50 dark:focus:ring-surface-300/50',
    acceptClass:
      'text-white dark:text-surface-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-400/50 dark:focus:ring-red-300/50',
    accept: () => {
      queue.purge()
      toast.success('Clip history cleared')
    },
    reject: () => {}
  })
}

async function purgeCache() {
  confirm.require({
    header: 'Purge Cache',
    message: 'Are you sure you want to purge all clips cached locally?',
    rejectLabel: 'Cancel',
    acceptLabel: 'Confirm',
    rejectClass:
      'text-white dark:text-surface-900 bg-surface-500 dark:bg-surface-400 border border-surface-500 dark:border-surface-400 hover:bg-surface-600 dark:hover:bg-surface-300 hover:border-surface-600 dark:hover:border-surface-300 focus:ring-surface-400/50 dark:focus:ring-surface-300/50',
    acceptClass:
      'text-white dark:text-surface-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-400/50 dark:focus:ring-red-300/50',
    accept: () => {
      providers.purge()
      toast.success('Clip cache cleared')
    },
    reject: () => {}
  })
}
</script>
