import { defineStore } from 'pinia'
import { ClipList } from '@/utils/clip-list'
import { ClipProvider, type Clip } from '@/providers'
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

export const useQueue = defineStore('queue', {
  persist: {
    key: 'queue',
    paths: ['history', 'current', 'upcoming', 'settings'],
    afterRestore: (ctx) => {
      if (ctx.store.current?.id) {
        ctx.store.history.add(ctx.store.current)
      }
      ctx.store.current = undefined
    }
  },
  state: (): ClipQueue => ({
    isOpen: true,
    history: new ClipList(),
    current: undefined,
    upcoming: new ClipList(),
    settings: { ...DEFAULT_SETTINGS }
  }),
  getters: {
    isSettingsModified: (state) => {
      return (settings: QueueSettings) => {
        return !deepEqual(state.settings, settings)
      }
    }
  },
  actions: {
    clear() {
      this.upcoming = new ClipList()
    },
    purge() {
      this.history = new ClipList()
    },
    add(clip: Clip, force = false) {
      // Force add the clip
      if (force) {
        this.upcoming.add(clip)
        return
      }
      // Ignore clip when queue isnt open
      if (!this.open) {
        return
      }
      // Ignore when we have previously watched it
      const hasBeenWatched =
        (this.current?.id === clip.id && this.current?.provider === clip.provider) ||
        this.history.includes(clip)
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
        this.settings.isLimited &&
        this.settings.limit &&
        this.upcoming.size() >= this.settings.limit
      ) {
        // If the clip is already in the queue add it so submitters is updated
        if (!this.upcoming.includes(clip)) {
          return
        }
      }
      this.upcoming.add(clip)
    },
    remove(clip: Clip) {
      this.upcoming.remove(clip)
    },
    removeSubmitterClips(submitter: string) {
      this.upcoming.removeBySubmitter(submitter)
    },
    removeChannelClips(channel: string) {
      this.upcoming.removeByChannel(channel)
    },
    removeProviderClips(provider: ClipProvider) {
      this.upcoming.removeByProvider(provider)
    },
    removeFromHistory(clip: Clip) {
      this.history.remove(clip)
    },
    play(clip: Clip) {
      if (!this.upcoming.includes(clip)) {
        return
      }
      if (this.current?.id) {
        this.history.add(this.current)
      }
      this.upcoming.remove(clip)
      this.current = clip
    },
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
    previous() {
      if (this.current?.id) {
        this.upcoming.unshift(this.current)
      }
      this.current = this.history.pop()
    },
    next() {
      if (this.current?.id) {
        this.history.add(this.current)
      }
      this.current = this.upcoming.shift()
    },
    updateSettings(settings: QueueSettings) {
      this.settings = settings
    },
    setLimit(limit: number) {
      if (Number.isNaN(limit) || limit < 1) {
        return
      }
      this.updateSettings({
        isLimited: true,
        limit: limit
      })
    },
    removeLimit() {
      this.updateSettings({
        isLimited: false,
        limit: this.settings.limit
      })
    }
  }
})
