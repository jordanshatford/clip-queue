<template>
  <p class="cq-title">History</p>
  <div class="flex min-h-[80vh] flex-col justify-between">
    <BaseTable :columns="columns" :rows="currentPageClips">
      <template #head="{ column }">
        <BaseButton
          v-if="column.key === 'actions'"
          :disabled="queue.history.empty()"
          @click="purgeHistory()"
          variant="danger"
          class="float-right flex text-sm"
          ><TrashIcon class="mr-1 w-5" />Delete All</BaseButton
        >
      </template>
      <template #cell="{ column, row }">
        <div v-if="column.key === 'info'" class="flex items-center">
          <img
            class="hidden aspect-video w-24 rounded-xl sm:block"
            :src="row.thumbnailUrl"
            :alt="row.title"
          />
          <div class="ml-3 text-left text-sm">
            <p class="cq-text">
              {{ row.title }}
              <span v-if="row.url">
                <a
                  :href="row.url"
                  target="_blank"
                  rel="noreferrer"
                  className="cq-text-subtle text-lg no-underline hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <ArrowTopRightOnSquareIcon class="mb-1 inline-block w-5" />
                </a>
              </span>
            </p>
            <p class="cq-text-subtle-semibold">
              {{ row.channel }}<span class="cq-text-subtle"> playing </span>{{ row.game }}
            </p>
          </div>
        </div>
        <p v-else-if="column.key === 'provider'" class="cq-text text-left text-sm">
          {{ row.provider }}
        </p>
        <p v-else-if="column.key === 'submitter'" class="cq-text text-left text-sm">
          {{ row.submitters[0] }}
        </p>
        <div v-else-if="column.key === 'actions'" class="mt-2 inline-flex space-x-2">
          <BaseButton :disabled="queue.upcoming.includes(row)" @click="queue.add(row, true)">
            <PlusIcon class="h-5 w-5" />
          </BaseButton>
          <BaseButton variant="danger" @click="queue.removeFromHistory(row)">
            <TrashIcon class="h-5 w-5" />
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
    key: 'provider',
    title: 'Provider'
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
