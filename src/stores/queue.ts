import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ClipList } from '@/utils/clip-list'
import { ClipProvider, type Clip, toUUID } from '@/providers'
import { useModeration } from '@/stores/moderation'
import { deepEqual } from '@/utils'

export interface QueueSettings {
  isLimited: boolean
  limit: number
}

export const DEFAULT_SETTINGS: QueueSettings = {
  isLimited: false,
  limit: 1
}

export interface ClipQueue {
  isOpen: boolean
  history: ClipList
  current: Clip | undefined
  upcoming: ClipList
  settings: QueueSettings
}

export const useQueue = defineStore(
  'queue',
  () => {
    const isOpen = ref<boolean>(true)
    const history = ref<ClipList>(new ClipList())
    const current = ref<Clip | undefined>(undefined)
    const upcoming = ref<ClipList>(new ClipList())
    const settings = ref<QueueSettings>(DEFAULT_SETTINGS)

    const isSettingsModified = computed(() => {
      return (s: QueueSettings) => {
        return !deepEqual(settings.value, s)
      }
    })

    function clear() {
      upcoming.value = new ClipList()
    }

    function purge() {
      history.value = new ClipList()
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
        (current.value && toUUID(current.value) === toUUID(clip)) || history.value.includes(clip)
      if (hasBeenWatched) {
        return
      }
      // Clip not allowed
      const moderation = useModeration()
      if (!moderation.isAllowed(clip)) {
        return
      }
      // Queue is full based on limit
      if (
        settings.value.isLimited &&
        settings.value.limit &&
        upcoming.value.size() >= settings.value.limit
      ) {
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

    function removeChannelClips(channel: string) {
      upcoming.value.removeByChannel(channel)
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

    function updateSettings(s: QueueSettings) {
      settings.value = s
    }

    function setLimit(limit: number) {
      if (Number.isNaN(limit) || limit < 1) {
        return
      }
      updateSettings({
        isLimited: true,
        limit: limit
      })
    }

    function removeLimit() {
      updateSettings({
        isLimited: false,
        limit: settings.value.limit
      })
    }

    return {
      isOpen,
      history,
      current,
      upcoming,
      settings,
      isSettingsModified,
      clear,
      purge,
      add,
      remove,
      removeSubmitterClips,
      removeChannelClips,
      removeProviderClips,
      removeFromHistory,
      play,
      open,
      close,
      previous,
      next,
      updateSettings,
      setLimit,
      removeLimit
    }
  },
  {
    persist: {
      key: 'queue',
      paths: ['history', 'current', 'upcoming', 'settings'],
      afterRestore: (ctx) => {
        if (ctx.store.current?.id) {
          ctx.store.history.add(ctx.store.current)
        }
        ctx.store.current = undefined
      }
    }
  }
)
