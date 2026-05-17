<template>
  <div class="flex flex-row-reverse gap-2 pr-2">
    <UButton
      icon="lucide:trash"
      :disabled="!selection.length"
      color="error"
      @click="deleteClips()"
      >{{ m.delete_label() }}</UButton
    >
    <UButton
      icon="lucide:plus"
      :disabled="isQueueClipsDisabled"
      color="neutral"
      variant="soft"
      @click="queueClips()"
      >{{ m.queue() }}</UButton
    >
  </div>
  <DataTable
    v-model:selection="selection"
    v-model:filters="filters"
    :global-filter-fields="['category', 'channel', 'provider', 'submitters', 'title']"
    :value="queue.history.items"
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
        <UInput
          icon="lucide:search"
          size="md"
          variant="outline"
          v-model="filters['global'].value"
          :placeholder="m.search()"
        />
      </div>
    </template>
    <Column selection-mode="multiple" header-style="width: 3rem"></Column>
    <Column field="title" :header="m.info()" sortable :sort-field="(data: Clip) => data.title">
      <template #body="{ data }: { data: Clip }">
        <div class="flex items-center">
          <ClipThumbnail class="hidden w-24 sm:block" :src="data.thumbnailUrl" :alt="data.title" />
          <div class="text-left text-sm sm:ml-3">
            <p class="flex items-center justify-center gap-1 font-normal">
              {{ data.title }}
              <span v-if="data.url">
                <a
                  :href="data.url"
                  target="_blank"
                  rel="noreferrer"
                  class="text-surface-400 no-underline hover:text-surface-600 dark:text-surface-600 dark:hover:text-surface-200"
                >
                  <UIcon name="lucide:external-link" />
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
    <Column field="integration" sortable :header="m.integration()">
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
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { useConfirm } from 'primevue/useconfirm'
import { computed, ref } from 'vue'

import type { Clip } from '@/integrations'

import ClipThumbnail from '@/components/ClipThumbnail.vue'
import ProviderName from '@/components/ProviderName.vue'
import { m } from '@/paraglide/messages'
import { useLogger } from '@/stores/logger'
import { useQueue } from '@/stores/queue'

definePage({
  meta: {
    requiresAuth: true,
    icon: 'lucide:history',
    title: m.history,
    order: 2,
  },
})

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
        queue.history.remove(clip)
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
