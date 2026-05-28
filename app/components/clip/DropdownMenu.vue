<template>
  <UDropdownMenu :items="items">
    <UButton v-bind="rest" :icon :size :color :variant />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { ButtonProps, DropdownMenuItem } from '@nuxt/ui'

import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'

const {
  clip,
  icon = 'lucide:ellipsis-vertical',
  size = 'sm',
  color = 'neutral',
  variant = 'ghost',
  ...rest
} = defineProps<ButtonProps & { clip: Clip }>()

const emit = defineEmits<{
  (e: 'play' | 'remove'): void
}>()

const integrations = useIntegrations()
const extras = useClip(clip)

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: m.play(),
      icon: 'lucide:play',
      onSelect: () => {
        emit('play')
      },
    },
    {
      label: m.remove(),
      color: 'error',
      icon: 'lucide:trash',
      onSelect: () => {
        emit('remove')
      },
    },
  ],
  [
    {
      type: 'label',
      label: extras.value.provider?.name,
      icon: integrations.integration(clip.provider)?.branding.icon,
    },
    {
      type: 'label',
      label: clip.title,
      icon: 'lucide:captions',
    },
    {
      type: 'label',
      label: clip.channel,
      icon: 'lucide:tv',
    },
    {
      type: 'label',
      label: clip.category ?? 'Unknown',
      icon: 'lucide:tag',
    },
    {
      label: m.submitters(),
      icon: 'lucide:users',
      filter: true,
      children: extras.value.submitters,
    },
  ],
])
</script>
