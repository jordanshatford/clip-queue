<template>
  <UFormField :label="m.authentication_for_integration()">
    <UBadge color="neutral" variant="soft" class="flex w-full justify-between rounded-full">
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
  </UFormField>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import type { IntegrationAuthentication } from '~/integrations/core'

import { m } from '#paraglide/messages'

const router = useRouter()
const integrations = useIntegrations()
const authentication = defineModel<Reactive<IntegrationAuthentication>>({ required: true })

async function logout(): Promise<void> {
  // Disconnect the integrations source as current we rely on the authenticatino to use the source.
  // In the future we can determine if a source requires the authentication to function.
  const source = integrations.integration(authentication.value.id)?.source
  await Promise.all([source?.disconnect?.(), authentication.value.logout()])
  await router.push('/')
}
</script>
