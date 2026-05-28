<template>
  <div class="mx-auto flex max-w-7xl flex-col">
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput v-model="filter" class="max-w-sm" icon="lucide:search" :placeholder="m.search()" />
      <div class="flex flex-wrap items-center gap-1.5">
        <UButton
          v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
          color="neutral"
          variant="subtle"
          icon="lucide:plus"
          @click="queueClips()"
        >
          {{ m.queue() }}
          <template #trailing>
            <UKbd>
              {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
            </UKbd>
          </template>
        </UButton>
        <UButton
          v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
          color="error"
          variant="subtle"
          icon="lucide:trash"
          @click="deleteClips()"
        >
          {{ m.delete_label() }}
          <template #trailing>
            <UKbd>
              {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
            </UKbd>
          </template>
        </UButton>
      </div>
    </div>
    <UTable
      ref="table"
      v-model:global-filter="filter"
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      :data="queue.history.items"
      :columns="columns"
      :empty="m.no_clips_previously_watched()"
      sticky="header"
      class="text-left"
    />
    <div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-4">
      <div class="text-sm text-muted">
        {{
          m.pagination_selected({
            selected: table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0,
            total: table?.tableApi?.getFilteredRowModel().rows.length || 0,
          })
        }}
      </div>
      <div class="flex items-center gap-1.5">
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import {
  getPaginationRowModel,
  type RowSelectionState,
  type PaginationState,
} from '@tanstack/vue-table'

import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'
import ClipDetails from '~/components/clip/Details.vue'
import ClipProviderName from '~/components/clip/ProviderName.vue'
import { useConfirmDialog } from '~/composables/useConfirmDialog'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:history',
  order: 2,
})

const UCheckbox = resolveComponent('UCheckbox')

const table = useTemplateRef('table')

const rowSelection = ref<RowSelectionState>({})

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const filter = ref<string>('')

const columns: TableColumn<Clip>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
  },
  {
    id: 'info',
    header: m.info(),
    accessorFn: (row) => `${row.title} ${row.channel} ${row.category}`,
    cell: ({ row }) => {
      return h(ClipDetails, { data: row.original })
    },
  },
  {
    id: 'integration',
    header: m.integration(),
    accessorFn: (row) => row.provider.toString(),
    cell: ({ row }) => h(ClipProviderName, { id: row.original.provider }),
  },
  {
    id: 'submitter',
    header: m.submitter(),
    accessorFn: (row) => row.submitters?.join(' ') ?? '',
    cell: ({ row }) => useClip(row.original).submitter,
  },
]

const confirm = useConfirmDialog()
const queue = useQueue()
const logger = useLogger()

function queueClips() {
  const clips = table.value?.tableApi.getSelectedRowModel().rows?.map((r) => r.original) ?? []
  if (!clips.length) {
    return
  }
  logger.debug(`[History]: Queuing ${clips.length} clip(s).`)
  for (const clip of clips) {
    queue.add(clip, true)
  }
  rowSelection.value = {}
}

async function deleteClips(): Promise<void> {
  const clips = table.value?.tableApi.getSelectedRowModel().rows?.map((r) => r.original) ?? []
  if (!clips.length) {
    return
  }
  logger.debug(`[History]: Attempting to delete ${clips.length} clip(s).`)
  const confirmed = await confirm({
    title: m.delete_history(),
    description: m.delete_history_confirm({ length: clips.length }),
  })
  if (confirmed) {
    logger.debug(`[History]: Deleting ${clips.length} clip(s).`)
    for (const clip of clips) {
      queue.history.remove(clip)
    }
    rowSelection.value = {}
  } else {
    logger.debug(`[History]: Deletion of ${clips.length} clip(s) was cancelled.`)
  }
}
</script>
