<template>
  <div class="w-full space-y-4 pb-4">
    <div class="flex justify-between border-b border-accented px-4 py-3.5">
      <span class="text-lg font-medium">{{ m.logs() }}</span>
      <UButton color="error" @click="deleteAllLogs()">{{ m.clear() }}</UButton>
    </div>
    <UTable
      ref="table"
      v-model:pagination="pagination"
      sticky="header"
      :data="logs"
      :columns="columns"
      :empty="m.no_logs_captured()"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      class="text-left"
    />
    <div class="flex justify-end border-t border-default px-4 pt-4">
      <UPagination
        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import { getPaginationRowModel, type PaginationState } from '@tanstack/vue-table'
import { computed, h, ref, resolveComponent, useTemplateRef } from 'vue'

import type { Log } from '@/stores/logger'

import { m } from '#paraglide/messages'
import { datetime } from '#paraglide/registry'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { logLevelIcons, logLevelSeverities, logLevelTranslations, useLogger } from '@/stores/logger'
import { usePreferences } from '@/stores/preferences'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:book-text',
  hidden: true,
})

const confirm = useConfirmDialog()
const preferences = usePreferences()
const logger = useLogger()

const table = useTemplateRef('table')

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 6,
})

const logs = computed(() => {
  return [...logger.logs].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
})

const UBadge = resolveComponent('UBadge')

const columns: TableColumn<Log>[] = [
  {
    accessorKey: 'timestamp',
    header: m.timestamp(),
    cell: ({ row }) => formatTimestamp(row.original.timestamp),
  },
  {
    accessorKey: 'level',
    header: m.level(),
    cell: ({ row }) => {
      const level = row.original.level
      return h(
        UBadge,
        { icon: logLevelIcons[level], variant: 'soft', color: logLevelSeverities[level] },
        () => logLevelTranslations[level](),
      )
    },
  },
  { accessorKey: 'message', header: m.message() },
]

function formatTimestamp(timestamp: string) {
  return datetime(preferences.locale, timestamp, {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false,
  })
}

async function deleteAllLogs(): Promise<void> {
  logger.debug('[Logs]: attempting to delete all logs.')
  const confirmed = await confirm({
    title: m.clear_logs(),
    description: m.clear_logs_confirm({ length: logs.value.length }),
  })
  if (confirmed) {
    logger.debug('[Logs]: deleting all logs.')
    logger.reset()
  } else {
    logger.debug('[Logs]: deletion of logs was cancelled.')
  }
}
</script>

<style scoped>
:deep(.p-datatable-header),
:deep(.p-datatable-header-cell),
:deep(.p-datatable-tbody > tr),
:deep(.p-paginator) {
  background: transparent !important;
}
</style>
