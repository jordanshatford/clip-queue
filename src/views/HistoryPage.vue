<template>
  <div class="flex flex-row-reverse gap-2">
    <Button
      icon="pi pi-trash"
      :label="m.delete_label()"
      :disabled="!selection.length"
      severity="danger"
      size="small"
      @click="deleteClips()"
    ></Button>
    <Button
      icon="pi pi-plus"
      :label="m.queue()"
      :disabled="isQueueClipsDisabled"
      severity="secondary"
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
    class="my-2"
  >
    <template #empty>
      <div class="p-4 text-surface-500">
        {{ m.no_clips_previously_watched() }}
      </div>
    </template>
    <template #header>
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xl">{{ m.history() }}</span>
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText size="small" v-model="filters['global'].value" :placeholder="m.search()" />
        </IconField>
      </div>
    </template>
    <Column selection-mode="multiple" header-style="width: 3rem"></Column>
    <Column field="title" :header="m.info()" sortable :sort-field="(data: Clip) => data.title">
      <template #body="{ data }: { data: Clip }">
        <div class="flex items-center">
          <ClipThumbnail class="hidden w-24 sm:block" :src="data.thumbnailUrl" :alt="data.title" />
          <div class="text-left text-sm sm:ml-3">
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
    <Column field="provider" sortable :header="m.provider()">
      <template #body="{ data }: { data: Clip }">
        <ProviderName :provider="data.provider" />
      </template>
    </Column>
    <Column
      :field="(data: Clip) => data.submitters[0] ?? ''"
      sortable
      :sort-field="(data: Clip) => data.submitters[0] ?? ''"
      :header="m.submitter()"
    >
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { useConfirm } from 'primevue/useconfirm'
import { computed, ref } from 'vue'

import type { Clip } from '@/integrations'

import ClipThumbnail from '@/components/ClipThumbnail.vue'
import ProviderName from '@/components/ProviderName.vue'
import { m } from '@/paraglide/messages'
import { useLogger } from '@/stores/logger'
import { useQueue } from '@/stores/queue'

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

const confirm = useConfirm()
const queue = useQueue()
const logger = useLogger()

const selection = ref<Clip[]>([])

const isQueueClipsDisabled = computed(() => {
  return selection.value.length === 0 || selection.value.every((c) => queue.upcoming.includes(c))
})

function queueClips() {
  const clips = selection.value
  selection.value = []
  logger.debug(`[History]: queuing ${clips.length} clip(s).`)
  for (const clip of clips) {
    queue.add(clip, true)
  }
}

function deleteClips() {
  const clips = [...selection.value]
  logger.debug(`[History]: attempting to delete ${clips.length} clip(s).`)
  confirm.require({
    header: m.delete_history(),
    message: m.delete_history_confirm({ length: clips.length }),
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
      logger.debug(`[History]: deleting ${clips.length} clip(s).`)
      for (const clip of clips) {
        queue.removeFromHistory(clip)
      }
    },
    reject: () => {
      logger.debug(`[History]: deletion of ${clips.length} clip(s) was cancelled.`)
    },
  })
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
