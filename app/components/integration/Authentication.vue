<template>
  <div>
    <UBadge
      v-if="authentication.isLoggedIn"
      color="neutral"
      variant="soft"
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
        variant="subtle"
        @click="logout()"
        >{{ m.logout() }}</UButton
      >
    </UBadge>
    <UBadge v-else color="neutral" variant="soft" class="flex w-full justify-between rounded-full">
      <UButton
        :disabled="authentication.isLoggedIn"
        class="w-full justify-center rounded-full"
        color="neutral"
        variant="subtle"
        @click="authentication.redirect()"
        >{{ m.login() }}</UButton
      >
    </UBadge>
  </div>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import type { IntegrationAuthentication } from '~/integrations/core'

import { m } from '#paraglide/messages'

const authentication = defineModel<Reactive<IntegrationAuthentication>>({ required: true })

const integrations = useIntegrations()

async function logout(): Promise<void> {
  // Disconnect the integrations source as current we rely on the authenticatino to use the source.
  // In the future we can determine if a source requires the authentication to function.
  const source = integrations.integration(authentication.value.id)?.source
  await Promise.all([source?.disconnect?.(), authentication.value.logout()])
  await navigateTo('/')
}
</script>
