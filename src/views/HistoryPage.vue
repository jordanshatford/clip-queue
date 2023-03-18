<template>
  <p class="cq-title">History</p>
  <div class="min-h-[80vh] flex flex-col justify-between">
    <BaseTable :columns="columns" :rows="currentPageClips">
      <template #head="{ column }">
        <BaseButton
          v-if="column.key === 'actions'"
          :disabled="queue.history.empty()"
          @click="purgeHistory()"
          variant="danger"
          class="flex text-sm float-right"
          ><TrashIcon class="w-5 mr-1" />Delete All</BaseButton
        >
      </template>
      <template #cell="{ column, row }">
        <div v-if="column.key === 'info'" class="flex items-center">
          <img
            class="hidden sm:block w-24 rounded-xl aspect-video"
            :src="row.thumbnailUrl"
            :alt="row.title"
          />
          <div class="text-left ml-3 text-sm">
            <p class="cq-text">
              {{ row.title }}
              <span v-if="row.url">
                <a
                  :href="row.url"
                  target="_blank"
                  rel="noreferrer"
                  className="cq-text-subtle text-lg no-underline hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <ArrowTopRightOnSquareIcon class="w-5 inline-block mb-1" />
                </a>
              </span>
            </p>
            <p class="cq-text-subtle-semibold">
              {{ row.channel }}<span class="cq-text-subtle"> playing </span>{{ row.game }}
            </p>
          </div>
        </div>
        <p v-else-if="column.key === 'submitter'" class="cq-text text-left text-sm">
          {{ row.submitter }} <span class="cq-text-subtle">({{ row.source }})</span>
        </p>
        <div v-else-if="column.key === 'actions'" class="inline-flex mt-2 space-x-2">
          <BaseButton
            :disabled="queue.upcoming.includes(row)"
            @click="queue.add({ ...row, source: ClipSource.HistoryPage }, true)"
          >
            <PlusIcon class="w-5 h-5" />
          </BaseButton>
          <BaseButton variant="danger" @click="queue.removeFromHistory(row)">
            <TrashIcon class="w-5 h-5" />
          </BaseButton>
        </div>
      </template>
    </BaseTable>
    <BasePagination v-model="page" :totalPages="totalPages" class="mt-2" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PlusIcon, TrashIcon, ArrowTopRightOnSquareIcon } from '@/assets/icons'
import config from '@/assets/config'
import { useQueue } from '@/stores/queue'
import { ClipSource } from '@/interfaces/clips'
import { useConfirm } from '@/plugins/confirm'

const queue = useQueue()
const confirm = useConfirm()

const { pageSize } = config.history

const columns = [
  {
    key: 'info',
    title: 'Info'
  },
  {
    key: 'submitter',
    title: 'Submitter'
  },
  {
    key: 'actions',
    title: 'Actions'
  }
]

const page = ref<number>(1)

const totalPages = computed(() => {
  return Math.ceil(queue.history.toArray().length / pageSize)
})

const currentPageClips = computed(() => {
  // pages start at 1, remove 1 to index at 0
  const start = (page.value - 1) * pageSize
  const end = start + pageSize
  // Reverse the cloned array to show history latest -> oldest
  return [...queue.history.toArray()].reverse().slice(start, end)
})

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
