<template>
  <p class="cq-title">History</p>
  <DataTable
    :value="queue.history.toArray()"
    size="small"
    paginator
    removableSort
    :rows="10"
    :rowsPerPageOptions="[10, 20, 50]"
  >
    <DataTableColumn field="title" header="Info" sortable :sortField="(data: Clip) => data.title">
      <template #body="{ data }: { data: Clip }">
        <div class="flex items-center">
          <img
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
                  className="cq-text-subtle text-lg no-underline hover:text-zinc-600 dark:hover:text-zinc-200"
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
    <DataTableColumn field="provider" sortable header="Provider"></DataTableColumn>
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
import { useQueue } from '@/stores/queue'
import { useConfirm } from '@/plugins/confirm'
import type { Clip } from '@/providers'

const queue = useQueue()
const confirm = useConfirm()

async function purgeHistory() {
  const isConfirmed = await confirm({
    title: 'Delete All History',
    description: 'Are you sure you want to delete all clips from the history?'
  })
  if (isConfirmed) {
    queue.purge()
  }
}
</script>
