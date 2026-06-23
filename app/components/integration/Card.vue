<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex w-full items-center justify-between gap-4">
      <div class="flex min-w-0 items-center gap-2 align-middle">
        <IntegrationIcon :id="integration.id" class="size-5" />
        <span class="truncate font-medium">
          {{ integration.name }}
        </span>
        <UBadge
          v-if="integration.isExperimental"
          icon="lucide:triangle-alert"
          color="warning"
          size="sm"
          variant="subtle"
        >
          {{ m.experimental() }}
        </UBadge>
        <IntegrationDropdownMenu :integration="integration" />
      </div>
    </div>
    <div class="mt-4 flex flex-col gap-4 text-left">
      <IntegrationAuthentication
        v-if="integration.authentication"
        v-model="integration.authentication"
      />
      <IntegrationSource v-if="integration.source" v-model="integration.source" />
      <USeparator v-if="integration.authentication || integration.source" />
      <IntegrationProviders v-if="integration.providers?.length" v-model="integration.providers" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Integration } from '~/integrations'

import { m } from '#paraglide/messages'

const integration = defineModel<Integration>({ required: true })
</script>
