<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm :title="m.login()" icon="lucide:user" :providers="providers" />
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

import { m } from '#paraglide/messages'

definePageMeta({
  requiresAuth: false,
  hidden: true,
})

const integrations = useIntegrations()

const providers = computed<ButtonProps[]>(() => {
  return integrations.integrations
    .flatMap((integration) => integration.authentication)
    .filter((authentication) => authentication !== undefined)
    .map((authentication) => {
      const integration = integrations.integration(authentication.id)
      const props: ButtonProps = {
        label: integration?.name,
        icon: integration?.branding.icon,
      }
      if (authentication.isLoggedIn) {
        props.disabled = true
        return props
      }
      props.onClick = async () => {
        await authentication.login()
      }
      return props
    })
})
</script>
