<template>
  <div class="mx-auto flex max-w-2xl min-w-2xl flex-col gap-2">
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

const version = useRuntimeConfig().public.version

const toast = useToast()
const confirm = useConfirmDialog()

const commands = useCommands()
const queue = useQueue()
const integrations = useIntegrations()
const logger = useLogger()

const isSettingsModified = computed<boolean>(() => {
  return (
    commands.settings.isModified ||
    queue.settings.isModified ||
    integrations.settings.isModified ||
    logger.settings.isModified
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
    commands.settings.reset()
    queue.settings.reset()
    integrations.settings.reset()
    logger.settings.reset()
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
</script>
