<template>
  <UAvatarGroup size="sm">
    <UTooltip v-for="avatar of avatars" :key="avatar.src" :text="avatar.alt">
      <UAvatar v-bind="avatar" />
    </UTooltip>
  </UAvatarGroup>
</template>

<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

import { toColor } from '~/integrations/core'

const integrations = useIntegrations()

const avatars = computed<AvatarProps[]>(() => {
  return integrations.integrations
    .filter((integration) => integration.authentication?.isLoggedIn)
    .map((integration) => ({
      src: integration.authentication?.user?.profileImageURL,
      loading: 'lazy',
      alt: integration.authentication?.user?.name,
      chip: integration.source
        ? {
            inset: true,
            color: toColor(integration.source.status),
          }
        : undefined,
    }))
})
</script>
