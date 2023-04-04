<template>
  <p class="cq-title">Search Reddit</p>
  <div class="grid gap-4 grid-cols-1 mt-3">
    <div class="cq-card mx-auto max-w-md">
      <div class="flex items-center justify-between">
        <p class="cq-text text-2xl pl-3 pr-1">r/</p>
        <BaseInput
          :disabled="search.loading"
          class="inline"
          type="text"
          maxlength="25"
          v-model.trim="search.term"
        />
        <BaseButton
          class="m-3 float-right"
          title="Search"
          @click="search.getFromSubreddit()"
          :disabled="search.loading || search.term.length === 0"
        >
          <component
            :is="search.loading ? LoadingIcon : MagnifyingGlassIcon"
            class="w-5 h-5"
          ></component>
        </BaseButton>
      </div>
    </div>
  </div>
  <div class="mt-4">
    <div class="flex flex-wrap justify-center gap-y-4 gap-x-2">
      <ClipCard
        v-for="clip in search.results"
        :key="clip.id"
        :clip="clip"
        :inQueue="queue.upcoming.includes(clip)"
        @add="queue.add(clip, true)"
        @remove="queue.remove(clip)"
        @play="queue.play(clip)"
        class="mr-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@/assets/icons'
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import ClipCard from '@/components/ClipCard.vue'
import { useSearch } from '@/stores/search'
import { useQueue } from '@/stores/queue'

const search = useSearch()
const queue = useQueue()
</script>
