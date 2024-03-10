import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Moderation {
  // Auto remove clips when the submitter has been timed out
  // or banned in chat.
  hasAutoRemoveClipsEnabled: boolean
}

export const DEFAULTS: Moderation = {
  hasAutoRemoveClipsEnabled: true
}

export const useModeration = defineStore(
  'moderation',
  () => {
    const hasAutoRemoveClipsEnabled = ref<boolean>(DEFAULTS.hasAutoRemoveClipsEnabled)

    const isModified = computed(() => {
      return (moderation: Moderation) => {
        return hasAutoRemoveClipsEnabled.value !== moderation.hasAutoRemoveClipsEnabled
      }
    })

    function update(moderation: Moderation) {
      hasAutoRemoveClipsEnabled.value = moderation.hasAutoRemoveClipsEnabled
    }

    return {
      hasAutoRemoveClipsEnabled,
      isModified,
      update
    }
  },
  {
    persist: {
      key: 'moderation'
    }
  }
)
