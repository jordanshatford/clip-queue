<template>
  <div class="flex items-center gap-2">
    <UButton
      v-if="!user.isLoggedIn"
      size="lg"
      icon="simple-icons:twitch"
      @click="() => user.redirect()"
    >
      {{ m.login() }}
    </UButton>
    <UDropdownMenu v-else v-model:open="open" :items="items">
      <UButton
        size="xl"
        variant="ghost"
        color="neutral"
        :avatar="{
          src: user.details?.profileImageURL,
          loading: 'lazy',
          icon: 'lucide:image',
          chip: {
            inset: true,
            color: chipColor,
          },
        }"
      >
        <span class="hidden sm:block">{{ user.details?.name }}</span>
        <UIcon :name="open ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="hidden sm:block" />
      </UButton>
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, ChipProps } from '@nuxt/ui'

import { m } from '#paraglide/messages'
import { IntegrationID } from '~/integrations'
import { IntegrationStatus } from '~/integrations/core'

const router = useRouter()

const integrations = useIntegrations()
const user = useUser()

const open = ref<boolean>(false)

const items: DropdownMenuItem[] = [
  {
    label: m.logout(),
    icon: 'lucide:log-out',
    onSelect: async () => {
      await user.logout()
      await router.push('/')
    },
  },
]

const chipColor = computed<ChipProps['color']>(() => {
  const status = integrations.source(IntegrationID.TWITCH)?.status
  switch (status) {
    case IntegrationStatus.HEALTHY: {
      return 'success'
    }
    case IntegrationStatus.UNKNOWN: {
      return 'warning'
    }
    case IntegrationStatus.DISABLED: {
      return 'neutral'
    }
    case IntegrationStatus.ERROR:
    case IntegrationStatus.MISCONFIGURED:
    default: {
      return 'error'
    }
  }
})
</script>
