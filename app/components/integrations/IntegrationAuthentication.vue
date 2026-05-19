<template>
  <UFormField :label="m.authentication_for_integration()">
    <UBadge color="neutral" variant="soft" class="w-full rounded-full">
      <UUser
        :name="authentication?.user?.name"
        :avatar="{
          src: authentication?.user?.profileImageURL,
          loading: 'lazy',
          icon: 'lucide:image',
        }"
      />
    </UBadge>
  </UFormField>
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import type { IntegrationAuthentication } from '@/integrations/core'

import { m } from '#paraglide/messages'

const authentication = defineModel<Reactive<IntegrationAuthentication>>({ required: true })
</script>
