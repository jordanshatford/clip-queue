<template>
  <div>
    <UBadge
      v-if="authentication.isLoggedIn"
      color="neutral"
      variant="subtle"
      class="flex w-full justify-between rounded-full"
    >
      <UUser
        :name="authentication.user?.name"
        :avatar="{
          src: authentication.user?.profileImageURL,
          loading: 'lazy',
          icon: 'lucide:image',
        }"
      />
      <UButton
        :disabled="!authentication.isLoggedIn"
        class="rounded-full"
        color="neutral"
        variant="soft"
        @click="logout()"
        >{{ m.logout() }}</UButton
      >
    </UBadge>
    <UButton
      v-else
      :disabled="authentication.isLoggedIn"
      class="w-full justify-center rounded-full"
      color="neutral"
      variant="subtle"
      @click="authentication.redirect()"
      >{{ m.login() }}</UButton
    >
  </div>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import type { IntegrationAuthentication } from '~/integrations/core'

import { m } from '#paraglide/messages'

const authentication = defineModel<Reactive<IntegrationAuthentication>>({ required: true })

const integrations = useIntegrations()

async function logout(): Promise<void> {
  return await integrations.logout(authentication.value.id)
}
</script>
