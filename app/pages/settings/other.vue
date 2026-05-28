<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-2">
    <UCard class="text-left" variant="subtle">
      <div class="flex flex-col gap-4">
        <UFormField :help="m.reset_settings_description()">
          <UButton
            class="w-full justify-center"
            color="error"
            variant="subtle"
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
            variant="subtle"
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
            variant="subtle"
            :disabled="!integrations.hasCachedData"
            @click="resetCache()"
            >{{ m.reset_cache() }}</UButton
          >
        </UFormField>
      </div>
    </UCard>
    <UCard variant="subtle">
      <p class="text-center text-sm">
        {{ m.application_version({ version }) }}
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'
import { useConfirmDialog } from '~/composables/useConfirmDialog'

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
  logger.debug('[Settings]: Attempting to reset settings to default.')
  const confirmed = await confirm({
    title: m.reset_settings(),
    description: m.reset_settings_confirm(),
  })
  if (confirmed) {
    logger.debug('[Settings]: Resetting settings to default confirmed.')
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
  } else {
    logger.debug('[Settings]: Resetting settings to default cancelled.')
  }
}

async function purgeHistory(): Promise<void> {
  logger.debug('[Settings]: Attempting to purge all history.')
  const confirmed = await confirm({
    title: m.purge_history(),
    description: m.purge_history_confirm(),
  })
  if (confirmed) {
    logger.debug('[Settings]: Purging all history confirmed.')
    queue.purge()
    toast.add({
      icon: 'lucide:circle-check',
      color: 'success',
      title: m.success(),
      description: m.clip_history_purged(),
    })
  } else {
    logger.debug('[Settings]: Purging all history cancelled.')
  }
}

async function resetCache(): Promise<void> {
  logger.debug('[Settings]: Attempting to reset all integrations cache.')
  const confirmed = await confirm({
    title: m.reset_cache(),
    description: m.reset_cache_confirm(),
  })
  if (confirmed) {
    logger.debug('[Settings]: Resetting all integrations cache confirmed.')
    integrations.clearCache()
    toast.add({
      icon: 'lucide:circle-check',
      color: 'success',
      title: m.success(),
      description: m.integrations_cache_reset(),
    })
  } else {
    logger.debug('[Settings]: Resetting all integrations cache cancelled.')
  }
}
</script>
