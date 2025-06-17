<template>
  <DataTable
    ref="logs-table"
    :value="logs"
    size="small"
    paginator
    export-filename="logs.clip-queue"
    :rows="10"
    :rows-per-page-options="[10, 20, 50]"
  >
    <template #empty>
      <div class="text-surface-500 p-4">{{ m.no_logs_captured() }}</div>
    </template>
    <template #header>
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xl">{{ m.logs() }}</span>
        <div class="text-end">
          <div class="flex flex-row-reverse gap-2">
            <DangerButton
              :label="m.clear()"
              :disabled="logs.length === 0"
              severity="danger"
              size="small"
              @click="deleteAllLogs()"
            ></DangerButton>
            <SecondaryButton
              icon="pi pi-download"
              :label="m.download()"
              :disabled="logs.length === 0"
              size="small"
              @click="exportCSV()"
            />
          </div>
        </div>
      </div>
    </template>
    <Column field="timestamp" :header="m.timestamp()" export-header="Timestamp">
      <template #body="{ data }: { data: Log }">
        <p>{{ formatTimestamp(data.timestamp) }}</p>
      </template>
    </Column>
    <Column field="level" :header="m.level()" export-header="Level">
      <template #body="{ data }: { data: Log }">
        <Tag :severity="logLevelSeverities[data.level]" :icon="logLevelIcons[data.level]">
          {{ logLevelTranslations[data.level]() }}
        </Tag>
      </template>
    </Column>
    <Column field="message" :header="m.message()" export-header="Message"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { Column, DangerButton, DataTable, SecondaryButton, Tag, useConfirm } from '@cq/ui'

import type { Log } from '@/stores/logger'
import * as m from '@/paraglide/messages'
import { datetime } from '@/paraglide/registry'
import { logLevelIcons, logLevelSeverities, logLevelTranslations, useLogger } from '@/stores/logger'
import { usePreferences } from '@/stores/preferences'

const confirm = useConfirm()
const preferences = usePreferences()
const logger = useLogger()
const table = useTemplateRef<InstanceType<typeof DataTable>>('logs-table')

const logs = computed(() => {
  return [...logger.logs].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
})

function formatTimestamp(timestamp: string) {
  return datetime(preferences.preferences.language, timestamp, {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false
  })
}

function exportCSV() {
  logger.debug('[Logs]: exporting logs as CSV.')
  table.value?.exportCSV()
}

function deleteAllLogs() {
  logger.debug('[Logs]: attempting to delete all logs.')
  confirm.require({
    header: m.clear_logs(),
    message: m.clear_logs_confirm({ length: logs.value.length }),
    rejectProps: {
      label: m.cancel()
    },
    acceptProps: {
      label: m.confirm()
    },
    accept: () => {
      logger.debug('[Logs]: deleting all logs.')
      logger.$reset()
    },
    reject: () => {
      logger.debug('[Logs]: deletion of logs was cancelled.')
    }
  })
}
</script>
