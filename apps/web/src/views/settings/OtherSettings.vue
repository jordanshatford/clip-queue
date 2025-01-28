<template>
  <Card class="mx-auto mb-2 max-w-lg text-left">
    <template #content>
      <Button
        :label="m.reset_settings()"
        class="mb-2"
        fluid
        size="small"
        severity="danger"
        :disabled="!(settings.isModified || preferences.isModified)"
        @click="resetSettingsToDefault()"
      ></Button>
      <Message size="small" severity="secondary" variant="simple">{{
        m.reset_settings_description()
      }}</Message>
    </template>
  </Card>
  <Card class="mx-auto mb-2 max-w-lg text-left">
    <template #content>
      <Button
        :label="m.purge_history()"
        class="mb-2"
        fluid
        size="small"
        severity="danger"
        :disabled="queue.history.empty()"
        @click="purgeHistory()"
      ></Button>
      <Message size="small" severity="secondary" variant="simple">{{
        m.purge_history_description()
      }}</Message>
    </template>
  </Card>
  <Card class="mx-auto mb-2 max-w-lg text-left">
    <template #content>
      <Button
        :label="m.purge_cache()"
        class="mb-2"
        fluid
        size="small"
        severity="danger"
        :disabled="!providers.hasCachedData"
        @click="purgeCache()"
      ></Button>
      <Message size="small" severity="secondary" variant="simple">{{
        m.purge_cache_description()
      }}</Message>
    </template>
  </Card>
  <Card class="mx-auto max-w-lg">
    <template #content>
      <p class="text-surface-400 text-sm">
        {{ m.application_version({ version }) }}
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card, Message, useConfirm, useToast } from '@cq/ui'

import * as m from '@/paraglide/messages'
import { usePreferences } from '@/stores/preferences'
import { useProviders } from '@/stores/providers'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'

const version = __APP_VERSION__

const toast = useToast()
const confirm = useConfirm()
const preferences = usePreferences()
const queue = useQueue()
const settings = useSettings()
const providers = useProviders()

async function resetSettingsToDefault() {
  confirm.require({
    header: m.reset_settings(),
    message: m.reset_settings_confirm(),
    rejectLabel: m.cancel(),
    acceptLabel: m.confirm(),
    rejectClass:
      'text-white dark:text-surface-900 bg-surface-500 dark:bg-surface-400 border border-surface-500 dark:border-surface-400 hover:bg-surface-600 dark:hover:bg-surface-300 hover:border-surface-600 dark:hover:border-surface-300 focus:ring-surface-400/50 dark:focus:ring-surface-300/50',
    acceptClass:
      'text-white dark:text-surface-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-400/50 dark:focus:ring-red-300/50',
    accept: () => {
      settings.$reset()
      preferences.$reset()
      toast.add({
        severity: 'success',
        summary: m.success(),
        detail: m.settings_reset(),
        life: 3000
      })
    },
    reject: () => {}
  })
}

async function purgeHistory() {
  confirm.require({
    header: m.purge_history(),
    message: m.purge_history_confirm(),
    rejectLabel: m.cancel(),
    acceptLabel: m.confirm(),
    rejectClass:
      'text-white dark:text-surface-900 bg-surface-500 dark:bg-surface-400 border border-surface-500 dark:border-surface-400 hover:bg-surface-600 dark:hover:bg-surface-300 hover:border-surface-600 dark:hover:border-surface-300 focus:ring-surface-400/50 dark:focus:ring-surface-300/50',
    acceptClass:
      'text-white dark:text-surface-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-400/50 dark:focus:ring-red-300/50',
    accept: () => {
      queue.purge()
      toast.add({
        severity: 'success',
        summary: m.success(),
        detail: m.clip_history_purged(),
        life: 3000
      })
    },
    reject: () => {}
  })
}

async function purgeCache() {
  confirm.require({
    header: m.purge_cache(),
    message: m.purge_cache_confirm(),
    rejectLabel: m.cancel(),
    acceptLabel: m.confirm(),
    rejectClass:
      'text-white dark:text-surface-900 bg-surface-500 dark:bg-surface-400 border border-surface-500 dark:border-surface-400 hover:bg-surface-600 dark:hover:bg-surface-300 hover:border-surface-600 dark:hover:border-surface-300 focus:ring-surface-400/50 dark:focus:ring-surface-300/50',
    acceptClass:
      'text-white dark:text-surface-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-400/50 dark:focus:ring-red-300/50',
    accept: () => {
      providers.purge()
      toast.add({
        severity: 'success',
        summary: m.success(),
        detail: m.clip_cache_purged(),
        life: 3000
      })
    },
    reject: () => {}
  })
}
</script>
