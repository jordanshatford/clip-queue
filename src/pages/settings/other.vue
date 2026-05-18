<template>
  <UCard class="mx-auto mb-2 max-w-2xl text-left" variant="subtle">
    <div class="flex flex-col gap-2">
      <UFormField :help="m.reset_settings_description()">
        <UButton
          class="w-full justify-center"
          color="error"
          :disabled="!isSettingsModified"
          @click="resetSettingsToDefault()"
          >{{ m.reset_settings() }}</UButton
        >
      </UFormField>
      <USeparator />
      <UFormField :help="m.purge_history_description()">
        <UButton
          class="w-full justify-center"
          color="error"
          :disabled="queue.history.length === 0"
          @click="purgeHistory()"
          >{{ m.purge_history() }}</UButton
        >
      </UFormField>
      <USeparator />
      <UFormField :help="m.reset_cache_description()">
        <UButton
          class="w-full justify-center"
          color="error"
          :disabled="!integrations.hasCachedData"
          @click="resetCache()"
          >{{ m.reset_cache() }}</UButton
        >
      </UFormField>
    </div>
  </UCard>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <p class="text-sm text-surface-400">
      {{ m.application_version({ version }) }}
    </p>
  </UCard>
</template>

<script setup lang="ts">
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useConfirm } from 'primevue/useconfirm'
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
        icon: 'lucide:circle-check',
        color: 'success',
        title: m.success(),
        description: m.settings_reset(),
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
        icon: 'lucide:circle-check',
        color: 'success',
        title: m.success(),
        description: m.clip_history_purged(),
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
        icon: 'lucide:circle-check',
        color: 'success',
        title: m.success(),
        description: m.integrations_cache_reset(),
      })
    },
    reject: () => {},
  })
}
</script>
