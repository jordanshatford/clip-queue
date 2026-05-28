<template>
  <div class="flex items-center gap-2">
    <UButton v-if="!user.isLoggedIn" icon="simple-icons:twitch" @click="() => user.redirect()">
      {{ m.login() }}
    </UButton>
    <UDropdownMenu v-else v-model:open="open" :items="items">
      <UButton
        variant="ghost"
        color="neutral"
        :trailing-icon="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
      >
        <IntegrationAvatars />
      </UButton>
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import { m } from '#paraglide/messages'

const user = useUser()

const open = ref<boolean>(false)

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: m.settings(),
      icon: 'lucide:settings',
      to: '/settings/integrations',
    },
  ],
  [
    {
      label: m.logout(),
      icon: 'lucide:log-out',
      onSelect: async () => {
        await user.logout()
        await navigateTo('/')
      },
    },
  ],
])
</script>
