<template>
  <UDropdownMenu :items="items">
    <UButton v-bind="rest" :icon :size :color :variant />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { ButtonProps, DropdownMenuItem } from '@nuxt/ui'

import type { Integration } from '~/integrations'

import { m } from '#paraglide/messages'

export interface Props extends ButtonProps {
  integration: Integration
}

const {
  integration,
  icon = 'lucide:ellipsis-vertical',
  size = 'sm',
  color = 'neutral',
  variant = 'ghost',
  ...rest
} = defineProps<Props>()

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: m.reset_cache(),
        color: 'error',
        icon: 'lucide:rotate-ccw',
        disabled: !integration.providers.some((provider) => provider.hasCachedData),
        onSelect: () => {
          for (const provider of integration.providers) {
            provider.clearCache()
          }
        },
      },
    ],
  ]
})
</script>
