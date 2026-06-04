<template>
  <UCard class="mx-auto max-w-2xl" variant="subtle">
    <div class="flex w-full items-center justify-between gap-4">
      <div class="flex items-center gap-2 align-middle">
        <IntegrationIcon :id="integration.id" class="size-5" />
        <NuxtLink
          v-if="integration.url"
          :to="integration.url"
          target="_blank"
          class="flex items-center gap-1 no-underline"
        >
          <span class="font-medium">
            {{ integration.name }}
          </span>
          <UIcon name="lucide:external-link" class="size-3" />
        </NuxtLink>
        <span v-else class="font-medium">
          {{ integration.name }}
        </span>
        <UBadge size="sm" color="neutral" variant="soft" class="font-mono">
          {{ integration.id }}
        </UBadge>
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
      <USwitch
        v-if="integration.isEnabled !== undefined"
        v-model="integration.isEnabled"
        class="ml-auto"
      />
    </div>
    <UCollapsible :open="integration?.isEnabled ?? true">
      <template #content>
        <div class="mt-4 flex flex-col gap-4 text-left">
          <IntegrationAuthentication
            v-if="integration.authentication"
            v-model="integration.authentication"
          />
          <IntegrationSource v-if="integration.source" v-model="integration.source" />
          <USeparator v-if="integration.source" />
          <IntegrationProviders
            v-if="integration.providers?.length"
            v-model="integration.providers"
          />
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>

<script setup lang="ts">
import type { Integration } from '~/integrations'

import { m } from '#paraglide/messages'

const integration = defineModel<Integration>({ required: true })
</script>
