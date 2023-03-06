<template>
  <p class="cq-title">History</p>
  <div class="min-w-full border-2 rounded-xl border-zinc-100 dark:border-zinc-800">
    <table class="min-w-full table-auto">
      <thead class="bg-zinc-100 dark:bg-zinc-800">
        <tr class="cq-text text-left uppercase">
          <th class="px-3 py-2">Info</th>
          <th class="px-3 py-2">Submitter</th>
          <th>
            <BaseButton
              :disabled="queue.history.empty()"
              @click="purgeHistory()"
              variant="danger"
              class="flex text-sm float-right my-1 mr-1 flex"
              ><TrashIcon class="w-5 mr-2 ml-0" />Delete All</BaseButton
            >
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <tr v-for="clip in currentPageClips" :key="clip.id">
          <td class="p-3">
            <div class="flex items-center">
              <img
                class="hidden sm:block w-24 rounded-xl aspect-video"
                :src="clip.thumbnailUrl"
                :alt="clip.title"
              />
              <div class="text-left ml-3 text-sm">
                <p class="cq-text">{{ clip.title }}</p>
                <p class="cq-text-subtle-semibold">
                  {{ clip.channel }}<span class="cq-text-subtle"> playing </span>{{ clip.game }}
                </p>
              </div>
            </div>
          </td>
          <td class="p-3">
            <p class="cq-text text-left text-sm">
              {{ clip.submitter }} <span class="cq-text-subtle">({{ clip.source }})</span>
            </p>
          </td>
          <td class="p-3 text-right">
            <div class="inline-flex mt-2 space-x-2">
              <BaseButton
                :disabled="queue.upcoming.includes(clip)"
                @click="queue.add({ ...clip, source: ClipSource.HistoryPage }, true)"
              >
                <PlusIcon class="w-5 h-5" />
              </BaseButton>
              <BaseButton variant="danger" @click="queue.removeFromHistory(clip)">
                <TrashIcon class="w-5 h-5" />
              </BaseButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <BasePagination v-model="page" :totalPages="totalPages" class="mt-2" />
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { PlusIcon, TrashIcon } from '@/assets/icons'
import config from '@/assets/config'
import { useQueue } from '@/stores/queue'
import { ClipSource } from '@/interfaces/clips'
import type { ConfirmDialog } from '@/plugins/confirm'

const queue = useQueue()

const confirm = inject<ConfirmDialog>('confirm')!

const { pageSize } = config.history

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
