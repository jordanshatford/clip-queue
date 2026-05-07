<template>
  <Message size="small" severity="secondary" variant="simple">
    {{ m.authentication_for_integration() }}
  </Message>
  <Chip :label="authentication?.user?.name" :image="authentication?.user?.profileImageURL" />
</template>

<script setup lang="ts">
import type { Reactive } from 'vue'

import Chip from 'primevue/chip'
import Message from 'primevue/message'

import type { IntegrationAuthentication } from '@/integrations/core'

import { m } from '@/paraglide/messages'

const authentication = defineModel<Reactive<IntegrationAuthentication>>({ required: true })
</script>
