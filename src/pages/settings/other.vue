<template>
  <Card class="mx-auto mb-2 max-w-2xl text-left">
    <template #content>
      <Button
        :label="m.reset_settings()"
        class="mb-2"
        fluid
        size="small"
        severity="danger"
        :disabled="
          !(
            commands.isSettingsModified ||
            queue.isSettingsModified ||
            sources.isSettingsModified ||
            preferences.isModified
          )
        "
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
  <Card class="mx-auto max-w-2xl">
    <template #content>
      <p class="text-sm text-surface-400">
        {{ m.application_version({ version }) }}
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import { m } from '@/paraglide/messages'
import { useCommands } from '@/stores/commands'
import { usePreferences } from '@/stores/preferences'
import { useProviders } from '@/stores/providers'
import { useQueue } from '@/stores/queue'
import { useSources } from '@/stores/sources'

definePage({
  meta: {
    requiresAuth: true,
    icon: 'pi pi-cog',
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
const sources = useSources()
const providers = useProviders()

function resetSettingsToDefault() {
  confirm.require({
    header: m.reset_settings(),
    message: m.reset_settings_confirm(),
    icon: 'pi pi-exclamation-triangle',
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
      sources.resetSettings()
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
    icon: 'pi pi-exclamation-triangle',
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

function purgeCache() {
  confirm.require({
    header: m.purge_cache(),
    message: m.purge_cache_confirm(),
    icon: 'pi pi-exclamation-triangle',
    acceptProps: {
      label: m.confirm(),
      severity: 'danger',
    },
    rejectProps: {
      label: m.cancel(),
      severity: 'secondary',
    },
    accept: () => {
      providers.purge()
      toast.add({
        severity: 'success',
        summary: m.success(),
        detail: m.clip_cache_purged(),
        life: 3000,
      })
    },
    reject: () => {},
  })
}
</script>
