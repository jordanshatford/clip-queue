<template>
  <div>
    <UBadge
      v-if="authentication.isLoggedIn"
      color="neutral"
      variant="subtle"
      class="flex w-full justify-between"
    >
      <UUser
        :name="authentication.user.name"
        :avatar="{
          src: authentication.user.profileImageURL,
          loading: 'lazy',
          icon: 'lucide:image',
        }"
      />
      <UButton
        :disabled="!authentication.isLoggedIn"
        color="neutral"
        variant="soft"
        @click="logout()"
        >{{ m.logout() }}</UButton
      >
    </UBadge>
    <UButton
      v-else
      :disabled="authentication.isLoggedIn"
      class="w-full justify-center"
      color="neutral"
      variant="subtle"
      @click="authentication.login()"
      >{{ m.login() }}</UButton
    >
  </div>
</template>

<script setup lang="ts">
import type { AbstractIntegrationAuthentication } from '~/integrations'

import { m } from '#paraglide/messages'

const authentication = defineModel<AbstractIntegrationAuthentication>({ required: true })

const integrations = useIntegrations()

async function logout(): Promise<void> {
  return await integrations.logout(authentication.value.id)
}
</script>
