<template>
  <div class="flex items-center gap-2">
    <UIButton
      v-if="!user.isLoggedIn"
      size="lg"
      icon="simple-icons:twitch"
      @click="() => user.redirect()"
    >
      {{ m.login() }}
    </UIButton>
    <UIDropdownMenu v-else :items="items">
      <UIButton
        size="xl"
        variant="ghost"
        color="neutral"
        :avatar="{
          src: user.details?.profileImageURL,
          loading: 'lazy',
          icon: 'lucide:image',
        }"
      >
        {{ user.details?.name }}
        <UIIcon name="lucide:chevron-down" />
      </UIButton>
    </UIDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import { useRouter } from 'vue-router'

import { m } from '@/paraglide/messages'
import { useUser } from '@/stores/user'

const router = useRouter()

const user = useUser()

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
</script>
