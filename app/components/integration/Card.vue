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
        <UBadge size="sm" color="neutral" variant="soft" class="font-mono">
          {{ integration.id }}
        </UBadge>
      </div>
      <div class="flex items-center gap-1">
        <UBadge
          v-if="integration.isExperimental"
          icon="lucide:triangle-alert"
          color="warning"
          size="sm"
          variant="soft"
        >
          {{ m.experimental() }}
        </UBadge>
      </div>
      <USwitch
        v-if="!undisabledable.includes(integration.id)"
        v-model="integration.isEnabled"
        class="ml-auto"
      />
    </div>
    <UCollapsible :open="integration.isEnabled">
      <template #content>
        <div class="mt-4 flex flex-col gap-4 text-left">
          <IntegrationAuthentication
            v-if="integration.authentication"
            v-model="integration.authentication"
          />
          <USeparator v-if="integration.authentication" />
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
import { m } from '#paraglide/messages'
import { IntegrationID, type Integration } from '~/integrations'

const integration = defineModel<Integration>({ required: true })

// These more complex integrations cannot be disabled currently, as they provide
// potential authentication, source, and providers. Sources and providers can still
// be disabled singularly.
const undisabledable: IntegrationID[] = [IntegrationID.TWITCH]
</script>
