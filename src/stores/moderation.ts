import { defineStore } from 'pinia'
import type { Clip } from '@/interfaces/clips'
import { deepEqual } from '@/utils'

export interface Moderation {
  // Auto remove clips when the submitter has been timed out
  // or banned in chat.
  hasAutoRemoveClipsEnabled: boolean
  // Clips from these channels will not be allowed in the queue.
  blockedChannels: string[]
}

export const DEFAULTS: Moderation = {
  hasAutoRemoveClipsEnabled: true,
  blockedChannels: []
}

export const useModeration = defineStore('moderation', {
  persist: {
    key: 'moderation'
  },
  state: (): Moderation => ({
    ...DEFAULTS
  }),
  getters: {
    // Compare moderation to currently set moderations
    isModified: (state) => {
      return (moderation: Moderation) => {
        /* eslint-disable @typescript-eslint/no-explicit-any*/
        return !deepEqual((state as any).$state, moderation)
      }
    },
    // Return if a clip passes moderation
    isAllowed: (state) => {
      return (clip: Clip) => {
        const blockedChannel = state.blockedChannels.some(
          (c) => c.toLowerCase() === clip.channel?.toLowerCase()
        )
        return !blockedChannel
      }
    }
  },
  actions: {
    update(moderation: Moderation) {
      this.$patch(moderation)
    },
    addBlockedChannel(channel: string) {
      // Ignore if the channel is already blocked
      if (this.blockedChannels.some((c) => c.toLowerCase() === channel.toLowerCase())) {
        return
      }
      this.blockedChannels = [...this.blockedChannels, channel]
    },
    removeBlockedChannel(channel: string) {
      this.blockedChannels = this.blockedChannels.filter(
        (c) => c.toLowerCase() !== channel.toLowerCase()
      )
    }
  }
})
