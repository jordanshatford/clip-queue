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
        {{ user.details?.name }}
        <UIcon :name="open ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
      </UButton>
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, ChipProps } from '@nuxt/ui'

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { IntegrationID } from '@/integrations'
import { IntegrationStatus } from '@/integrations/core'
import { m } from '@/paraglide/messages'
import { useIntegrations } from '@/stores/integrations'
import { useUser } from '@/stores/user'

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
