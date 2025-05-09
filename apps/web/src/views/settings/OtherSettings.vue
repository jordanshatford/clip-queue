<template>
  <Card class="mx-auto mb-2 max-w-xl text-left">
    <template #content>
      <DangerButton
        :label="m.reset_settings()"
        class="mb-2"
        fluid
        size="small"
        :disabled="!(settings.isModified || preferences.isModified)"
        @click="resetSettingsToDefault()"
      ></DangerButton>
      <Message size="small" severity="secondary" variant="simple">{{
        m.reset_settings_description()
      }}</Message>
    </template>
  </Card>
  <Card class="mx-auto mb-2 max-w-xl text-left">
    <template #content>
      <DangerButton
        :label="m.purge_history()"
        class="mb-2"
        fluid
        size="small"
        :disabled="queue.history.empty()"
        @click="purgeHistory()"
      ></DangerButton>
      <Message size="small" severity="secondary" variant="simple">{{
        m.purge_history_description()
      }}</Message>
    </template>
  </Card>
  <Card class="mx-auto mb-2 max-w-xl text-left">
    <template #content>
      <DangerButton
        :label="m.purge_cache()"
        class="mb-2"
        fluid
        size="small"
        :disabled="!providers.hasCachedData"
        @click="purgeCache()"
      ></DangerButton>
      <Message size="small" severity="secondary" variant="simple">{{
        m.purge_cache_description()
      }}</Message>
    </template>
  </Card>
  <Card class="mx-auto max-w-xl">
    <template #content>
      <p class="text-surface-400 text-sm">
        {{ m.application_version({ version }) }}
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Card, DangerButton, Message, useConfirm, useToast } from '@cq/ui'

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
    acceptProps: {
      label: m.confirm()
    },
    rejectProps: {
      label: m.cancel()
    },
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
    acceptProps: {
      label: m.confirm()
    },
    rejectProps: {
      label: m.cancel()
    },
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
    acceptProps: {
      label: m.confirm()
    },
    rejectProps: {
      label: m.cancel()
    },
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
