<template>
  <UAvatarGroup size="sm">
    <UTooltip v-for="avatar of avatars" :key="avatar.src" :text="avatar.alt">
      <template #content>
        <div class="flex items-center gap-1">
          <IntegrationIcon :id="avatar.integration" />
          <span>{{ avatar.alt }}</span>
        </div>
      </template>
      <UAvatar v-bind="avatar" />
    </UTooltip>
  </UAvatarGroup>
</template>

<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

import type { IntegrationID } from '~/integrations'

import { toColor } from '~/integrations/core'

const integrations = useIntegrations()

const avatars = computed<(AvatarProps & { integration: IntegrationID })[]>(() => {
  return integrations.integrations
    .filter((integration) => integration.authentication?.isLoggedIn)
    .map((integration) => ({
      integration: integration.id,
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
