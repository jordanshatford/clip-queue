<template>
  <DataTable
    :value="queue.history.toArray()"
    size="small"
    paginator
    removableSort
    :rows="10"
    :rowsPerPageOptions="[10, 20, 50]"
    class="my-4"
  >
    <template #empty>No clips previously watched.</template>
    <DataTableColumn field="title" header="Info" sortable :sortField="(data: Clip) => data.title">
      <template #body="{ data }: { data: Clip }">
        <div class="flex items-center">
          <img
            @error="queue.history.remove(data)"
            class="hidden aspect-video w-24 rounded-xl sm:block"
            :src="data.thumbnailUrl"
            :alt="data.title"
          />
          <div class="ml-3 text-left text-sm">
            <p class="cq-text">
              {{ data.title }}
              <span v-if="data.url">
                <a
                  :href="data.url"
                  target="_blank"
                  rel="noreferrer"
                  className="cq-text-subtle text-lg no-underline hover:text-surface-600 dark:hover:text-surface-200"
                >
                  <i class="pi pi-external-link text-sm"></i>
                </a>
              </span>
            </p>
            <p class="cq-text-subtle-semibold">
              {{ data.channel }}<span class="cq-text-subtle"> playing </span>{{ data.category }}
            </p>
          </div>
        </div>
      </template>
    </DataTableColumn>
    <DataTableColumn field="provider" sortable header="Provider">
      <template #body="{ data }: { data: Clip }">
        <ProviderName :provider="data.provider" />
      </template>
    </DataTableColumn>
    <DataTableColumn
      :field="(data: Clip) => data.submitters?.[0]"
      sortable
      :sortField="(data: Clip) => data.submitters?.[0]"
      header="Submitter"
    >
    </DataTableColumn>
    <DataTableColumn field="actions">
      <template #header>
        <BButton
          :disabled="queue.history.empty()"
          @click="purgeHistory()"
          severity="danger"
          size="small"
          ><i class="pi pi-trash mr-2"></i>Delete All</BButton
        >
      </template>
      <template #body="{ data }: { data: Clip }">
        <div class="inline-flex space-x-2">
          <BButton
            severity="info"
            size="small"
            :disabled="queue.upcoming.includes(data)"
            @click="queue.add(data, true)"
          >
            <i class="pi pi-plus p-1"></i>
          </BButton>
          <BButton severity="danger" size="small" @click="queue.removeFromHistory(data)">
            <i class="pi pi-trash p-1"></i>
          </BButton>
        </div>
      </template>
    </DataTableColumn>
  </DataTable>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useQueue } from '@/stores/queue'
import type { Clip } from '@/providers'
import ProviderName from '@/components/ProviderName.vue'

const confirm = useConfirm()
const queue = useQueue()

async function purgeHistory() {
  confirm.require({
    header: 'Delete All History',
    message: 'Are you sure you want to delete all clips from the history?',
    rejectLabel: 'Cancel',
    acceptLabel: 'Confirm',
    rejectClass:
      'text-white dark:text-surface-900 bg-surface-500 dark:bg-surface-400 border border-surface-500 dark:border-surface-400 hover:bg-surface-600 dark:hover:bg-surface-300 hover:border-surface-600 dark:hover:border-surface-300 focus:ring-surface-400/50 dark:focus:ring-surface-300/50',
    acceptClass:
      'text-white dark:text-surface-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-400/50 dark:focus:ring-red-300/50',
    accept: () => {
      queue.purge()
    },
    reject: () => {}
  })
}
</script>
