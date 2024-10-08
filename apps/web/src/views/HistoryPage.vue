<template>
  <div class="flex flex-row-reverse gap-2">
    <Button
      icon="pi pi-trash"
      label="Delete"
      :disabled="!selection.length"
      severity="danger"
      size="small"
      @click="deleteClips()"
    ></Button>
    <Button
      icon="pi pi-plus"
      label="Queue"
      :disabled="isQueueClipsDisabled"
      severity="info"
      size="small"
      @click="queueClips()"
    ></Button>
  </div>
  <DataTable
    v-model:selection="selection"
    v-model:filters="filters"
    :global-filter-fields="['category', 'channel', 'provider', 'submitters', 'title']"
    :value="queue.history.toArray()"
    size="small"
    paginator
    removable-sort
    :rows="10"
    :rows-per-page-options="[10, 20, 50]"
    class="my-4"
  >
    <template #empty>No clips previously watched.</template>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-xl">History</span>
        <span class="relative">
          <i
            class="pi pi-search absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-500"
          ></i>
          <InputText
            v-model="filters['global'].value"
            size="small"
            placeholder="Search"
            class="pl-10 font-normal"
          />
        </span>
      </div>
    </template>
    <Column selection-mode="multiple" header-style="width: 3rem"></Column>
    <Column field="title" header="Info" sortable :sort-field="(data: Clip) => data.title">
      <template #body="{ data }: { data: Clip }">
        <div class="flex items-center">
          <img
            class="hidden aspect-video w-24 rounded-lg sm:block"
            :src="data.thumbnailUrl"
            :alt="data.title"
            @error="queue.history.remove(data)"
          />
          <div class="ml-3 text-left text-sm">
            <p class="font-normal">
              {{ data.title }}
              <span v-if="data.url">
                <a
                  :href="data.url"
                  target="_blank"
                  rel="noreferrer"
                  class="text-surface-400 no-underline hover:text-surface-600 dark:text-surface-600 dark:hover:text-surface-200"
                >
                  <i class="pi pi-external-link"></i>
                </a>
              </span>
            </p>
            <div class="text-xs text-surface-400">
              <p v-if="data.category">{{ data.channel }} - {{ data.category }}</p>
              <p v-else>
                {{ data.channel }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Column>
    <Column field="provider" sortable header="Provider">
      <template #body="{ data }: { data: Clip }">
        <ProviderName :provider="data.provider" />
      </template>
    </Column>
    <Column
      :field="(data: Clip) => data.submitters?.[0]"
      sortable
      :sort-field="(data: Clip) => data.submitters?.[0]"
      header="Submitter"
    >
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Clip } from '@cq/providers'
import { Button, Column, DataTable, InputText, useConfirm } from '@cq/ui'

import ProviderName from '@/components/ProviderName.vue'
import { useQueue } from '@/stores/queue'

const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

const confirm = useConfirm()
const queue = useQueue()

const selection = ref<Clip[]>([])

const isQueueClipsDisabled = computed(() => {
  return selection.value.length === 0 || selection.value.every((c) => queue.upcoming.includes(c))
})

function queueClips() {
  const clips = selection.value
  selection.value = []
  for (const clip of clips) {
    queue.add(clip, true)
  }
}

function deleteClips() {
  const clips = selection.value
  confirm.require({
    header: 'Delete History',
    message: `Are you sure you want to delete ${clips.length} clip(s) from the history?`,
    rejectLabel: 'Cancel',
    acceptLabel: 'Confirm',
    rejectClass:
      'text-white dark:text-surface-900 bg-surface-500 dark:bg-surface-400 border border-surface-500 dark:border-surface-400 hover:bg-surface-600 dark:hover:bg-surface-300 hover:border-surface-600 dark:hover:border-surface-300 focus:ring-surface-400/50 dark:focus:ring-surface-300/50',
    acceptClass:
      'text-white dark:text-surface-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-300 hover:border-red-600 dark:hover:border-red-300 focus:ring-red-400/50 dark:focus:ring-red-300/50',
    accept: () => {
      for (const clip of clips) {
        queue.removeFromHistory(clip)
      }
    },
    reject: () => {}
  })
}
</script>
