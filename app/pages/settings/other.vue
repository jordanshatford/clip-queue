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
    <p class="text-sm">
      {{ m.application_version({ version }) }}
    </p>
  </UCard>
</template>

<script setup lang="ts">
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { computed } from 'vue'

import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { m } from '@/paraglide/messages'
import { useCommands } from '@/stores/commands'
import { useIntegrations } from '@/stores/integrations'
import { useLogger } from '@/stores/logger'
import { usePreferences } from '@/stores/preferences'
import { useQueue } from '@/stores/queue'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:settings',
  order: 5,
})

const runtime = useRuntimeConfig()
const version = runtime.public.version

const toast = useToast()
const confirm = useConfirmDialog()

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

async function resetSettingsToDefault(): Promise<void> {
  const confirmed = await confirm({
    title: m.reset_settings(),
    description: m.reset_settings_confirm(),
  })
  if (confirmed) {
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
  }
}

async function purgeHistory(): Promise<void> {
  const confirmed = await confirm({
    title: m.purge_history(),
    description: m.purge_history_confirm(),
  })
  if (confirmed) {
    queue.purge()
    toast.add({
      icon: 'lucide:circle-check',
      color: 'success',
      title: m.success(),
      description: m.clip_history_purged(),
    })
  }
}

async function resetCache(): Promise<void> {
  const confirmed = await confirm({
    title: m.reset_cache(),
    description: m.reset_cache_confirm(),
  })
  if (confirmed) {
    integrations.clearCache()
    toast.add({
      icon: 'lucide:circle-check',
      color: 'success',
      title: m.success(),
      description: m.integrations_cache_reset(),
    })
  }
}
</script>
