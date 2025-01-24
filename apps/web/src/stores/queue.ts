import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Clip } from '@cq/providers'
import { BasicClipList, ClipList, ClipProvider, toClipUUID } from '@cq/providers'

import { useSettings } from '@/stores/settings'

export const useQueue = defineStore(
  'queue',
  () => {
    const settings = useSettings()

    const isOpen = ref<boolean>(true)
    const history = ref<BasicClipList>(new BasicClipList())
    const current = ref<Clip | undefined>(undefined)
    const upcoming = ref<ClipList>(new ClipList())

    function clear() {
      upcoming.value.clear()
    }

    function purge() {
      history.value.clear()
    }

    function add(clip: Clip, force = false) {
      // Force add the clip
      if (force) {
        upcoming.value.add(clip)
        return
      }
      // Ignore clip when queue isnt open
      if (!isOpen.value) {
        return
      }
      // Ignore when we have previously watched it
      const hasBeenWatched =
        (current.value && toClipUUID(current.value) === toClipUUID(clip)) ||
        history.value.includes(clip)
      if (hasBeenWatched) {
        return
      }
      // Queue is full based on limit
      if (settings.queue.limit && upcoming.value.size() >= settings.queue.limit) {
        // If the clip is already in the queue add it so submitters is updated
        if (!upcoming.value.includes(clip)) {
          return
        }
      }
      upcoming.value.add(clip)
    }

    function remove(clip: Clip) {
      upcoming.value.remove(clip)
    }

    function removeSubmitterClips(submitter: string) {
      upcoming.value.removeBySubmitter(submitter)
    }

    function removeProviderClips(provider: ClipProvider) {
      upcoming.value.removeByProvider(provider)
    }

    function removeFromHistory(clip: Clip) {
      history.value.remove(clip)
    }

    function play(clip: Clip) {
      if (!upcoming.value.includes(clip)) {
        return
      }
      if (current.value?.id) {
        history.value.add(current.value)
      }
      upcoming.value.remove(clip)
      current.value = clip
    }

    function open() {
      isOpen.value = true
    }

    function close() {
      isOpen.value = false
    }

    function previous() {
      if (current.value?.id) {
        upcoming.value.unshift(current.value)
      }
      current.value = history.value.pop()
    }

    function next() {
      if (current.value?.id) {
        history.value.add(current.value)
      }
      current.value = upcoming.value.shift()
    }

    return {
      isOpen,
      history,
      current,
      upcoming,
      clear,
      purge,
      add,
      remove,
      removeSubmitterClips,
      removeProviderClips,
      removeFromHistory,
      play,
      open,
      close,
      previous,
      next
    }
  },
  {
    persist: {
      key: 'cq-queue',
      pick: ['history', 'current', 'upcoming']
    }
  }
)
