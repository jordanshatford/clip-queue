<template>
  <p class="cq-title">Search Reddit</p>
  <form @submit.prevent="search.getFromSubreddit()" class="mt-3 grid grid-cols-1 gap-4">
    <div class="cq-card mx-auto max-w-md">
      <div class="flex items-center justify-between">
        <p class="cq-text pl-3 pr-1 text-2xl">r/</p>
        <BaseInput
          :disabled="search.loading"
          class="inline"
          type="text"
          maxlength="25"
          v-model.trim="search.term"
        />
        <BaseButton
          class="float-right m-3"
          title="Search"
          :disabled="search.loading || search.term.length === 0"
          type="submit"
        >
          <component
            :is="search.loading ? LoadingIcon : MagnifyingGlassIcon"
            class="h-5 w-5"
          ></component>
        </BaseButton>
      </div>
    </div>
  </form>
  <div class="mt-4">
    <div class="flex flex-wrap justify-center gap-x-2 gap-y-4">
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
