import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Clip } from '@/integrations'

import { toClipUUID } from '@/integrations/core'
import { useHistory } from '@/stores/history'
import { useLogger } from '@/stores/logger'
import { useSettings } from '@/stores/settings'
import { useUpcoming } from '@/stores/upcoming'

export const useQueue = defineStore(
  'queue',
  () => {
    const settings = useSettings()
    const logger = useLogger()

    const history = useHistory()
    const upcoming = useUpcoming()

    const isOpen = ref<boolean>(true)
    const current = ref<Clip | undefined>(undefined)

    function clear() {
      logger.info('[Queue]: Clearing upcoming queue.')
      upcoming.reset()
    }

    function purge() {
      logger.info('[Queue]: Purging queue history.')
      history.reset()
    }

    function add(clip: Clip, force = false) {
      // Force add the clip
      if (force) {
        upcoming.add(clip)
        return
      }
      // Ignore clip when queue isnt open
      if (!isOpen.value) {
        return
      }
      // Ignore when we have previously watched it
      const hasBeenWatched =
        (current.value && toClipUUID(current.value) === toClipUUID(clip)) || history.includes(clip)
      if (hasBeenWatched) {
        return
      }
      // Queue is full based on limit
      if (settings.application.limit && upcoming.length >= settings.application.limit) {
        // If the clip is already in the queue add it so submitters is updated
        if (!upcoming.includes(clip)) {
          return
        }
      }
      upcoming.add(clip)
    }

    function remove(clip: Clip) {
      upcoming.remove(clip)
    }

    function play(clip: Clip) {
      if (!upcoming.includes(clip)) {
        return
      }
      if (current.value?.id) {
        history.add(current.value)
      }
      upcoming.remove(clip)
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
        upcoming.unshift(current.value)
      }
      current.value = history.pop()
    }

    function next() {
      if (current.value?.id) {
        history.add(current.value)
      }
      current.value = upcoming.shift()
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
      play,
      open,
      close,
      previous,
      next,
    }
  },
  {
    persist: {
      key: 'cq-queue',
      pick: ['current', 'isOpen'],
    },
  },
)
