import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Clip } from '@/providers'
import { deepEqual } from '@/utils'

export interface Moderation {
  // Auto remove clips when the submitter has been timed out
  // or banned in chat.
  hasAutoRemoveClipsEnabled: boolean
  // Clips from these channels will not be allowed in the queue.
  blockedChannels: string[]
  // Users submitting clips will not be allowed in the queue.
  blockedSubmitters: string[]
}

export const DEFAULTS: Moderation = {
  hasAutoRemoveClipsEnabled: true,
  blockedChannels: [],
  blockedSubmitters: []
}

export const useModeration = defineStore(
  'moderation',
  () => {
    const hasAutoRemoveClipsEnabled = ref<boolean>(DEFAULTS.hasAutoRemoveClipsEnabled)
    const blockedChannels = ref<string[]>(DEFAULTS.blockedChannels)
    const blockedSubmitters = ref<string[]>(DEFAULTS.blockedSubmitters)

    const $state = computed(() => ({
      hasAutoRemoveClipsEnabled: hasAutoRemoveClipsEnabled.value,
      blockedChannels: blockedChannels.value,
      blockedSubmitters: blockedSubmitters.value
    }))

    const isModified = computed(() => {
      return (moderation: Moderation) => {
        return !deepEqual($state.value, moderation)
      }
    })

    const isAllowed = computed(() => {
      return (clip: Clip) => {
        const blockedChannel = $state.value.blockedChannels.some(
          (c) => c.toLowerCase() === clip.channel?.toLowerCase()
        )
        const blockedSubmitter = $state.value.blockedSubmitters.some(
          (s) => s.toLowerCase() === clip.submitters[0]?.toLowerCase()
        )
        return !blockedChannel && !blockedSubmitter
      }
    })

    function update(moderation: Moderation) {
      hasAutoRemoveClipsEnabled.value = moderation.hasAutoRemoveClipsEnabled
      blockedChannels.value = moderation.blockedChannels
      blockedSubmitters.value = moderation.blockedSubmitters
    }

    function addBlockedChannel(channel: string) {
      // Ignore if the channel is already blocked
      if (blockedChannels.value.some((c) => c.toLowerCase() === channel.toLowerCase())) {
        return
      }
      blockedChannels.value = [...blockedChannels.value, channel.toLowerCase()]
    }

    function removeBlockedChannel(channel: string) {
      blockedChannels.value = blockedChannels.value.filter(
        (c) => c.toLowerCase() !== channel.toLowerCase()
      )
    }

    function addBlockedSubmitter(submitter: string) {
      // Ignore if the channel is already blocked
      if (blockedSubmitters.value.some((s) => s.toLowerCase() === submitter.toLowerCase())) {
        return
      }
      blockedSubmitters.value = [...blockedSubmitters.value, submitter.toLowerCase()]
    }

    function removeBlockedSubmitter(submitter: string) {
      blockedSubmitters.value = blockedSubmitters.value.filter(
        (s) => s.toLowerCase() !== submitter.toLowerCase()
      )
    }

    return {
      hasAutoRemoveClipsEnabled,
      blockedChannels,
      blockedSubmitters,
      isModified,
      $state,
      isAllowed,
      update,
      addBlockedChannel,
      removeBlockedChannel,
      addBlockedSubmitter,
      removeBlockedSubmitter
    }
  },
  {
    persist: {
      key: 'moderation'
    }
  }
)
