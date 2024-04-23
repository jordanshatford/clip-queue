<template>
  <Card class="mx-auto mb-2 max-w-lg text-left">
    <template #content>
      <Button
        label="Reset Settings"
        class="w-full"
        size="small"
        severity="danger"
        :disabled="!(settings.isModified || theme.isModified)"
        @click="resetSettingsToDefault()"
      ></Button>
      <label class="text-sm text-surface-400">Reset settings back to their initial values.</label>
    </template>
  </Card>
  <Card class="mx-auto mb-2 max-w-lg text-left">
    <template #content>
      <Button
        label="Purge History"
        class="w-full"
        size="small"
        severity="danger"
        :disabled="queue.history.empty()"
        @click="purgeHistory()"
      ></Button>
      <label class="text-sm text-surface-400"
        >Purge all clips previously viewed allowing them to be resubmitted.</label
      >
    </template>
  </Card>
  <Card class="mx-auto mb-2 max-w-lg text-left">
    <template #content>
      <Button
        label="Purge Cache"
        class="w-full"
        size="small"
        severity="danger"
        :disabled="!providers.hasCachedData"
        @click="purgeCache()"
      ></Button>
      <label class="text-sm text-surface-400">
        Clips submitted may be cached for future use. Purge all cached clips.
      </label>
    </template>
  </Card>
  <Card class="mx-auto max-w-lg">
    <template #content>
      <p class="text-sm text-surface-400">
        Application version: <span>v{{ version }}</span>
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card, useConfirm, useToast } from '@cq/ui'

import { useProviders } from '@/stores/providers'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'
import { useTheme } from '@/stores/theme'

const version = __APP_VERSION__

const toast = useToast()
const confirm = useConfirm()
const theme = useTheme()
const queue = useQueue()
const settings = useSettings()
const providers = useProviders()

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
      settings.$reset()
      theme.$reset()
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Settings reset to default',
        life: 3000
      })
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
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Clip history cleared',
        life: 3000
      })
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
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Clip cache cleared',
        life: 3000
      })
    },
    reject: () => {}
  })
}
</script>
