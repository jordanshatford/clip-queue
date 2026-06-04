<template>
  <UDropdownMenu :items="items">
    <UButton v-bind="rest" :icon :size :color :variant />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { ButtonProps, DropdownMenuItem } from '@nuxt/ui'

import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'

export interface Props extends ButtonProps {
  clip: Clip
  actions?: boolean
}

const {
  clip,
  actions = true,
  icon = 'lucide:ellipsis-vertical',
  size = 'sm',
  color = 'neutral',
  variant = 'ghost',
  ...rest
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'play' | 'remove'): void
}>()

const integrations = useIntegrations()
const extras = useClip(clip)

const integration = integrations.integration(clip.provider)

const controls = computed<DropdownMenuItem[]>(() => [
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
])

const details = computed<DropdownMenuItem[]>(() => {
  return [
    integration?.url
      ? {
          label: extras.value.provider?.name,
          icon: integration?.branding.icon,
          to: integration.url,
          target: '_blank',
        }
      : {
          type: 'label',
          label: extras.value.provider?.name,
          icon: integration?.branding.icon,
        },
    {
      label: clip.title,
      icon: 'lucide:captions',
      to: clip.url,
      target: '_blank',
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
  ]
})

const items = computed<DropdownMenuItem[][]>(() => {
  if (actions) {
    return [controls.value, details.value]
  } else {
    return [details.value]
  }
})
</script>
