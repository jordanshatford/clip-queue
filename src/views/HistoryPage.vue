<template>
  <p class="cq-title">History</p>
  <div class="min-w-full border-2 rounded-lg border-zinc-100 dark:border-zinc-800">
    <table class="min-w-full table-auto">
      <thead class="bg-zinc-100 dark:bg-zinc-800">
        <tr class="cq-text text-left uppercase">
          <th class="px-3 py-2">Info</th>
          <th class="px-3 py-2">Submitter</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
        <tr v-for="clip in currentPage" :key="clip.id">
          <td class="p-3">
            <div class="flex items-center">
              <img class="hidden sm:block w-24 rounded-lg aspect-video" :src="clip.thumbnailUrl" :alt="clip.title" />
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
              <BaseButton :disabled="queue.upcoming.includes(clip)" @click="queue.add(clip, true)">
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
import { computed, ref } from "vue"
import { PlusIcon, TrashIcon } from "@/assets/icons"
import config from "@/assets/config"
import { useQueue } from "@/stores/queue"

const queue = useQueue()

const { pageSize } = config.history

const page = ref<number>(1)

const totalPages = computed(() => {
  return Math.ceil(queue.history.toArray().length / pageSize)
})

const currentPage = computed(() => {
  // pages start at 1, remove 1 to index at 0
  const start = (page.value - 1) * pageSize
  const end = start + pageSize
  // Reverse the cloned array to show history latest -> oldest
  return [...queue.history.toArray()].reverse().slice(start, end)
})
</script>
