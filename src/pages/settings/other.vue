<template>
  <UICard class="mx-auto mb-2 max-w-2xl text-left" variant="subtle">
    <Button
      :label="m.reset_settings()"
      class="mb-2"
      fluid
      size="small"
      severity="danger"
      :disabled="!isSettingsModified"
      @click="resetSettingsToDefault()"
    ></Button>
    <Message size="small" severity="secondary" variant="simple">{{
      m.reset_settings_description()
    }}</Message>
    <Divider />
    <Button
      :label="m.purge_history()"
      class="mb-2"
      fluid
      size="small"
      severity="danger"
      :disabled="queue.history.length === 0"
      @click="purgeHistory()"
    ></Button>
    <Message size="small" severity="secondary" variant="simple">{{
      m.purge_history_description()
    }}</Message>
    <Divider />
    <Button
      :label="m.reset_cache()"
      class="mb-2"
      fluid
      size="small"
      severity="danger"
      :disabled="!integrations.hasCachedData"
      @click="resetCache()"
    ></Button>
    <Message size="small" severity="secondary" variant="simple">{{
      m.reset_cache_description()
    }}</Message>
  </UICard>
  <UICard class="mx-auto max-w-2xl" variant="subtle">
    <p class="text-sm text-surface-400">
      {{ m.application_version({ version }) }}
    </p>
  </UICard>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { computed } from 'vue'

import { m } from '@/paraglide/messages'
import { useCommands } from '@/stores/commands'
import { useIntegrations } from '@/stores/integrations'
import { useLogger } from '@/stores/logger'
import { usePreferences } from '@/stores/preferences'
import { useQueue } from '@/stores/queue'

definePage({
  meta: {
    requiresAuth: true,
    icon: 'lucide:settings',
    title: m.settings_other,
    order: 5,
  },
})

const version = __APP_VERSION__

const toast = useToast()
const confirm = useConfirm()

const commands = useCommands()
const preferences = usePreferences()
const queue = useQueue()
const integrations = useIntegrations()
const logger = useLogger()

const isSettingsModified = computed<boolean>(() => {
  return (
    commands.isSettingsModified ||
    queue.isSettingsModified ||
    integrations.isSettingsModified ||
    logger.isSettingsModified ||
    preferences.isModified
  )
})

function resetSettingsToDefault() {
  confirm.require({
    header: m.reset_settings(),
    message: m.reset_settings_confirm(),
    acceptProps: {
      label: m.confirm(),
      severity: 'danger',
    },
    rejectProps: {
      label: m.cancel(),
      severity: 'secondary',
    },
    accept: () => {
      commands.resetSettings()
      queue.resetSettings()
      integrations.resetSettings()
      logger.resetSettings()
      preferences.reset()
      toast.add({
        severity: 'success',
        summary: m.success(),
        detail: m.settings_reset(),
        life: 3000,
      })
    },
    reject: () => {},
  })
}

function purgeHistory() {
  confirm.require({
    header: m.purge_history(),
    message: m.purge_history_confirm(),
    acceptProps: {
      label: m.confirm(),
      severity: 'danger',
    },
    rejectProps: {
      label: m.cancel(),
      severity: 'secondary',
    },
    accept: () => {
      queue.purge()
      toast.add({
        severity: 'success',
        summary: m.success(),
        detail: m.clip_history_purged(),
        life: 3000,
      })
    },
    reject: () => {},
  })
}

function resetCache() {
  confirm.require({
    header: m.reset_cache(),
    message: m.reset_cache_confirm(),
    acceptProps: {
      label: m.confirm(),
      severity: 'danger',
    },
    rejectProps: {
      label: m.cancel(),
      severity: 'secondary',
    },
    accept: () => {
      integrations.clearCache()
      toast.add({
        severity: 'success',
        summary: m.success(),
        detail: m.integrations_cache_reset(),
        life: 3000,
      })
    },
    reject: () => {},
  })
}
</script>
